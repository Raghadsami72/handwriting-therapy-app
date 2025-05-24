import React, { useState } from "react";
import { generatePDFReportFull, generateJSONReport } from "../agents/tracking_agent/report_generator";
import { saveAs } from "file-saver";

function ReplaySection({ attempts, mcp, metrics: parentMetrics, fatigue: parentFatigue, patientName }) {
  const [loading, setLoading] = useState(false);

const handleDownloadPDF = async () => {
  if (!parentMetrics || !parentFatigue) {
    alert("⚠️ Session summary not available yet.");
    return;
  }
  setLoading(true);
  const doc = await generatePDFReportFull({
    attempts,
    metrics: parentMetrics,
    fatigueInfo: parentFatigue,
    digitAccuracy: 0, // You can pass the real one later
    patientName,
    sessionId: `session_${Date.now()}`,
    language: localStorage.getItem("language") || "en",
    autoSave: false
  });
  saveAs(doc, `Report_${patientName}_${new Date().toISOString().slice(0, 10)}.pdf`);
  setLoading(false);
};


  const handleDownloadJSON = async () => {
    if (!parentMetrics || !parentFatigue) {
      alert("⚠️ Session summary not available yet.");
      return;
    }
    setLoading(true);
    const blob = await generateJSONReport(parentMetrics, parentFatigue);
    saveAs(blob, `SessionData_${patientName}_${new Date().toISOString().slice(0, 10)}.json`);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-2 text-blue-800">📁 Session Export</h2>
      <p className="text-sm text-gray-600 mb-4">
        You can download the full session data as a PDF or JSON file for documentation and analysis.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 px-4 py-2 rounded-lg font-medium shadow"
        >📄 Download PDF</button>

        <button
          onClick={handleDownloadJSON}
          disabled={loading}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-900 px-4 py-2 rounded-lg font-medium shadow"
        >🧾 Download JSON</button>
      </div>
    </div>
  );
}

export default ReplaySection;
