// frontend/src/pages/TherapyPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CanvasDrawing from "../components/CanvasDrawing";
import AnimatedTherapyScene from "../Animations/AnimatedTherapyScene";
import * as imported from "../agents/tracking_agent/TherapySessionAgent.js";

const TherapySessionAgent = imported.default;

const motivationalQuotes = {
  en: [
    "You're doing amazing!",
    "Keep going, one step at a time 🌱",
    "Progress is power ✨",
    "You’re stronger than you think 💪",
  ],
  ar: [
    "أنت تقوم بعمل رائع!",
    "استمر، خطوة بخطوة 🌱",
    "التقدم هو القوة ✨",
    "أنت أقوى مما تظن 💪",
  ],
};

function TherapyPage({ mcp, patientName }) {
  const [quote, setQuote] = useState("");
  const [language, setLanguage] = useState("en");
  const [feedback, setFeedback] = useState("Draw carefully and take your time.");
  const [sessionManager] = useState(() => new TherapySessionAgent(patientName, mcp));
const [feedbackVisible, setFeedbackVisible] = useState(false);



  const navigate = useNavigate();

  useEffect(() => {
    const lang = localStorage.getItem("language") || "en";
    setLanguage(lang);
    rotateQuote(lang);
  }, []);
  useEffect(() => {
  if (mcp?.startSession) {
    mcp.startSession(patientName); // 💡 make sure to start with correct name
  }
}, [mcp, patientName]);


  const rotateQuote = (lang) => {
    const quotes = motivationalQuotes[lang];
    const interval = setInterval(() => {
      const random = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[random]);
    }, 5000);
    return () => clearInterval(interval);
  };

 const handleNextDigit = async () => {
  if (sessionManager.isSessionFinished()) {
    const sessionSummary = await sessionManager.endSession();  // 🔥 Now it properly ends the session

const cleanedSummary = {
  ...sessionSummary,
  attempts: sessionSummary.attempts.map(({ drawingDataURL, strokes, ...rest }) => ({
    ...rest
  })),
  metrics: sessionSummary.metrics, // keep only essential keys
  fatigueInfo: sessionSummary.fatigueInfo,
  digitAccuracy: sessionSummary.digitAccuracy,
  sessionId: sessionSummary.sessionId,
  patientName: sessionSummary.patientName
};

localStorage.setItem("lastSessionResults", JSON.stringify(cleanedSummary));


    navigate("/results", {
      state: { sessionData: sessionSummary, mcp },
    });
  } else {
    sessionManager.goToNextDigit();
    setFeedback("Great! Let's try the next one.");
    setFeedbackVisible(true);

    setTimeout(() => setFeedbackVisible(false), 1500); // hide after 1.5s

  }
};


  const playFeedbackAudio = () => {
    const utterance = new SpeechSynthesisUtterance(feedback);
    utterance.lang = language === "ar" ? "ar-SA" : "en-US";
    window.speechSynthesis.speak(utterance);
  };

  // 🛠️ Debug metrics and strokes every 5 seconds
  useEffect(() => {
    console.log("🔥 MCP inside TherapyPage:", mcp);
    window.__MCP__ = mcp; // Optional: global for console testing

    const interval = setInterval(() => {
      const attempts = JSON.parse(localStorage.getItem("attempts") || "[]");
      console.log("🧠 [Therapy] Attempts so far:", attempts);

      if (mcp?.getMetrics) {
        const metrics = mcp.getMetrics();
        console.log("📊 [Therapy] MCP Metrics Snapshot:", metrics);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [mcp]);

  return (
    <AnimatedTherapyScene>
      <div className="absolute top-4 text-center bg-white/50 px-6 py-2 rounded-full text-sm font-medium text-gray-700 animate-pulse shadow-sm border border-white">
        {quote}
      </div>

      <h2 className="text-2xl mt-20 mb-2 text-gray-800 font-semibold">
        {language === "en"
          ? `Draw the number: ${sessionManager.getCurrentDigit()}`
          : `ارسم الرقم: ${sessionManager.getCurrentDigit()}`}
      </h2>

      <CanvasDrawing
        mcp={mcp}
        patientName={patientName}
        currentDigit={sessionManager.getCurrentDigit()}
        onComplete={handleNextDigit}
        sessionManager={sessionManager}
        setFeedbackVisible={setFeedbackVisible}
      />

{feedbackVisible && (
  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 px-4 py-2 rounded-xl shadow-md text-sm text-gray-800 transition">
    🧠 {feedback}
  </div>
)}


      <div className="w-full max-w-xl mt-8 mb-2">
        <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-green-400 h-full transition-all duration-500"
            style={{
              width: `${((sessionManager.currentIndex + 1) / sessionManager.digits.length) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-center text-sm mt-1 text-gray-600">
          {sessionManager.currentIndex + 1}/{sessionManager.digits.length}
        </p>
      </div>

      <button
        onClick={playFeedbackAudio}
        className="mt-2 bg-pink-200 hover:bg-pink-300 text-pink-800 font-semibold px-4 py-2 rounded-full shadow-md transition"
      >
        🔊 Hear Therapist Feedback
      </button>

      <div className="absolute bottom-0 w-full h-32 pointer-events-none">
        <img src="/flowers/CoralFlower.png" alt="" className="absolute left-4 bottom-4 w-10 h-10 animate-float-soft" />
        <img src="/flowers/OrangeFlower.png" alt="" className="absolute left-20 bottom-5 w-10 h-10 animate-float-soft" />
        <img src="/flowers/PinkFlower.png" alt="" className="absolute left-36 bottom-6 w-10 h-10 animate-float-soft" />
        <img src="/flowers/BlueFlower.png" alt="" className="absolute right-20 bottom-5 w-10 h-10 animate-float-soft" />
        <img src="/flowers/PurpleFlower.png" alt="" className="absolute right-10 bottom-4 w-10 h-10 animate-float-soft" />
        <img src="/flowers/YellowFlower.png" alt="" className="absolute left-1/2 bottom-6 w-10 h-10 animate-float-soft" />
        <img src="/bird/BirdWalk.gif" alt="Bird" className="absolute bottom-0 left-1/4 w-16 h-16 animate-wiggle" />
      </div>
    </AnimatedTherapyScene>
  );
}

export default TherapyPage;
