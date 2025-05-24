// src/components/ResultsTabs.jsx
import React from "react";

function ResultsTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "core", label: "🔢 Core Metrics" },
    { id: "summary", label: "📊 Session Summary" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 border-b border-gray-200 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-blue-200 text-blue-800 shadow-sm"
              : "bg-white hover:bg-gray-100 text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default ResultsTabs;
