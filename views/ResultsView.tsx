
import React, { useState } from 'react';
import { GradingResult, Question } from '../types.ts';
import { 
  ArrowLeft, 
  GraduationCap, 
  BookOpen,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  FilterX
} from 'lucide-react';

interface ResultsViewProps {
  questions: Question[];
  answers: Record<string, any>;
  results: GradingResult[];
  onBack: () => void;
}

type FilterStatus = 'Correct' | 'Incorrect' | 'Partial' | 'All';

const ResultsView: React.FC<ResultsViewProps> = ({ questions, answers, results, onBack }) => {
  const [filter, setFilter] = useState<FilterStatus>('All');

  const correctCount = results.filter(r => r.status === 'Correct').length;
  const wrongCount = results.filter(r => r.status === 'Incorrect').length;
  const partialCount = results.filter(r => r.status === 'Partial').length;
  
  const totalMarks = results.reduce((acc, r) => acc + r.maxMarks, 0);
  const obtainedMarks = results.reduce((acc, r) => acc + r.obtainedMarks, 0);
  const accuracy = Math.round((obtainedMarks / totalMarks) * 100) || 0;

  const filteredQuestions = questions.filter(q => {
    if (filter === 'All') return true;
    const res = results.find(r => r.questionId === q.id);
    return res?.status === filter;
  });

  const toggleFilter = (status: FilterStatus) => {
    setFilter(prev => prev === status ? 'All' : status);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 text-text-secondary hover:text-white mb-4 transition-all font-bold text-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            ড্যাশবোর্ডে ফিরে যান
          </button>
          <h2 className="text-3xl font-black text-white tracking-tight">পাঠ পর্যালোচনা (Review)</h2>
          <p className="text-text-secondary mt-1">আপনার উত্তরগুলো এবং শিক্ষকের ব্যাখ্যাগুলো দেখে নিন।</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl">
          <Trophy size={18} className="text-brand-primary" />
          <span className="text-sm font-bold text-brand-primary">সাফল্য হার: {accuracy}%</span>
        </div>
      </div>

      {/* Summary Section - Interactive Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <button 
          onClick={() => toggleFilter('Correct')}
          className={`relative bg-emerald-500/10 border rounded-[2rem] p-6 flex flex-col items-center text-center group transition-all ${
            filter === 'Correct' ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-500/20' : 'border-emerald-500/20 hover:bg-emerald-500/15'
          }`}
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-emerald-900/40 group-hover:scale-110 transition-transform">
            <CheckCircle2 size={24} />
          </div>
          <p className="text-3xl font-black text-emerald-400">{correctCount}</p>
          <p className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-widest mt-1">সঠিক উত্তর (Correct)</p>
          {filter === 'Correct' && <div className="absolute top-4 right-4"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div></div>}
        </button>

        <button 
          onClick={() => toggleFilter('Incorrect')}
          className={`relative bg-red-500/10 border rounded-[2rem] p-6 flex flex-col items-center text-center group transition-all ${
            filter === 'Incorrect' ? 'border-red-500 ring-4 ring-red-500/20 bg-red-500/20' : 'border-red-500/20 hover:bg-red-500/15'
          }`}
        >
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform">
            <XCircle size={24} />
          </div>
          <p className="text-3xl font-black text-red-400">{wrongCount}</p>
          <p className="text-[10px] font-bold text-red-500/70 uppercase tracking-widest mt-1">ভুল উত্তর (Wrong)</p>
          {filter === 'Incorrect' && <div className="absolute top-4 right-4"><div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div></div>}
        </button>

        <button 
          onClick={() => toggleFilter('Partial')}
          className={`relative bg-amber-500/10 border rounded-[2rem] p-6 flex flex-col items-center text-center group transition-all ${
            filter === 'Partial' ? 'border-amber-500 ring-4 ring-amber-500/20 bg-amber-500/20' : 'border-amber-500/20 hover:bg-amber-500/15'
          }`}
        >
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg shadow-amber-900/40 group-hover:scale-110 transition-transform">
            <AlertCircle size={24} />
          </div>
          <p className="text-3xl font-black text-amber-400">{partialCount}</p>
          <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mt-1">আংশিক নম্বর (Partial)</p>
          {filter === 'Partial' && <div className="absolute top-4 right-4"><div className="w-2 h-2 bg-amber-400 rounded-full animate-ping"></div></div>}
        </button>
      </div>

      {/* Filter Status Indicator */}
      {filter !== 'All' && (
        <div className="flex justify-center mb-8">
          <button 
            onClick={() => setFilter('All')}
            className="flex items-center gap-2 px-6 py-2 bg-surface border border-white/10 rounded-full text-xs font-bold text-text-secondary hover:text-white transition-all animate-in fade-in slide-in-from-top-2"
          >
            <FilterX size={14} />
            ফিল্টার রিসেট করুন (সবগুলো দেখুন)
          </button>
        </div>
      )}

      {/* Detailed Question Review */}
      <div className="space-y-8 min-h-[400px]">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
          <BookOpen size={16} /> 
          {filter === 'All' ? 'বিস্তারিত পর্যালোচনা' : `ফিল্টার করা ফলাফল: ${filter}`} 
          <span className="ml-auto text-[10px] opacity-50">Showing {filteredQuestions.length} of {questions.length}</span>
        </h3>
        
        {filteredQuestions.length > 0 ? filteredQuestions.map((q, i) => {
          const res = results.find(r => r.questionId === q.id);
          const isCorrect = res?.status === 'Correct';
          const isPartial = res?.status === 'Partial';
          const isIncorrect = res?.status === 'Incorrect';
          
          // Re-calculate the actual index for display (1-based from original list)
          const displayIndex = questions.findIndex(orig => orig.id === q.id) + 1;

          return (
            <div key={q.id} className={`group bg-surface border rounded-[2rem] p-8 transition-all relative overflow-hidden animate-in fade-in zoom-in duration-300 ${
              isCorrect ? 'border-emerald-500/20' : isIncorrect ? 'border-red-500/20' : 'border-amber-500/20'
            }`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                <div className="flex items-start gap-5">
                  <div className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border shadow-inner ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                    isIncorrect ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                    'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {displayIndex}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-primary leading-snug group-hover:text-white transition-colors">
                      {q.type === 'MCQ' ? q.question : q.type === 'ENGLISH' ? 'ইংরেজি বোর্ড প্যাটার্ন প্রশ্ন' : 'সৃজনশীল প্রশ্ন (Creative Question)'}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-md">
                        {q.chapter}
                      </span>
                      {res && (
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                          isCorrect ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          isIncorrect ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          প্রাপ্ত নম্বর: {res.obtainedMarks} / {res.maxMarks}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Student's Answer Section */}
              <div className="mb-6 ml-11">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 ml-1">আপনার উত্তর (Your Response)</p>
                {q.type === 'MCQ' ? (
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                    <p className={`text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {q.options.find((o: any) => o.id === answers[q.id])?.text || 'উত্তর দেওয়া হয়নি'}
                    </p>
                    {!isCorrect && q.type === 'MCQ' && (
                       <p className="text-xs text-text-secondary mt-2 font-bold">
                         সঠিক উত্তর: <span className="text-emerald-400">{q.options.find((o: any) => o.id === q.correctOptionId)?.text}</span>
                       </p>
                    )}
                  </div>
                ) : q.type === 'ENGLISH' ? (
                  <div className="space-y-3">
                    {(q as any).items.map((item: any) => {
                      const itemAns = answers[q.id]?.[item.id];
                      return (
                        <div key={item.id} className="bg-black/20 rounded-2xl p-4 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                              {item.instruction}:
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary italic">
                            {itemAns?.text ? `"${itemAns.text}"` : '[উত্তর দেওয়া হয়নি]'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {['a', 'b', 'c', 'd'].map((part) => {
                      const partAns = answers[q.id]?.[part];
                      const qPart = (q as any).parts[part];
                      if (!qPart) return null;
                      return (
                        <div key={part} className="bg-black/20 rounded-2xl p-4 border border-white/5">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                              অংশ ({part.toUpperCase()}):
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary italic">
                            {partAns?.text ? `"${partAns.text}"` : '[উত্তর দেওয়া হয়নি / চিত্র সংযুক্তি]'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Assessor Feedback / Explanation Section */}
              <div className="relative mt-8 p-6 bg-white/5 rounded-3xl border border-white/10 group-hover:border-white/20 transition-all ml-11">
                <div className="absolute top-4 right-6 text-white/5">
                  <MessageSquare size={40} />
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 text-text-secondary rounded-xl shadow-inner shrink-0">
                    <GraduationCap size={18} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mb-2">ব্যাখ্যা ও মূল্যায়ন</p>
                    <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                      {res?.feedback || 'ব্যাখ্যা উপলব্ধ নেই।'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
            <p className="text-text-secondary font-bold">এই ক্যাটাগরিতে কোনো প্রশ্ন পাওয়া যায়নি।</p>
            <button onClick={() => setFilter('All')} className="mt-4 text-brand-primary hover:text-brand-secondary text-sm font-bold">সকল প্রশ্ন দেখুন</button>
          </div>
        )}
      </div>

      <div className="mt-16 text-center">
        <button
          onClick={onBack}
          className="btn-primary px-12 py-5 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-brand-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto"
        >
          শিখন চালিয়ে যান (Continue Learning)
          <ChevronRight size={20} />
        </button>
        <p className="text-text-secondary text-[10px] mt-6 uppercase tracking-[0.3em] font-bold">MRAB SSC ২০২৬ প্রিপারেশন Hub</p>
      </div>
    </div>
  );
};

export default ResultsView;
