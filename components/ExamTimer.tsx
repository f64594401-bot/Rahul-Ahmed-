
import React, { useState, useEffect, useRef } from 'react';
import { Timer } from 'lucide-react';

interface ExamTimerProps {
  durationMinutes: number;
  onTimeUp: () => void;
}

const ExamTimer: React.FC<ExamTimerProps> = ({ durationMinutes, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const hasEndedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0 && !hasEndedRef.current) {
      hasEndedRef.current = true;
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isLow = timeLeft < 300; // Less than 5 mins

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
      isLow ? 'bg-red-950/30 border-red-800 text-red-400' : 'bg-surface border-white/10 text-text-primary'
    }`}>
      <Timer size={18} className={isLow ? 'animate-pulse' : ''} />
      <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
    </div>
  );
};

export default ExamTimer;
