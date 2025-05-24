import React from "react";

function FloatingDigit({ digit, isCorrect }) {
  return (
    <div
      className={`absolute text-5xl font-bold select-none pointer-events-none
        ${isCorrect ? "text-pink-300 animate-float-up" : "text-red-400 animate-float-down"}
        left-1/2 transform -translate-x-1/2 top-1/2`}
      style={{ zIndex: 50 }}
    >
      {digit}
    </div>
  );
}

export default FloatingDigit;
