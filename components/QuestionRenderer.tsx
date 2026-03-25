
import React, { useRef } from 'react';
import { Question, MCQQuestion, CQQuestion, EnglishQuestion } from '../types';
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
      <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-text-primary leading-relaxed whitespace-pre-wrap">
              {mcq.question}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(mcq.options || []).map((option) => {
            const isSelected = answer === option.id;
            const isCorrect = option.id === mcq.correctOptionId;
            let borderStyle = 'border-white/5 hover:border-white/10 hover:bg-white/5';
            
            if (isSelected) borderStyle = 'border-brand-primary bg-brand-primary/10 text-brand-primary';
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
                  isSelected ? 'border-brand-primary bg-brand-primary' : 'border-white/20'
                }`}>
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                </div>
                <span className="text-sm md:text-base font-medium">{option.text}</span>
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold uppercase text-text-secondary mb-2 tracking-wider">ব্যাখ্যা (Board Explanation)</h4>
            <p className="text-sm text-text-primary leading-relaxed">{mcq.explanation}</p>
          </div>
        )}
      </div>
    );
  }

  if (question.type === 'ENGLISH') {
    const eng = question as EnglishQuestion;
    const engAnswers = answer || {};

    return (
      <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-6">
        {eng.passage && (
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 mb-8">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">অনুচ্ছেদ (Passage)</h4>
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-bold uppercase border border-brand-primary/20">Board Standard Reading</span>
            </div>
            <p className="text-text-primary leading-relaxed whitespace-pre-wrap font-medium bg-white/5 p-4 rounded-xl border border-white/5">{eng.passage}</p>
          </div>
        )}

        <div className="space-y-12">
          {eng.items.map((item, idx) => (
            <div key={item.id} className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-brand-primary/20 text-brand-primary flex items-center justify-center font-black text-sm border border-brand-primary/20">
                      {idx + 1}
                    </span>
                    <h4 className="text-text-primary font-bold leading-tight">{item.instruction}</h4>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-4 font-medium text-text-primary whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <span className="text-[10px] font-bold text-text-secondary bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                    {item.marks} Marks
                  </span>
                </div>
              </div>

              <div className="pl-11">
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all min-h-[100px] text-sm md:text-base"
                  placeholder="আপনার উত্তর এখানে লিখুন..."
                  value={engAnswers[item.id]?.text || ''}
                  onChange={(e) => onAnswerChange({ ...engAnswers, [item.id]: { text: e.target.value } })}
                  disabled={showFeedback}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cq = question as CQQuestion;

  if (!cq.parts || typeof cq.parts !== 'object' || !cq.parts.a) {
    return (
      <div className="bg-red-950/20 border border-red-900 p-6 rounded-3xl text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
        <h3 className="text-red-200 font-bold">সৃজনশীল প্রশ্ন লোড করতে সমস্যা হয়েছে</h3>
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
    <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-6">
      <div className="bg-black/40 p-6 rounded-xl border border-white/5 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-xs font-bold text-brand-primary uppercase tracking-widest">উদ্দীপক (Stem)</h4>
          <span className="px-3 py-1 bg-amber-600/10 text-amber-500 rounded-full text-[10px] font-bold uppercase border border-amber-500/20">বোর্ড স্ট্যান্ডার্ড সৃজনশীল</span>
        </div>
        <p className="text-text-primary leading-relaxed whitespace-pre-wrap font-medium bg-white/5 p-4 rounded-xl border border-white/5">{cq.stem}</p>
      </div>

      <div className="space-y-10">
        {(['a', 'b', 'c', 'd'] as const).map((part) => {
          const partData = cq.parts[part];
          if (!partData) return null;

          return (
            <div key={part} className="space-y-4">
              <div className="flex justify-between items-start">
                <label className="text-text-primary font-bold flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 text-brand-primary flex items-center justify-center font-black uppercase text-sm border border-white/10">
                    {part}
                  </span>
                  <span className="leading-tight">{partData.question}</span>
                </label>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-text-secondary bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                    {partData.marks} নম্বর • {partData.label}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pl-11">
                <textarea
                  className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all min-h-[120px] text-sm md:text-base"
                  placeholder={`আপনার উত্তর এখানে লিখুন (বোর্ড পরীক্ষায় এই অংশের জন্য ${partData.marks} মার্কস বরাদ্দ থাকে)...`}
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
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-text-secondary rounded-xl text-xs font-bold transition-all border border-white/10"
                  >
                    <Camera size={14} />
                    ছবি আপলোড (হাতে লেখা উত্তর)
                  </button>

                  {cqAnswers[part]?.image && (
                    <div className="relative group">
                      <img 
                        src={cqAnswers[part].image} 
                        alt="Uploaded" 
                        className="w-16 h-16 object-cover rounded-xl border-2 border-brand-primary cursor-pointer"
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
