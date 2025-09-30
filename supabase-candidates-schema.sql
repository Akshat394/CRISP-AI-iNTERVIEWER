-- Supabase Database Schema for Crisp Interview Assistant
-- Run this SQL in your Supabase SQL Editor

-- Create candidates table if it doesn't exist
CREATE TABLE IF NOT EXISTS candidates (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_text TEXT,
  status TEXT CHECK (status IN ('uploading', 'info-collection', 'interviewing', 'completed', 'paused')) DEFAULT 'uploading',
  current_question INTEGER DEFAULT 0,
  questions JSONB DEFAULT '[]'::jsonb,
  answers JSONB DEFAULT '[]'::jsonb,
  score INTEGER DEFAULT 0,
  summary TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  time_remaining INTEGER,
  last_active_time TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  profile TEXT CHECK (profile IN ('fullstack-node', 'react')),
  skills JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  education JSONB DEFAULT '[]'::jsonb,
  missing_info JSONB DEFAULT '[]'::jsonb,
  interview_history JSONB DEFAULT '[]'::jsonb,
  total_interviews INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  average_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on the candidates table
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- Row Level Security Policies
-- Users can only see their own candidates (unless they're interviewers)
CREATE POLICY "Users can view own candidates" ON candidates
  FOR SELECT USING (
    auth.uid()::text = user_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid()::text AND role = 'interviewer'
    )
  );

-- Users can insert their own candidates
CREATE POLICY "Users can insert own candidates" ON candidates
  FOR INSERT WITH CHECK (
    auth.uid()::text = user_id
  );

-- Users can update their own candidates
CREATE POLICY "Users can update own candidates" ON candidates
  FOR UPDATE USING (
    auth.uid()::text = user_id
  );

-- Users can delete their own candidates
CREATE POLICY "Users can delete own candidates" ON candidates
  FOR DELETE USING (
    auth.uid()::text = user_id
  );

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create users table for authentication (if using Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('interviewee', 'interviewer')) DEFAULT 'interviewee',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table (only after table exists)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own user record
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Insert some sample data for testing (optional)
-- INSERT INTO users (id, email, name, role) VALUES 
--   ('test-interviewer-1', 'interviewer@example.com', 'Test Interviewer', 'interviewer'),
--   ('test-interviewee-1', 'interviewee@example.com', 'Test Interviewee', 'interviewee');

-- Grant necessary permissions (adjust based on your Supabase setup)
GRANT ALL ON candidates TO anon;
GRANT ALL ON candidates TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;