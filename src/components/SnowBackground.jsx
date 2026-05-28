import React, { useEffect, useRef } from "react";

export default function SnowBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Number of snowflakes based on screen size
    const count = Math.min(100, Math.floor((width * height) / 14000));
    const flakes = [];

    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 0.8,
        d: Math.random() * 0.4 + 0.15,
        drift: Math.random() * 0.5 - 0.25,
        amplitude: Math.random() * 1.5 + 0.5,
      });
    }

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.beginPath();

      for (let i = 0; i < count; i++) {
        const f = flakes[i];
        
        // Horizontal oscillation based on sine wave over time
        const wave = Math.sin(time * 0.001 * f.d + i) * f.amplitude;
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x + wave, f.y, f.r, 0, Math.PI * 2, true);

        // Update positions
        f.y += f.d * 1.2; // vertical speed
        f.x += f.drift * 0.3; // minor general drift

        // If snowflake reaches bottom, wrap back to top
        if (f.y > height) {
          flakes[i] = {
            ...f,
            x: Math.random() * width,
            y: -10,
          };
        }
        // Wrapper for sides
        if (f.x > width) {
          f.x = 0;
        } else if (f.x < 0) {
          f.x = width;
        }
      }
      ctx.fill();
      animationFrameId = requestAnimationFrame((t) => draw(t));
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animationFrameId = requestAnimationFrame((t) => draw(t));

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-35"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
