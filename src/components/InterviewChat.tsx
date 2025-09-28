import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Progress, Typography, Card, Space, Tag, Alert } from 'antd';
import { SendOutlined, ClockCircleOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Question, Answer, TimerState } from '../types';
import './InterviewChat.css';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface InterviewChatProps {
  questions: Question[];
  answers: Answer[];
  currentQuestionIndex: number;
  onAnswerSubmit: (answer: string, timeSpent: number) => void;
  isInterviewCompleted: boolean;
}

const InterviewChat: React.FC<InterviewChatProps> = ({
  questions,
  answers,
  currentQuestionIndex,
  onAnswerSubmit,
  isInterviewCompleted,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [timer, setTimer] = useState<TimerState>({
    timeRemaining: 0,
    isRunning: false,
    isExpired: false,
  });
  const [startTime, setStartTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  useEffect(() => {
    if (currentQuestion && !isInterviewCompleted) {
      setTimer({
        timeRemaining: currentQuestion.timeLimit,
        isRunning: true,
        isExpired: false,
      });
      setStartTime(Date.now());
      setCurrentAnswer('');

      // Start timer
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.timeRemaining <= 1) {
            return {
              timeRemaining: 0,
              isRunning: false,
              isExpired: true,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, currentQuestion, isInterviewCompleted]);

  useEffect(() => {
    // Auto-submit when timer expires
    if (timer.isExpired && currentAnswer.trim() && !isInterviewCompleted) {
      handleSubmit();
    }
  }, [timer.isExpired, currentAnswer, isInterviewCompleted]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [answers, currentQuestionIndex]);

  const handleSubmit = () => {
    if (!currentAnswer.trim() || isInterviewCompleted) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    onAnswerSubmit(currentAnswer.trim(), timeSpent);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'blue';
    }
  };

  if (isInterviewCompleted) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <Title level={3} style={{ color: '#52c41a' }}>
            Interview Completed!
          </Title>
          <Text type="secondary">
            Thank you for completing the interview. Your responses have been evaluated.
          </Text>
        </div>
      </Card>
    );
  }

  if (!currentQuestion) {
    return (
      <Card>
        <Alert
          message="No questions available"
          description="Please wait while questions are being generated."
          type="info"
          showIcon
        />
      </Card>
    );
  }

  return (
    <div className="chat-container custom-card">
      {/* Enhanced Header */}
      <div className="chat-header">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} className="text-primary" style={{ 
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 600
            }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Title>
            <Tag 
              color={getDifficultyColor(currentQuestion.difficulty)}
              style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '12px'
              }}
            >
              {currentQuestion.difficulty.toUpperCase()}
            </Tag>
          </div>
          <Progress 
            percent={progress} 
            showInfo={false} 
            strokeColor="#667eea"
            style={{ height: '12px' }}
          />
          <div className="timer-display" style={{ 
            fontSize: '1.2rem',
            fontWeight: '700',
            padding: 'var(--spacing-md) var(--spacing-lg)'
          }}>
            <ClockCircleOutlined style={{ fontSize: '1.5rem', marginRight: 'var(--spacing-sm)' }} />
            <Text strong style={{ 
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              {timer.isExpired ? 'Time\'s up!' : `Time remaining: ${formatTime(timer.timeRemaining)}`}
            </Text>
          </div>
        </Space>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {/* Show answers/explanations only after all questions are asked */}
        {isInterviewCompleted && answers.map((answer, index) => {
          const question = questions[index];
          return (
            <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* AI Question */}
              <div className="message ai" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                  className="message-bubble ai"
                  style={{
                    background: 'linear-gradient(90deg, #e3eaf2 0%, #f5f5f7 100%)',
                    borderRadius: 16,
                    padding: '22px 24px',
                    marginBottom: 10,
                    boxShadow: '0 4px 16px rgba(25,118,210,0.08)',
                    maxWidth: 700,
                    width: '100%',
                    minWidth: 280,
                  }}
                >
                  <Space align="start" style={{ width: '100%' }}>
                    <RobotOutlined style={{ color: '#1976d2', fontSize: '1.5rem', marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ color: '#1976d2', fontSize: '1.15rem' }}>Question {index + 1}:</Text>
                      </div>
                      <div style={{ color: '#222', lineHeight: 1.7, fontSize: '1.12rem', fontWeight: 500 }}>{question.text}</div>
                      <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Tag 
                          style={{ 
                            background: getDifficultyColor(question.difficulty),
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 500,
                            fontSize: '0.98rem',
                            padding: '4px 12px'
                          }}
                        >
                          {question.difficulty.toUpperCase()}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: '0.98rem', color: '#555' }}>• {question.category}</Text>
                      </div>
                    </div>
                  </Space>
                </div>
              </div>

              {/* User Answer */}
              <div className="message user" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div
                  className="message-bubble user"
                  style={{
                    background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
                    borderRadius: 16,
                    padding: '22px 24px',
                    marginBottom: 22,
                    boxShadow: '0 4px 16px rgba(25,118,210,0.12)',
                    maxWidth: 700,
                    width: '100%',
                    minWidth: 280,
                  }}
                >
                  <Space align="start" style={{ width: '100%' }}>
                    <UserOutlined style={{ color: '#fff', fontSize: '1.5rem', marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ color: '#fff', fontSize: '1.15rem' }}>Your Answer:</Text>
                      </div>
                      <div style={{ color: '#fff', lineHeight: 1.7, fontSize: '1.12rem', fontWeight: 500 }}>{answer.text}</div>
                      {answer.score && (
                        <div style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.18)', borderRadius: 8 }}>
                          <Text style={{ color: '#fff', fontWeight: 600 }}>Score: {answer.score}/10</Text>
                          {answer.feedback && (
                            <div style={{ marginTop: 6 }}>
                              <Text style={{ color: 'rgba(255,255,255,0.96)', fontStyle: 'italic' }}>{answer.feedback}</Text>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Space>
                </div>
              </div>
            </div>
          );
        })}

        {/* Current Question (no answers/explanations until completed) */}
        {!isInterviewCompleted && (
          <div className="message ai" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div
              className="message-bubble ai"
              style={{
                background: 'linear-gradient(90deg, #e3eaf2 0%, #f5f5f7 100%)',
                borderRadius: 16,
                padding: '22px 24px',
                marginBottom: 10,
                boxShadow: '0 4px 16px rgba(25,118,210,0.08)',
                maxWidth: 700,
                width: '100%',
                minWidth: 280,
              }}
            >
              <Space align="start" style={{ width: '100%' }}>
                <RobotOutlined style={{ color: '#1976d2', fontSize: '1.5rem', marginTop: 4 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ color: '#1976d2', fontSize: '1.15rem' }}>Question {currentQuestionIndex + 1}:</Text>
                  </div>
                  <div style={{ color: '#222', lineHeight: 1.7, fontSize: '1.12rem', fontWeight: 500 }}>{currentQuestion.text}</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Tag 
                      style={{ 
                        background: getDifficultyColor(currentQuestion.difficulty),
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        fontWeight: 500,
                        fontSize: '0.98rem',
                        padding: '4px 12px'
                      }}
                    >
                      {currentQuestion.difficulty.toUpperCase()}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: '0.98rem', color: '#555' }}>• {currentQuestion.category}</Text>
                  </div>
                </div>
              </Space>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="chat-input-container">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <TextArea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your detailed answer here..."
            rows={4}
            disabled={timer.isExpired}
            style={{
              borderRadius: '18px',
              border: '2px solid #1976d2',
              background: 'rgba(227, 234, 242, 0.85)',
              fontSize: '1.15rem',
              padding: '22px',
              lineHeight: '1.7',
              minHeight: '80px',
              fontWeight: 500,
              color: '#222',
              boxShadow: '0 4px 16px rgba(25,118,210,0.10)',
              marginBottom: '18px',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onPressEnter={(e) => {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSubmit();
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={timer.isExpired || !currentAnswer.trim()}
              style={{
                borderRadius: '24px',
                fontWeight: 700,
                fontSize: '1.18rem',
                padding: '16px 48px',
                marginTop: 0,
                background: 'linear-gradient(90deg, #1976d2 0%, #00bcd4 100%)',
                border: 'none',
                boxShadow: '0 6px 24px rgba(25,118,210,0.18)',
                color: '#fff',
                transition: 'all 0.3s',
                letterSpacing: '0.04em',
              }}
            >
              Submit
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
}

export default InterviewChat;
