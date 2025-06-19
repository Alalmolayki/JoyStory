export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface FlashcardSet {
  id: string;
  user_id: string;
  grade: number;
  subject: string;
  topic: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Flashcard {
  id: string;
  flashcard_set_id: string;
  content: string;
  explanation: string | null;
  understood: boolean;
  needs_review: boolean;
  order_index: number;
  is_explanatory: boolean;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface StudySession {
  flashcardSet: FlashcardSet;
  flashcards: Flashcard[];
  currentCardIndex: number;
  reviewCards: Flashcard[];
  isComplete: boolean;
}

export const SUBJECTS = [
  'Matematik',
  'Fen Bilimleri',
  'Türkçe',
  'Sosyal Bilgiler',
  'Tarih',
  'Coğrafya',
  'Biyoloji',
  'Kimya',
  'Fizik',
  'Edebiyat',
  'Resim',
  'Müzik',
  'Beden Eğitimi',
  'Bilgisayar Bilimleri',
  'Yabancı Dil'
] as const;

export type Subject = typeof SUBJECTS[number];

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);