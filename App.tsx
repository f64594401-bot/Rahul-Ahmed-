
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import PracticeView from './views/PracticeView';
import ActiveExam from './views/ActiveExam';
import ResultsView from './views/ResultsView';
import SettingsView from './views/SettingsView';
import ExamHubView from './views/ExamHubView';
import { geminiService } from './services/geminiService';
import { Subject, QuestionType, ExamSession, GradingResult, Language, UserProfile, Bibhag, SessionHistory, UserGoals } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSession, setActiveSession] = useState<ExamSession | null>(null);
  const [gradingResults, setGradingResults] = useState<GradingResult[] | null>(null);
  const [sessionAnswers, setSessionAnswers] = useState<Record<string, any>>({});
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mrab_profile');
    return saved ? JSON.parse(saved) : { 
      name: '', 
      age: '', 
      bibhag: Bibhag.SCIENCE,
      goals: { topicsMastered: 20, studyHours: 50, targetAccuracy: 80 }
    };
  });

  const [sessionHistory, setSessionHistory] = useState<SessionHistory[]>(() => {
    const saved = localStorage.getItem('mrab_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mrab_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('mrab_history', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  const startPractice = async (subject: Subject, chapter: string, type: QuestionType, count: number, language: Language) => {
    setIsLoading(true);
    try {
      let questions = [];
      if (type === 'MCQ') {
        questions = await geminiService.generateMCQs(subject, chapter, count, language);
      } else {
        const cq = await geminiService.generateCQ(subject, chapter, language);
        if (cq) questions = [cq];
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
      }
    } catch (error) {
      console.error("Start Practice Error:", error);
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
          durationMinutes: 120, // 2 hours for board mock
          isCompleted: false,
          language
        };
        setActiveSession(newSession);
        setActiveView('active-exam');
      }
    } catch (error) {
      console.error("Start Board Exam Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinishExam = async (answers: Record<string, any>) => {
    if (!activeSession) return;
    setSessionAnswers(answers);
    setIsLoading(true);

    try {
      const results: GradingResult[] = [];
      for (const q of activeSession.questions) {
        if (q.type === 'MCQ') {
          const isCorrect = answers[q.id] === q.correctOptionId;
          const fb = activeSession.language === 'bn' 
            ? (isCorrect ? 'অসাধারণ! ধারণাটি পরিষ্কার।' : `সঠিক উত্তর: ${q.options.find(o => o.id === q.correctOptionId)?.text}।`)
            : (isCorrect ? 'Excellent! Concept is clear.' : `Correct answer: ${q.options.find(o => o.id === q.correctOptionId)?.text}.`);
          
          results.push({
            questionId: q.id,
            obtainedMarks: isCorrect ? 1 : 0,
            maxMarks: 1,
            feedback: fb,
            status: isCorrect ? 'Correct' : 'Incorrect'
          });
        } else {
          const cqResult = await geminiService.gradeCQAnswer(q, answers[q.id] || {}, activeSession.language);
          results.push(...cqResult);
        }
      }

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
            onStartPractice={() => setActiveView('practice')} 
            // Fix: Adding required onGoToExams prop to Dashboard
            onGoToExams={() => setActiveView('exams')}
            profile={userProfile}
            history={sessionHistory}
            onUpdateGoals={handleUpdateGoals}
          />
        );
      case 'practice':
        return <PracticeView onStart={startPractice} isLoading={isLoading} />;
      case 'exams':
        return <ExamHubView onStartExam={startBoardExam} isLoading={isLoading} />;
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
      case 'settings':
        return <SettingsView profile={userProfile} onSave={setUserProfile} />;
      default:
        return (
          <Dashboard 
            onStartPractice={() => setActiveView('practice')} 
            // Fix: Adding required onGoToExams prop to Dashboard in default case
            onGoToExams={() => setActiveView('exams')}
            profile={userProfile}
            history={sessionHistory}
            onUpdateGoals={handleUpdateGoals}
          />
        );
    }
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView} userName={userProfile.name}>
      {renderView()}
    </Layout>
  );
};

export default App;
