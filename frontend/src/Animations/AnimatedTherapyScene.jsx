// src/components/AnimatedTherapyScene.jsx
import React from "react";
import BirdSprite from "../assets/Walking_Bird.gif";
import CoralFlower from "../assets/flowers/CoralFlower.png";
import OrangeFlower from "../assets/flowers/OrangeFlower.png";
import PinkFlower from "../assets/flowers/PinkFlower.png";
import PurpleFlower from "../assets/flowers/PurpleFlower.png";
import BlueFlower from "../assets/flowers/BlueFlower.png";
import YellowFlower from "../assets/flowers/YellowFlower.png";

const flowerImages = [
  CoralFlower,
  OrangeFlower,
  PinkFlower,
  PurpleFlower,
  BlueFlower,
  YellowFlower,
];

function AnimatedTherapyScene({ children, debugCanvas }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#d4e9d7] via-[#fde9ec] to-[#e0f7fa] overflow-hidden">
      {/* 🌼 Static Grass Layer */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-green-200 rounded-t-[30%] z-0"></div>

      {/* 🌸 Flowers scattered */}
      {flowerImages.map((flower, index) => (
        <img
          key={index}
          src={flower}
          alt={`flower-${index}`}
          className="absolute bottom-[0.5rem] w-10 animate-wiggle"
          style={{ left: `${10 + index * 14}%` }}
        />
      ))}

      {/* 🐦 Walking Bird */}
      <img
        src={BirdSprite}
        alt="walking bird"
        className="absolute bottom-6 left-1 animate-bird-walk w-12 cursor-pointer z-10"
        onClick={() => new Audio(require("../assets/Bird_Chirping.wav")).play()}
      />

      {/* ✨ Sparkles */}
      <div className="absolute top-10 right-10 w-12 h-12 bg-white/50 blur-2xl rounded-full animate-pulse-slow"></div>

      {/* 🧠 Main Content Wrapper */}
      <div className="relative z-20 flex flex-col items-center justify-start p-4">
        {children}

        {/* 👁️ Model View Preview */}
        {debugCanvas && (
          <div className="mt-6 flex flex-col items-center bg-white/80 p-3 rounded-lg shadow-md border border-gray-300">
            <span className="text-gray-700 text-sm font-medium mb-2">🧠 Model View</span>
            <div
              ref={(el) => {
                if (el && debugCanvas && !el.firstChild) el.appendChild(debugCanvas);
              }}
              className="w-[56px] h-[56px] border border-gray-500 rounded-md overflow-hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AnimatedTherapyScene;
