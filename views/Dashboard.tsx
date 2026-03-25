
import React, { useState } from 'react';
import { 
  Play, 
  History as HistoryIcon, 
  Target, 
  Trophy,
  ArrowRight,
  Edit2,
  X,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { UserProfile, SessionHistory, UserGoals } from '../types';

interface DashboardProps {
  onStartPractice: () => void;
  onGoToExams: () => void;
  profile: UserProfile;
  history: SessionHistory[];
  onUpdateGoals: (goals: UserGoals) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStartPractice, onGoToExams, profile, history, onUpdateGoals }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState<UserGoals>(profile.goals);

  const totalAccuracy = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / history.length) 
    : 0;
  
  const topicsMastered = history.filter(h => h.accuracy >= 80).length;
  const totalStudyHours = Math.round(history.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60);

  const chartData = history.slice(-7).map(h => ({
    name: new Date(h.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
    score: h.accuracy
  }));

  const displayChartData = chartData.length > 0 ? chartData : [
    { name: 'N/A', score: 0 }
  ];

  const handleSaveGoals = () => {
    onUpdateGoals(goalDraft);
    setIsEditingGoal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tight">ড্যাশবোর্ড হাব</h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-text-secondary">আপনার SSC ২০২৬ প্রস্তুতির কমপ্লিট কন্ট্রোল সেন্টার</span>
            {profile.department && (
              <span className="px-3 py-1 bg-white/5 border border-white/10 text-brand-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                {profile.department}
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => setIsEditingGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all border border-white/10 shadow-sm"
        >
          <Edit2 size={16} />
          লক্ষ্য পরিবর্তন
        </button>
      </div>

      {/* Main Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2.5rem] p-8 text-white shadow-xl shadow-brand-primary/20 group">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">গড় নির্ভুলতা</span>
          </div>
          <p className="text-5xl font-black mb-2">{totalAccuracy}%</p>
          <p className="text-white/80 text-sm font-medium">লক্ষ্যমাত্রা: {profile.goals.targetAccuracy}%</p>
        </div>

        <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 group shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/5 text-brand-primary rounded-2xl group-hover:scale-110 transition-transform"><Target size={24} /></div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">মাস্টার্ড অধ্যায়</span>
          </div>
          <p className="text-5xl font-black text-white mb-2">{topicsMastered}/{profile.goals.topicsMastered}</p>
          <p className="text-text-secondary text-sm font-medium">৮০%+ নম্বর প্রাপ্ত অধ্যায়সমূহ</p>
        </div>

        <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 group shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/5 text-brand-primary rounded-2xl group-hover:scale-110 transition-transform"><HistoryIcon size={24} /></div>
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">স্টাডি টাইম</span>
          </div>
          <p className="text-5xl font-black text-white mb-2">{totalStudyHours}h / {profile.goals.studyHours}h</p>
          <p className="text-text-secondary text-sm font-medium">চলতি মাসের পড়ার টার্গেট</p>
        </div>
      </div>

      {/* System Modules Hub */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-[0.3em] px-2">সিস্টেম মডিউলস (All Systems)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={onStartPractice}
            className="flex flex-col p-6 bg-surface border border-white/5 rounded-[2rem] hover:border-brand-primary/50 hover:bg-white/5 transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
              <BookOpen size={24} />
            </div>
            <h4 className="font-bold text-lg text-white mb-1">প্র্যাকটিস হাব</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">অধ্যায়ভিত্তিক MCQ ও সৃজনশীল প্র্যাকটিস করুন।</p>
            <div className="mt-auto flex items-center gap-2 text-brand-primary font-bold text-xs">
              শুরু করুন <ArrowRight size={14} />
            </div>
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'tutor' }))}
            className="flex flex-col p-6 bg-surface border border-white/5 rounded-[2rem] hover:border-brand-primary/50 hover:bg-white/5 transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary mb-4 shadow-lg shadow-brand-primary/10 group-hover:scale-110 transition-transform">
              <Sparkles size={24} />
            </div>
            <h4 className="font-bold text-lg text-white mb-1">AI টিউটর</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">যেকোনো প্রশ্ন বা সমস্যা সমাধানে আপনার পার্সোনাল টিউটর।</p>
            <div className="mt-auto flex items-center gap-2 text-brand-primary font-bold text-xs">
              আলাপ করুন <ArrowRight size={14} />
            </div>
          </button>

          <button 
            onClick={onGoToExams}
            className="flex flex-col p-6 bg-surface border border-white/5 rounded-[2rem] hover:border-brand-primary/50 hover:bg-white/5 transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-4 shadow-lg shadow-brand-primary/10 group-hover:scale-110 transition-transform">
              <ShieldAlert size={24} />
            </div>
            <h4 className="font-bold text-lg text-white mb-1">মক টেস্ট</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">বোর্ড স্ট্যান্ডার্ড প্রশ্নপত্রে পূর্ণাঙ্গ মক টেস্ট দিন।</p>
            <div className="mt-auto flex items-center gap-2 text-brand-primary font-bold text-xs">
              পরীক্ষা দিন <ArrowRight size={14} />
            </div>
          </button>

          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'analytics' }))}
            className="flex flex-col p-6 bg-surface border border-white/5 rounded-[2rem] hover:border-brand-primary/50 hover:bg-white/5 transition-all text-left group shadow-sm"
          >
            <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary mb-4 shadow-lg shadow-brand-primary/5 group-hover:scale-110 transition-transform">
              <BarChart3 size={24} />
            </div>
            <h4 className="font-bold text-lg text-white mb-1">সাফল্য চিত্র</h4>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">আপনার প্রস্তুতির গ্রাফ ও দুর্বলতা চিহ্নিত করুন।</p>
            <div className="mt-auto flex items-center gap-2 text-brand-primary font-bold text-xs">
              গ্রাফ দেখুন <ArrowRight size={14} />
            </div>
          </button>
        </div>
      </div>

      {/* Progress Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-white/5 rounded-[2.5rem] p-8 min-h-[450px] shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-bold text-white">প্রগতি ট্র্যাকার</h3>
              <p className="text-xs text-text-secondary mt-1 uppercase tracking-widest font-bold">শেষ ৭ দিনের পারফরম্যান্স</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E6BFF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1E6BFF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#B0B0B0', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#B0B0B0', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px' }} 
                  itemStyle={{ color: '#FFFFFF' }} 
                  labelStyle={{ color: '#B0B0B0' }}
                />
                <Area type="monotone" dataKey="score" stroke="#1E6BFF" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 h-full flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/5 text-brand-primary rounded-2xl"><Sparkles size={24} /></div>
              <h3 className="text-xl font-bold text-white">আজকের টার্গেট</h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">সুপারিশকৃত</p>
                <p className="text-sm font-bold text-white">বাংলা ১ম পত্র: 'সুভা' এমসিকিউ (১০টি)</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">বোর্ডের জন্য গুরুত্বপূর্ণ</p>
                <p className="text-sm font-bold text-white">গণিত: পরিসংখ্যান অধ্যায় রিভিশন</p>
              </div>
            </div>
            <button 
              onClick={onStartPractice}
              className="btn-primary mt-8 w-full py-4 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-3"
            >
              টার্গেট পূরণ শুরু করুন <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditingGoal(false)}></div>
          <div className="relative bg-surface border border-white/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">লক্ষ্যমাত্রা নির্ধারণ</h3>
              <button onClick={() => setIsEditingGoal(false)} className="text-text-secondary hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3 ml-1">মাস্টার্ড অধ্যায় লক্ষ্য</label>
                <input 
                  type="number"
                  value={goalDraft.topicsMastered}
                  onChange={e => setGoalDraft({...goalDraft, topicsMastered: parseInt(e.target.value) || 0})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3 ml-1">মাসিক পড়ার সময় (ঘন্টা)</label>
                <input 
                  type="number"
                  value={goalDraft.studyHours}
                  onChange={e => setGoalDraft({...goalDraft, studyHours: parseInt(e.target.value) || 0})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-3 ml-1">টার্গেট নির্ভুলতা (%)</label>
                <input 
                  type="number"
                  value={goalDraft.targetAccuracy}
                  onChange={e => setGoalDraft({...goalDraft, targetAccuracy: parseInt(e.target.value) || 0})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-brand-primary/50 transition-all"
                />
              </div>
              <button 
                onClick={handleSaveGoals}
                className="btn-primary w-full py-5 text-white rounded-[2rem] font-bold transition-all"
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
