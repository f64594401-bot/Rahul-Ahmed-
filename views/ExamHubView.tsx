
import React, { useState } from 'react';
import { Subject, Language } from '../types';
import { Award, ShieldAlert, Timer, CheckCircle, ChevronRight, Loader2, Sparkles, GraduationCap, History, Zap } from 'lucide-react';

interface ExamHubViewProps {
  onStartExam: (subject: Subject, language: Language) => void;
  onGoToHistory: () => void;
  isLoading: boolean;
}

const ExamHubView: React.FC<ExamHubViewProps> = ({ onStartExam, onGoToHistory, isLoading }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.BANGLA_1ST);
  const [language, setLanguage] = useState<Language>('bn');

  const boardSubjects = [
    Subject.MATH, Subject.BANGLA_1ST, Subject.ENGLISH_1ST, 
    Subject.HISTORY, Subject.GEOGRAPHY, Subject.CIVICS, 
    Subject.GENERAL_SCIENCE, Subject.RELIGION
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-surface border border-white/10 p-10 rounded-[3rem] shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <div className="h-full bg-brand-primary animate-[loading_2s_ease-in-out_infinite]"></div>
            </div>
            <style>{`
              @keyframes loading {
                0% { width: 0%; left: 0%; }
                50% { width: 100%; left: 0%; }
                100% { width: 0%; left: 100%; }
              }
            `}</style>
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 border-2 border-brand-primary/10 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldAlert className="text-brand-primary animate-pulse" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">বোর্ড প্রশ্নপত্র তৈরি হচ্ছে</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              AI আপনার জন্য {selectedSubject} বিষয়ের পূর্ণাঙ্গ বোর্ড স্ট্যান্ডার্ড প্রশ্নপত্র প্রস্তুত করছে।
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">
              <Zap size={14} className="animate-pulse" />
              <span>Advanced Generation Mode</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-widest border border-brand-primary/20 mb-4">
          <ShieldAlert size={14} />
          রিয়েল বোর্ড এক্সাম মোড (SSC 2026)
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">বোর্ড স্ট্যান্ডার্ড মক টেস্ট</h2>
        <p className="text-text-secondary">SSC ২০২৬ বোর্ড পরীক্ষার হুবহু প্রশ্নপত্র ও সময় অনুযায়ী নিজেকে যাচাই করুন।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-white/5 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="text-text-secondary" size={20} />
              পরীক্ষার নিয়মাবলী
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Timer className="text-text-secondary shrink-0" size={18} />
                <span className="text-sm text-text-secondary">নির্ধারিত সময় শেষে অটো-সাবমিট হবে।</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-text-secondary shrink-0" size={18} />
                <span className="text-sm text-text-secondary">MCQ এবং CQ উভয় অংশই থাকবে।</span>
              </li>
              <li className="flex gap-3 text-brand-primary">
                <Zap className="shrink-0" size={18} />
                <span className="text-sm font-bold">Fast-Load Enabled: প্যারালাল কোয়েশ্চেন জেনারেশন।</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs font-bold text-text-secondary uppercase mb-3">ভার্সন নির্বাচন</p>
              <div className="grid grid-cols-2 gap-2">
                {['bn', 'en'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as Language)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${language === l ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/5 text-text-secondary hover:text-white'}`}>
                    {l === 'bn' ? 'বাংলা' : 'English'}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={onGoToHistory} className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-text-secondary rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-white/5">
              <History size={18} className="text-brand-primary" /> গত পরীক্ষার ইতিহাস
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-text-secondary px-2 uppercase tracking-widest">বিষয় নির্বাচন করুন</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {boardSubjects.map((sub) => (
              <button key={sub} onClick={() => setSelectedSubject(sub)} className={`p-5 rounded-3xl border text-left transition-all shadow-sm ${selectedSubject === sub ? 'bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/10' : 'bg-surface border-white/5 text-text-secondary hover:border-brand-primary/50'}`}>
                <div className="flex justify-between items-center"><span className="font-bold">{sub}</span>{selectedSubject === sub && <CheckCircle size={18} />}</div>
                <p className={`text-[10px] mt-1 uppercase tracking-widest ${selectedSubject === sub ? 'text-white/80' : 'text-text-secondary/60'}`}>Full Board Standard • 100 Marks</p>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button onClick={() => onStartExam(selectedSubject, language)} disabled={isLoading} className="btn-primary w-full py-5 text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-brand-primary/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  <span className="animate-pulse">এডভান্সড জেনারেশন মোড...</span>
                </>
              ) : (
                <>পরীক্ষা শুরু করুন (Fast Start)<ChevronRight size={20} /></>
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-text-secondary">
              <Zap size={14} />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Optimized for Gemini Flash 2.5</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHubView;
