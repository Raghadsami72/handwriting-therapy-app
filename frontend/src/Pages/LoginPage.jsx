// frontend/src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    if (name.trim()) {
      localStorage.setItem("patientName", name);
      navigate("/intro"); // Will create this page next
    } else {
      alert("Please enter your name to start.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Welcome to Handwriting Therapy</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        className="p-3 rounded-xl shadow-md w-72 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
      />

      <button
        onClick={handleStart}
        className="mt-6 bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-6 rounded-xl transition duration-200"
      >
        Start Session
      </button>
    </div>
  );
}

export default LoginPage;
// This code defines a simple login page for a handwriting therapy app.
// It includes an input field for the user's name and a button to start the session.
// When the button is clicked, the name is saved in local storage and the user is navigated to the introduction page. 
// The page has a gradient background and uses Tailwind CSS for styling.
// The input field has a focus effect, and the button has hover effects for better user experience.
// The page is responsive and centered, making it visually appealing and user-friendly.