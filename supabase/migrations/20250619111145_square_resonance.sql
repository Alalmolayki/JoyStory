/*
  # JoyStudy Database Schema

  1. New Tables
    - `flashcard_sets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `grade` (integer, 1-12)
      - `subject` (text)
      - `topic` (text)
      - `completed` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `flashcards`
      - `id` (uuid, primary key)
      - `flashcard_set_id` (uuid, references flashcard_sets)
      - `content` (text)
      - `explanation` (text, nullable)
      - `understood` (boolean, default false)
      - `needs_review` (boolean, default false)
      - `order_index` (integer)
      - `is_explanatory` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create flashcard_sets table
CREATE TABLE IF NOT EXISTS flashcard_sets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  grade integer NOT NULL CHECK (grade >= 1 AND grade <= 12),
  subject text NOT NULL,
  topic text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flashcard_set_id uuid REFERENCES flashcard_sets(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  explanation text,
  understood boolean DEFAULT false,
  needs_review boolean DEFAULT false,
  order_index integer NOT NULL DEFAULT 0,
  is_explanatory boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE flashcard_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;

-- Create policies for flashcard_sets
CREATE POLICY "Users can read own flashcard sets"
  ON flashcard_sets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own flashcard sets"
  ON flashcard_sets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard sets"
  ON flashcard_sets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flashcard sets"
  ON flashcard_sets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for flashcards
CREATE POLICY "Users can read own flashcards"
  ON flashcards
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets 
      WHERE flashcard_sets.id = flashcards.flashcard_set_id 
      AND flashcard_sets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create flashcards for own sets"
  ON flashcards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashcard_sets 
      WHERE flashcard_sets.id = flashcards.flashcard_set_id 
      AND flashcard_sets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own flashcards"
  ON flashcards
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets 
      WHERE flashcard_sets.id = flashcards.flashcard_set_id 
      AND flashcard_sets.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM flashcard_sets 
      WHERE flashcard_sets.id = flashcards.flashcard_set_id 
      AND flashcard_sets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own flashcards"
  ON flashcards
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM flashcard_sets 
      WHERE flashcard_sets.id = flashcards.flashcard_set_id 
      AND flashcard_sets.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX flashcard_sets_user_id_idx ON flashcard_sets(user_id);
CREATE INDEX flashcard_sets_created_at_idx ON flashcard_sets(created_at DESC);
CREATE INDEX flashcards_set_id_idx ON flashcards(flashcard_set_id);
CREATE INDEX flashcards_order_idx ON flashcards(flashcard_set_id, order_index);