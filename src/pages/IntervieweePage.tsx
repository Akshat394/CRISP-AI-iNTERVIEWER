import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { Layout, Typography, Button, Space, Card, Alert, App, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, PlayCircleOutlined, RocketOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './IntervieweePage.css';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signOut } from '../store/authSlice';
import { 
  startInterview, 
  submitAnswer, 
  evaluateAnswer, 
  completeInterview,
  resumeInterview,
  resetInterview 
} from '../store/interviewSlice';
import { addInterviewSession, addCandidateProfile } from '../store/candidatesSlice';
import { ResumeData } from '../types';
import { checkGeminiApiKey } from '../utils/aiConfig';

import ResumeUpload from '../components/ResumeUpload';
import InterviewChat from '../components/InterviewChat';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const IntervieweePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { currentSession, isInterviewActive, isLoading } = useAppSelector((state) => state.interview);
  const { message } = App.useApp();
  
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [showAnswersModal, setShowAnswersModal] = useState(false);
  const handleShowAnswersModal = () => setShowAnswersModal(true);
  const handleCloseAnswersModal = () => setShowAnswersModal(false);

  useEffect(() => {
    // Check for incomplete interview on page load
    if (currentSession && !currentSession.isCompleted) {
      setShowWelcomeBack(true);
    }
  }, [currentSession]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      dispatch(resetInterview());
      navigate('/auth');
    } catch (error) {
      message.error('Failed to sign out');
    }
  };

  const handleResumeParsed = (parsedData: ResumeData) => {
    setResumeData(parsedData);
  };

  const handleClearResume = () => {
    setResumeData(null);
  };

  const handleStartInterview = async () => {
    if (!resumeData || !user) return;

    try {
      if (!checkGeminiApiKey()) {
        return;
      }

      // Create candidate profile if not exists
      const candidateProfile = {
        id: user.id,
        name: resumeData.name || user.name || 'Anonymous',
        email: resumeData.email || user.email,
        phone: resumeData.phone,
        sessions: [],
        totalSessions: 0,
      };

      dispatch(addCandidateProfile(candidateProfile));

      // Start the interview
      await dispatch(startInterview({ 
        candidateId: user.id, 
        resumeData 
      })).unwrap();
      
      message.success('Interview started! Good luck!');
    } catch (error: any) {
      if (error.message?.includes('Gemini API key')) {
        message.error('AI services are currently unavailable. Please check your configuration.');
      } else {
        message.error(error.message || 'Failed to start interview');
      }
    }
  };

  const handleAnswerSubmit = async (answer: string, timeSpent: number) => {
    if (!currentSession || !currentSession.questions[currentSession.currentQuestionIndex]) return;

    try {
      const question = currentSession.questions[currentSession.currentQuestionIndex];
      
      // Submit the answer
      const answerObj = await dispatch(submitAnswer({
        questionId: question.id,
        answer,
        timeSpent,
      })).unwrap();

      // Evaluate the answer
      try {
        await dispatch(evaluateAnswer({ question, answer: answerObj }));
      } catch (evalError: any) {
        if (evalError.message?.includes('Gemini API key')) {
          message.warning('Answer submitted but AI evaluation is currently unavailable.');
        } else {
          throw evalError;
        }
      }

      // Check if interview is complete
      if (currentSession.currentQuestionIndex + 1 >= currentSession.questions.length) {
        await handleCompleteInterview();
      }
    } catch (error: any) {
      if (error.message?.includes('Gemini API key')) {
        message.error('AI services are currently unavailable. Please check your configuration.');
      } else {
        message.error(error.message || 'Failed to submit answer');
      }
    }
  };

  const handleCompleteInterview = async () => {
    if (!currentSession) return;

    try {
      if (!checkGeminiApiKey()) {
        // Still complete the interview but without AI evaluation
        dispatch(addInterviewSession({
          candidateId: currentSession.candidateId,
          session: { 
            ...currentSession,
            summary: "AI evaluation unavailable - Please check the configuration guide in the documentation.",
            strengths: [],
            weaknesses: [],
            totalScore: 0,
          },
        }));
        return;
      }

      const evaluation = await dispatch(completeInterview(currentSession)).unwrap();
      
      // Add session to candidate profile
      dispatch(addInterviewSession({
        candidateId: currentSession.candidateId,
        session: { ...currentSession, ...evaluation },
      }));

      message.success('Interview completed! Check your results.');
    } catch (error: any) {
      if (error.message?.includes('Gemini API key')) {
        // Complete interview without AI evaluation
        dispatch(addInterviewSession({
          candidateId: currentSession.candidateId,
          session: { 
            ...currentSession,
            summary: "AI evaluation unavailable - Please check configuration.",
            strengths: [],
            weaknesses: [],
          },
        }));
        message.warning('Interview completed without AI evaluation. Some features are unavailable.');
      } else {
        message.error(error.message || 'Failed to complete interview');
      }
    }
  };

  const handleResumeInterview = () => {
    dispatch(resumeInterview());
    setShowWelcomeBack(false);
    message.info('Interview resumed!');
  };

  const handleStartNewInterview = () => {
    dispatch(resetInterview());
    setResumeData(null);
    setShowWelcomeBack(false);
  };

  return (
    <Layout className="interview-page">
      <Header className="interview-header">
        <div className="header-left">
          <RocketOutlined style={{ fontSize: '2rem', color: '#000000' }} />
          <Title className="brand-logo" level={3}>
            Crisp AI
          </Title>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              style={{ background: '#1890ff' }}
            />
            <Text style={{ color: '#000000', fontWeight: '500' }}>
              {user?.name || user?.email}
            </Text>
          </div>
          <Button 
            type="default"
            icon={<LogoutOutlined />} 
            onClick={handleSignOut}
            className="action-button"
          >
            Sign Out
          </Button>
        </div>
      </Header>

      <Content className="main-content">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div className="page-header">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space align="center" style={{ justifyContent: 'center', width: '100%' }}>
                <TrophyOutlined style={{ fontSize: '3rem', color: '#667eea' }} />
                <Title className="page-title" level={1} style={{ margin: 0 }}>
                  Interviewee Dashboard
                </Title>
              </Space>
              <Text className="page-subtitle" style={{ 
                fontSize: 'var(--font-size-xl)', 
                maxWidth: '700px', 
                margin: '0 auto',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: 'var(--line-height-relaxed)'
              }}>
                Upload your resume and take an AI-powered mock interview designed specifically for your background
              </Text>
            </Space>
          </div>

          {/* Welcome Back Modal */}
          {showWelcomeBack && currentSession && (
            <Alert
              message="Welcome Back!"
              description={
                <Space direction="vertical" size="small">
                  <Text>
                    You have an incomplete interview. Would you like to resume where you left off?
                  </Text>
                  <Text type="secondary">
                    Progress: {currentSession.currentQuestionIndex} of {currentSession.questions.length} questions
                  </Text>
                  <Space>
                    <Button type="primary" onClick={handleResumeInterview}>
                      Resume Interview
                    </Button>
                    <Button onClick={handleStartNewInterview}>
                      Start New Interview
                    </Button>
                  </Space>
                </Space>
              }
              type="info"
              showIcon
              closable
              onClose={() => setShowWelcomeBack(false)}
            />
          )}

          {/* Resume Upload */}
          {!isInterviewActive && (
            <div className="resume-section">
              <ResumeUpload
                onResumeParsed={handleResumeParsed}
                onClearResume={handleClearResume}
                resumeData={resumeData}
              />

              {/* Enhanced Start Interview Button */}
              {resumeData && !showWelcomeBack && (
                <Card className="glass-card" style={{ textAlign: 'center', padding: 'var(--spacing-xxl)' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    <Title level={2} style={{ 
                      color: 'var(--text-primary)', 
                      marginBottom: 'var(--spacing-md)',
                      fontSize: 'var(--font-size-2xl)',
                      fontWeight: 'var(--font-weight-bold)'
                    }}>
                      🚀 Ready to Start Your Interview?
                    </Title>
                    <Text style={{ 
                      fontSize: 'var(--font-size-lg)', 
                      color: 'var(--text-secondary)', 
                      maxWidth: '600px', 
                      margin: '0 auto',
                      fontWeight: 'var(--font-weight-medium)',
                      lineHeight: 'var(--line-height-relaxed)'
                    }}>
                      Your resume has been processed and personalized questions have been generated. 
                      Click below to begin your AI-powered interview experience.
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      icon={<PlayCircleOutlined />}
                      onClick={handleStartInterview}
                      loading={isLoading}
                      style={{ 
                        height: '64px',
                        fontSize: '20px',
                        fontWeight: '700',
                        padding: '0 var(--spacing-xl)',
                        borderRadius: '16px',
                        background: 'var(--success-gradient)',
                        border: 'none',
                        boxShadow: '0 8px 25px rgba(79, 172, 254, 0.4)'
                      }}
                    >
                      {isLoading ? 'Preparing Interview...' : 'Start Interview'}
                    </Button>
                  </Space>
                </Card>
              )}
            </div>
          )}

          {/* Interview Chat */}
          {isInterviewActive && currentSession && (
            <InterviewChat
              questions={currentSession.questions}
              answers={currentSession.answers}
              currentQuestionIndex={currentSession.currentQuestionIndex}
              onAnswerSubmit={handleAnswerSubmit}
              isInterviewCompleted={currentSession.isCompleted}
            />
          )}

          {/* Interview Results */}
          {currentSession?.isCompleted && (
            <Card>
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Title level={3} className="stats-title" style={{ textAlign: 'center', color: '#000000' }}>
                  Interview Completed!
                </Title>
                
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <Title level={1} className="stats-value">
                    {currentSession.totalScore}/100
                  </Title>
                  <Text style={{ color: '#333333' }}>Overall Score</Text>
                </div>

                {currentSession.summary && (
                  <Card className="stats-card">
                    <Title level={4} className="stats-title">Summary</Title>
                    <Text style={{ color: '#333333' }}>{currentSession.summary}</Text>
                  </Card>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {currentSession.strengths && currentSession.strengths.length > 0 && (
                    <Card className="stats-card" style={{ borderTop: '3px solid #52c41a' }}>
                      <Title level={5} className="stats-title" style={{ color: '#000000' }}>
                        Strengths
                      </Title>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                        {currentSession.strengths.map((strength: string, index: number) => (
                          <li key={index}>
                            <Text style={{ color: '#333333' }}>{strength}</Text>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {currentSession.weaknesses && currentSession.weaknesses.length > 0 && (
                    <Card className="stats-card" style={{ borderTop: '3px solid #ff4d4f' }}>
                      <Title level={5} className="stats-title" style={{ color: '#000000' }}>
                        Areas for Improvement
                      </Title>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                        {currentSession.weaknesses.map((weakness: string, index: number) => (
                          <li key={index}>
                            <Text style={{ color: '#333333' }}>{weakness}</Text>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <Button type="primary" onClick={handleShowAnswersModal}>
                      View Full Answer Details
                    </Button>
                    <Button onClick={handleStartNewInterview}>
                      Take Another Interview
                    </Button>
                  </Space>
                </div>

                {/* Modal for full answer details */}
                <Modal
                  title={<span className="modal-title">Interview Answer Details & Improvements</span>}
                  open={showAnswersModal}
                  onCancel={handleCloseAnswersModal}
                  footer={null}
                  width={800}
                  className="answer-modal"
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {currentSession.questions.map((q: any, idx: number) => {
                      const ans = currentSession.answers[idx];
                      return (
                        <Card key={q.id} className="stats-card" style={{ marginBottom: 16 }}>
                          <Title level={5} className="stats-title" style={{ marginBottom: 8 }}>
                            Q{idx + 1}: {q.text}
                          </Title>
                          <Text style={{ color: '#666666', fontSize: 13 }}>
                            Difficulty: {q.difficulty} | Category: {q.category}
                          </Text>
                          <div style={{ marginTop: 12 }}>
                            <Text strong style={{ color: '#000000' }}>Your Answer:</Text>
                            <div style={{ 
                              background: '#f8f9fa', 
                              borderRadius: 8, 
                              padding: 16, 
                              margin: '8px 0',
                              color: '#333333'
                            }}>
                              {ans?.text || <Text style={{ color: '#ff4d4f' }}>No answer provided.</Text>}
                            </div>
                            <Text style={{ color: '#000000' }}>
                              Score: <span style={{ fontWeight: 600 }}>{ans?.score ?? 'N/A'}/10</span>
                            </Text>
                          </div>
                          {ans?.feedback && (
                            <div style={{ marginTop: 8 }}>
                              <Text strong>Feedback & Suggestions:</Text>
                              <div style={{ background: '#fffbe6', borderRadius: 8, padding: 10, marginTop: 4 }}>
                                {ans.feedback}
                              </div>
                            </div>
                          )}
                        </Card>
                      );
                    })}
                  </Space>
                </Modal>
              </Space>
            </Card>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default IntervieweePage;
