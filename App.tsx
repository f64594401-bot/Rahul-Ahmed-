
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Dashboard from './views/Dashboard.tsx';
import PracticeView from './views/PracticeView.tsx';
import ActiveExam from './views/ActiveExam.tsx';
import ResultsView from './views/ResultsView.tsx';
import ExamHubView from './views/ExamHubView.tsx';
import ExamHistoryView from './views/ExamHistoryView.tsx';
import AITutorView from './views/AITutorView.tsx';
import { geminiService } from './services/geminiService.ts';
import { Subject, QuestionType, ExamSession, GradingResult, Language, UserProfile, SessionHistory, UserGoals, Department } from './types.ts';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [previousView, setPreviousView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);
  const [gradingResults, setGradingResults] = useState<GradingResult[] | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, any>>({});
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mrab_profile');
      return saved ? JSON.parse(saved) : { 
        department: Department.HUMANITIES,
        goals: { topicsMastered: 20, studyHours: 50, targetAccuracy: 80 }
      };
    } catch (e) {
      console.error("Failed to load user profile:", e);
      return { 
        department: Department.HUMANITIES,
        goals: { topicsMastered: 20, studyHours: 50, targetAccuracy: 80 }
      };
    }
  });

  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>(() => {
    try {
      const saved = localStorage.getItem('mrab_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load session history:", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mrab_profile', JSON.stringify(userProfile));
    } catch (e) {
      console.error("Failed to save user profile:", e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('mrab_history', JSON.stringify(sessionHistory));
    } catch (e) {
      console.error("Failed to save session history:", e);
      // If history is too large, trim it
      if (sessionHistory.length > 50) {
        setSessionHistory(prev => prev.slice(-50));
      }
    }
  }, [sessionHistory]);

  const navigateTo = (view: string) => {
    setPreviousView(activeView);
    setActiveView(view);
  };

  // Handle global navigation events (e.g. from Dashboard modules)
  useEffect(() => {
    const handleNav = (e: any) => navigateTo(e.detail);
    window.addEventListener('navigate', handleNav);
    return () => window.removeEventListener('navigate', handleNav);
  }, [activeView]);

  const startPractice = async (subject: Subject, chapter: string, type: QuestionType, count: number, language: Language) => {
    setIsLoading(true);
    try {
      let questions = [];
      if (type === 'MCQ') {
        const mcqs = await geminiService.generateMCQs(subject, chapter, count, language);
        // Case-insensitive filtering for safety
        questions = mcqs.filter(q => q.type?.toUpperCase() === 'MCQ').slice(0, count);
      } else if (type === 'ENGLISH') {
        const engQuestions = await geminiService.generateCQs(subject, chapter, count, language);
        questions = engQuestions.filter(q => q.type?.toUpperCase() === 'ENGLISH').slice(0, count);
      } else {
        const cqs = await geminiService.generateCQs(subject, chapter, count, language);
        questions = cqs.filter(q => q.type?.toUpperCase() === 'CQ' || (q as any).parts).slice(0, count);
      }

      if (questions.length > 0) {
        const newSession: ExamSession = {
          id: Math.random().toString(36).substring(7),
          subject,
          mode: 'Practice',
          startTime: Date.now(),
          questions,
          durationMinutes: type === 'MCQ' ? Math.max(5, count * 1) : 30,
          isCompleted: false,
          language
        };
        setActiveSession(newSession);
        setActiveView('active-exam');
      } else {
        alert("দুঃখিত, কোনো প্রশ্ন তৈরি করা সম্ভব হয়নি। দয়া করে আবার চেষ্টা করুন। (Failed to generate questions, please try again.)");
      }
    } catch (error) {
      console.error("Start Practice Error:", error);
      alert("একটি ত্রুটি হয়েছে। আপনার ইন্টারনেট সংযোগ যাচাই করে আবার চেষ্টা করুন।");
    } finally {
      setIsLoading(false);
    }
  };

  const startBoardExam = async (subject: Subject, language: Language) => {
    setIsLoading(true);
    try {
      const { mcqs, cqs } = await geminiService.generateFullExam(subject, language);
      const allQuestions = [...mcqs, ...cqs];

      if (allQuestions.length > 0) {
        const newSession: ExamSession = {
          id: Math.random().toString(36).substring(7),
          subject,
          mode: 'BOARD',
          startTime: Date.now(),
          questions: allQuestions,
          durationMinutes: 120,
          isCompleted: false,
          language
        };
        setActiveSession(newSession);
        setActiveView('active-exam');
      } else {
        alert("পরীক্ষার প্রশ্নপত্র লোড করা যায়নি।");
      }
    } catch (error) {
      console.error("Start Board Exam Error:", error);
      alert("ত্রুটি: বোর্ড প্রশ্নপত্র তৈরি করা সম্ভব হয়নি।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishExam = async (answers: Record<string, any>) => {
    if (!activeSession) return;
    setSessionAnswers(answers);
    setIsLoading(true);

    try {
      const gradingPromises = activeSession.questions.map(async (q) => {
        try {
          if (q.type === 'MCQ') {
            const isCorrect = answers[q.id] === q.correctOptionId;
            const fb = activeSession.language === 'bn' 
              ? (isCorrect ? 'অসাধারণ! ধারণাটি পরিষ্কার।' : `সঠিক উত্তর: ${q.options.find(o => o.id === q.correctOptionId)?.text}।`)
              : (isCorrect ? 'Excellent! Concept is clear.' : `Correct answer: ${q.options.find(o => o.id === q.correctOptionId)?.text}.`);
            
            return {
              questionId: q.id,
              obtainedMarks: isCorrect ? 1 : 0,
              maxMarks: 1,
              feedback: fb,
              status: isCorrect ? 'Correct' : 'Incorrect'
            } as GradingResult;
          } else {
            return await geminiService.gradeCQAnswer(q as any, answers[q.id] || {}, activeSession.language);
          }
        } catch (err) {
          console.error(`Error grading question ${q.id}:`, err);
          return {
            questionId: q.id,
            obtainedMarks: 0,
            maxMarks: q.type === 'MCQ' ? 1 : 10,
            feedback: "এই প্রশ্নটি মূল্যায়ন করার সময় একটি ত্রুটি হয়েছে। (Error during grading this question)",
            status: 'Incorrect'
          } as GradingResult;
        }
      });

      const results = await Promise.all(gradingPromises);

      const obtained = results.reduce((acc, r) => acc + r.obtainedMarks, 0);
      const total = results.reduce((acc, r) => acc + r.maxMarks, 0);
      const accuracy = Math.round((obtained / total) * 100) || 0;

      const historyEntry: SessionHistory = {
        sessionId: activeSession.id,
        subject: activeSession.subject,
        timestamp: Date.now(),
        score: obtained,
        totalMarks: total,
        accuracy: accuracy,
        durationMinutes: activeSession.durationMinutes,
        mode: activeSession.mode
      };

      setSessionHistory(prev => [...prev, historyEntry]);
      setGradingResults(results);
      setActiveView('results');
    } catch (error) {
      console.error("Grading Error:", error);
      alert("মূল্যায়ন করার সময় একটি সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoals = (newGoals: UserGoals) => {
    setUserProfile(prev => ({ ...prev, goals: newGoals }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            onStartPractice={() => navigateTo('practice')} 
            onGoToExams={() => navigateTo('exams')}
            profile={userProfile}
            history={sessionHistory}
            onUpdateGoals={handleUpdateGoals}
          />
        );
      case 'practice':
        return <PracticeView onStart={startPractice} onGoToHistory={() => navigateTo('exam-history')} isLoading={isLoading} />;
      case 'tutor':
        return <AITutorView />;
      case 'exams':
        return <ExamHubView onStartExam={startBoardExam} onGoToHistory={() => navigateTo('exam-history')} isLoading={isLoading} />;
      case 'analytics':
        // Reuse Dashboard for analytics or create a specific view if needed
        return (
          <Dashboard 
            onStartPractice={() => navigateTo('practice')} 
            onGoToExams={() => navigateTo('exams')}
            profile={userProfile}
            history={sessionHistory}
            onUpdateGoals={handleUpdateGoals}
          />
        );
      case 'exam-history':
        return (
          <ExamHistoryView 
            history={sessionHistory} 
            onBack={() => setActiveView(previousView)} 
          />
        );
      case 'active-exam':
        return activeSession ? (
          <ActiveExam session={activeSession} onFinish={handleFinishExam} isGrading={isLoading} />
        ) : null;
      case 'results':
        return activeSession && gradingResults ? (
          <ResultsView 
            questions={activeSession.questions} 
            answers={sessionAnswers}
            results={gradingResults}
            onBack={() => {
              setActiveView('dashboard');
              setActiveSession(null);
            }}
          />
        ) : null;
      default:
        return (
          <Dashboard 
            onStartPractice={() => setActiveView('practice')} 
            onGoToExams={() => setActiveView('exams')}
            profile={userProfile}
            history={sessionHistory}
            onUpdateGoals={handleUpdateGoals}
          />
        );
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={navigateTo}>
      {renderView()}
    </Layout>
  );
};

export default App;
