
# Handwriting Therapy AI System

An intelligent, real-time handwriting therapy application built using deep learning, stroke tracking, and multi-agent coordination. Designed to support individuals with motor impairments (such as Parkinson’s disease or stroke recovery), this system offers personalized feedback, motivation, and progress tracking through AI.

---

## Features

- Real-time digit recognition using a CNN model (Arabic & English)
- Canvas-based handwriting input with stroke tracking
- Therapist-style feedback (text and speech)
- Live analytics: accuracy, smoothness, speed, tremor, and progress
- Challenge levels with motivational messages and guidance
- PDF and JSON reports to track session history
- Deployed as a web-based app using React and TensorFlow.js

---

## Technologies Used

- React.js / Vite  
- TensorFlow.js  
- HTML5 Canvas  
- Python + Keras (for model training)  
- LocalStorage / JSON session logging  
- gTTS for speech feedback  
- Modular Multi-Agent Architecture (CanvasAgent, SessionAgent, MetricsAgent, FeedbackAgent)

---

## Getting Started

### Installation

```bash
git clone https://github.com/Raghadsami72/handwriting-therapy-app.git
cd handwriting-therapy-app/frontend
npm install
npm run dev
```

Make sure TensorFlow.js is supported in your browser (Chrome is recommended).

---

## Project Structure (Frontend)

```
frontend/
├── components/
│   ├── CanvasDrawing.js
│   ├── FloatingDigit.js
├── agents/
│   ├── mcpManager.js
│   ├── feedbackAgent.js
│   ├── tracking_agent/
├── pages/
│   ├── TherapyPage.jsx
│   ├── ResultsPage.jsx
├── App.jsx
```

---

## Dedication

This project is dedicated to my dad, who is in a better place now but would have loved to help others around him — and for me to do so.  
To everyone who uses this: you are so strong. Never give up, and always have faith.

— *Developer: Raghad Sami Saleh Badarneh*

---

## Contact

If you'd like to collaborate or learn more:

Email: `raghadbadarneh850@gmail.com`  
GitHub: [github.com/Raghadsami72](https://github.com/Raghadsami72)
