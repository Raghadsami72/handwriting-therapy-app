// agents/feedbackAgent.js

const feedbackTemplates = {
    0: {
      compliment: "Beautiful circular shape! Your loops are smooth and controlled.",
      suggestion: "Focus a bit more on closing the circle fully to strengthen the form.",
      encouragement: "You're doing amazing — every circle you draw is a step closer to mastery!"
    },
    1: {
      compliment: "Strong and confident vertical line!",
      suggestion: "Make sure to keep the stroke steady from top to bottom.",
      encouragement: "You're building fantastic control with every stroke you make!"
    },
    2: {
      compliment: "Lovely curves shaping nicely!",
      suggestion: "Try connecting the curves a little more fluidly.",
      encouragement: "Progress is in motion — keep those beautiful curves coming!"
    },
    3: {
      compliment: "Elegant arcs, well done!",
      suggestion: "Balance the top and bottom of the three evenly.",
      encouragement: "Each arc you draw is strengthening your precision!"
    },
    4: {
      compliment: "Solid angles with great sharpness!",
      suggestion: "Focus on stabilizing the cross-section more firmly.",
      encouragement: "Your hand strength is improving stroke by stroke!"
    },
    5: {
      compliment: "Nice beginning with confident strokes!",
      suggestion: "Ensure the middle curve flows smoothly into the finish.",
      encouragement: "You are writing your way to stronger motor control!"
    },
    6: {
      compliment: "Good loop formation!",
      suggestion: "Focus on neatly closing the lower part for more clarity.",
      encouragement: "Every small detail you fix shows massive progress!"
    },
    7: {
      compliment: "Sharp and quick response!",
      suggestion: "Work on maintaining a consistent slant if possible.",
      encouragement: "Your precision is becoming sharper with every attempt!"
    },
    8: {
      compliment: "Lovely double loops!",
      suggestion: "Keep the top and bottom loops even for best results.",
      encouragement: "Double loops, double the strength — keep shining!"
    },
    9: {
      compliment: "Wonderful circular ending!",
      suggestion: "Try to complete the loop fully to avoid gaps.",
      encouragement: "You're finishing strong — amazing effort!"
    },
  };
  
  export async function generateFeedback(drawingDataURL, predictedDigit) {
    try {
      const template = feedbackTemplates[predictedDigit];
      if (!template) {
        return "Wonderful effort! Keep practicing your strokes — progress is happening every moment.";
      }
  
      const feedback = `${template.compliment} ${template.suggestion} ${template.encouragement}`;
      return feedback;
    } catch (error) {
      console.error('Feedback Agent error:', error);
      throw error;
    }
  }
  