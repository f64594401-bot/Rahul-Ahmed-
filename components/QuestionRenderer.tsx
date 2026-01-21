
import React, { useRef } from 'react';
import { Question, MCQQuestion, CQQuestion } from '../types';
import { Camera, Image as ImageIcon, X, Paperclip, AlertTriangle } from 'lucide-react';

interface QuestionRendererProps {
  question: Question;
  index: number;
  answer: any;
  onAnswerChange: (answer: any) => void;
  showFeedback?: boolean;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ 
  question, 
  index, 
  answer, 
  onAnswerChange,
  showFeedback = false 
}) => {
  const fileInputRefs = {
    a: useRef<HTMLInputElement>(null),
    b: useRef<HTMLInputElement>(null),
    c: useRef<HTMLInputElement>(null),
    d: useRef<HTMLInputElement>(null)
  };

  if (!question) {
    return (
      <div className="bg-red-950/20 border border-red-900 p-6 rounded-3xl text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
        <h3 className="text-red-200 font-bold">প্রশ্ন পাওয়া যায়নি</h3>
      </div>
    );
  }

  if (question.type === 'MCQ') {
    const mcq = question as MCQQuestion;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <h3 className="text-lg font-medium text-slate-200 leading-relaxed">
            {mcq.question}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(mcq.options || []).map((option) => {
            const isSelected = answer === option.id;
            const isCorrect = option.id === mcq.correctOptionId;
            let borderStyle = 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/50';
            
            if (isSelected) borderStyle = 'border-indigo-500 bg-indigo-500/10 text-indigo-200';
            if (showFeedback) {
              if (isCorrect) borderStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-200';
              else if (isSelected) borderStyle = 'border-red-500 bg-red-500/10 text-red-200';
            }

            return (
              <button
                key={option.id}
                onClick={() => !showFeedback && onAnswerChange(option.id)}
                disabled={showFeedback}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${borderStyle}`}
              >
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
                <span className="text-sm md:text-base font-medium">{option.text}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
            <h4 className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-wider">ব্যাখ্যা (Explanation)</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{mcq.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  const cq = question as CQQuestion;

  // STRICT DEFENSIVE CHECK FOR CQ PARTS
  if (!cq.parts || typeof cq.parts !== 'object' || !cq.parts.a) {
    return (
      <div className="bg-red-950/20 border border-red-900 p-6 rounded-3xl text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
        <h3 className="text-red-200 font-bold">সৃজনশীল প্রশ্ন লোড করতে সমস্যা হয়েছে</h3>
        <p className="text-red-400/60 text-sm mt-1">AI প্রশ্নটি সম্পূর্ণভাবে তৈরি করতে পারেনি। পুনরায় চেষ্টা করুন।</p>
      </div>
    );
  }

  const cqAnswers = answer || { 
    a: { text: '', image: null }, 
    b: { text: '', image: null }, 
    c: { text: '', image: null }, 
    d: { text: '', image: null } 
  };

  const updatePartText = (part: 'a' | 'b' | 'c' | 'd', val: string) => {
    onAnswerChange({ ...cqAnswers, [part]: { ...(cqAnswers[part] || {}), text: val } });
  };

  const handleImageUpload = (part: 'a' | 'b' | 'c' | 'd', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onAnswerChange({ 
        ...cqAnswers, 
        [part]: { ...(cqAnswers[part] || {}), image: reader.result as string } 
      });
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (part: 'a' | 'b' | 'c' | 'd') => {
    onAnswerChange({ 
      ...cqAnswers, 
      [part]: { ...(cqAnswers[part] || {}), image: null } 
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">উদ্দীপক (Stem)</h4>
          <span className="px-3 py-1 bg-indigo-600/10 text-indigo-400 rounded-full text-[10px] font-bold uppercase border border-indigo-500/20">সৃজনশীল প্রশ্ন</span>
        </div>
        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">{cq.stem}</p>
      </div>

      <div className="space-y-10">
        {(['a', 'b', 'c', 'd'] as const).map((part) => {
          const partData = cq.parts[part];
          if (!partData) return null;

          return (
            <div key={part} className="space-y-4">
              <div className="flex justify-between items-start">
                <label className="text-slate-200 font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-800 text-indigo-400 flex items-center justify-center font-black uppercase text-sm border border-slate-700">
                    {part}
                  </span>
                  <span className="leading-tight">{partData.question}</span>
                </label>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    {partData.marks} নম্বর • {partData.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pl-11">
                <textarea
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all min-h-[120px] text-sm md:text-base"
                  placeholder={`আপনার উত্তর এখানে লিখুন অথবা ছবি আপলোড করুন...`}
                  value={cqAnswers[part]?.text || ''}
                  onChange={(e) => updatePartText(part, e.target.value)}
                  disabled={showFeedback}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRefs[part]}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(part, file);
                    }}
                  />
                  <button
                    onClick={() => fileInputRefs[part].current?.click()}
                    disabled={showFeedback}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
                  >
                    <Camera size={14} />
                    হাতে লেখা উত্তর আপলোড করুন
                  </button>

                  {cqAnswers[part]?.image && (
                    <div className="relative group">
                      <img 
                        src={cqAnswers[part].image} 
                        alt="Uploaded" 
                        className="w-16 h-16 object-cover rounded-xl border-2 border-indigo-500 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => window.open(cqAnswers[part].image)}
                      />
                      {!showFeedback && (
                        <button 
                          onClick={() => removeImage(part)}
                          className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-lg"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionRenderer;
