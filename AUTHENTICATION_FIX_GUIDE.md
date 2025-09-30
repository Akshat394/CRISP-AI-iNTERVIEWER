# 🔧 Authentication Fix Guide

## Current Issues Identified:

1. **Missing `.env.local` file** - ✅ **FIXED** (created for you)
2. **Missing `password_hash` column** - ✅ **FIXED** (updated schema)
3. **Supabase authentication not configured** - ⚠️ **NEEDS YOUR ACTION**

## 🚀 Quick Fix Steps:

### Step 1: Update Your Database Schema
**Run this updated schema in Supabase SQL Editor:**

```sql
-- Add password_hash column to existing users table (if you already ran the schema)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Or run the complete corrected schema from supabase-corrected-schema.sql
```

### Step 2: Configure Your API Keys
**Edit `.env.local` file with your actual keys:**

```bash
# Open the file and replace placeholders:
nano .env.local

# Or use any text editor to edit:
# NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_key
# NEXT_PUBLIC_GEMINI_API_KEY=your_actual_gemini_key
```

### Step 3: Get Your Supabase Credentials
1. **Go to [supabase.com](https://supabase.com)**
2. **Create a new project** or use existing
3. **Find your Project URL:**
   - Go to Project Settings → API
   - Copy "Project URL"
4. **Find your Anon Key:**
   - Same page, copy "anon public" key

### Step 4: Get Your Gemini API Key
1. **Go to [Google AI Studio](https://makersuite.google.com)**
2. **Create API key**
3. **Copy the key**

### Step 5: Test Authentication
**After updating `.env.local`, test the app:**

1. **Restart the dev server:**
   ```bash
   npm run dev
   ```

2. **Try signing up:**
   - Go to http://localhost:3000/signup
   - Create a test account

3. **Try signing in:**
   - Go to http://localhost:3000/signin
   - Use your new account

## 🛠️ Common Issues & Solutions:

### Error: "relation \"users\" does not exist"
**Solution:** Run the corrected schema from `supabase-corrected-schema.sql`

### Error: "column \"password_hash\" does not exist"
**Solution:** Run this SQL:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;
```

### Error: "401 Unauthorized" on signin
**Solution:** Check your `.env.local` file has correct Supabase credentials

### Error: "500 Internal Server Error" on signup
**Solution:** Ensure database schema is properly set up with all required columns

## ✅ Verification Checklist:

- [ ] `.env.local` file exists with real API keys
- [ ] Supabase project created and running
- [ ] Database schema updated with `password_hash` column
- [ ] Users table has all required columns
- [ ] Can successfully sign up new users
- [ ] Can successfully sign in existing users

## 🎯 Next Steps After Authentication Works:

1. **Test the interview functionality**
2. **Upload a resume and see AI parsing**
3. **Start an interview session**
4. **Configure your interview questions**

**Need help?** The development server is running at `http://localhost:3000` - just update those API keys and you'll be ready to go!