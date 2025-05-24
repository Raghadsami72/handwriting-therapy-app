import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// 📄 Full professional report
export async function generatePDFReportFull({
  attempts = [],
  metrics = {},
  digitAccuracy = 0,
  fatigueInfo = {},
  patientName = "Anonymous",
  sessionId = null,
  language = "en",
  autoSave = false
} = {}) {
  try {
    const doc = new jsPDF();
    const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("HANDWRITING THERAPY SESSION REPORT", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, doc.internal.pageSize.getWidth() / 2, 26, { align: "center" });

    doc.line(20, 30, 190, 30);

    doc.setFontSize(12);
    doc.text("Patient Information", 20, 40);
    doc.setFontSize(11);
    doc.text(`Name: ${patientName}`, 25, 48);
    doc.text(`Language Mode: ${language}`, 25, 56);
    if (sessionId) doc.text(`Session ID: ${sessionId}`, 25, 64);

    const tableRows = attempts.map(entry => [
      entry.targetDigit ?? "N/A",
      entry.predictedDigit ?? "N/A",
      (entry.confidence || 0).toFixed(2),
      new Date(entry.timestamp).toLocaleTimeString(),
      (entry.speed || 0).toFixed(2) + "s",
      entry.correct ? "✓" : "✗",
      entry.feedbackText || (entry.correct ? "Well done." : "Retry needed.")
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Expected", "Predicted", "Confidence", "Time", "Speed", "Result", "Remarks"]],
      body: tableRows,
      theme: "grid",
      styles: { fontSize: 9 },
    });

    const summaryY = doc.lastAutoTable.finalY + 10;
    const correct = attempts.filter(a => a.correct).length;
    const incorrect = attempts.length - correct;

    doc.setFontSize(12);
    doc.text("Therapist Summary", 20, summaryY);
    doc.setFontSize(10);
    doc.text(`Correct Digits: ${correct}`, 25, summaryY + 8);
    doc.text(`Incorrect Digits: ${incorrect}`, 25, summaryY + 16);
    doc.text(`Accuracy: ${(digitAccuracy * 100).toFixed(2)}%`, 25, summaryY + 24);
    doc.text(`Average Speed: ${(metrics.avgSpeed || 0).toFixed(2)} px/sec`, 25, summaryY + 32);
    doc.text(`Stroke Variance: ${(metrics.speedVariance || 0).toFixed(2)}`, 25, summaryY + 40);
    doc.text(`Fatigue Detected: ${fatigueInfo.detected ? "Yes" : "No"}`, 25, summaryY + 48);
    if (fatigueInfo.reason) doc.text(`Fatigue Reason: ${fatigueInfo.reason}`, 25, summaryY + 56);

    doc.setFontSize(9);
    doc.text(
      "This report reflects a session using AI-based handwriting therapy tools. Always consult your physician for professional evaluation.",
      20,
      doc.internal.pageSize.getHeight() - 25
    );

    doc.setFontSize(8);
    doc.text("Page 1", doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });

    const blob = doc.output("blob");

    if (autoSave) {
      doc.save(`therapy_report_${patientName}_${Date.now()}.pdf`);
    }

    return blob;
  } catch (error) {
    console.error("🛑 Error generating enhanced PDF report:", error);
    throw error;
  }
}

// 🧾 JSON Report
export function generateJSONReport(metrics, fatigueInfo) {
  const sessionSummary = {
    generatedAt: new Date().toISOString(),
    metrics,
    fatigueInfo,
  };

  return new Blob([JSON.stringify(sessionSummary, null, 2)], {
    type: "application/json"
  });
}
