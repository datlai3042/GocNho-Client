import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

export default function CountdownTimer({ initialSeconds = 0 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let interval = null;

      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const { hours, minutes, seconds: displaySeconds } = formatTime(seconds);

 
  return (
    <div className="w-max">
      <div className="text-center transition-all duration-300">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-3xl font-mono font-bold text-inherit">
            {hours}
          </span>
          <span className="text-2xl text-inherit">:</span>
          <span className="text-3xl font-mono font-bold text-inherit">
            {minutes}
          </span>
          <span className="text-2xl text-inherit">:</span>
          <span className="text-3xl font-mono font-bold text-inherit">
            {displaySeconds}
          </span>
        </div>
      </div>
    </div>
  );
}
