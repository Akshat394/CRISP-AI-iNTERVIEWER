# ✅ Configuration Checklist - Make This Project Yours

## 🔑 API Keys & Services Setup

### Google Gemini AI
- [ ] Sign up at [Google AI Studio](https://makersuite.google.com)
- [ ] Create new API key
- [ ] Copy key (starts with `AIza`)
- [ ] Add to `.env.local` as `NEXT_PUBLIC_GEMINI_API_KEY`

### Supabase Database
- [ ] Create account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Copy Project URL (format: `https://[project-id].supabase.co`)
- [ ] Copy anon key (starts with `eyJ`)
- [ ] Add both to `.env.local`
- [ ] Run database schema from `supabase-candidates-schema.sql`

## 📝 Environment Variables

Create `.env.local` file in root directory:

```env
# Required - Get from Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Required - Get from Google AI Studio
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

**Example completed file:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abc123def456.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiYzEyM2RlZjQ1NiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjI3MjA2ODAwLCJleHAiOjE5NDI3ODI4MDB9.your-actual-key-here
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSyYourActualGeminiKeyHere123456789
```

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables (see above)
cp env-example.txt .env.local
# Then edit .env.local with your keys

# 3. Set up database
# - Go to Supabase SQL Editor
# - Run contents of supabase-candidates-schema.sql

# 4. Start development server
npm run dev

# 5. Open in browser
# Visit: http://localhost:3000
```

## 🔍 Verification Steps

### Test Your Setup
1. **Homepage loads**: Navigate to `http://localhost:3000`
2. **Resume upload works**: Try uploading a PDF resume
3. **AI parsing works**: Check if candidate info is extracted
4. **Questions generate**: Start interview and see AI questions
5. **Database saves**: Check Supabase dashboard for data

### Common Issues to Check
- [ ] All environment variables are set correctly
- [ ] Supabase database schema is applied
- [ ] Gemini API key has billing enabled
- [ ] File uploads are working (PDF/DOCX only)
- [ ] Browser console shows no errors

## 🎯 Make It Your Own

### Customize Interview Questions
Edit `lib/ai-service.ts` to modify:
- Question generation prompts
- Scoring criteria
- Feedback generation
- Interview profiles (Full Stack vs React)

### Brand Customization
- Update `app/layout.tsx` for site title/meta
- Modify `components/ui/` for styling
- Change color scheme in `tailwind.config.js`
- Update logo in `public/` directory

### Add Features
- Authentication system
- Email notifications
- Advanced analytics
- Multiple interview tracks
- Integration with ATS systems

## 📊 Monitoring Your Setup

### Supabase Dashboard
- Check database usage
- Monitor API calls
- Review RLS policies
- Track storage usage

### Google AI Studio
- Monitor API usage
- Check quota limits
- Review model performance
- Manage billing

## 🔒 Security Checklist

- [ ] Environment variables not committed to git
- [ ] Supabase RLS policies enabled
- [ ] API keys rotated regularly
- [ ] Database access restricted
- [ ] File upload size limits set
- [ ] Rate limiting configured

## 🎉 Success Indicators

✅ **Working Setup:**
- Homepage loads without errors
- Resume upload processes PDFs
- AI extracts candidate information
- Interview questions generate
- Scores and feedback display
- Data persists in Supabase
- Both interviewer/interviewee views work

✅ **Ready for Production:**
- Environment variables secure
- Database properly configured
- Error handling implemented
- Performance optimized
- Monitoring in place

---

**Once all checkboxes are ticked, your Crisp Interview Assistant is ready to use! 🚀**