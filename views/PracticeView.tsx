
import React, { useState } from 'react';
import { SSC_SYLLABUS_2026 } from '../constants';
import { Subject, QuestionType, Language } from '../types';
import { BookOpen, ChevronRight, Loader2, Sparkles, Hash, Library, BookMarked, Star, Layers, GraduationCap, Globe, History } from 'lucide-react';

interface PracticeViewProps {
  onStart: (subject: Subject, chapter: string, type: QuestionType, count: number, language: Language) => void;
  onGoToHistory: () => void;
  isLoading: boolean;
}

const PracticeView: React.FC<PracticeViewProps> = ({ onStart, onGoToHistory, isLoading }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.BANGLA_1ST);
  const [selectedType, setSelectedType] = useState<QuestionType>('MCQ');
  const [qCount, setQCount] = useState<number>(10);
  const [language, setLanguage] = useState<Language>('bn');

  const filteredSyllabus = SSC_SYLLABUS_2026.filter(s => s.subject === selectedSubject)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);

  const countOptions = selectedType === 'MCQ' ? [10, 20, 30, 50, 100] : [1, 2, 3, 5, 7];

  // Reset qCount when type changes to a valid default for that type
  const handleTypeChange = (type: QuestionType) => {
    setSelectedType(type);
    setQCount(type === 'MCQ' ? 10 : 1);
  };

  const generalSubjects = [
    Subject.BANGLA_1ST, 
    Subject.BANGLA_2ND, 
    Subject.ENGLISH_1ST, 
    Subject.ENGLISH_2ND, 
    Subject.MATH, 
    Subject.ICT, 
    Subject.RELIGION
  ];
  
  const humanitiesSubjects = [
    Subject.HISTORY, 
    Subject.GEOGRAPHY, 
    Subject.CIVICS, 
    Subject.AGRICULTURE,
    Subject.GENERAL_SCIENCE
  ];

  const isEnglish = selectedSubject === Subject.ENGLISH_1ST || selectedSubject === Subject.ENGLISH_2ND;

  // Reset qCount and language when subject changes to English
  React.useEffect(() => {
    if (isEnglish) {
      setQCount(1);
      setLanguage('en');
    }
  }, [selectedSubject, isEnglish]);

  const handleFullSyllabusStart = () => {
    if (filteredSyllabus.length === 0) {
      alert("এই বিষয়ের কোনো অধ্যায় এখনো যোগ করা হয়নি।");
      return;
    }
    const chapterList = filteredSyllabus.map(c => c.chapterTitle).join(", ");
    onStart(selectedSubject, `Full Syllabus (Only these chapters: ${chapterList})`, isEnglish ? 'ENGLISH' : selectedType, qCount, language);
  };

  const renderSubjectBtn = (sub: Subject) => (
    <button
      key={sub}
      onClick={() => setSelectedSubject(sub)}
      className={`px-3 py-2.5 rounded-xl font-medium text-[10px] leading-tight transition-all border ${
        selectedSubject === sub 
        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
        : 'bg-surface text-text-secondary border-white/5 hover:border-brand-primary/50 shadow-sm'
      }`}
    >
      {sub}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
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
              <div className="absolute inset-0 border-2 border-white/5 rounded-full"></div>
              <div className="absolute inset-0 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="text-brand-primary animate-pulse" size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">প্রশ্নপত্র তৈরি হচ্ছে</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              AI আপনার জন্য বোর্ড স্ট্যান্ডার্ড {isEnglish ? 'ইংরেজি' : (selectedType === 'MCQ' ? 'এমসিকিউ' : 'সৃজনশীল')} প্রশ্ন প্রস্তুত করছে।
            </p>
            <div className="mt-8 flex items-center justify-center gap-3 text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">
              <Loader2 size={14} className="animate-spin" />
              <span>Gemini AI Processing</span>
            </div>
          </div>
        </div>
      )}

      <div className="mb-10 text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-4">
          <BookMarked size={14} />
          SSC ২০২৬ প্র্যাকটিস হাব
        </div>
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">আপনার প্রস্তুতি শুরু করুন</h2>
        <p className="text-text-secondary text-sm">বিষয় এবং অধ্যায় নির্বাচন করে প্র্যাকটিস শুরু করুন।</p>
        
        <button 
          onClick={onGoToHistory} 
          className="absolute top-0 right-0 p-3 bg-white/5 hover:bg-white/10 text-text-secondary rounded-2xl font-bold flex items-center gap-2 transition-all border border-white/5 text-xs"
        >
          <History size={16} className="text-brand-primary" /> 
          <span className="hidden sm:inline">ইতিহাস</span>
        </button>
      </div>

      {/* Language Toggle */}
      {!isEnglish && (
        <div className="flex justify-center mb-8">
          <div className="bg-surface p-1.5 rounded-2xl border border-white/5 flex gap-2 shadow-sm">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${language === 'bn' ? 'bg-brand-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
            >
              বাংলা
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${language === 'en' ? 'bg-brand-primary text-white shadow-md' : 'text-text-secondary hover:text-white'}`}
            >
              English
            </button>
          </div>
        </div>
      )}

      {/* Subject Groups */}
      <div className="space-y-6 mb-12">
        <div className="bg-surface p-6 rounded-[2rem] border border-white/5 shadow-sm">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                <GraduationCap size={14} className="text-brand-primary" /> আবশ্যিক বিষয়
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {generalSubjects.map(renderSubjectBtn)}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase font-bold text-text-secondary tracking-[0.2em] mb-4 px-1 flex items-center gap-2">
                <Layers size={14} className="text-amber-500" /> মানবিক বিভাগীয় বিষয়
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {humanitiesSubjects.map(renderSubjectBtn)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      {!isEnglish && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => handleTypeChange('MCQ')}
              className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group shadow-sm ${
                selectedType === 'MCQ' 
                ? 'bg-white/5 border-brand-primary/50 text-white' 
                : 'bg-surface border-white/5 text-text-secondary hover:border-brand-primary/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl transition-colors ${selectedType === 'MCQ' ? 'bg-brand-primary text-white' : 'bg-white/5 text-text-secondary'}`}>
                  <Hash size={24} />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-1 relative z-10">বহুনির্বাচনী (MCQ)</h4>
              <p className="text-sm opacity-80 leading-relaxed relative z-10">বোর্ড স্ট্যান্ডার্ড এমসিকিউ প্র্যাকটিস।</p>
            </button>

            <button 
              onClick={() => handleTypeChange('CQ')}
              className={`p-6 rounded-3xl border text-left transition-all relative overflow-hidden group shadow-sm ${
                selectedType === 'CQ' 
                ? 'bg-white/5 border-brand-primary/50 text-white' 
                : 'bg-surface border-white/5 text-text-secondary hover:border-brand-primary/30'
              }`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-2xl transition-colors ${selectedType === 'CQ' ? 'bg-brand-primary text-white' : 'bg-white/5 text-text-secondary'}`}>
                  <Library size={24} />
                </div>
              </div>
              <h4 className="text-xl font-bold mb-1 relative z-10">সৃজনশীল (CQ)</h4>
              <p className="text-sm opacity-80 leading-relaxed relative z-10">AI দ্বারা বোর্ড সৃজনশীল সমাধান।</p>
            </button>
          </div>

          {/* Question Count */}
          <div className="mb-10 p-6 bg-surface border border-white/5 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-2 text-white font-bold mb-4">
              <Sparkles size={18} className="text-amber-500" />
              <span>{selectedType === 'MCQ' ? 'প্রশ্নের সংখ্যা' : 'সৃজনশীল প্রশ্নের সংখ্যা'}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {countOptions.map(num => (
                <button
                  key={num}
                  onClick={() => setQCount(num)}
                  className={`px-6 py-2 rounded-xl font-bold transition-all border ${
                    qCount === num 
                    ? 'bg-brand-primary border-brand-primary text-white shadow-md' 
                    : 'bg-white/5 border-white/10 text-text-secondary hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Chapters List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2 mb-2">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">অধ্যায় নির্বাচন</h3>
        </div>

        {/* FULL SYLLABUS OPTION */}
        <button
          onClick={handleFullSyllabusStart}
          disabled={isLoading || filteredSyllabus.length === 0}
          className="w-full bg-surface border border-white/5 hover:border-brand-primary/30 p-6 rounded-3xl flex items-center justify-between group transition-all disabled:opacity-50 shadow-sm"
        >
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white transition-all font-bold shadow-lg shadow-brand-primary/10">
              <Globe size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-white group-hover:text-brand-primary transition-colors">সকল অধ্যায় (Full Syllabus)</h4>
              <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-widest font-bold">যোগকৃত সকল অধ্যায় থেকে মিক্সড প্রশ্ন</p>
            </div>
          </div>
          {isLoading ? (
            <Loader2 className="animate-spin text-text-secondary" />
          ) : (
            <div className="px-3 py-1 bg-white/5 text-brand-primary rounded-full text-[10px] font-bold">সবচেয়ে জনপ্রিয়</div>
          )}
        </button>
        
        {filteredSyllabus.length > 0 ? filteredSyllabus.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onStart(selectedSubject, chapter.chapterTitle, isEnglish ? 'ENGLISH' : selectedType, qCount, language)}
            disabled={isLoading}
            className="w-full bg-surface hover:bg-white/5 border border-white/5 hover:border-brand-primary/30 p-6 rounded-3xl flex items-center justify-between group transition-all shadow-sm"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-text-secondary group-hover:bg-brand-primary group-hover:text-white transition-all font-bold shadow-inner border border-white/10">
                {chapter.chapterNumber}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-white group-hover:text-brand-primary transition-colors">{chapter.chapterTitle}</h4>
                <p className="text-[10px] text-text-secondary mt-1 uppercase tracking-widest font-medium">{isEnglish ? 'বোর্ড প্যাটার্ন' : selectedType} প্র্যাকটিস</p>
              </div>
            </div>
            {isLoading ? (
              <Loader2 className="animate-spin text-text-secondary" />
            ) : (
              <ChevronRight className="text-white/20 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
            )}
          </button>
        )) : (
          <div className="text-center py-20 bg-surface border border-dashed border-white/10 rounded-[2.5rem]">
            <p className="text-text-secondary font-medium">এই বিষয়ের কোনো অধ্যায় পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticeView;
