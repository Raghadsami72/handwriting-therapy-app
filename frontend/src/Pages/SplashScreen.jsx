// src/pages/SplashScreen.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Logo_App.png"; // Replace with your actual logo

function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <motion.img
        src={logo}
        alt="Therapy Logo"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="w-40 h-40 mb-8"
      />

      <div className="w-12 h-12 border-4 border-dotted rounded-full border-pink-400 animate-spin"></div>

      <p className="mt-6 text-lg text-gray-700 font-medium">
        Starting session...
      </p>
    </div>
  );
}

export default SplashScreen;
// This component serves as a splash screen for the therapy app. It displays a logo and a loading spinner while navigating to the login page after 3 seconds.
// The logo is animated using Framer Motion for a smooth entrance effect. The background features a gradient for a visually appealing design.