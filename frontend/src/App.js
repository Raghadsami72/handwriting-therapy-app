/*
// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MCPManager } from "./agents/mcpManager";
import AppLogo from "./assets/Logo_App.png";

// Pages
import SplashScreen from "./Pages/SplashScreen";
import LoginPage from "./Pages/LoginPage";
import IntroPage from "./Pages/IntroPage";
import TherapyPage from "./Pages/TherapyPage";
import ResultsPage from "./Pages/ResultsPage";

import "./App.css";

const mcp = new MCPManager();

function App() {
  return (
    <div className="min-h-screen">
      <Toaster />

      <Routes>
        <Route path="/" element={<SplashScreen logo={AppLogo} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route
          path="/therapy"
          element={
            <TherapyPage
              mcp={mcp}
              patientName={localStorage.getItem("patientName") || "Anonymous"}
            />
          }
        />
        <Route
          path="/results"
          element={
            <ResultsPage
              mcp={mcp}
              patientName={localStorage.getItem("patientName") || "Anonymous"}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;*/

// src/App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { MCPManager } from "./agents/mcpManager";
import AppLogo from "./assets/Logo_App.png";

// Pages
import SplashScreen from "./Pages/SplashScreen";
import LoginPage from "./Pages/LoginPage";
import IntroPage from "./Pages/IntroPage";
import TherapyPage from "./Pages/TherapyPage";
import ResultsPage from "./Pages/ResultsPage";

import "./App.css";

const mcp = new MCPManager();

function RenderResultsPage() {
  const patientName = localStorage.getItem("patientName") || "Anonymous";
  return <ResultsPage mcp={mcp} patientName={patientName} />;
}

function RenderTherapyPage() {
  const patientName = localStorage.getItem("patientName") || "Anonymous";
  return <TherapyPage mcp={mcp} patientName={patientName} />;
}

function App() {
  return (
    <div className="min-h-screen">
      <Toaster />

      <Routes>
        <Route path="/" element={<SplashScreen logo={AppLogo} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/therapy" element={<RenderTherapyPage />} />
        <Route path="/results" element={<RenderResultsPage />} />
      </Routes>
    </div>
  );
}

export default App;

