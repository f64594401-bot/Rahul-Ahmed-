
import React, { useState } from 'react';
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
  const [isFinishing, setIsFinishing] = useState(false);

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [session.questions[currentIdx].id]: val }));
  };

  const isLast = currentIdx === session.questions.length - 1;

  const handleFinishRequest = () => {
    setIsFinishing(true);
    onFinish(answers);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Fixed Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4 px-2 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            {session.subject} প্র্যাকটিস
            <span className="text-sm font-normal text-slate-500 px-3 py-1 bg-slate-900 rounded-full">
              প্রশ্ন {currentIdx + 1} / {session.questions.length}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-4">
          {session.mode === 'Exam' && (
            <ExamTimer 
              durationMinutes={session.durationMinutes} 
              onTimeUp={() => onFinish(answers)} 
            />
          )}
          <button
            onClick={handleFinishRequest}
            disabled={isGrading || isFinishing}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold transition-all disabled:opacity-50"
          >
            {isGrading ? 'মূল্যায়ন চলছে...' : 'পরীক্ষা জমা দিন'}
            <Send size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <QuestionRenderer
          question={session.questions[currentIdx]}
          index={currentIdx}
          answer={answers[session.questions[currentIdx].id]}
          onAnswerChange={handleAnswer}
        />

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-12 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="flex items-center gap-2 px-6 py-3 text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            <ChevronLeft /> পূর্ববর্তী
          </button>
          
          <div className="hidden md:flex gap-1">
            {session.questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${
                  currentIdx === i 
                  ? 'bg-indigo-600 text-white' 
                  : answers[session.questions[i].id] 
                    ? 'bg-slate-800 text-slate-300' 
                    : 'text-slate-600 hover:bg-slate-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => !isLast ? setCurrentIdx(prev => prev + 1) : handleFinishRequest()}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
              isLast 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {isLast ? 'সম্পন্ন' : 'পরবর্তী প্রশ্ন'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveExam;
