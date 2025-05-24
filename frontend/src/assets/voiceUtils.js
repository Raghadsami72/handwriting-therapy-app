// File: frontend/src/utils/voiceUtils.js

export function speak(text, lang = "en") {
  if (!window.speechSynthesis) {
    console.warn("SpeechSynthesis not supported");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  window.speechSynthesis.cancel(); // Stop previous voice
  window.speechSynthesis.speak(utterance);
}
