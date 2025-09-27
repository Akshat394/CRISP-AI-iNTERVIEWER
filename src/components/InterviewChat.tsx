import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Progress, Typography, Card, Space, Tag, Alert } from 'antd';
import { SendOutlined, ClockCircleOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Question, Answer, TimerState } from '../types';

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
    <div className="chat-container">
      {/* Enhanced Header */}
      <div className="chat-header">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={2} style={{ 
              margin: 0, 
              color: 'var(--text-primary)',
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)'
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
        {/* Previous Q&A pairs */}
        {answers.map((answer, index) => {
          const question = questions[index];
          return (
            <div key={index}>
              {/* AI Question */}
              <div className="message ai">
                <div className="message-bubble ai">
                  <Space align="start" style={{ width: '100%' }}>
                    <RobotOutlined style={{ color: '#667eea', fontSize: '1.2rem', marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ color: 'var(--text-primary)' }}>Question {index + 1}:</Text>
                      </div>
                      <div style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{question.text}</div>
                      <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                        <Tag 
                          style={{ 
                            background: getDifficultyColor(question.difficulty),
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '500'
                          }}
                        >
                          {question.difficulty}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>• {question.category}</Text>
                      </div>
                    </div>
                  </Space>
                </div>
              </div>

              {/* User Answer */}
              <div className="message user">
                <div className="message-bubble user">
                  <Space align="start" style={{ width: '100%' }}>
                    <UserOutlined style={{ color: 'white', fontSize: '1.2rem', marginTop: 4 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ marginBottom: 8 }}>
                        <Text strong style={{ color: 'white' }}>Your Answer:</Text>
                      </div>
                      <div style={{ color: 'white', lineHeight: 1.6 }}>{answer.text}</div>
                      {answer.score && (
                        <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}>
                          <Text style={{ color: 'white', fontWeight: '600' }}>Score: {answer.score}/10</Text>
                          {answer.feedback && (
                            <div style={{ marginTop: 6 }}>
                              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontStyle: 'italic' }}>{answer.feedback}</Text>
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

        {/* Current Question */}
        <div className="message ai">
          <div className="message-bubble ai">
            <Space align="start" style={{ width: '100%' }}>
              <RobotOutlined style={{ color: '#667eea', fontSize: '1.2rem', marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong style={{ color: 'var(--text-primary)' }}>Question {currentQuestionIndex + 1}:</Text>
                </div>
                <div style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{currentQuestion.text}</div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Tag 
                    style={{ 
                      background: getDifficultyColor(currentQuestion.difficulty),
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '500'
                    }}
                  >
                    {currentQuestion.difficulty}
                  </Tag>
                  <Text type="secondary" style={{ fontSize: 12 }}>• {currentQuestion.category}</Text>
                </div>
              </div>
            </Space>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="chat-input-container">
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <TextArea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your detailed answer here..."
            rows={6}
            disabled={timer.isExpired}
            style={{
              borderRadius: 'var(--border-radius)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(15px)',
              fontSize: 'var(--font-size-lg)',
              padding: 'var(--spacing-xl)',
              lineHeight: 'var(--line-height-relaxed)',
              minHeight: '140px',
              fontWeight: 'var(--font-weight-normal)',
              color: 'var(--text-primary)'
            }}
            onPressEnter={(e) => {
              if (e.shiftKey) return;
              e.preventDefault();
              handleSubmit();
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ 
              fontSize: 'var(--font-size-base)', 
              color: 'var(--text-secondary)', 
              fontWeight: 'var(--font-weight-medium)' 
            }}>
              💡 Press Enter to submit, Shift+Enter for new line
            </Text>
            
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={!currentAnswer.trim() || timer.isExpired}
              loading={timer.isExpired}
              size="large"
              style={{ 
                height: '64px',
                borderRadius: 'var(--border-radius)',
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                background: 'var(--success-gradient)',
                border: 'none',
                padding: '0 var(--spacing-xxl)',
                boxShadow: 'var(--shadow-soft)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {timer.isExpired ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default InterviewChat;
