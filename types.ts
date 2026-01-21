
export enum Subject {
  // Science
  PHYSICS = 'পদার্থবিজ্ঞান',
  CHEMISTRY = 'রসায়ন',
  BIOLOGY = 'জীববিজ্ঞান',
  HIGHER_MATH = 'উচ্চতর গণিত',
  
  // Humanities / Arts (Economics removed)
  HISTORY = 'ইতিহাস ও বিশ্বসভ্যতা',
  GEOGRAPHY = 'ভূগোল ও পরিবেশ',
  CIVICS = 'পৌরনীতি ও নাগরিকতা',

  // General / Compulsory
  MATH = 'সাধারণ গণিত',
  GENERAL_SCIENCE = 'সাধারণ বিজ্ঞান',
  ICT = 'তথ্য ও যোগাযোগ প্রযুক্তি',
  BGS = 'বাংলাদেশ ও বিশ্বপরিচয়',
  RELIGION = 'ইসলাম ও নৈতিক শিক্ষা',
  ENGLISH_1ST = 'English 1st Paper',
  ENGLISH_2ND = 'English 2nd Paper',
  BANGLA_1ST = 'বাংলা ১ম পত্র',
  BANGLA_2ND = 'বাংলা ২য় পত্র'
}

export enum Bibhag {
  SCIENCE = 'বিজ্ঞান',
  HUMANITIES = 'মানবিক',
  COMMERCE = 'ব্যবসায় শিক্ষা'
}

export interface UserGoals {
  topicsMastered: number;
  studyHours: number;
  targetAccuracy: number;
}

export interface UserProfile {
  name: string;
  age: string;
  bibhag: Bibhag;
  goals: UserGoals;
}

export type Language = 'bn' | 'en';

export interface SyllabusItem {
  id: string;
  subject: Subject;
  chapterNumber: number;
  chapterTitle: string;
  topics: string[];
}

export type QuestionType = 'MCQ' | 'CQ' | 'FULL';

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  type: 'MCQ';
  chapter: string;
  question: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CQQuestion {
  id: string;
  type: 'CQ';
  chapter: string;
  stem: string;
  parts: {
    a: { question: string; marks: number; label: string };
    b: { question: string; marks: number; label: string };
    c: { question: string; marks: number; label: string };
    d: { question: string; marks: number; label: string };
  };
}

export type Question = MCQQuestion | CQQuestion;

export interface ExamSession {
  id: string;
  subject: Subject;
  mode: 'Practice' | 'Exam' | 'BOARD';
  startTime: number;
  questions: Question[];
  durationMinutes: number;
  isCompleted: boolean;
  language: Language;
}

export interface GradingResult {
  questionId: string;
  obtainedMarks: number;
  maxMarks: number;
  feedback: string;
  status: 'Correct' | 'Partial' | 'Incorrect';
}

export interface SessionHistory {
  sessionId: string;
  subject: Subject;
  timestamp: number;
  score: number;
  totalMarks: number;
  accuracy: number;
  durationMinutes: number;
  mode: 'Practice' | 'Exam' | 'BOARD';
}
