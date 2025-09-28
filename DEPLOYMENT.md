# 🚀 Vercel Deployment Guide for Crisp AI

## Prerequisites
- GitHub repository with your code
- Vercel account (free tier available)
- Gemini API key

## Step 1: Prepare Your Repository

### 1.1 Ensure all files are committed
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify build works locally
```bash
npm run build
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy from your project directory**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? **Yes**
   - Which scope? **Your account**
   - Link to existing project? **No**
   - Project name: **crisp-ai** (or your preferred name)
   - Directory: **./** (current directory)
   - Override settings? **No**

### Option B: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

## Step 3: Configure Environment Variables

### 3.1 In Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `GEMINI_API_KEY` | `AIzaSyCuWz8Oc5dnEFncJySzvOehTiNsNQHLxuw` | Production, Preview, Development |

### 3.2 Or via CLI:
```bash
vercel env add VITE_GEMINI_API_KEY
# Enter your API key when prompted
```

## Step 4: Configure Firebase (if using authentication)

### 4.1 Update Firebase config for production:
1. Go to Firebase Console
2. Add your Vercel domain to authorized domains
3. Update `src/services/firebase.ts` if needed

## Step 5: Redeploy

After setting environment variables:
```bash
vercel --prod
```

## Step 6: Verify Deployment

1. **Check the deployment URL**
2. **Test all features:**
   - Resume upload (PDF/DOCX)
   - AI question generation
   - Interview flow
   - Data persistence
   - Both tabs (Interviewee/Interviewer)

## Troubleshooting

### Common Issues:

1. **Build fails**: Check `npm run build` locally first
2. **Environment variables not working**: Ensure they start with `VITE_`
3. **PDF.js worker issues**: The worker file is in `/public/pdfjs/`
4. **Routing issues**: Vercel config handles SPA routing

### Debug Commands:
```bash
# Check build locally
npm run build
npm run preview

# Check Vercel deployment
vercel logs
vercel inspect
```

## Production URLs

After deployment, you'll get:
- **Production URL**: `https://your-project-name.vercel.app`
- **Preview URLs**: For each commit/PR

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Gemini API key | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase API key (if using auth) | Optional |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Optional |

## Performance Optimizations

The app is already optimized for Vercel:
- ✅ Static build output
- ✅ SPA routing configured
- ✅ Environment variables properly prefixed
- ✅ PDF.js worker in public directory
- ✅ Responsive design
- ✅ Modern build tools (Vite)

## Monitoring

- Check Vercel dashboard for:
  - Build logs
  - Function logs
  - Performance metrics
  - Analytics

Your app should be live at: `https://your-project-name.vercel.app` 🎉
