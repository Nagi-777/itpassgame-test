export interface Question {
  id: string;
  chapter: string;
  keyword: string;
  question: string;
  choices: string[];
  answer: string;
  explanation: string;
  termExplanations: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface TestRecord {
  date: string;
  chapter: string;
  score: number;
  total: number;
}

export interface AppData {
  testHistory: TestRecord[];
  reviewQueue: string[];
}

export type Screen = 'home' | 'quiz' | 'result';

export interface QuizConfig {
  mode: 'chapter' | 'review';
  chapter: string; // 'all' or specific chapter id; ignored in review mode
}

export interface QuizResult {
  score: number;
  total: number;
  chapterLabel: string;
  wrongIds: string[];
}
