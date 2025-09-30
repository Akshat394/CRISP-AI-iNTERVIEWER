# 🔧 Supabase Database Setup - Fix for "relation does not exist" Error

## ❌ The Problem
The error `ERROR: 42P01: relation "candidates" does not exist` occurs when trying to enable Row Level Security (RLS) on a table that hasn't been created yet.

## ✅ The Solution
Run the SQL commands in the correct order: **CREATE TABLE first, then enable RLS.**

## 🚀 Quick Fix Options

### Option 1: Use the Corrected Schema (Recommended)
1. Open your Supabase dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-corrected-schema.sql`
4. Click **Run**

This file has the proper order of operations:
- **Creates the `users` table first** (needed for RLS policies)
- **Then creates the `candidates` table** (can reference users)
- **Applies RLS policies in correct order**

### Option 2: Run Commands Step by Step
If you prefer to run commands manually, follow this exact order:

#### Step 1: Create the candidates table
```sql
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
```

#### Step 2: Enable RLS (after table exists)
```sql
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
```

#### Step 3: Create indexes
```sql
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(status);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);
```

#### Step 4: Create RLS policies
```sql
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
```

#### Step 5: Create trigger function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Step 6: Create trigger
```sql
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Step 7: Create users table (optional)
```sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('interviewee', 'interviewer')) DEFAULT 'interviewee',
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id);
```

#### Step 8: Grant permissions
```sql
GRANT ALL ON candidates TO anon;
GRANT ALL ON candidates TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;
```

## 🎯 Verification Steps

After running the SQL successfully:

1. **Check tables exist**: 
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Verify RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE tablename IN ('candidates', 'users');
   ```

3. **Test with sample data**:
   ```sql
   INSERT INTO candidates (id, user_id, name, email, status) 
   VALUES ('test-1', 'user-1', 'Test Candidate', 'test@example.com', 'uploading');
   ```

## 🚀 Continue with Your Setup

Once the database schema is applied successfully:

1. **Add your API keys** to `.env.local` file
2. **Restart your development server** if needed
3. **Test the application** at http://localhost:3000
4. **Upload a resume** to verify everything works

## 📋 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "relation does not exist" | Create table before enabling RLS |
| "policy already exists" | Use `CREATE POLICY IF NOT EXISTS` or drop existing policies first |
| "permission denied" | Check GRANT statements and RLS policies |
| "function does not exist" | Create function before creating trigger |

---

**✅ After successful database setup, your Crisp Interview Assistant will be ready to use!**