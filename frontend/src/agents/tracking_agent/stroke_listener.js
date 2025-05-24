// agents/tracking_agent/stroke_listener.js

let strokeCallback = null;
let canvasElement = null;

export function startListening(canvas, callback) {
    strokeCallback = callback;
    canvasElement = canvas;

    canvasElement.addEventListener('pointermove', captureStroke);
}

export function stopListening() {
    if (canvasElement) {
        canvasElement.removeEventListener('pointermove', captureStroke);
    }
    strokeCallback = null;
    canvasElement = null;
}

let lastCaptureTime = 0;

function captureStroke(event) {
    if (!strokeCallback) return;

    // Only capture stylus or finger input
    if (event.pointerType !== "pen" && event.pointerType !== "touch") return;

    const now = Date.now();

    // Throttle: capture only every 20ms
    if (now - lastCaptureTime < 20) return;
    lastCaptureTime = now;

    strokeCallback({
        x: event.offsetX,
        y: event.offsetY,
        timestamp: now,
        pressure: event.pressure ?? 0.5, // Default if no pressure
    });
}
