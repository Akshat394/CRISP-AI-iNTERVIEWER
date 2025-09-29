export enum UserRole {
  INTERVIEWER = 'interviewer',
  INTERVIEWEE = 'interviewee'
}

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
}

export interface ResumeData {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  skills?: string[];
  experience?: string[];
  education?: string[];
  rawText: string;
  fileName: string;
}

export interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
}

export interface Answer {
  questionId: string;
  text: string;
  timeSpent: number; // in seconds
  timestamp: number;
  score?: number;
  feedback?: string;
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  resumeData: ResumeData;
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  isCompleted: boolean;
  totalScore?: number;
  summary?: string;
  strengths?: string[];
  weaknesses?: string[];
  createdAt: number;
  completedAt?: number;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  sessions: InterviewSession[];
  averageScore?: number;
  totalSessions: number;
  lastInterviewDate?: number;
}

export interface AppState {
  auth: {
    user: User | null;
    isLoading: boolean;
    error: string | null;
  };
  interview: {
    currentSession: InterviewSession | null;
    isInterviewActive: boolean;
    isLoading: boolean;
    error: string | null;
  };
  candidates: {
    profiles: CandidateProfile[];
    isLoading: boolean;
    error: string | null;
  };
}

export interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
}
