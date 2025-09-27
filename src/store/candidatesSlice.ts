import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateProfile, InterviewSession } from '../types';

interface CandidatesState {
  profiles: CandidateProfile[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CandidatesState = {
  profiles: [],
  isLoading: false,
  error: null,
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidateProfile: (state, action: PayloadAction<CandidateProfile>) => {
      const existingIndex = state.profiles.findIndex(
        (profile) => profile.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.profiles[existingIndex] = action.payload;
      } else {
        state.profiles.push(action.payload);
      }
    },
    updateCandidateProfile: (state, action: PayloadAction<{ id: string; updates: Partial<CandidateProfile> }>) => {
      const index = state.profiles.findIndex((profile) => profile.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = { ...state.profiles[index], ...action.payload.updates };
      }
    },
    addInterviewSession: (state, action: PayloadAction<{ candidateId: string; session: InterviewSession }>) => {
      const { candidateId, session } = action.payload;
      const candidateIndex = state.profiles.findIndex((profile) => profile.id === candidateId);
      
      if (candidateIndex !== -1) {
        const candidate = state.profiles[candidateIndex];
        candidate.sessions.push(session);
        candidate.totalSessions = candidate.sessions.length;
        candidate.lastInterviewDate = session.completedAt || session.createdAt;
        
        // Calculate average score
        const completedSessions = candidate.sessions.filter(s => s.totalScore !== undefined);
        if (completedSessions.length > 0) {
          const totalScore = completedSessions.reduce((sum, s) => sum + (s.totalScore || 0), 0);
          candidate.averageScore = totalScore / completedSessions.length;
        }
      }
    },
    removeCandidateProfile: (state, action: PayloadAction<string>) => {
      state.profiles = state.profiles.filter((profile) => profile.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  addCandidateProfile,
  updateCandidateProfile,
  addInterviewSession,
  removeCandidateProfile,
  setLoading,
  setError,
  clearError,
} = candidatesSlice.actions;
export default candidatesSlice.reducer;
