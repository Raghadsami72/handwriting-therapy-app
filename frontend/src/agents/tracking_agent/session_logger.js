
// frontend/src/agents/tracking_agent/session_logger.js

const STORAGE_KEY = "attempts";


// 🔐 1. Log individual drawing attempts
export function logAttempt(metricsObj) {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  existing.push(metricsObj);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
}

// 🔍 2. Retrieve drawing attempts
export function getAllAttempts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// 🧹 3. Clear attempts
//export function clearAttempts() {
 // localStorage.removeItem(STORAGE_KEY);
//}

export function saveSessionResult(patientName, sessionData) {
  console.log("📦 Saving session:", sessionData);
  const cleanName = patientName.trim().toLowerCase();
  const key = `sessions_${cleanName}`;

  const existing = JSON.parse(localStorage.getItem(key) || "[]");

  // Prevent duplicate sessionId
  const alreadyExists = existing.some(e => e.sessionId === sessionData.sessionId);
  if (alreadyExists) return;

  existing.push(sessionData);
  localStorage.setItem(key, JSON.stringify(existing));
}


// 📊 5. Retrieve all sessions for dashboard chart
export function getAllSessions(patientName) {
  const key = `sessions_${patientName.toLowerCase()}`; // ✅ FIXED to match saveSessionResult
  const sessions = JSON.parse(localStorage.getItem(key) || "[]");
  console.log("🟢 getAllSessions() for", key, "→", sessions);
  return sessions;
}


// 📈 6. Generate progress report (compare last 2 sessions)
export function getSessionProgressReport(currentMetrics, patientName) {
  const pastSessions = getAllSessions(patientName);
  const lastSession = pastSessions.at(-2); // skip the one we just added

  if (!lastSession) return null;

  return {
    speedChange: currentMetrics.avgSpeed - lastSession.metrics.avgSpeed,
    sizeChange: currentMetrics.micrographiaData?.shrinkRatio - lastSession.micrographiaData?.shrinkRatio,
    tremorChange: currentMetrics.tremorData?.tremorScore - lastSession.tremorData?.tremorScore,
    improvement: currentMetrics.digitAccuracy > lastSession.digitAccuracy,
  };
}
