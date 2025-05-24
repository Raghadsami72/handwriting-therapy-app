import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function ProgressDashboard({ patientName, metrics }) {
  const sessions = Array.isArray(metrics) ? metrics : [metrics];

  const chartData = sessions.map((session, index) => ({
    session: `S${index + 1}`,
    accuracy:
      session.digitAccuracy != null
        ? +(session.digitAccuracy * 100).toFixed(2)
        : null,
    speed:
      session.strokeSpeedData?.averageSpeed != null
        ? +session.strokeSpeedData.averageSpeed.toFixed(2)
        : null,
    shrink:
      session.micrographiaData?.shrinkRatio != null
        ? +session.micrographiaData.shrinkRatio.toFixed(2)
        : null,
    tremor:
      session.tremorData?.tremorScore != null
        ? +session.tremorData.tremorScore.toFixed(2)
        : null,
  }));

  const hasData = chartData.some(
    (entry) => entry.accuracy || entry.speed || entry.shrink || entry.tremor
  );

  if (!hasData) {
    return (
      <div className="mt-6 text-sm text-gray-500">
        ⚠️ No valid metrics available yet.
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 rounded-lg bg-white shadow">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        📊 Progress Over Sessions for <span className="text-blue-700">{patientName}</span>
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="session" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#1f77b4"
            name="Accuracy (%)"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="#ff7f0e"
            name="Avg Speed"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="shrink"
            stroke="#2ca02c"
            name="Shrink Ratio"
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="tremor"
            stroke="#d62728"
            name="Tremor Score"
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
