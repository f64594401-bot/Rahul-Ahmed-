
import React, { useState, useRef, useEffect } from 'react';
import { ExamSession, Question, GradingResult } from '../types';
import QuestionRenderer from '../components/QuestionRenderer';
import ExamTimer from '../components/ExamTimer';
import { Send, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface ActiveExamProps {
  session: ExamSession;
  onFinish: (answers: Record<string, any>) => void;
  isGrading?: boolean;
}

const ActiveExam: React.FC<ActiveExamProps> = ({ session, onFinish, isGrading }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [session.questions[currentIdx].id]: val }));
  };

  const isLast = currentIdx === session.questions.length - 1;

  const handleFinishRequest = () => {
    onFinish(answers);
  };

  // Scroll active question button into view when currentIdx changes
  useEffect(() => {
    const activeBtn = scrollContainerRef.current?.children[currentIdx] as HTMLElement;
    if (activeBtn && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollLeft = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [currentIdx]);

  return (
    <div className="max-w-4xl mx-auto pb-10 relative min-h-full flex flex-col">
      {/* Fixed Sticky Header */}
      <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md border-b border-white/10 py-4 px-4 mb-8 flex justify-between items-center shadow-lg rounded-b-3xl">
        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-black text-white flex items-center gap-3 truncate">
            <span className="hidden sm:inline">{session.subject}</span>
            <span className="shrink-0 text-[10px] md:text-xs font-bold text-brand-primary px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
              প্রশ্ন {currentIdx + 1} / {session.questions.length}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {session.mode === 'Exam' && (
            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <ExamTimer 
                durationMinutes={session.durationMinutes} 
                onTimeUp={() => onFinish(answers)} 
              />
            </div>
          )}
          <button
            onClick={handleFinishRequest}
            disabled={isGrading}
            className="btn-primary flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 text-white rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider transition-all disabled:opacity-50"
          >
            <span className="hidden xs:inline">{isGrading ? 'মূল্যায়ন...' : 'জমা দিন'}</span>
            <Send size={14} className="md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-1">
        <QuestionRenderer
          question={session.questions[currentIdx]}
          index={currentIdx}
          answer={answers[session.questions[currentIdx].id]}
          onAnswerChange={handleAnswer}
        />
      </div>

      {/* Navigation Controls - Sticky at bottom of content area */}
      <div className="sticky bottom-0 z-30 mt-12 pb-4 pt-2">
        <div className="bg-surface/95 backdrop-blur-xl p-3 md:p-4 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-3 md:gap-6 ring-1 ring-white/5">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="shrink-0 flex items-center justify-center w-12 h-12 bg-white/5 text-text-secondary hover:text-white rounded-2xl disabled:opacity-20 transition-all border border-white/5 hover:bg-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex-1 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {session.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`shrink-0 w-10 h-10 rounded-xl font-black transition-all text-xs border ${
                  currentIdx === i 
                  ? 'bg-brand-primary text-white border-brand-secondary scale-110 shadow-lg shadow-brand-primary/30' 
                  : answers[session.questions[i].id] 
                    ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                    : 'bg-white/5 text-text-secondary border-white/5 hover:border-white/20'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => !isLast ? setCurrentIdx(prev => prev + 1) : handleFinishRequest()}
            className={`shrink-0 flex items-center gap-2 px-5 md:px-8 py-3 rounded-2xl font-black transition-all whitespace-nowrap text-xs md:text-sm uppercase tracking-widest ${
              isLast 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' 
              : 'bg-brand-primary text-white hover:bg-brand-secondary shadow-lg shadow-brand-primary/30'
            }`}
          >
            <span>{isLast ? 'জমা দিন' : 'পরবর্তী'}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ActiveExam;
