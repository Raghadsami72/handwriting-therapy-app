// src/components/StrokeReplay.jsx
import React, { useEffect, useRef } from "react";

function StrokeReplay({ strokeData, width = 300, height = 300, speed = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!strokeData || strokeData.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#2563EB"; // blue-600
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    let currentStroke = 0;
    let currentPoint = 0;

    function drawNext() {
      if (currentStroke >= strokeData.length) return;

      const stroke = strokeData[currentStroke];
      const points = stroke.points;
      if (currentPoint === 0 && points.length > 0) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
      }

      if (currentPoint < points.length - 1) {
        const p1 = points[currentPoint];
        const p2 = points[currentPoint + 1];
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        currentPoint++;
        setTimeout(drawNext, 8 / speed); // Control speed
      } else {
        currentStroke++;
        currentPoint = 0;
        setTimeout(drawNext, 200 / speed); // pause between strokes
      }
    }

    drawNext();
  }, [strokeData, speed]);

  return (
    <div className="border rounded shadow bg-white">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-gray-100 rounded"
      />
    </div>
  );
}

export default StrokeReplay;
