
import React, { useState } from 'react';
import { SessionHistory, Subject } from '../types';
import { ArrowLeft, Calendar, BookOpen, Clock, Target, ChevronDown, ChevronUp, Search, History } from 'lucide-react';

interface ExamHistoryViewProps {
  history: SessionHistory[];
  onBack: () => void;
}

const ExamHistoryView: React.FC<ExamHistoryViewProps> = ({ history, onBack }) => {
  const [sortField, setSortField] = useState<'timestamp' | 'subject' | 'accuracy'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'ALL' | 'Practice' | 'BOARD'>('ALL');

  const filteredExams = history.filter(h => {
    const matchesSearch = h.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMode = modeFilter === 'ALL' || h.mode === modeFilter;
    return matchesSearch && matchesMode;
  }).sort((a, b) => {
    let comparison = 0;
    if (sortField === 'timestamp') comparison = a.timestamp - b.timestamp;
    else if (sortField === 'accuracy') comparison = a.accuracy - b.accuracy;
    else if (sortField === 'subject') comparison = a.subject.localeCompare(b.subject);
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const toggleSort = (field: 'timestamp' | 'subject' | 'accuracy') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-3 bg-surface border border-white/10 text-text-secondary hover:text-white rounded-2xl transition-all shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">পরীক্ষার ইতিহাস</h2>
          <p className="text-text-secondary text-sm">আপনার সম্পন্ন করা সকল মক টেস্টের ফলাফল।</p>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-[2rem] overflow-hidden shadow-sm">
        {/* Mode Tabs */}
        <div className="flex border-b border-white/5 bg-black/20">
          {(['ALL', 'Practice', 'BOARD'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setModeFilter(mode)}
              className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${
                modeFilter === mode ? 'text-brand-primary' : 'text-text-secondary hover:text-white'
              }`}
            >
              {mode === 'ALL' ? 'সবগুলো' : mode === 'Practice' ? 'প্র্যাকটিস' : 'মক টেস্ট'}
              {modeFilter === mode && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_0_10px_rgba(30,107,255,0.5)]"></div>
              )}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="বিষয় খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-primary/50 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => toggleSort('timestamp')}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                sortField === 'timestamp' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/5 text-text-secondary hover:text-white'
              }`}
            >
              <Calendar size={14} /> তারিখ
              {sortField === 'timestamp' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
            </button>
            <button 
              onClick={() => toggleSort('accuracy')}
              className={`flex-1 md:flex-none flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                sortField === 'accuracy' ? 'bg-brand-primary border-brand-primary text-white' : 'bg-white/5 border-white/5 text-text-secondary hover:text-white'
              }`}
            >
              <Target size={14} /> নম্বর
              {sortField === 'accuracy' && (sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-white/5">
          {filteredExams.length > 0 ? filteredExams.map((h) => (
            <div key={h.sessionId} className="p-6 hover:bg-white/5 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 text-brand-primary flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-white">{h.subject}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider ${
                        h.mode === 'BOARD' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                      }`}>
                        {h.mode === 'BOARD' ? 'Mock Test' : 'Practice'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-1.5 text-text-secondary text-xs font-medium">
                        <Calendar size={14} />
                        {new Date(h.timestamp).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-text-secondary text-xs font-medium">
                        <Clock size={14} />
                        {h.durationMinutes} মিনিট
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">মোট মার্কস</p>
                    <p className="text-xl font-black text-white">{h.score} / {h.totalMarks}</p>
                  </div>
                  <div className="relative">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-black text-sm ${
                      h.accuracy >= 80 ? 'border-emerald-500/50 text-emerald-400' :
                      h.accuracy >= 60 ? 'border-brand-primary/50 text-brand-primary' :
                      h.accuracy >= 40 ? 'border-amber-500/50 text-amber-400' :
                      'border-red-500/50 text-red-400'
                    } bg-black/20 shadow-inner`}>
                      {h.accuracy}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-24 flex flex-col items-center text-center px-6">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-text-secondary/30 mb-6 border border-white/5">
                <History size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">কোন ইতিহাস নেই</h3>
              <p className="text-text-secondary max-w-xs">আপনি এখনো কোনো প্র্যাকটিস বা মক টেস্ট সম্পন্ন করেননি। প্রথম সেশন শুরু করুন!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHistoryView;
