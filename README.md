# Crisp AI - AI-Powered Interview Assistant

A modern, AI-powered interview assistant built with React, TypeScript, and Redux. This application provides a comprehensive platform for conducting mock interviews with AI-generated questions and real-time evaluation.

## Features

### For Candidates (Interviewees)
- **Resume Upload & Parsing**: Upload PDF or DOCX resumes with automatic text extraction
- **AI-Generated Questions**: Personalized interview questions based on resume content
- **Real-time Chat Interface**: Interactive chat-based interview experience
- **Timer Management**: Automatic timing for each question (Easy: 30s, Medium: 90s, Hard: 180s)
- **Progress Tracking**: Visual progress indicator and question counter
- **Session Persistence**: Resume interviews after page reload or interruption
- **Instant Feedback**: Real-time AI evaluation of answers with scores and feedback
- **Comprehensive Results**: Final score, summary, strengths, and areas for improvement

### For Interviewers
- **Candidate Dashboard**: View all candidate profiles and interview sessions
- **Performance Metrics**: Statistics including total candidates, interviews, and average scores
- **Detailed Analytics**: Individual candidate performance with session history
- **Search & Filter**: Find candidates by name or email
- **Session Review**: Complete interview transcripts with Q&A pairs and scores
- **Export Capabilities**: View detailed interview results and feedback

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Framework**: Ant Design (Antd) for enterprise-grade components
- **Authentication**: Firebase Authentication
- **File Processing**: PDF.js for PDF parsing, Mammoth.js for DOCX parsing
- **AI Integration**: Google Gemini Pro for question generation and evaluation
- **Build Tool**: Vite for fast development and building
- **Styling**: CSS with Ant Design theming

## Getting Started

### Prerequisites

- Node.js (version 20.19+ or 22.12+)
- npm or yarn
- Firebase project
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crisp-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual values:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id

   # Google Gemini Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication with Email/Password provider
   - Copy your Firebase config values to `.env`

5. **Get Google Gemini API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Get API Key" and create a new key
   - Copy the API key and add it to `.env`

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### For Candidates

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Upload Resume**: Upload your PDF or DOCX resume
3. **Review Information**: Check extracted information (name, email, phone)
4. **Start Interview**: Begin the AI-powered interview
5. **Answer Questions**: Respond to 6 questions (2 easy, 2 medium, 2 hard)
6. **View Results**: Review your score, feedback, and areas for improvement

### For Interviewers

1. **Access Dashboard**: Switch to interviewer view from the header
2. **View Candidates**: Browse all candidate profiles and sessions
3. **Search & Filter**: Use search functionality to find specific candidates
4. **Review Sessions**: Click on candidates to view detailed interview sessions
5. **Analyze Performance**: Review Q&A pairs, scores, and AI feedback

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── InterviewChat.tsx
│   ├── ResumeUpload.tsx
│   ├── ProtectedRoute.tsx
│   └── LoadingSpinner.tsx
├── pages/              # Main application pages
│   ├── AuthPage.tsx
│   ├── IntervieweePage.tsx
│   └── InterviewerPage.tsx
├── store/              # Redux store and slices
│   ├── index.ts
│   ├── authSlice.ts
│   ├── interviewSlice.ts
│   └── candidatesSlice.ts
├── services/           # API and external service integrations
│   ├── firebase.ts
│   ├── authService.ts
│   ├── resumeParser.ts
│   └── aiService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── hooks/              # Custom React hooks
│   └── redux.ts
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## Key Features Implementation

### Resume Parsing
- **PDF Processing**: Uses Mozilla PDF.js for client-side PDF text extraction
- **DOCX Processing**: Uses Mammoth.js for DOCX file parsing
- **Data Extraction**: Implements regex patterns and heuristics to extract name, email, and phone
- **Error Handling**: Graceful handling of parsing errors with user-friendly messages

### AI Integration
- **Question Generation**: Generates personalized questions based on resume content
- **Answer Evaluation**: Real-time scoring and feedback for each answer
- **Final Assessment**: Comprehensive evaluation with strengths and weaknesses
- **Fallback System**: Fallback questions and evaluations if AI service is unavailable

### State Persistence
- **Redux Persist**: Automatically saves state to localStorage
- **Session Recovery**: Resumes interrupted interviews on page reload
- **Data Integrity**: Ensures all candidate data and progress is preserved

### Responsive Design
- **Mobile-First**: Responsive design that works on all device sizes
- **Enterprise UI**: Professional appearance using Ant Design components
- **Accessibility**: WCAG-compliant interface with proper contrast and navigation

## Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Set Environment Variables**: Add all environment variables in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

### Netlify

1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: 
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add all environment variables in Netlify dashboard
4. **Deploy**: Automatic deployment on every push to main branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@crisp-ai.com or create an issue in the repository.

## Acknowledgments

- [Ant Design](https://ant.design/) for the beautiful UI components
- [Firebase](https://firebase.google.com/) for authentication services
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF processing
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) for DOCX processing