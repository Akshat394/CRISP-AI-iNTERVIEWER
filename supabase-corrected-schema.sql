-- Supabase Database Schema for Crisp Interview Assistant - CORRECTED VERSION
-- Run this SQL in your Supabase SQL Editor
-- This version fixes the table creation order issue

-- Step 1: Create users table first (needed for RLS policies)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK (role IN ('interviewee', 'interviewer')) DEFAULT 'interviewee',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Step 4: Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger for automatic timestamp updates on users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Create the candidates table
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

-- Step 7: Now enable RLS on candidates (after table exists)
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- Step 9: Create Row Level Security Policies for candidates
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

-- Step 10: Create trigger for automatic timestamp updates on candidates
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 11: Grant permissions
GRANT ALL ON candidates TO anon;
GRANT ALL ON candidates TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;

-- Optional: Insert test data
-- INSERT INTO users (id, email, name, role) VALUES 
--   ('test-interviewer-1', 'interviewer@example.com', 'Test Interviewer', 'interviewer'),
--   ('test-interviewee-1', 'interviewee@example.com', 'Test Interviewee', 'interviewee');

-- Success message
SELECT 'Database schema created successfully!' as status;