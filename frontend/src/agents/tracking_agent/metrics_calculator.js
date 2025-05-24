// agents/tracking_agent/metrics_calculator.js


export function calculateMetrics(strokes) {
  const strokeStability = calculateStrokeStability(strokes);

  if (strokes.length < 2) {
    const avgPressure = strokes.length === 1 ? strokes[0].pressure : 0;
    return {
      avgSpeed: 0,
      avgPressure: avgPressure,
      totalStrokes: strokes.length,
      speedVariance: 0,
    };
  }

  let totalDistance = 0;
  let totalTime = 0;
  let pressures = [strokes[0].pressure];

  for (let i = 1; i < strokes.length; i++) {
    const dx = strokes[i].x - strokes[i - 1].x;
    const dy = strokes[i].y - strokes[i - 1].y;
    const dt = strokes[i].timestamp - strokes[i - 1].timestamp;

    if (dt > 0) {
      totalDistance += Math.sqrt(dx * dx + dy * dy);
      totalTime += dt;
    }

    pressures.push(strokes[i].pressure);
  }

  const avgSpeed = totalTime > 0 ? (totalDistance / (totalTime / 1000)) : 0;
  const avgPressure = pressures.reduce((a, b) => a + b, 0) / pressures.length;
  const speedVariance = calculateSpeedVariance(strokes);

  return {
    avgSpeed: avgSpeed,
    avgPressure: avgPressure,
    totalStrokes: strokes.length,
    speedVariance: speedVariance,
      strokeStability: strokeStability,
  };
}

  // Calculates instantaneous speeds between consecutive points in the stroke data.
  export function calculateInstantaneousSpeeds(strokes) {
    if (strokes.length < 2) return [];
  
    const speeds = [];
  
    for (let i = 1; i < strokes.length; i++) {
      const dx = strokes[i].x - strokes[i - 1].x;
      const dy = strokes[i].y - strokes[i - 1].y;
      const dt = strokes[i].timestamp - strokes[i - 1].timestamp;
  
      if (dt > 0) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = distance / (dt / 1000); // pixels per second
        speeds.push(speed);
      }
    }
  
    return speeds;  // array of instantaneous speeds
  }

  // Calculates the variance of instantaneous writing speeds for stability analysis.
// Variance is the average of the squared differences from the mean speed.
export function calculateSpeedVariance(strokes) {
    const speeds = calculateInstantaneousSpeeds(strokes);
    if (speeds.length < 2) return 0; // Ensure there is enough data
  
    const avg = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const variance = speeds.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / speeds.length;
  
    return variance;
  }

/**
 * Analyze stroke speed from a sequence of stroke points.
 * @param {Array} strokes - [{x, y, pressure, timestamp}, ...]
 * @returns {Object} { averageSpeed, maxSpeed, minSpeed, totalLength }
 */
export function analyzeStrokeSpeed(strokes) {
  if (!strokes || strokes.length < 2) return null;

  let totalDistance = 0;
  let speeds = [];

  for (let i = 1; i < strokes.length; i++) {
    const dx = strokes[i].x - strokes[i - 1].x;
    const dy = strokes[i].y - strokes[i - 1].y;
    const dt = (strokes[i].timestamp - strokes[i - 1].timestamp) / 1000;

    if (dt <= 0) continue;

    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = distance / dt;

    totalDistance += distance;
    speeds.push(speed);
  }

  const averageSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const maxSpeed = Math.max(...speeds);
  const minSpeed = Math.min(...speeds);

  return { averageSpeed, maxSpeed, minSpeed, totalLength: totalDistance };
}

/**
 * Detect micrographia by analyzing size shrinkage over time.
 * @param {Array} strokes
 * @returns {Object} { shrinkRatio, segmentSizes }
 */
export function detectMicrographia(strokes) {
  if (!strokes || strokes.length < 10) return null;

  const segmentCount = 5;
  const segmentSize = Math.floor(strokes.length / segmentCount);
  const segmentSizes = [];

  for (let i = 0; i < segmentCount; i++) {
    const segment = strokes.slice(i * segmentSize, (i + 1) * segmentSize);
    const xs = segment.map(p => p.x);
    const ys = segment.map(p => p.y);
    const width = Math.max(...xs) - Math.min(...xs);
    const height = Math.max(...ys) - Math.min(...ys);
    segmentSizes.push(Math.sqrt(width * width + height * height));
  }

  const shrinkRatio = segmentSizes[segmentSizes.length - 1] / segmentSizes[0];

  return { shrinkRatio, segmentSizes };
}

/**
 * Detect tremor by identifying high-frequency fluctuations.
 * @param {Array} strokes
 * @returns {Object} { tremorScore, highFreqSegments }
 */
export function detectTremor(strokes) {
  if (!strokes || strokes.length < 3) return null;

  const deviations = [];
  const highFreqSegments = [];

  for (let i = 1; i < strokes.length - 1; i++) {
    const prev = strokes[i - 1];
    const curr = strokes[i];
    const next = strokes[i + 1];

    const dx1 = curr.x - prev.x;
    const dy1 = curr.y - prev.y;
    const dx2 = next.x - curr.x;
    const dy2 = next.y - curr.y;

    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);
    const delta = Math.abs(angle2 - angle1);

    deviations.push(delta);
    if (delta > 0.5) highFreqSegments.push(curr);
  }

  const tremorScore = deviations.reduce((a, b) => a + b, 0) / deviations.length;

  return { tremorScore, highFreqSegments };
}
/**
 * Calculates stroke stability as inverse of directional angle variance.
 * @param {Array} strokes - [{x, y, timestamp}, ...]
 * @returns {Number} stability score [0–10], higher is smoother
 */
export function calculateStrokeStability(strokes) {
  if (!strokes || strokes.length < 3) return 0;

  const angles = [];
  for (let i = 1; i < strokes.length; i++) {
    const dx = strokes[i].x - strokes[i - 1].x;
    const dy = strokes[i].y - strokes[i - 1].y;
    angles.push(Math.atan2(dy, dx));
  }

  const mean = angles.reduce((a, b) => a + b, 0) / angles.length;
  const variance = angles.reduce((sum, angle) => sum + (angle - mean) ** 2, 0) / angles.length;

  const stability = 1 / (variance + 1e-5); // avoid division by zero
  return Math.min(10, parseFloat(stability.toFixed(2))); // scale to [0–10] range
}
