
import React from 'react';
import { MCQQuestion, CQQuestion, GradingResult, Subject } from '../types';
import { Trophy, ArrowLeft, CheckCircle2, XCircle, HelpCircle, GraduationCap } from 'lucide-react';

interface ResultsViewProps {
  questions: any[];
  answers: Record<string, any>;
  results: GradingResult[];
  onBack: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ questions, answers, results, onBack }) => {
  const totalMarks = results.reduce((acc, r) => acc + r.obtainedMarks, 0);
  const maxPossible = results.reduce((acc, r) => acc + r.maxMarks, 0);
  const percentage = Math.round((totalMarks / maxPossible) * 100) || 0;

  const getGrade = (p: number) => {
    if (p >= 80) return { grade: 'A+', color: 'text-emerald-500' };
    if (p >= 70) return { grade: 'A', color: 'text-emerald-400' };
    if (p >= 60) return { grade: 'A-', color: 'text-blue-400' };
    if (p >= 50) return { grade: 'B', color: 'text-amber-400' };
    if (p >= 40) return { grade: 'C', color: 'text-orange-400' };
    if (p >= 33) return { grade: 'D', color: 'text-orange-500' };
    return { grade: 'F', color: 'text-red-500' };
  };

  const { grade, color } = getGrade(percentage);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-all"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      {/* Score Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 mb-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10">
          <GraduationCap className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-slate-400 mb-1">Practice Result</h2>
          <div className="flex items-baseline justify-center gap-4 mb-4">
            <span className={`text-8xl font-black ${color}`}>{grade}</span>
            <span className="text-3xl font-bold text-slate-600">Grade</span>
          </div>
          <p className="text-xl text-slate-300">
            You scored <span className="text-white font-bold">{totalMarks}</span> out of <span className="text-white font-bold">{maxPossible}</span>
          </p>
          <div className="mt-8 flex justify-center gap-12">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-white">{percentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Time Spent</p>
              <p className="text-2xl font-bold text-white">14m</p>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-6">Detailed Feedback</h3>
      <div className="space-y-6">
        {questions.map((q, i) => {
          const res = results.find(r => r.questionId === q.id);
          const isCorrect = res?.status === 'Correct';
          
          return (
            <div key={q.id} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-slate-200 font-medium leading-relaxed">
                      {q.type === 'MCQ' ? q.question : 'Creative Question (CQ)'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{q.chapter}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                  res?.status === 'Correct' ? 'bg-emerald-500/10 text-emerald-400' : 
                  res?.status === 'Partial' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {res?.obtainedMarks} / {res?.maxMarks} Marks
                </div>
              </div>

              {q.type === 'CQ' && (
                <div className="mt-6 space-y-4">
                  {['a', 'b', 'c', 'd'].map((part) => (
                    <div key={part} className="pl-12 border-l border-slate-800 relative">
                      <div className="absolute top-0 left-0 -ml-1.5 w-3 h-3 rounded-full bg-slate-800"></div>
                      <p className="text-sm font-bold text-slate-400 mb-1 uppercase tracking-widest">Part {part.toUpperCase()}</p>
                      <p className="text-sm text-slate-300 italic mb-2">"{answers[q.id]?.[part] || 'No answer'}"</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-5 bg-slate-800/40 rounded-2xl border border-slate-800">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Assessor Feedback</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{res?.feedback}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsView;
