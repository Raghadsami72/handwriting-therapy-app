// frontend/src/components/SessionResults.js

import React from "react";

function SessionResults({ results }) {
  if (!results?.trackingResults) {
    return (
      <div className="mt-8 bg-white p-6 rounded shadow w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Session Summary 📋</h2>
        <p className="text-gray-500">No tracking data available for this session.</p>
      </div>
    );
  }

  const { metrics, fatigueInfo } = results.trackingResults;

  return (
    <div className="mt-8 bg-white p-6 rounded shadow w-full max-w-2xl transition-all duration-500 ease-in-out">
      <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-300 pb-2">🩺 Therapy Session Summary</h2>

      <div className="space-y-4 text-gray-700 text-lg">
        <p>🏃‍♀️ <strong>Average Speed:</strong> {metrics.avgSpeed.toFixed(2)} px/sec</p>
        <p>✋ <strong>Average Pressure:</strong> {metrics.avgPressure.toFixed(2)}</p>
        <p>🖌️ <strong>Total Strokes Captured:</strong> {metrics.totalStrokes}</p>
        <p>📈 <strong>Stroke Stability (Speed Variance):</strong> {metrics.speedVariance.toFixed(2)}</p>
        <hr className="border-gray-300" />
        <p>🛌 <strong>Fatigue Detected:</strong> {fatigueInfo.detected ? "Yes" : "No"}</p>
        <p>💬 <strong>Reason:</strong> {fatigueInfo.reason || "No specific reason detected"}</p>
      </div>

      <p className="text-xs text-gray-400 mt-6">📅 Report generated at: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default SessionResults;
