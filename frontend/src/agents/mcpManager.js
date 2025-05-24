// File: frontend/src/agents/cnnAgent.js
// agents/mcpManager.js
import { predictDigit } from './cnnAgent.js';
import { generateFeedback } from './feedbackAgent.js';
import { endTracking } from './tracking_agent/index.js';
import { calculateMetrics } from './tracking_agent/metrics_calculator.js';
import { detectFatigue } from './tracking_agent/fatigue_detector.js';
import { getStrokesRaw } from './tracking_agent'; 
import { generatePDFReportFull, generateJSONReport } from './tracking_agent/report_generator.js';
import { saveSessionResult, getSessionProgressReport } from './tracking_agent/session_logger.js';
import JSZip from 'jszip';


import { analyzeStrokeSpeed, detectMicrographia, detectTremor } from './tracking_agent/metrics_calculator.js';

export class MCPManager {
  constructor() {
    this.sessionData = [];
    this.debugArchive = []; // 🆕 for saving images + txt
    this.patientName = "Anonymous";
    this.sessionId = null;
    this.language = localStorage.getItem("language") || "en";
  }

async startSession(patientName) {
  const resolvedName = patientName || localStorage.getItem("patientName") || "Anonymous";
  console.log("🟢 MCP session started for:", resolvedName);
  this.patientName = resolvedName;

    this.sessionId = `session_${Date.now()}`;
    
  }

  // ✅ Now accepts targetDigit as an argument
  async processDrawing(drawingDataURL, targetDigit = null) {

    console.log("🔥 [MCP] processDrawing called!", drawingDataURL, targetDigit);

    const predictedDigit = await predictDigit(drawingDataURL, this.language, null, this.debugArchive, this.patientName);
    const feedbackText = await generateFeedback(drawingDataURL, predictedDigit);

const strokes = getStrokesRaw?.() || []; // 🔍 You need to expose this from tracking_agent

const entry = {
  predictedDigit,
  targetDigit,
  correct: targetDigit !== null && predictedDigit === targetDigit,
  feedbackText,
  timestamp: new Date().toISOString(),
  strokes 
};

    this.sessionData.push(entry);
    console.log("📝 [MCP] Added entry:", entry);
console.log("📊 sessionData so far:", this.sessionData);

    return { predictedDigit, feedbackText };
  }

async endSession({ generatePDF = true, generateJSON = true, autoDownloadLog = true } = {}) {
  console.log("🔴 MCP ending session for:", this.patientName);

  const trackingResults = await endTracking({
    patientName: this.patientName,
    sessionId: this.sessionId,
    generateJSON,
    autoDownloadLog
  });

  const strokes = trackingResults.strokes || [];
  console.log("👉 Strokes received in MCP:", strokes);

  const metrics = calculateMetrics(strokes);
  console.log("✅ Calculated metrics:", metrics);

  const fatigueInfo = detectFatigue(strokes);

  const strokeSpeedData = analyzeStrokeSpeed(strokes);
  const micrographiaData = detectMicrographia(strokes);
  const tremorData = detectTremor(strokes);

  const digitAccuracy = this.sessionData.filter(d => d.correct).length / (this.sessionData.length || 1);

  const progressReport = getSessionProgressReport({
    ...metrics,
    strokeSpeedData,
    micrographiaData,
    tremorData,
    digitAccuracy,
  }, this.patientName);

  // 💾 Save session summary to localStorage
saveSessionResult(this.patientName.toLowerCase(), {
  sessionId: this.sessionId,
  timestamp: new Date().toISOString(),
  patientName: this.patientName,
  metrics: {
    ...metrics,
    strokeSpeedData,
    micrographiaData,
    tremorData,
    digitAccuracy
  },
  fatigueInfo,
    attempts: this.sessionData.map(({ drawingDataURL, ...rest }) => ({
    ...rest
  }))
});


  console.log("📊 Progress Report:", progressReport);

  try {
    // 📄 Generate PDF report
    if (generatePDF) {
      await generatePDFReportFull({
        attempts: this.sessionData,
        metrics,
        fatigueInfo,
        digitAccuracy,
        patientName: this.patientName,
        sessionId: this.sessionId,
        language: this.language || localStorage.getItem("language") || "en",
        autoSave: autoDownloadLog
      });
    }

    // 🧾 Generate JSON report
    if (generateJSON) {
      await generateJSONReport(metrics, fatigueInfo);
    }

    // 🗂️ Create ZIP of debug images
    if (this.debugArchive.length > 0) {
      const zip = new JSZip();
      for (const item of this.debugArchive) {
        zip.file(item.name, item.blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `session_${this.patientName}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

  } catch (err) {
    console.warn("⚠️ Export failed during endSession:", err);
  }

  return {
    drawings: this.sessionData,
    metrics,
    fatigueInfo,
    strokeSpeedData,
    micrographiaData,
    tremorData,
    digitAccuracy,
    progressReport
  };
}

}
