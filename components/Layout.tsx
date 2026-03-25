
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'practice', label: 'প্র্যাকটিস হাব', icon: BookOpen },
    { id: 'tutor', label: 'AI টিউটর', icon: Sparkles },
    { id: 'exams', label: 'মক টেস্ট', icon: ClipboardList },
    { id: 'analytics', label: 'সাফল্য চিত্র', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col hidden md:flex bg-surface">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-brand-primary/20">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">MRAB</h1>
        </button>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={20} className={item.id === 'tutor' ? 'text-brand-primary' : ''} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-xs text-text-secondary mb-1">প্রস্তুতি লক্ষ্য</p>
            <p className="text-sm font-semibold text-white">SSC ২০২৬</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-brand-primary h-1.5 rounded-full w-2/3"></div>
            </div>
            <p className="text-[10px] text-text-secondary mt-2 text-right">৬৫% প্রস্তুতি সম্পন্ন</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-surface/80 backdrop-blur-sm z-10">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="md:hidden flex items-center gap-2"
          >
            <GraduationCap className="text-brand-primary w-6 h-6" />
            <span className="font-bold text-white">MRAB</span>
          </button>
          <div className="hidden md:block text-text-secondary text-sm">
            প্রস্তুতি শুরু করুন: <span className="text-white font-bold">SSC ২০২৬</span>
          </div>
          <div className="flex items-center gap-4">
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
