
export enum Subject {
  // General Subjects
  MATH = 'সাধারণ গণিত',
  BANGLA_1ST = 'বাংলা ১ম পত্র',
  BANGLA_2ND = 'বাংলা ২য় পত্র',
  ENGLISH_1ST = 'English 1st Paper',
  ENGLISH_2ND = 'English 2nd Paper',
  ICT = 'তথ্য ও যোগাযোগ প্রযুক্তি',
  RELIGION = 'ইসলাম ও নৈতিক শিক্ষা',
  
  // Humanities / Arts Subjects
  HISTORY = 'ইতিহাস ও বিশ্বসভ্যতা',
  GEOGRAPHY = 'ভূগোল ও পরিবেশ',
  CIVICS = 'পৌরনীতি ও নাগরিকতা',
  AGRICULTURE = 'কৃষি শিক্ষা',
  GENERAL_SCIENCE = 'সাধারণ বিজ্ঞান',

  // Science Subjects (Placeholders for future content)
  PHYSICS = 'পদার্থবিজ্ঞান',
  CHEMISTRY = 'রসায়ন',
  BIOLOGY = 'জীববিজ্ঞান',
  HIGHER_MATH = 'উচ্চতর গণিত',

  // Commerce Subjects (Placeholders for future content)
  ACCOUNTING = 'হিসাববিজ্ঞান',
  FINANCE = 'ফিন্যান্স ও ব্যাংকিং',
  BUSINESS_ENT = 'ব্যবসায় উদ্যোগ'
}

export enum Department {
  SCIENCE = 'Science (বিজ্ঞান)',
  HUMANITIES = 'Humanities (মানবিক)',
  COMMERCE = 'Business Studies (ব্যবসায় শিক্ষা)'
}

export interface UserGoals {
  topicsMastered: number;
  studyHours: number;
  targetAccuracy: number;
}

export interface UserProfile {
  department: Department | '';
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

export type QuestionType = 'MCQ' | 'CQ' | 'FULL' | 'ENGLISH';

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
    a: { question: string; marks: number; label: string; solution?: string };
    b: { question: string; marks: number; label: string; solution?: string };
    c: { question: string; marks: number; label: string; solution?: string };
    d: { question: string; marks: number; label: string; solution?: string };
  };
}

export interface EnglishItem {
  id: string;
  instruction: string;
  content: string;
  marks: number;
  type: string;
  solution?: string;
}

export interface EnglishQuestion {
  id: string;
  type: 'ENGLISH';
  chapter: string;
  passage?: string;
  items: EnglishItem[];
}

export type Question = MCQQuestion | CQQuestion | EnglishQuestion;

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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
  timestamp: number;
}

export interface TutorSession {
  id: string;
  subject: Subject;
  messages: ChatMessage[];
  lastActive: number;
}
