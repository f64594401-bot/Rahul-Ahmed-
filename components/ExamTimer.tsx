
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ durationMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLow = timeLeft < 300; // Less than 5 mins

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
      isLow ? 'bg-red-950/30 border-red-800 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      <Timer size={18} className={isLow ? 'animate-pulse' : ''} />
      <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default ExamTimer;
