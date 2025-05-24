export default class TherapySessionAgent {
constructor(patientName = "Anonymous", mcp = null) {
  this.patientName = patientName;
  this.digits = [...Array(10).keys()];
  this.currentIndex = 0;
  this.attempts = []; // ✅ Add or fix this line
  this.sessionId = `session_${Date.now()}`;
  this.mcp = mcp;
}


  getCurrentDigit() {
    return this.digits[this.currentIndex];
  }

  getStrokes() {
    const mcpEntry = this.mcp?.sessionData?.[this.currentIndex];
    return mcpEntry?.strokes || [];
  }

  goToNextDigit() {
    if (this.currentIndex < this.digits.length - 1) {
      this.currentIndex++;
    }
  }

  isSessionFinished() {
    return this.currentIndex >= this.digits.length - 1;
  }

  // ✅ Let MCP handle the full drawing logic
// 🆕 Drop this into TherapySessionAgent.js
async processDrawing(dataURL, targetDigit) {
  // 1️⃣ Forward the drawing + targetDigit to MCPManager
  const { predictedDigit, feedbackText } = await this.mcp.processDrawing(
    dataURL,
    targetDigit        // ✅ make sure MCP receives it
  );

  // 2️⃣ (Optional) keep a local log inside TherapySessionAgent
  this.attempts.push({
    targetDigit,
    predictedDigit,
    correct: predictedDigit === targetDigit,
    feedbackText,
    timestamp: new Date().toISOString(),
  });

  // 3️⃣ Return prediction + feedback back to Canvas/UI
  return { predictedDigit, feedbackText };
}





  // ✅ Return sessionData directly from MCP
async endSession() {
  const {
    drawings,
    metrics,
    fatigueInfo,
    strokeSpeedData,
    micrographiaData,
    tremorData,
    digitAccuracy,
    progressReport
  } = await this.mcp.endSession({
    autoDownloadLog: true,
    generatePDF: false,
    generateJSON: false,
  });

  return {
    // ✅ This is the FIX — pass the drawings (MCP's sessionData) as attempts
    attempts: drawings,
    metrics,
    fatigueInfo,
    strokeSpeedData,
    micrographiaData,
    tremorData,
    digitAccuracy,
    progressReport,
    patientName: this.patientName,
    sessionId: this.sessionId,
  };
}

}
