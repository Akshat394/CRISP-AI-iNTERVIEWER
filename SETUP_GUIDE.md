# 🚀 Crisp Interview Assistant - Complete Setup Guide

## Overview
This is your AI-powered interview platform that automates candidate evaluation with personalized technical interviews, real-time scoring, and comprehensive feedback.

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **Package Manager**: npm, pnpm, or yarn
- **Supabase Account**: Free tier works perfectly
- **Google Gemini API Key**: Get from Google AI Studio
- **Git**: For version control

## 🛠️ Step-by-Step Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd crisp-interview-assistant

# Install dependencies
npm install
# or
pnpm install
```

### 2. Supabase Setup

#### Create Your Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in:
   - **Project Name**: `crisp-interview-assistant`
   - **Database Password**: Save this securely
   - **Region**: Choose closest to you

#### Get Your Supabase Credentials
1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon** key (starts with `eyJ`)

#### Set Up Database Schema
1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-candidates-schema.sql`
4. Click **Run** to execute the schema

### 3. Google Gemini AI Setup

#### Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Sign in with your Google account
3. Click **Get API Key**
4. Click **Create API Key** → **Generate API Key**
5. Copy your API key (starts with `AIza`)

### 4. Environment Configuration

#### Create Environment File
```bash
# Copy the example file
cp env-example.txt .env.local
```

#### Fill in Your Credentials
Edit `.env.local` with your actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
NEXT_PUBLIC_GEMINI_API_KEY=your-actual-gemini-key-here
```

**Example of completed file:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjI3MjA2ODAwLCJleHAiOjE5NDI3ODI4MDB9.your-actual-key
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyYourActualGeminiKeyHere123456789
```

### 5. Start Development Server

```bash
# Start the development server
npm run dev
# or
pnpm dev
```

Your app will be available at: **http://localhost:3000**

## 🎯 How to Use Your Platform

### For Interviewees (Candidates)

1. **Upload Resume**: Drag & drop PDF/DOCX files
2. **Complete Profile**: Fill in any missing information
3. **Choose Track**: 
   - Full Stack Node.js Developer
   - React Frontend Developer
4. **Take Interview**: Answer 6 AI-generated questions
5. **Get Results**: Instant scoring and detailed feedback

### For Interviewers (You)

1. **Dashboard**: View all candidates and their progress
2. **Analytics**: Track scores and interview history
3. **Candidate Details**: Full interview transcripts and scores
4. **Export Data**: Download candidate information

## 🔧 Configuration Options

### Interview Profiles

The platform supports two interview tracks:

#### Full Stack Node.js Track
- Backend: Node.js, Express, MongoDB/PostgreSQL
- Frontend: React, State Management
- DevOps: Docker, CI/CD basics
- System Design: Scalability concepts

#### React Frontend Track
- React Core: Hooks, Context, Performance
- State Management: Redux, Zustand
- UI/UX: Component libraries, Accessibility
- Testing: Unit testing, E2E concepts

### Question Difficulty Levels

- **Easy (90-120s)**: Basic concepts and definitions
- **Medium (180-240s)**: Practical problem-solving
- **Hard (300-360s)**: Complex scenarios and architecture

## 🚀 Deployment Options

### Option 1: Netlify (Recommended)
1. Push code to GitHub
2. Connect repository to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy automatically

### Option 2: Netlify
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

### Option 3: Self-Hosted
1. Build: `npm run build`
2. Start: `npm start`
3. Use PM2 or similar for process management

## 🔒 Security Features

- **Row Level Security**: Candidates only see their data
- **API Key Protection**: All keys are environment variables
- **Input Validation**: Zod schemas for all data
- **Rate Limiting**: Built-in protection
- **Secure File Upload**: PDF parsing without server storage

## 📊 Database Schema Overview

### Candidates Table
- Personal information (name, email, phone)
- Resume text and parsing results
- Interview questions and answers
- Scoring and feedback data
- Session history and analytics

### Users Table (Optional)
- Authentication integration
- Role-based access control
- User management

## 🛠️ Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"
- Ensure `.env.local` file exists
- Check variable names match exactly
- Restart development server

#### "Failed to parse PDF"
- Check file format (PDF/DOCX only)
- Ensure file size < 10MB
- Try different PDF file

#### "Gemini API key invalid"
- Verify key is correct in Google AI Studio
- Check billing is enabled on Google Cloud
- Ensure API quotas aren't exceeded

#### Database connection issues
- Verify Supabase URL and anon key
- Check network connectivity
- Ensure RLS policies are set up correctly

### Getting Help

1. **Check Console**: Open browser dev tools for errors
2. **Supabase Logs**: Check SQL Editor logs in dashboard
3. **Network Tab**: Verify API calls are successful
4. **Environment**: Double-check all .env.local values

## 🎉 Next Steps

1. **Customize Questions**: Modify AI prompts in `lib/ai-service.ts`
2. **Add New Tracks**: Create additional interview profiles
3. **Integrate Auth**: Add proper authentication system
4. **Analytics**: Add more detailed reporting
5. **Mobile App**: Consider React Native version

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review the README.md file
3. Check browser console for errors
4. Verify all environment variables

---

**🚀 Happy Interviewing! Your AI-powered interview platform is ready to use!**