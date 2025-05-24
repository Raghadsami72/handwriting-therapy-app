// File: frontend/src/agents/llmAgent.js

import { speak } from '../assets/voiceUtils.js';
import { openai } from '../assets/openaiClient.js';

/**
 * Friendly real-time feedback generator
 */
export async function generateLiveFeedback({ digit, prediction, correct, metrics, speakOut = false }) {
  const prompt = `
You are a friendly handwriting therapist giving feedback after a digit attempt.

Info:
- Target digit: ${digit}
- Predicted: ${prediction}
- Was correct? ${correct ? 'Yes' : 'No'}
- Metrics: ${JSON.stringify(metrics, null, 2)}

Respond in 2–3 warm, short sentences.
Be human, calm, and encouraging.
If prediction is wrong or a metric is low (e.g. high tremor, low smoothness), gently give tips.
Use simple language. No jargon.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = response.choices[0].message.content.trim();
    if (speakOut) speak(message);
    return message;
  } catch (err) {
    console.error("LLM Feedback Error:", err);
    return "That was a good try! Let's keep going and improve together.";
  }
}

/**
 * Friendly session summary + suggestion explanation
 */
export async function generateSessionSummary({ name, summary, speakOut = false }) {
  const prompt = `
You are a handwriting therapist giving a session summary to a patient named ${name}.

Session Metrics:
${JSON.stringify(summary, null, 2)}

Explain the session results in a kind, supportive way.
1. First, praise their effort and any improvements.
2. Then explain what each metric means (e.g., speed, smoothness, tremor).
3. Give practical tips if any score is low.
Make it feel like a real therapist speaking softly. Avoid technical words.
Use 2–3 short paragraphs. Friendly and human.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const message = response.choices[0].message.content.trim();
    if (speakOut) speak(message);
    return message;
  } catch (err) {
    console.error("LLM Summary Error:", err);
    return "You did amazing this session. I'm proud of your effort!";
  }
}
