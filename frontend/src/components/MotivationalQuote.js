// frontend/src/components/MotivationalQuote.js

import React, { useEffect, useState } from "react";

const quotes = [
  "Every small step is a step forward. ✨",
  "Your effort today is your success tomorrow. 🚀",
  "Keep going, you're doing amazing! 🌟",
  "Progress, not perfection. 💖",
  "Believe in your journey. 🛤️",
  "Strength grows in the moments you think you can't go on but you keep going. 💪",
  "You're not behind, you're building your story. 📖",
  "One stroke at a time, you're creating your masterpiece. 🎨",
  "Success is built on persistence and patience. 🧡",
  "Healing and growth are journeys, not races. 🌱",
];

function MotivationalQuote() {
  const [quote, setQuote] = useState(quotes[0]);
  const [fade, setFade] = useState(true); // for smooth transition

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out

      setTimeout(() => {
        setQuote(prev => {
          let newQuote;
          do {
            newQuote = quotes[Math.floor(Math.random() * quotes.length)];
          } while (newQuote === prev); // make sure it's not the same quote
          return newQuote;
        });
        setFade(true); // fade-in new quote
      }, 500); // 500ms matches the fade-out time
    }, 6000); // every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`text-lg md:text-xl text-blue-700 font-semibold italic mt-4 text-center transition-all duration-500 ${
        fade ? "opacity-100" : "opacity-0"
      }`}
    >
      {quote}
    </p>
  );
}

export default MotivationalQuote;
