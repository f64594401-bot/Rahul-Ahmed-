
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  GraduationCap 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onNavigate: (view: string) => void;
  userName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onNavigate, userName }) => {
  const navItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'practice', label: 'প্র্যাকটিস হাব', icon: BookOpen },
    { id: 'exams', label: 'মক টেস্ট', icon: ClipboardList },
    { id: 'analytics', label: 'সাফল্য চিত্র', icon: BarChart3 },
    { id: 'settings', label: 'সেটিংস', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">MRAB</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800">
            <p className="text-xs text-slate-500 mb-1">লক্ষ্য</p>
            <p className="text-sm font-semibold text-slate-200">SSC ২০২৬</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3">
              <div className="bg-indigo-500 h-1.5 rounded-full w-2/3"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-right">৬৫% প্রস্তুতি সম্পন্ন</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-950/50 backdrop-blur-sm z-10">
          <div className="md:hidden flex items-center gap-2">
            <GraduationCap className="text-indigo-500 w-6 h-6" />
            <span className="font-bold">MRAB</span>
          </div>
          <div className="hidden md:block text-slate-400 text-sm">
            স্বাগতম, <span className="text-slate-200 font-medium">{userName || 'শিক্ষার্থী'}</span>। আজ কি পড়তে চাও?
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('settings')}
              className={`p-2 transition-colors ${activeView === 'settings' ? 'text-indigo-500' : 'text-slate-400 hover:text-white'}`}
            >
              <Settings size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-2 border-slate-800"></div>
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
