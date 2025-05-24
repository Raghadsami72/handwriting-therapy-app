// agents/cnnAgent.js
import * as tf from '@tensorflow/tfjs';

let model = null;
let currentLanguage = null;

export async function loadModel(lang = "en") {
  if (model && currentLanguage === lang) return model;

  const path = lang === "ar"
    ? "/models/model_tfjs_hala/model_tfjs/model.json"
    : "/models/ENGLISH/model.json";

  try {
    model = await tf.loadLayersModel(path);
    currentLanguage = lang;
    console.log(`✅ ${lang.toUpperCase()} model loaded.`);
  } catch (error) {
    console.error(`❌ Failed to load ${lang} model:`, error);
    throw error;
  }

  return model;
}

export async function predictDigit(dataURL, lang = "en", profile = null, archiveArray = null, patientName = "Anonymous") {
  await loadModel(lang);

  const { tensor, debugCanvas } = await preprocessDrawing(dataURL, profile, true);
  const prediction = model.predict(tensor);
  const predictionArray = await prediction.array();
  const predictedDigit = predictionArray[0].indexOf(Math.max(...predictionArray[0]));
  const confidence = Math.max(...predictionArray[0]);

  if (confidence < 0.6 && profile !== "standard") {
    console.warn("⚠️ Low confidence. Consider fallback to less aggressive preprocessing.");
  }

  if (archiveArray && debugCanvas) {
    const blob = await new Promise(res => debugCanvas.toBlob(res, "image/png"));
    const timestamp = Date.now();

    console.log("🧪 Preprocessed image (debug view):", debugCanvas.toDataURL("image/png"));

    archiveArray.push({
      name: `digit_${predictedDigit}_${timestamp}.png`,
      blob,
    });

    const text = `Prediction: ${predictedDigit}\nTimestamp: ${timestamp}\nPatient: ${patientName}`;
    const metaBlob = new Blob([text], { type: "text/plain" });

    archiveArray.push({
      name: `digit_${predictedDigit}_${timestamp}.txt`,
      blob: metaBlob,
    });
  }

  return predictedDigit;
}

export async function preprocessDrawing(dataURL, profile = null, includeCanvas = false) {
  const image = new Image();
  image.src = dataURL;
  await new Promise((res) => (image.onload = res));

  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  return await preprocessCanvas(canvas, profile, includeCanvas);
}

function cropToBoundingBox(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  let top = height, bottom = 0, left = width, right = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const brightness = (r + g + b) / 3;

      if (brightness < 240) {
        if (x < left) left = x;
        if (x > right) right = x;
        if (y < top) top = y;
        if (y > bottom) bottom = y;
      }
    }
  }

  const cropWidth = right - left + 1;
  const cropHeight = bottom - top + 1;

  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = cropWidth;
  croppedCanvas.height = cropHeight;
  const croppedCtx = croppedCanvas.getContext("2d");
  croppedCtx.drawImage(canvas, left, top, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  return deskewCanvas(croppedCanvas);
}

function deskewCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let sumX = 0, sumY = 0, sumXY = 0, sumYY = 0, count = 0;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
      const intensity = 1 - brightness / 255;
      sumX += x * intensity;
      sumY += y * intensity;
      sumXY += x * y * intensity;
      sumYY += y * y * intensity;
      count += intensity;
    }
  }

  if (count === 0) return canvas; // blank
  const meanX = sumX / count;
  const meanY = sumY / count;
  const covXY = sumXY / count - meanX * meanY;
  const varY = sumYY / count - meanY * meanY;
  const skew = covXY / varY;

  const deskewed = document.createElement("canvas");
  deskewed.width = canvas.width;
  deskewed.height = canvas.height;
  const dctx = deskewed.getContext("2d");

  dctx.setTransform(1, 0, -skew, 1, skew * canvas.height / 2, 0);
  dctx.drawImage(canvas, 0, 0);
  return deskewed;
}

export async function preprocessCanvas(canvas, profile = null, includeCanvas = false) {
  const cropped = cropToBoundingBox(canvas);

  // Resize to 20x20 with aspect ratio preserved
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = 20;
  tempCanvas.height = 20;

  const cropRatio = cropped.width / cropped.height;
  let targetWidth = 20, targetHeight = 20;

  if (cropRatio > 1) {
    targetHeight = Math.round(20 / cropRatio);
  } else {
    targetWidth = Math.round(20 * cropRatio);
  }

  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.clearRect(0, 0, 20, 20);
  tempCtx.drawImage(
    cropped,
    (20 - targetWidth) / 2,
    (20 - targetHeight) / 2,
    targetWidth,
    targetHeight
  );

  // Pad to 28x28
  const resized = document.createElement("canvas");
  resized.width = 28;
  resized.height = 28;
  const resizedCtx = resized.getContext("2d");
  resizedCtx.fillStyle = "white";
  resizedCtx.fillRect(0, 0, 28, 28);
  resizedCtx.drawImage(tempCanvas, 4, 4);

  // Convert to grayscale tensor
  const imgData = resizedCtx.getImageData(0, 0, 28, 28);
  const data = imgData.data;
  const gray = [];
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    gray.push(1.0 - avg / 255);
  }

  let tensor = tf.tensor2d(gray, [28, 28]);

  const pixelSum = tensor.sum().dataSync()[0];
  const binary = tensor.greater(tf.scalar(0.15)).toFloat();
  const activePixels = binary.sum().dataSync()[0];
  const isVerySmall = activePixels < 60 || pixelSum < 25;

  if (!profile) {
    profile = detectProfile(pixelSum, activePixels);
    console.log("🧠 Auto-selected profile:", profile);
  }

  tensor = centerImage(tensor); // center using center of mass

  if (profile === "standard") {
    console.log("🎯 Standard profile: Keeping raw grayscale");
  } else {
    const smoothLevel = activePixels < 80 ? "strong" : "light";
    tensor = gaussianSmooth(tensor, smoothLevel);

    if (!isVerySmall && tensor.sum().dataSync()[0] < 70) {
      tensor = dilate(tensor);
    }

    tensor = binarize(tensor, 0.25);
  }

  const input = tensor.reshape([1, 28, 28, 1]);

  let debugCanvas = null;
  if (includeCanvas) {
    debugCanvas = document.createElement("canvas");
    debugCanvas.width = 28;
    debugCanvas.height = 28;
    await tf.browser.toPixels(tensor, debugCanvas);
  }

  return { tensor: input, debugCanvas };
}


function centerImage(tensor) {
  const sum = tensor.sum().arraySync();
  if (sum === 0) return tensor;

  const arr = tensor.arraySync();
  let cx = 0, cy = 0;

  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const val = arr[y][x];
      cx += x * val;
      cy += y * val;
    }
  }

  cx /= sum;
  cy /= sum;

  const shiftX = Math.round(14 - cx);
  const shiftY = Math.round(14 - cy);

  const padded = tf.pad(tensor, [[1, 1], [1, 1]], 0);
  const begin = [1 - shiftY, 1 - shiftX];
  const size = [28, 28];
  const safeBegin = begin.map(v => Math.max(0, Math.min(2, v)));

  return tf.slice(padded, safeBegin, size);
}

function gaussianSmooth(tensor, level = "strong") {
  let kernelArray;

  if (level === "light") {
    kernelArray = [
      [0, 1, 0],
      [1, 4, 1],
      [0, 1, 0]
    ];
  } else {
    kernelArray = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ];
  }

  const kernel = tf.tensor4d(
    kernelArray.map(row => row.map(val => [[val]])),
    [3, 3, 1, 1]
  ).div(level === "light" ? 8 : 16);

  return tf.conv2d(tensor.reshape([1, 28, 28, 1]), kernel, 1, 'same').reshape([28, 28]);
}

function dilate(tensor) {
  return tf.maxPool(tensor.reshape([1, 28, 28, 1]), [3, 3], [1, 1], 'same').reshape([28, 28]);
}

function binarize(tensor, threshold = 0.25) {
  return tensor.greater(tf.scalar(threshold)).toFloat();
}

function detectProfile(pixelSum, activePixels) {
  const isFaint = pixelSum < 40;
  const isSmall = activePixels < 120;
  const isThin = activePixels < 80 && pixelSum / activePixels < 0.5;

  if (isFaint || isSmall || isThin) return "parkinson-enhanced";
  return "standard";
}
