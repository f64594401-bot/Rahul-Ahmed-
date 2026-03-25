
import React, { useState, useEffect } from 'react';
import { UserProfile, Department } from '../types';
import { Save, CheckCircle2, ShieldCheck, GraduationCap, Briefcase, Atom } from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSave = () => {
    if (!formData.department) return;
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const departments = [
    { id: Department.SCIENCE, icon: Atom, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { id: Department.HUMANITIES, icon: GraduationCap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { id: Department.COMMERCE, icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">অ্যাপ সেটিংস</h2>
        <p className="text-text-secondary">আপনার শিক্ষা বিভাগ নির্বাচন করুন যাতে বোর্ড স্ট্যান্ডার্ড প্রশ্নপত্র কাস্টমাইজ করা যায়।</p>
      </div>

      <div className="bg-surface border border-white/5 rounded-[2.5rem] p-8 space-y-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-4">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1 block">আপনার শিক্ষা বিভাগ নির্বাচন করুন</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setFormData({ ...formData, department: dept.id })}
                  className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all text-center gap-3 ${
                    formData.department === dept.id
                    ? `bg-brand-primary/10 border-brand-primary/20 ring-2 ring-brand-primary/20`
                    : 'bg-black/40 border-white/5 hover:border-white/10 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  <dept.icon className={`w-8 h-8 ${formData.department === dept.id ? 'text-brand-primary' : 'text-text-secondary'}`} />
                  <span className={`text-[11px] font-bold uppercase tracking-tight ${formData.department === dept.id ? 'text-white' : 'text-text-secondary'}`}>
                    {dept.id.split('(')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-2 text-text-secondary">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-[10px] uppercase tracking-wider font-bold">বিভাগ অনুযায়ী প্রশ্নপত্র লোড হবে</span>
          </div>
          <button
            onClick={handleSave}
            disabled={!formData.department}
            className={`btn-primary w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isSaved 
              ? 'bg-emerald-600 text-white scale-105 shadow-lg shadow-emerald-900/40' 
              : 'text-white shadow-xl shadow-brand-primary/20 active:scale-95'
            }`}
          >
            {isSaved ? <CheckCircle2 size={20} className="animate-in zoom-in" /> : <Save size={20} />}
            {isSaved ? 'সংরক্ষিত হয়েছে' : 'সেভ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
