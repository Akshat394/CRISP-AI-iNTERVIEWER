import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { InterviewSession, Question, Answer, ResumeData } from '../types';
import { aiService } from '../services/aiService';

interface InterviewState {
  currentSession: InterviewSession | null;
  isInterviewActive: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: InterviewState = {
  currentSession: null,
  isInterviewActive: false,
  isLoading: false,
  error: null,
};

export const startInterview = createAsyncThunk(
  'interview/startInterview',
  async ({ candidateId, resumeData }: { candidateId: string; resumeData: ResumeData }) => {
    const questions = await aiService.generateQuestions(resumeData);
    const session: InterviewSession = {
      id: Date.now().toString(),
      candidateId,
      resumeData,
      questions,
      answers: [],
      currentQuestionIndex: 0,
      isCompleted: false,
      createdAt: Date.now(),
    };
    return session;
  }
);

export const submitAnswer = createAsyncThunk(
  'interview/submitAnswer',
  async ({ questionId, answer, timeSpent }: { questionId: string; answer: string; timeSpent: number }) => {
    const timestamp = Date.now();
    const answerObj: Answer = {
      questionId,
      text: answer,
      timeSpent,
      timestamp,
    };
    return answerObj;
  }
);

export const evaluateAnswer = createAsyncThunk(
  'interview/evaluateAnswer',
  async ({ question, answer }: { question: Question; answer: Answer }) => {
    const evaluation = await aiService.evaluateAnswer(question, answer);
    return { questionId: answer.questionId, ...evaluation };
  }
);

export const completeInterview = createAsyncThunk(
  'interview/completeInterview',
  async (session: InterviewSession) => {
    const evaluation = await aiService.generateFinalEvaluation(session);
    return evaluation;
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCurrentSession: (state, action: PayloadAction<InterviewSession | null>) => {
      state.currentSession = action.payload;
      state.isInterviewActive = !!action.payload && !action.payload.isCompleted;
    },
    updateCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.currentQuestionIndex = action.payload;
      }
    },
    pauseInterview: (state) => {
      state.isInterviewActive = false;
    },
    resumeInterview: (state) => {
      if (state.currentSession && !state.currentSession.isCompleted) {
        state.isInterviewActive = true;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    resetInterview: (state) => {
      state.currentSession = null;
      state.isInterviewActive = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Interview
      .addCase(startInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSession = action.payload;
        state.isInterviewActive = true;
        state.error = null;
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start interview';
      })
      // Submit Answer
      .addCase(submitAnswer.fulfilled, (state, action) => {
        if (state.currentSession) {
          state.currentSession.answers.push(action.payload);
          state.currentSession.currentQuestionIndex += 1;
        }
      })
      // Evaluate Answer
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        if (state.currentSession) {
          const answerIndex = state.currentSession.answers.findIndex(
            (answer) => answer.questionId === action.payload.questionId
          );
          if (answerIndex !== -1) {
            state.currentSession.answers[answerIndex].score = action.payload.score;
            state.currentSession.answers[answerIndex].feedback = action.payload.feedback;
          }
        }
      })
      // Complete Interview
      .addCase(completeInterview.fulfilled, (state, action) => {
        if (state.currentSession) {
          state.currentSession.isCompleted = true;
          state.currentSession.completedAt = Date.now();
          state.currentSession.totalScore = action.payload.totalScore;
          state.currentSession.summary = action.payload.summary;
          state.currentSession.strengths = action.payload.strengths;
          state.currentSession.weaknesses = action.payload.weaknesses;
          state.isInterviewActive = false;
        }
      });
  },
});

export const {
  setCurrentSession,
  updateCurrentQuestionIndex,
  pauseInterview,
  resumeInterview,
  clearError,
  resetInterview,
} = interviewSlice.actions;
export default interviewSlice.reducer;
