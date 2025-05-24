// ResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ResultsTabs from "../components/ResultsTabs";
import ReplaySection from "../components/ReplaySection";
import ProgressDashboard from "../components/ProgressDashboard";
import { MCPManager } from "../agents/mcpManager";
import { toast } from "react-hot-toast";
import { generateSessionSummary } from "../agents/llmAgent";
import { getAllSessions } from "../agents/tracking_agent/session_logger";

const motivationalQuotes = [
  "Your progress is beautiful. 🌸",
  "You’re doing better than you think. 🌟",
  "Small steps still move you forward. 🐾",
  "Your efforts matter. 💖"
];

const mcp = new MCPManager();

function ResultsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("core");
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [attempts, setAttempts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [fatigueInfo, setFatigueInfo] = useState(null);
  const [patientName, setPatientName] = useState("Anonymous");
  const [llmSummary, setLlmSummary] = useState("");
  const [loadingLlm, setLoadingLlm] = useState(false);
  const [allSessions, setAllSessions] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * motivationalQuotes.length);
      setQuote(motivationalQuotes[random]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const data = location.state?.sessionData;
    
    if (data) {
      console.log("✅ Loaded session from navigation:", data);
      const patientKey = data?.patientName?.toLowerCase?.() || this.patientName.toLowerCase?.() || "anonymous";
console.log("🧠 Loaded sessionData:", data);
console.log("🧠 Derived patientKey:", patientKey);

      const sessions = getAllSessions(patientKey); // array of past sessions
      setAllSessions(sessions);

      if (sessions.length > 0) {
        const latest = sessions.at(-1);
        setMetrics(latest.metrics || {});
        setFatigueInfo(latest.fatigueInfo || {});
        setPatientName(latest.patientName || "Anonymous");
        setAttempts(latest.attempts || []);
      } else {
        toast.error("No sessions found for this patient.");
      }
      toast.success("📦 Session data loaded successfully!");
    } else {
      console.warn("⚠️ No session data passed to ResultsPage.");
      toast.error("No session data found. Please retry the session.");
    }
  }, [location.state?.sessionData]);

  const generateTherapistFeedback = () => {
    if (!metrics) return "Not enough data.";
    const { avgSpeed = 0, avgPressure = 0, speedVariance = 0 } = metrics;
    let feedback = [];

    if (avgSpeed < 60) feedback.push("🟡 Try speeding up your strokes to improve fluency.");
    else feedback.push("🟢 Good speed control!");

    if (avgPressure < 0.3) feedback.push("🟡 Your grip is too light, try pressing a bit harder.");
    else if (avgPressure > 0.8) feedback.push("🟡 Your grip is too tight, relax your hand.");
    else feedback.push("🟢 Perfect pressure control!");

    if (speedVariance > 150000) feedback.push("🟡 Try keeping your stroke flow steadier to reduce tremor.");
    else feedback.push("🟢 Stroke stability is solid!");

    return feedback.join(" ");
  };

  const getDigitSummary = () => {
    const summary = {};
    for (let i = 0; i <= 9; i++) {
      summary[i] = { correct: 0, wrong: 0 };
    }
    for (const attempt of attempts) {
      const target = attempt.targetDigit;
      const isCorrect = attempt.correct;
      if (typeof target !== "number" || isNaN(target)) continue;
      if (isCorrect) summary[target].correct += 1;
      else summary[target].wrong += 1;
    }
    return summary;
  };

  const handleExplainMyResults = async () => {
    if (!metrics) return;
    setLoadingLlm(true);
    const summaryText = await generateSessionSummary({
      name: patientName,
      summary: metrics,
      speakOut: true
    });
    setLlmSummary(summaryText);
    setLoadingLlm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-pink-100 p-4">
      <div className="text-center bg-white/60 border border-white backdrop-blur-md shadow-sm px-6 py-2 rounded-full text-sm font-medium text-gray-800 animate-pulse mb-6">
        ✨ {quote}
      </div>

      <ResultsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="mt-4">
        {activeTab === "core" && (
          <div className="bg-white rounded-lg shadow p-4 text-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-blue-800">📊 Core Metrics</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Speed: {metrics?.avgSpeed?.toFixed(2)} px/sec</li>
              <li>Pressure: {metrics?.avgPressure?.toFixed(2)}</li>
              <li>Stroke Stability: {metrics?.speedVariance?.toFixed(2)}</li>
              <li>Total Strokes: {metrics?.totalStrokes}</li>
            </ul>

            <div className="pt-4">
              <h3 className="text-md font-semibold text-green-700 mb-2">🧶 Digit Classification Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2">Digit</th>
                      <th className="px-4 py-2">Correct</th>
                      <th className="px-4 py-2">Wrong</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(getDigitSummary()).map(([digit, data]) => (
                      <tr key={digit} className="border-t">
                        <td className="px-4 py-1 font-bold">{digit}</td>
                        <td className="px-4 py-1 text-green-700">{data.correct}</td>
                        <td className="px-4 py-1 text-red-600">{data.wrong}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "feedback" && (
          <div className="bg-white rounded-lg shadow p-4 text-gray-700">
            <h2 className="text-lg font-bold text-pink-800 mb-2">🧐 Therapist Feedback</h2>
            <p className="text-md">{generateTherapistFeedback()}</p>
          </div>
        )}

        {activeTab === "summary" && (
          <>
            <div className="bg-white rounded-lg shadow p-4 text-gray-800 space-y-2">
              <h2 className="text-xl font-bold text-green-800">📊 Session Summary</h2>
              {metrics ? (
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Average Speed:</strong> {metrics.avgSpeed?.toFixed(2)} px/s</li>
                  <li><strong>Average Pressure:</strong> {metrics.avgPressure?.toFixed(2)}</li>
                  <li><strong>Stroke Stability:</strong> {metrics.speedVariance?.toFixed(2)}</li>
                  <li><strong>Total Strokes:</strong> {metrics.totalStrokes}</li>
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Loading session summary...</p>
              )}

              {fatigueInfo && (
                <div className="mt-4">
                  <h3 className="font-semibold text-red-700">🛑 Fatigue Analysis</h3>
                  <p>Detected: {fatigueInfo.detected ? "Yes" : "No"}</p>
                  <p>Reason: {fatigueInfo.reason}</p>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={handleExplainMyResults}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200"
                >
                  {loadingLlm ? "Explaining..." : "🟢 Explain My Results"}
                </button>

                {llmSummary && (
                  <div className="mt-4 p-4 bg-blue-50 rounded text-sm text-gray-800 whitespace-pre-wrap border-l-4 border-blue-300 shadow-sm">
                    {llmSummary}
                  </div>
                )}
              </div>

              <ProgressDashboard
                patientName={patientName}
                metrics={allSessions.map((s) => ({
                  digitAccuracy: s.metrics?.digitAccuracy ?? 0,
                  strokeSpeedData: s.metrics?.strokeSpeedData ?? { averageSpeed: 0 },
                  micrographiaData: s.metrics?.micrographiaData ?? { shrinkRatio: 0 },
                  tremorData: s.metrics?.tremorData ?? { tremorScore: 0 }
                }))}
              />

              <ReplaySection
                attempts={attempts}
                mcp={mcp}
                metrics={metrics}
                fatigue={fatigueInfo}
                patientName={patientName}
              />

              <div className="relative w-full h-40 mt-12 overflow-hidden">
                <img src="/assets/grass.png" alt="" className="absolute bottom-0 w-full object-cover z-0" />
                <img src="/assets/Walking_Bird.gif" alt="" className="absolute bottom-4 left-4 h-20 animate-wiggle" style={{ animation: "walk 12s linear infinite" }} />
                <img src="/assets/flowers/BlueFlower.png" alt="" className="absolute bottom-4 left-32 h-12 animate-bounce-slow" />
                <img src="/assets/flowers/PinkFlower.png" alt="" className="absolute bottom-4 left-64 h-10 animate-float-soft" />
                <img src="/assets/flowers/OrangeFlower.png" alt="" className="absolute bottom-4 left-[40%] h-14 animate-bounce-slow" />
                <img src="/assets/flowers/PurpleFlower.png" alt="" className="absolute bottom-4 right-32 h-12 animate-float-soft" />
                <img src="/assets/flowers/YellowFlower.png" alt="" className="absolute bottom-4 right-64 h-10 animate-bounce-slow" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
