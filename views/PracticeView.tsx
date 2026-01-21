
import React, { useState } from 'react';
import { SSC_SYLLABUS_2026 } from '../constants';
import { Subject, QuestionType, Language } from '../types';
import { BookOpen, ChevronRight, Loader2, Sparkles, Hash, Library, Globe, BookMarked } from 'lucide-react';

interface PracticeViewProps {
  onStart: (subject: Subject, chapter: string, type: QuestionType, count: number, language: Language) => void;
  isLoading: boolean;
}

const PracticeView: React.FC<PracticeViewProps> = ({ onStart, isLoading }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.PHYSICS);
  const [selectedType, setSelectedType] = useState<QuestionType>('MCQ');
  const [qCount, setQCount] = useState<number>(10);
  const [language, setLanguage] = useState<Language>('bn');

  const subjects = Object.values(Subject);
  const filteredSyllabus = SSC_SYLLABUS_2026.filter(s => s.subject === selectedSubject)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const countOptions = [5, 10, 25, 50, 100];

  const scienceSubjects = [Subject.PHYSICS, Subject.CHEMISTRY, Subject.BIOLOGY, Subject.HIGHER_MATH];
  const artsSubjects = [Subject.HISTORY, Subject.GEOGRAPHY, Subject.CIVICS];
  const generalSubjects = subjects.filter(s => !scienceSubjects.includes(s) && !artsSubjects.includes(s));

  const renderSubjectBtn = (sub: Subject) => (
    <button
      key={sub}
      onClick={() => setSelectedSubject(sub)}
      className={`px-3 py-3 rounded-xl font-medium text-[11px] leading-tight transition-all border ${
        selectedSubject === sub 
        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/40' 
        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
      }`}
    >
      {sub}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20 mb-4">
          <BookMarked size={14} />
          ২০২৬ পূর্ণাঙ্গ সিলেবাস (Full Syllabus)
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">SSC ২০২৬ প্র্যাকটিস হাব</h2>
        <p className="text-slate-400 text-sm">এনসিটিবি বোর্ড বইয়ের সবগুলো অধ্যায় এখানে অন্তর্ভুক্ত করা হয়েছে।</p>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex gap-2 shadow-inner">
          <button
            onClick={() => setLanguage('bn')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${language === 'bn' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
          >
            বাংলা ভার্সন
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${language === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
          >
            English Version
          </button>
        </div>
      </div>

      {/* Subject Groups */}
      <div className="space-y-6 mb-12">
        <div>
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-3 px-1 border-l-2 border-indigo-500 ml-1">বিজ্ঞান বিভাগ (Science)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {scienceSubjects.map(renderSubjectBtn)}
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-3 px-1 border-l-2 border-amber-500 ml-1">মানবিক বিভাগ (Humanities)</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {artsSubjects.map(renderSubjectBtn)}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.2em] mb-3 px-1 border-l-2 border-emerald-500 ml-1">আবশ্যিক ও সাধারণ বিষয়</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {generalSubjects.map(renderSubjectBtn)}
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => setSelectedType('MCQ')}
          className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
            selectedType === 'MCQ' 
            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300' 
            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
          }`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full transition-opacity ${selectedType === 'MCQ' ? 'bg-indigo-500/20 opacity-100' : 'bg-indigo-500/5 opacity-0'}`}></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl transition-colors ${selectedType === 'MCQ' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              <Hash size={24} />
            </div>
          </div>
          <h4 className="text-xl font-bold mb-1 relative z-10">বহুনির্বাচনী প্রশ্ন (MCQ)</h4>
          <p className="text-sm opacity-80 leading-relaxed relative z-10">বোর্ড বইয়ের প্রতিটি অধ্যায় থেকে এমসিকিউ প্র্যাকটিস।</p>
        </button>

        <button 
          onClick={() => setSelectedType('CQ')}
          className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group ${
            selectedType === 'CQ' 
            ? 'bg-purple-600/10 border-purple-500 text-purple-300' 
            : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
          }`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full transition-opacity ${selectedType === 'CQ' ? 'bg-purple-500/20 opacity-100' : 'bg-purple-500/5 opacity-0'}`}></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl transition-colors ${selectedType === 'CQ' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              <Library size={24} />
            </div>
          </div>
          <h4 className="text-xl font-bold mb-1 relative z-10">সৃজনশীল প্রশ্ন (CQ)</h4>
          <p className="text-sm opacity-80 leading-relaxed relative z-10">AI এর মাধ্যমে সৃজনশীল উত্তর মূল্যায়ন ও নম্বর প্রদান।</p>
        </button>
      </div>

      {/* Question Count Selection */}
      {selectedType === 'MCQ' && (
        <div className="mb-10 p-8 bg-slate-900/50 border border-slate-800 rounded-[2rem] shadow-inner">
          <div className="flex items-center gap-2 text-slate-300 font-bold mb-6">
            <Sparkles size={18} className="text-amber-400" />
            <span>প্রশ্নের সংখ্যা নির্বাচন করুন</span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {countOptions.map(num => (
              <button
                key={num}
                onClick={() => setQCount(num)}
                className={`py-3 rounded-2xl font-bold transition-all border ${
                  qCount === num 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                  : 'bg-slate-800 border-slate-700 text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chapters List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2 mb-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em]">অধ্যায়সমূহ (পুরো বই)</h3>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 font-black">
            {filteredSyllabus.length} টি অধ্যায়
          </span>
        </div>
        
        {filteredSyllabus.length > 0 ? filteredSyllabus.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onStart(selectedSubject, chapter.chapterTitle, selectedType, qCount, language)}
            disabled={isLoading}
            className="w-full bg-slate-900/30 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all font-bold shadow-inner">
                {chapter.chapterNumber}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{chapter.chapterTitle}</h4>
                <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-wider font-medium">{selectedSubject} • {selectedType}</p>
              </div>
            </div>
            {isLoading ? (
              <Loader2 className="animate-spin text-indigo-500" />
            ) : (
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">শুরু করুন</span>
                <ChevronRight className="text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
            )}
          </button>
        )) : (
          <div className="text-center py-20 bg-slate-900/10 border border-dashed border-slate-800 rounded-[2.5rem]">
            <Library size={48} className="mx-auto text-slate-800 mb-4" />
            <p className="text-slate-500 font-medium">অধ্যায়গুলো লোড হচ্ছে...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeView;
