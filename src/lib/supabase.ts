import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      flashcard_sets: {
        Row: {
          id: string;
          user_id: string;
          grade: number;
          subject: string;
          topic: string;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          grade: number;
          subject: string;
          topic: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          grade?: number;
          subject?: string;
          topic?: string;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      flashcards: {
        Row: {
          id: string;
          flashcard_set_id: string;
          content: string;
          explanation: string | null;
          understood: boolean;
          needs_review: boolean;
          order_index: number;
          is_explanatory: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          flashcard_set_id: string;
          content: string;
          explanation?: string | null;
          understood?: boolean;
          needs_review?: boolean;
          order_index?: number;
          is_explanatory?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          flashcard_set_id?: string;
          content?: string;
          explanation?: string | null;
          understood?: boolean;
          needs_review?: boolean;
          order_index?: number;
          is_explanatory?: boolean;
          created_at?: string;
        };
      };
    };
  };
};