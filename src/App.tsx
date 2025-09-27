import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { store, persistor } from './store';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuthState } from './store/authSlice';

// Configure PDF.js early
import './config/pdfjs';

import AuthPage from './pages/AuthPage';
import IntervieweePage from './pages/IntervieweePage';
import InterviewerPage from './pages/InterviewerPage.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import LoadingSpinner from './components/LoadingSpinner.js';

import 'antd/dist/reset.css';
import './App.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <AntApp>
          <div className="app">
            <Routes>
              <Route
                path="/auth"
                element={user ? <Navigate to="/interviewee" replace /> : <AuthPage />}
              />
              <Route
                path="/interviewee"
                element={
                  <ProtectedRoute>
                    <IntervieweePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/interviewer"
                element={
                  <ProtectedRoute>
                    <InterviewerPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  user ? (
                    <Navigate to="/interviewee" replace />
                  ) : (
                    <Navigate to="/auth" replace />
                  )
                }
              />
            </Routes>
          </div>
        </AntApp>
      </ConfigProvider>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

export default App;