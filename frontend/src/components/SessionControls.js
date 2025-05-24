// frontend/src/components/SessionControls.js

import React from "react";

function SessionControls({ onStart, onEnd, sessionActive, loading }) {
  const commonButtonClasses = "px-6 py-2 rounded-full text-white font-semibold transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2";

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4">
      {!sessionActive ? (
        <button
          onClick={onStart}
          className={`${commonButtonClasses} bg-green-500 hover:bg-green-600 focus:ring-green-300`}
          aria-label="Start handwriting therapy session"
          disabled={loading}
        >
          {loading ? "Starting..." : "Start Session"}
        </button>
      ) : (
        <button
          onClick={onEnd}
          className={`${commonButtonClasses} bg-red-500 hover:bg-red-600 focus:ring-red-300`}
          aria-label="End handwriting therapy session"
          disabled={loading}
        >
          {loading ? "Ending..." : "End Session"}
        </button>
      )}
    </div>
  );
}

export default SessionControls;
