# Crisp: AI-Powered Interview Assistant 🚀

**Swipe Internship Assignment Submission**

---

<p align="center">
  <img src="https://img.shields.io/badge/build-passing-brightgreen" />
  <img src="https://img.shields.io/badge/license-MIT-blue" />
  <img src="https://img.shields.io/badge/deployed-Vercel-black" />
</p>

---

## 🌟 Overview
Crisp is a next-generation AI-powered interview assistant designed to help candidates ace their interviews and empower interviewers with actionable insights. Built for the Swipe Internship Assessment, Crisp delivers a seamless, real-world interview experience with modern UI, robust data persistence, and advanced AI features.

---

## ✨ Features

### Interviewee (Chat)
- **Resume Upload:** Accepts PDF/DOCX, extracts Name, Email, Phone. Prompts for missing info before starting.
- **AI-Driven Interview:** 6 questions (2 Easy, 2 Medium, 2 Hard) generated for full-stack (React/Node) roles.
- **Timers:** Per-question timers (Easy: 20s, Medium: 60s, Hard: 120s) with auto-submit.
- **Progress Tracking:** Real-time feedback, answer evaluation, and final AI summary.
- **Pause/Resume:** "Welcome Back" modal restores unfinished sessions.

### Interviewer (Dashboard)
- **Candidate Leaderboard:** Sorted by score, with search and sort functionality.
- **Detailed Profiles:** View chat history, answers, scores, and AI summary for each candidate.
- **Live Sync:** Interviewee and Interviewer tabs stay in sync.

### Persistence & Reliability
- **Local Storage:** All progress, answers, and timers are saved locally (redux-persist/IndexedDB).
- **Session Recovery:** Refresh/close the app and resume exactly where you left off.

### UI/UX Excellence
- **Modern Design:** Responsive, clean, and intuitive UI using Ant Design and custom CSS.
- **Role Selection:** Animated slider for Interviewee/Interviewer, not just a button.
- **Error Handling:** Friendly messages for invalid files, missing fields, and edge cases.

---

## 🛠️ Tech Stack
- **Frontend:** React, Redux, Ant Design
- **Persistence:** redux-persist, IndexedDB
- **AI Integration:** OpenAI API (or similar)
- **Deployment:** Vercel/Netlify

---

## 🚀 Demo
- **Live Demo:** [crisp-ai.vercel.app](https://crisp-ai.vercel.app) *(replace with your actual link)*
- **Demo Video:** [Watch on YouTube](https://youtu.be/demo-link) *(replace with your actual link)*

---

## 📦 How to Run Locally
```bash
# Clone the repo
https://github.com/Akshat394/CRISP-AI-iNTERVIEWER.git
cd CRISP-AI-iNTERVIEWER

# Install dependencies
npm install

# Start the app
npm start
```

---

## 📝 Assessment Highlights
- **All requirements met:** Resume upload, missing field prompts, AI interview flow, dashboard, persistence, pause/resume, error handling, and more.
- **Extra polish:** Animated role slider, beautiful UI, instant feedback, and robust session recovery.
- **Real-world ready:** Designed for reliability, scalability, and a delightful user experience.

---

## 💡 Why Crisp Stands Out
- **User-centric:** Every detail is crafted for clarity, speed, and ease of use.
- **AI-first:** Smart question generation, answer evaluation, and summaries.
- **Persistence:** Never lose progress—refresh, close, and resume anytime.
- **Modern UI:** Looks and feels like a real product, not just a demo.
- **Code Quality:** Clean, modular, and well-documented.

---

## 📸 Screenshots

> Add screenshots here to showcase the UI and features. Example:
>
> ![Interviewee Chat](screenshots/interviewee-chat.png)
> ![Interviewer Dashboard](screenshots/interviewer-dashboard.png)

---

## 🙌 Author & Contact
- **Akshat394**
- [LinkedIn](https://www.linkedin.com/in/akshat-trived1/)
- [Email](mailto:akshattrivedi394@gmail.com)

---

## 📜 License
MIT