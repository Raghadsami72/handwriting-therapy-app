// agents/tracking_agent/fatigue_detector.js

import { calculateInstantaneousSpeeds } from './metrics_calculator.js';

export function detectFatigue(strokes, threshold = 20) {
  if (strokes.length < 5) {
    return {
      detected: false,
      reason: "Not enough data to detect fatigue.",
    };
  }

  const speeds = calculateInstantaneousSpeeds(strokes);
  
  if (speeds.length < 5) {
    return {
      detected: false,
      reason: "Not enough movement to assess fatigue.",
    };
  }

  const half = Math.floor(speeds.length / 2);
  const firstHalfSpeeds = speeds.slice(0, half);
  const secondHalfSpeeds = speeds.slice(half);

  const avgSpeedFirstHalf = average(firstHalfSpeeds);
  const avgSpeedSecondHalf = average(secondHalfSpeeds);

  if (avgSpeedFirstHalf < 10) {
    return {
      detected: false,
      reason: "Movement too slow to reliably assess fatigue.",
    };
  }

  const speedDropPercentage = ((avgSpeedFirstHalf - avgSpeedSecondHalf) / avgSpeedFirstHalf) * 100;

  return {
    detected: speedDropPercentage > threshold,
    reason: `Speed dropped by ${speedDropPercentage.toFixed(2)}% (Threshold: ${threshold}%)`,
  };
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
