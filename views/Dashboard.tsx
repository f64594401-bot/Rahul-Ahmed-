
import React, { useState } from 'react';
import { 
  Play, 
  History as HistoryIcon, 
  Target, 
  Trophy,
  ArrowRight,
  ClipboardList,
  Edit2,
  X,
  ShieldAlert
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

  // Calculate Real Stats
  const totalAccuracy = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / history.length) 
    : 0;
  
  const topicsMastered = history.filter(h => h.accuracy >= 80).length;
  const totalStudyHours = Math.round(history.reduce((acc, curr) => acc + curr.durationMinutes, 0) / 60);

  // Prepare Chart Data from History (Last 7 Sessions)
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
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header with Title */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">সাফল্য চিত্র</h2>
          <p className="text-slate-400 mt-1">আপনার নিয়মিত প্রস্তুতির খতিয়ান এখানে দেখুন।</p>
        </div>
        <button 
          onClick={() => setIsEditingGoal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl text-sm font-bold transition-all border border-slate-700"
        >
          <Edit2 size={16} />
          লক্ষ্য পরিবর্তন করুন
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-xl"><Trophy size={20} /></div>
            <span className="text-xs font-bold uppercase tracking-wider opacity-60">গড় নির্ভুলতা (Accuracy)</span>
          </div>
          <p className="text-4xl font-bold mb-1">{totalAccuracy}%</p>
          <p className="text-indigo-100 text-sm">
            লক্ষ্য: {profile.goals.targetAccuracy}%
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl"><Target size={20} /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">অর্জিত টপিক</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{topicsMastered}/{profile.goals.topicsMastered}</p>
          <p className="text-slate-400 text-sm">৮০% এর বেশি মার্ক পাওয়া অধ্যায়</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl"><HistoryIcon size={20} /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">মোট পড়ার সময়</span>
          </div>
          <p className="text-4xl font-bold text-white mb-1">{totalStudyHours}h / {profile.goals.studyHours}h</p>
          <p className="text-slate-400 text-sm">চলতি মাসের পড়ার লক্ষ্যমাত্রা</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">পারফরম্যান্স গ্রাফ</h3>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">শেষ ৭টি সেশন</div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayChartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">কুইক অ্যাকশনস</h3>
            <div className="space-y-3 flex-1">
              <button 
                onClick={onStartPractice}
                className="w-full flex items-center justify-between p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Play size={18} fill="currentColor" />
                  <span className="font-semibold">প্র্যাকটিস শুরু করুন</span>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={onGoToExams}
                className="w-full flex items-center justify-between p-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <ShieldAlert size={18} />
                  <span className="font-semibold">বোর্ড এক্সাম দিন</span>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-800">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">সবশেষ ফলাফল</p>
              <div className="space-y-4">
                {history.length > 0 ? history.slice(-3).reverse().map((h, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${h.accuracy >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                      <p className="text-sm text-slate-300 truncate max-w-[120px]">{h.subject}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-500">{h.accuracy}%</span>
                  </div>
                )) : (
                  <p className="text-xs text-slate-600">কোন ফলাফল নেই</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsEditingGoal(false)}></div>
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">লক্ষ্যমাত্রা নির্ধারণ করুন</h3>
              <button onClick={() => setIsEditingGoal(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm text-slate-400 block mb-2">মাস্টার্ড টপিকস লক্ষ্য (সংখ্যা)</label>
                <input 
                  type="number"
                  value={goalDraft.topicsMastered}
                  onChange={e => setGoalDraft({...goalDraft, topicsMastered: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">মাসিক পড়ার সময় (ঘন্টা)</label>
                <input 
                  type="number"
                  value={goalDraft.studyHours}
                  onChange={e => setGoalDraft({...goalDraft, studyHours: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-2">টার্গেট Accuracy (%)</label>
                <input 
                  type="number"
                  value={goalDraft.targetAccuracy}
                  onChange={e => setGoalDraft({...goalDraft, targetAccuracy: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              
              <button 
                onClick={handleSaveGoals}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-900/20 transition-all"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
