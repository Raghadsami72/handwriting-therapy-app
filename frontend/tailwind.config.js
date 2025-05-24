/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        keyframes: {
          floatUp: {
            '0%': { opacity: 1, transform: 'translateY(0)' },
            '100%': { opacity: 0, transform: 'translateY(-100px)' },
          },
          floatDown: {
            '0%': { opacity: 1, transform: 'translateY(0)' },
            '100%': { opacity: 0, transform: 'translateY(100px)' },
          },
          wiggle: {
            '0%, 100%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(100px)' },
          },
          float: {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          birdWalk: {
            '0%': { transform: 'translateX(0)' },
            '50%': { transform: 'translateX(150px)' },
            '100%': { transform: 'translateX(0)' },
          },
        },
        animation: {
          'float-up': 'floatUp 1.2s ease-out forwards',
          'float-down': 'floatDown 1.2s ease-out forwards',
          'wiggle': 'wiggle 12s linear infinite',
          'bounce-slow': 'bounce 3s infinite',
          'float-soft': 'float 6s ease-in-out infinite',
          'bird-walk': 'birdWalk 10s ease-in-out infinite',
        },
        colors: {
          pink: {
            100: "#FEE2E2",
            200: "#FECACA",
            300: "#FCA5A5",
            400: "#F87171",
            500: "#EF4444",
            600: "#DC2626",
            700: "#B91C1C",
            800: "#991B1B",
            900: "#7F1D1D",
          },
          green: {
            100: "#D1FAE5",
            200: "#A7F3D0",
            300: "#6EE7B7",
            400: "#34D399",
            500: "#10B981",
            600: "#059669",
            700: "#047857",
            800: "#065F46",
            900: "#064E3B",
          },
          blue: {
            100: "#DBEAFE",
            200: "#BFDBFE",
            300: "#93C5FD",
            400: "#60A5FA",
            500: "#3B82F6",
            600: "#2563EB",
            700: "#1D4ED8",
            800: "#1E40AF",
            900: "#1E3A8A",
          },
        },
      },
    },
    plugins: [],
  };
  