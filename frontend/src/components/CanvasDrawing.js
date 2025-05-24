import React, { useRef, useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import successSound from "../assets/success-chime.mp3";
import { startTracking, recordStrokePoint, finalizeStroke } from "../agents/tracking_agent";
import { logAttempt } from "../agents/tracking_agent/session_logger";
import FloatingDigit from "./FloatingDigit";

// ✅ Correctly receive props, including setFeedbackVisible
function CanvasDrawing({ mcp, patientName, sessionManager, onComplete, setFeedbackVisible }) {

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawingRef = useRef(false);

  const [processing, setProcessing] = useState(false);
  const [predictionCount, setPredictionCount] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [floatingDigit, setFloatingDigit] = useState(null);

  const successAudio = new Audio(successSound);

  const applyCanvasStyles = useCallback(() => {
    const ctx = ctxRef.current;
    if (!ctx || !canvasRef.current) return;

    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 12;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
    applyCanvasStyles();
    startTracking({ patientName });

    const getPosition = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX || e.touches?.[0]?.clientX) - rect.left,
        y: (e.clientY || e.touches?.[0]?.clientY) - rect.top,
        pressure: e.pressure ?? 0.5,
        timestamp: Date.now(),
      };
    };

    const handlePointerDown = (e) => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      const point = getPosition(e);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      recordStrokePoint(point);
      drawingRef.current = true;
      setHasDrawn(true);
    };

    const handlePointerMove = (e) => {
      if (!drawingRef.current) return;

      const ctx = ctxRef.current;
      const point = getPosition(e);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      recordStrokePoint(point);
    };

    const handlePointerUp = () => {
      if (!drawingRef.current) return;
      const ctx = ctxRef.current;
      ctx.closePath();
      drawingRef.current = false;
      finalizeStroke();
    };

    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    setCanvasReady(true);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [patientName, applyCanvasStyles]);

  const clearCanvas = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    applyCanvasStyles();
    setHasDrawn(false);
    drawingRef.current = false;
  };

  const handlePredict = async () => {
    if (!canvasRef.current || !hasDrawn) {
      toast.error("Please draw something first!");
      return;
    }
if (setFeedbackVisible) {
  setFeedbackVisible(false); // ✅ this works now
}


    try {
      setProcessing(true);
      const dataURL = canvasRef.current.toDataURL("image/png");
      const currentDigit = sessionManager.getCurrentDigit?.();
      console.log("🎯!! Using sessionManager.processDrawing with digit:", currentDigit);

      const { predictedDigit, feedbackText } = await mcp.processDrawing(dataURL, currentDigit);
      const correct = parseInt(predictedDigit) === currentDigit;
      const strokes = sessionManager.getStrokes?.();

      // ✨ Show feedback float
      setFloatingDigit({ digit: predictedDigit, isCorrect: correct });
      setTimeout(() => setFloatingDigit(null), 1200);

      // ✅ Log attempt to local storage (frontend dashboard)
      logAttempt({
        targetDigit: currentDigit,
        predictedDigit: parseInt(predictedDigit),
        correct,
        feedbackText,
        timestamp: new Date().toISOString(),
        patientName,
      });

      // 🎉 UI response
      if (correct) {
        successAudio.play();
        toast.success(`✅ Correct! You wrote ${currentDigit}
Feedback: ${feedbackText}`, {
          duration: 2000,
          style: { whiteSpace: "pre-line" },
        });
        setPredictionCount((prev) => prev + 1);
        onComplete?.(predictedDigit, correct, feedbackText, strokes);
      } else {
        toast.error(`❌ Try again! You wrote ${predictedDigit}, not ${currentDigit}.`);
      }

      clearCanvas();
    } catch (error) {
      console.error("Prediction failed:", error);
      toast.error("Something went wrong while predicting. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const commonButtonClasses =
    "px-6 py-2 rounded-full text-white font-semibold transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2";

  return (
    <div className="relative flex flex-col items-center space-y-4 mt-4 w-full max-w-md">
      <canvas
        ref={canvasRef}
        className="z-50 rounded-xl border bg-white border-black cursor-crosshair"
        width={300}
        height={300}
      />

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handlePredict}
          className={`${commonButtonClasses} bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 flex items-center justify-center gap-2`}
          disabled={processing || !canvasReady}
        >
          {processing ? (
            <>
              <ClipLoader size={20} color="#fff" />
              Processing...
            </>
          ) : (
            "Predict"
          )}
        </button>

        <button
          onClick={clearCanvas}
          className={`${commonButtonClasses} bg-gray-500 hover:bg-gray-600 focus:ring-gray-300`}
          disabled={processing || !canvasReady}
        >
          Clear
        </button>
      </div>

      {predictionCount > 0 && (
        <p className="text-blue-700 font-medium">
          ✨ Predictions made: <span className="font-bold">{predictionCount}</span>
        </p>
      )}
      <FloatingDigit digit={floatingDigit?.digit} isCorrect={floatingDigit?.isCorrect} />
    </div>
  );
}

export default CanvasDrawing;
