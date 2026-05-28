import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div id="clock-container" className="flex items-center gap-2 px-3 py-1.5 bg-[#09111e]/80 border border-[#1e2f47]/50 rounded-lg shadow-sm backdrop-blur-md">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400">Time:</span>
      <span id="current-time-display" className="font-mono text-xs font-medium text-zinc-300 tracking-wider">
        {formattedTime}
      </span>
    </div>
  );
}
