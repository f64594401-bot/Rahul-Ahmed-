
import React, { useState } from 'react';
import { UserProfile, Bibhag } from '../types';
import { User, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">সেটিংস ও প্রোফাইল</h2>
        <p className="text-slate-400">আপনার ব্যক্তিগত তথ্য এবং পড়ার বিভাগ পরিচালনা করুন।</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">শিক্ষার্থীর প্রোফাইল</h3>
            <p className="text-sm text-slate-500">তথ্যগুলো সঠিকভাবে পূরণ করুন।</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-400 ml-1">পূর্ণ নাম</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">বয়স</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="বয়স"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">বিভাগ (Bibhag)</label>
              <select
                value={formData.bibhag}
                onChange={(e) => setFormData({ ...formData, bibhag: e.target.value as Bibhag })}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
              >
                {Object.values(Bibhag).map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck size={16} />
            <span className="text-xs">আপনার তথ্য সুরক্ষিত রাখা হয়।</span>
          </div>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
              isSaved 
              ? 'bg-emerald-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/20'
            }`}
          >
            {isSaved ? <CheckCircle2 size={18} /> : <Save size={18} />}
            {isSaved ? 'সংরক্ষিত হয়েছে' : 'তথ্য সেভ করুন'}
          </button>
        </div>
      </div>

      <div className="mt-8 p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-3xl">
        <h4 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-widest">টিপস</h4>
        <p className="text-sm text-slate-400 leading-relaxed">
          সঠিক বিভাগ সিলেক্ট করলে আমরা আপনাকে সেই অনুযায়ী চ্যাপ্টার এবং প্রশ্ন সাজেস্ট করতে পারব।
        </p>
      </div>
    </div>
  );
};

export default SettingsView;
