// src/pages/IntroPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MCPManager } from "../agents/mcpManager";
import { toast } from "react-hot-toast";

const mcp = new MCPManager();

function IntroPage() {
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const patientName = localStorage.getItem("patientName") || "Anonymous";

  const handleStart = async () => {
    try {
      localStorage.setItem("language", language);

      // ✅ Start session via MCP
      await mcp.startSession(patientName);

      // ✅ Navigate to therapy page
      navigate("/therapy");
    } catch (error) {
      toast.error("Failed to start session. Please try again.");
      console.error("Session start error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Handwriting Therapy</h1>

      <p className="text-lg text-gray-600 max-w-md text-center mb-6">
        Welcome {patientName}! This program will help improve your handwriting skills
        through guided therapy exercises. Choose your language and begin when ready.
      </p>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setLanguage("en")}
          className={`py-2 px-4 rounded-xl border-2 font-semibold transition ${
            language === "en"
              ? "bg-pink-300 text-white border-pink-300"
              : "border-pink-200 text-pink-700"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage("ar")}
          className={`py-2 px-4 rounded-xl border-2 font-semibold transition ${
            language === "ar"
              ? "bg-green-300 text-white border-green-300"
              : "border-green-200 text-green-700"
          }`}
        >
          العربية
        </button>
      </div>

      <button
        onClick={handleStart}
        className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl transition duration-200"
      >
        Start Therapy
      </button>
    </div>
  );
}

export default IntroPage;
