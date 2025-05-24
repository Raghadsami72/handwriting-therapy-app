// ✅ Cleaned and fixed tracking_agent/index.js for full stroke tracking
let strokes = []; // All points across all strokes
let currentStroke = []; // Single stroke (list of enriched points)
let sessionMeta = { patientName: "Anonymous", sessionId: "" };

export function startTracking({ patientName = "Anonymous", sessionId = "" }) {
  sessionMeta = { patientName, sessionId };
  strokes = [];
  currentStroke = [];
  console.log("🧠 Tracking started for", patientName);
}

export function recordStrokePoint(point) {
  currentStroke.push({
    x: point.x,
    y: point.y,
    timestamp: point.timestamp,
    pressure: point.pressure ?? 0.5,
  });
}

export function finalizeStroke() {
  if (currentStroke.length > 0) {
    strokes.push(...currentStroke);
    currentStroke = [];
  }
}

export async function endTracking({ generateJSON = true, autoDownloadLog = true }) {
  finalizeStroke();

  const result = {
    patientName: sessionMeta.patientName,
    sessionId: sessionMeta.sessionId,
    timestamp: new Date().toISOString(),
    strokeCount: strokes.length,
    strokes,
  };

  console.log("📈 Session Stroke Data:", result);

  if (generateJSON && autoDownloadLog) {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sessionMeta.patientName}_tracking_log.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return result;
}

// ✅ NEW: Safely expose strokes for MCP
export function getStrokesRaw() {
  return strokes;
}
