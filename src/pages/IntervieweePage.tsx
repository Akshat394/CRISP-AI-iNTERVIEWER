import React, { useEffect, useState } from 'react';
import { Layout, Typography, Button, Space, Card, Alert, App, Avatar } from 'antd';
import { UserOutlined, LogoutOutlined, PlayCircleOutlined, RocketOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
      message.error(error.message || 'Failed to start interview');
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
      dispatch(evaluateAnswer({ question, answer: answerObj }));

      // Check if interview is complete
      if (currentSession.currentQuestionIndex + 1 >= currentSession.questions.length) {
        await handleCompleteInterview();
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to submit answer');
    }
  };

  const handleCompleteInterview = async () => {
    if (!currentSession) return;

    try {
      const evaluation = await dispatch(completeInterview(currentSession)).unwrap();
      
      // Add session to candidate profile
      dispatch(addInterviewSession({
        candidateId: currentSession.candidateId,
        session: { ...currentSession, ...evaluation },
      }));

      message.success('Interview completed! Check your results.');
    } catch (error: any) {
      message.error(error.message || 'Failed to complete interview');
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

  const getScoreBadgeClass = (score?: number) => {
    if (!score) return 'score-badge';
    if (score >= 80) return 'score-badge score-excellent';
    if (score >= 60) return 'score-badge score-good';
    if (score >= 40) return 'score-badge score-average';
    return 'score-badge score-poor';
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '0 32px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'var(--shadow-soft)'
      }}>
        <Space align="center">
          <RocketOutlined style={{ fontSize: '2rem', color: '#667eea' }} />
          <Title className="page-title" level={3} style={{ margin: 0 }}>
            Crisp AI
          </Title>
        </Space>
        
        <Space align="center" size="large">
          <Space align="center">
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              style={{ background: 'var(--success-gradient)' }}
            />
            <Text style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
              Welcome, {user?.name || user?.email}
            </Text>
          </Space>
          <Button 
            type="text"
            icon={<LogoutOutlined />} 
            onClick={handleSignOut}
            style={{ 
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px'
            }}
          >
            Sign Out
          </Button>
        </Space>
      </Header>

      <Content className="main-content">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Enhanced Page Header */}
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
            <ResumeUpload
              onResumeParsed={handleResumeParsed}
              onClearResume={handleClearResume}
              resumeData={resumeData}
            />
          )}

          {/* Enhanced Start Interview Button */}
          {resumeData && !isInterviewActive && !showWelcomeBack && (
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
                <Title level={3} style={{ textAlign: 'center', color: '#52c41a' }}>
                  Interview Completed!
                </Title>
                
                <div style={{ textAlign: 'center' }}>
                  <Title level={1} className={getScoreBadgeClass(currentSession.totalScore)}>
                    {currentSession.totalScore}/100
                  </Title>
                  <Text type="secondary">Overall Score</Text>
                </div>

                {currentSession.summary && (
                  <Card size="small">
                    <Title level={4}>Summary</Title>
                    <Text>{currentSession.summary}</Text>
                  </Card>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {currentSession.strengths && currentSession.strengths.length > 0 && (
                    <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
                      <Title level={5} style={{ color: '#52c41a', margin: 0 }}>
                        Strengths
                      </Title>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                        {currentSession.strengths.map((strength, index) => (
                          <li key={index}>
                            <Text>{strength}</Text>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}

                  {currentSession.weaknesses && currentSession.weaknesses.length > 0 && (
                    <Card size="small" style={{ background: '#fff2f0', border: '1px solid #ffccc7' }}>
                      <Title level={5} style={{ color: '#ff4d4f', margin: 0 }}>
                        Areas for Improvement
                      </Title>
                      <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                        {currentSession.weaknesses.map((weakness, index) => (
                          <li key={index}>
                            <Text>{weakness}</Text>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Space>
                    <Button type="primary" onClick={() => navigate('/interviewer')}>
                      View All Candidates
                    </Button>
                    <Button onClick={handleStartNewInterview}>
                      Take Another Interview
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>
          )}
        </Space>
      </Content>
    </Layout>
  );
};

export default IntervieweePage;
