
import React, { useState } from 'react';
import { Subject, Language } from '../types';
import { Award, ShieldAlert, Timer, CheckCircle, ChevronRight, Loader2, Sparkles, GraduationCap } from 'lucide-react';

interface ExamHubViewProps {
  onStartExam: (subject: Subject, language: Language) => void;
  isLoading: boolean;
}

const ExamHubView: React.FC<ExamHubViewProps> = ({ onStartExam, isLoading }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.PHYSICS);
  const [language, setLanguage] = useState<Language>('bn');

  const boardSubjects = [
    Subject.PHYSICS, Subject.CHEMISTRY, Subject.BIOLOGY, Subject.MATH, 
    Subject.HIGHER_MATH, Subject.BANGLA_1ST, Subject.ENGLISH_1ST, Subject.BGS
  ];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-4">
          <ShieldAlert size={14} />
          রিয়েল বোর্ড এক্সাম মোড
        </div>
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">বোর্ড স্ট্যান্ডার্ড মক টেস্ট</h2>
        <p className="text-slate-400">SSC ২০২৬ বোর্ড পরীক্ষার হুবহু প্রশ্নপত্র ও সময় অনুযায়ী নিজেকে যাচাই করুন।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Award className="text-indigo-400" size={20} />
              পরীক্ষার নিয়মাবলী
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <Timer className="text-slate-500 shrink-0" size={18} />
                <span className="text-sm text-slate-400">নির্ধারিত সময় শেষে অটো-সাবমিট হবে।</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle className="text-slate-500 shrink-0" size={18} />
                <span className="text-sm text-slate-400">MCQ এবং CQ উভয় অংশই থাকবে।</span>
              </li>
              <li className="flex gap-3">
                <Sparkles className="text-slate-500 shrink-0" size={18} />
                <span className="text-sm text-slate-400">AI দ্বারা বোর্ড মার্কিং পলিসি অনুযায়ী মূল্যায়ন হবে।</span>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase mb-3">ভার্সন নির্বাচন</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLanguage('bn')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${language === 'bn' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${language === 'en' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] p-6">
            <div className="flex items-center gap-3 text-indigo-400 mb-2">
              <GraduationCap size={20} />
              <h4 className="font-bold">প্রস্তুতি টিপস</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              বোর্ড পরীক্ষায় ভালো করার মূল মন্ত্র হলো সঠিক সময়ে সৃজনশীল প্রশ্নের উত্তর শেষ করা। আজই প্র্যাকটিস শুরু করুন।
            </p>
          </div>
        </div>

        {/* Right: Subject Selection */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-500 px-2 uppercase tracking-widest">বিষয় নির্বাচন করুন</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {boardSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`p-5 rounded-3xl border text-left transition-all ${
                  selectedSubject === sub 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-900/20' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold">{sub}</span>
                  {selectedSubject === sub && <CheckCircle size={18} />}
                </div>
                <p className={`text-[10px] mt-1 uppercase tracking-widest ${selectedSubject === sub ? 'text-indigo-200' : 'text-slate-600'}`}>
                  Full Board Standard • 100 Marks
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8">
            <button
              onClick={() => onStartExam(selectedSubject, language)}
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 text-white rounded-[2rem] font-bold text-lg shadow-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  প্রশ্ন তৈরি হচ্ছে...
                </>
              ) : (
                <>
                  পরীক্ষা শুরু করুন (Start Exam)
                  <ChevronRight size={20} />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em]">
              *প্রশ্নপত্র তৈরিতে ২০-৩০ সেকেন্ড সময় লাগতে পারে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamHubView;
