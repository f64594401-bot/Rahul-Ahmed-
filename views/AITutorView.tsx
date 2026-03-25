
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Camera, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Loader2, 
  Image as ImageIcon,
  BookOpen,
  History as HistoryIcon,
  Plus,
  Trash2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Subject, ChatMessage, TutorSession } from '../types.ts';

const AITutorView: React.FC = () => {
  const [sessions, setSessions] = useState<TutorSession[]>(() => {
    try {
      const saved = localStorage.getItem('mrab_tutor_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load tutor sessions:", e);
      return [];
    }
  });
  
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>(Subject.BANGLA_1ST);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Default to false as requested
  const [streamingContent, setStreamingContent] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const subjects = Object.values(Subject);

  const quickPrompts = [
    { label: "বোর্ড প্রশ্ন", text: "এই অধ্যায় থেকে কি ধরণের বোর্ড প্রশ্ন বেশি আসে?" },
    { label: "সহজ ব্যাখ্যা", text: "এই টপিকটি আমাকে একদম সহজভাবে বুঝিয়ে বলো।" },
    { label: "পড়ার রুটিন", text: "এই বিষয়ের প্রস্তুতির জন্য একটি কার্যকরী রুটিন দাও।" }
  ];

  useEffect(() => {
    try {
      localStorage.setItem('mrab_tutor_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.error("Failed to save tutor sessions (likely storage full):", e);
      // If storage is full, we might want to remove the oldest session
      if (sessions.length > 5) {
        setSessions(prev => prev.slice(0, -1));
      }
    }
  }, [sessions]);

  useEffect(() => {
    if (activeSessionId && messages.length > 0) {
      setSessions(prev => prev.map(s => 
        s.id === activeSessionId 
        ? { ...s, messages, lastActive: Date.now() } 
        : s
      ));
    }
  }, [messages, activeSessionId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingContent]);

  const handleStartNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setAttachedImage(null);
    setInputText('');
    setShowHistory(false);
  };

  const handleLoadSession = (session: TutorSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setSelectedSubject(session.subject);
    setShowHistory(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) handleStartNewChat();
  };

  const handleSendMessage = async (text: string = inputText, image: string | null = attachedImage) => {
    if (!text.trim() && !image) return;

    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      const newId = Math.random().toString(36).substring(7);
      const newSession: TutorSession = {
        id: newId,
        subject: selectedSubject,
        messages: [],
        lastActive: Date.now()
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newId);
      currentSessionId = newId;
    }

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      text: text,
      image: image || undefined,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setAttachedImage(null);
    setIsTyping(true);
    setStreamingContent('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const contents = updatedMessages.map(m => {
        const parts: any[] = [];
        
        // Add text part if it exists
        if (m.text.trim()) {
          parts.push({ text: m.text });
        }
        
        // Add image part if it exists
        if (m.image) {
          try {
            const [header, data] = m.image.split(',');
            const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
            parts.push({
              inlineData: {
                mimeType,
                data
              }
            });
          } catch (e) {
            console.error("Image processing error:", e);
          }
        }
        
        // Ensure at least one part exists
        if (parts.length === 0) {
          parts.push({ text: " " });
        }

        return {
          role: m.role,
          parts
        };
      });

      // High-performance streaming call
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents,
        config: {
          systemInstruction: `You are MRAB AI Tutor, a senior board expert for SSC 2026. 
          Respond in ${selectedSubject.includes('English') ? 'English' : 'Bengali'}. 
          Provide FAST, accurate, and high-yield board exam guidance. 
          If the user provides an image (like a screenshot of a question or a page), analyze it carefully and provide a detailed explanation or solution.`,
          temperature: 0.7
        }
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        const textChunk = chunk.text;
        if (textChunk) {
          fullText += textChunk;
          setStreamingContent(fullText);
        }
      }
      
      const botMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'model',
        text: fullText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
      setStreamingContent('');
    } catch (error) {
      console.error("Tutor Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-6 relative overflow-hidden">
      {/* Sidebar - History */}
      <div className={`
        fixed md:relative z-40 inset-y-0 left-0 w-80 bg-surface border-r border-white/5 flex flex-col transition-all duration-300 transform
        ${showHistory ? 'translate-x-0' : '-translate-x-full md:hidden'}
        shadow-2xl md:shadow-none
      `}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surface-dark/50">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-[0.2em]">
            <HistoryIcon size={16} className="text-brand-primary" />
            চ্যাট ইতিহাস
          </h3>
          <button onClick={() => setShowHistory(false)} className="md:hidden text-text-secondary hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <button onClick={handleStartNewChat} className="btn-primary w-full flex items-center justify-center gap-3 p-4 text-white rounded-2xl font-bold transition-all mb-4 shadow-lg shadow-brand-primary/20 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> নতুন চ্যাট শুরু করুন
          </button>

          {sessions.length === 0 ? (
            <div className="text-center py-10 opacity-30">
              <MessageSquare size={32} className="mx-auto mb-2" />
              <p className="text-xs">কোনো ইতিহাস নেই</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => handleLoadSession(s)} 
                  className={`group flex items-start gap-3 p-4 rounded-2xl cursor-pointer border transition-all relative overflow-hidden ${
                    activeSessionId === s.id 
                    ? 'bg-brand-primary/10 border-brand-primary/30 text-white shadow-inner' 
                    : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:text-white hover:border-white/10'
                  }`}
                >
                  {activeSessionId === s.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-primary"></div>
                  )}
                  <div className="shrink-0 mt-1">
                    <Bot size={16} className={activeSessionId === s.id ? 'text-brand-primary' : 'text-white/20'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] font-bold truncate uppercase tracking-wider text-brand-primary">{s.subject}</p>
                      <p className="text-[8px] opacity-40">{new Date(s.lastActive).toLocaleDateString()}</p>
                    </div>
                    <p className="text-xs font-medium truncate opacity-80">
                      {s.messages[s.messages.length - 1]?.text || 'নতুন আলাপ'}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => handleDeleteSession(e, s.id)} 
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-white/5 bg-surface-dark/30">
          <p className="text-[10px] text-text-secondary text-center font-medium opacity-50">
            আপনার সকল চ্যাট লোকাল স্টোরেজে সংরক্ষিত থাকে
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-black/20">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowHistory(!showHistory)} 
              className="flex items-center gap-2 p-3 bg-surface border border-white/10 text-brand-primary hover:bg-white/5 rounded-2xl transition-all shadow-lg shadow-black/20 group"
              title={showHistory ? "Hide History" : "Show History"}
            >
              {showHistory ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              <span className="text-xs font-bold uppercase tracking-widest hidden md:block">
                {showHistory ? 'Hide History' : 'View History'}
              </span>
            </button>
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                <Sparkles className="text-brand-primary animate-pulse" /> 
                MRAB AI টিউটর
              </h2>
              <p className="text-text-secondary text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:block opacity-60">
                এডভান্সড বোর্ড এক্সপার্ট সিস্টেম
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Online</span>
            </div>
            <select 
              value={selectedSubject} 
              onChange={(e) => setSelectedSubject(e.target.value as Subject)} 
              className="bg-surface border border-white/10 text-white text-xs font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-primary shadow-xl transition-all cursor-pointer hover:bg-white/5"
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 bg-surface/40 backdrop-blur-sm border border-white/5 rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-[100px] -z-10"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/5 blur-[100px] -z-10"></div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {messages.length === 0 && !streamingContent && (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full"></div>
                  <div className="relative w-24 h-24 bg-surface border border-white/10 rounded-[2rem] flex items-center justify-center text-brand-primary shadow-2xl">
                    <Bot size={56} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">আমি কিভাবে সাহায্য করতে পারি?</h3>
                  <p className="text-text-secondary text-sm max-w-md mx-auto">
                    আপনার {selectedSubject} বিষয়ের যেকোনো সমস্যা বা বোর্ড প্রশ্ন নিয়ে আলোচনা করুন।
                  </p>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${!showHistory ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 w-full max-w-4xl`}>
                  {!showHistory && (
                    <button 
                      onClick={() => setShowHistory(true)} 
                      className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-xs text-text-secondary hover:text-white hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-left group shadow-sm"
                    >
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                        <HistoryIcon size={20} />
                      </div>
                      <p className="font-bold text-white mb-1">পুরানো আলাপ</p>
                      <p className="opacity-60 line-clamp-2">আগের চ্যাট হিস্ট্রি দেখুন।</p>
                    </button>
                  )}
                  {quickPrompts.map((p, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleSendMessage(p.text)} 
                      className="p-6 bg-white/5 border border-white/5 rounded-[2rem] text-xs text-text-secondary hover:text-white hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all text-left group shadow-sm"
                    >
                      <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary mb-4 group-hover:scale-110 transition-transform">
                        <BookOpen size={20} />
                      </div>
                      <p className="font-bold text-white mb-1">{p.label}</p>
                      <p className="opacity-60 line-clamp-2">{p.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${
                  m.role === 'user' 
                  ? 'bg-brand-primary text-white' 
                  : 'bg-surface border border-white/10 text-brand-primary'
                }`}>
                  {m.role === 'user' ? <User size={24} /> : <Bot size={24} />}
                </div>
                <div className={`max-w-[85%] space-y-2 ${m.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`px-6 py-4 rounded-[2rem] inline-block text-left shadow-xl ${
                    m.role === 'user' 
                    ? 'bg-brand-primary text-white rounded-tr-none' 
                    : 'bg-surface-dark border border-white/10 text-text-primary rounded-tl-none prose prose-invert prose-sm max-w-none'
                  }`}>
                    {m.role === 'user' ? (
                      <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">{m.text}</p>
                    ) : (
                      <div className="markdown-content">
                        <ReactMarkdown>
                          {m.text}
                        </ReactMarkdown>
                      </div>
                    )}
                    {m.image && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/10">
                        <img src={m.image} alt="Attached" className="max-w-full h-auto max-h-64 object-contain bg-black/20" />
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] font-bold text-text-secondary uppercase tracking-widest px-2 opacity-40">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {streamingContent && (
              <div className="flex gap-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 text-brand-primary flex items-center justify-center shrink-0 shadow-xl">
                  <Bot size={24} />
                </div>
                <div className="max-w-[85%] space-y-2">
                  <div className="px-6 py-4 rounded-[2rem] rounded-tl-none bg-surface-dark border border-white/10 text-text-primary shadow-xl prose prose-invert prose-sm max-w-none">
                    <div className="markdown-content">
                      <ReactMarkdown>
                        {streamingContent}
                      </ReactMarkdown>
                    </div>
                    <span className="inline-block w-2 h-4 bg-brand-primary ml-1 animate-pulse rounded-full"></span>
                  </div>
                </div>
              </div>
            )}

            {isTyping && !streamingContent && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 text-brand-primary flex items-center justify-center shrink-0 shadow-xl">
                  <Bot size={24} />
                </div>
                <div className="bg-surface-dark border border-white/10 px-6 py-4 rounded-[2rem] rounded-tl-none flex items-center gap-4 shadow-xl">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">AI Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-surface-dark/80 backdrop-blur-xl border-t border-white/5">
            {attachedImage && (
              <div className="mb-4 flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10 animate-in slide-in-from-bottom-2">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20">
                  <img src={attachedImage} alt="Attached" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setAttachedImage(null)} 
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <X size={10} />
                  </button>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">ছবি সংযুক্ত করা হয়েছে</p>
                  <p className="text-[10px] text-text-secondary">AI এই ছবিটি বিশ্লেষণ করবে</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setAttachedImage(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }} 
              />
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-4 bg-white/5 text-text-secondary hover:text-brand-primary hover:bg-white/10 rounded-2xl border border-white/10 shadow-xl transition-all group"
                title="Attach Image"
              >
                <Camera size={24} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex-1 relative group">
                <div className="absolute -inset-0.5 bg-brand-primary/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <input 
                  type="text" 
                  value={inputText} 
                  onChange={(e) => setInputText(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} 
                  placeholder="আপনার প্রশ্নটি লিখুন..." 
                  className="relative w-full bg-surface border border-white/10 rounded-[2rem] pl-8 pr-16 py-5 text-text-primary focus:outline-none focus:border-brand-primary shadow-2xl transition-all text-sm md:text-base" 
                />
                <button 
                  onClick={() => handleSendMessage()} 
                  disabled={isTyping || (!inputText.trim() && !attachedImage)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 bg-brand-primary hover:bg-brand-secondary text-white rounded-2xl disabled:opacity-30 shadow-lg shadow-brand-primary/20 transition-all active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: white;
        }
        .markdown-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .markdown-content ul, .markdown-content ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        .markdown-content code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.4rem;
          font-family: monospace;
        }
        .markdown-content blockquote {
          border-left: 4px solid #1E6BFF;
          padding-left: 1rem;
          font-style: italic;
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
};

export default AITutorView;
