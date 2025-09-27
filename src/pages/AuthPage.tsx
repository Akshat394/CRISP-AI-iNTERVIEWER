
import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Typography, App, Space, Divider, Avatar } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, RocketOutlined, CheckCircleOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signIn, signUp, clearError } from '../store/authSlice';
import RoleSlider from '../components/RoleSlider';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
const { Title, Text } = Typography;

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('signin');
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'interviewee' | 'interviewer'>('interviewee');

  const handleRoleSelect = (role: 'interviewee' | 'interviewer') => {
    if (role === 'interviewee') {
      navigate('/interviewee');
    } else {
      navigate('/interviewer');
    }
  };

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      await dispatch(signIn(values)).unwrap();
      message.success('Signed in successfully!');
    } catch (error: any) {
      if (error && typeof error.message === 'string' && error.message.includes('auth/invalid-credential')) {
        message.error('Your email ID or password is incorrect.');
      } else {
        message.error(error.message || 'Sign in failed');
      }
    }
  };

  const handleSignUp = async (values: { email: string; password: string; name?: string }) => {
    try {
      await dispatch(signUp(values)).unwrap();
      message.success('Account created successfully!');
      setActiveTab('signin');
    } catch (error: any) {
      if (error && typeof error.message === 'string' && error.message.includes('auth/invalid-credential')) {
        message.error('Your email ID or password is incorrect.');
      } else {
        message.error(error.message || 'Sign up failed');
      }
    }
  };

  const handleTabChange = () => {
    dispatch(clearError());
  };

  return (
    <div className="swipe-auth-hero">
      <div className="swipe-auth-hero-bg" />
      <div className="swipe-auth-hero-content">
        <div className="swipe-auth-brand">
          <Avatar size={80} style={{ background: 'var(--swipe-gradient)', boxShadow: '0 4px 24px #0a7cff44' }}>
            <RocketOutlined style={{ fontSize: '2.5rem', color: 'white' }} />
          </Avatar>
          <Title className="swipe-auth-title" level={1}>
            CRISP: AI-Powered Interview Assistant
          </Title>
          <Text className="swipe-auth-subtitle">
            Land your dream internship with Swipe!<br />
            <span style={{ color: 'var(--swipe-pink)', fontWeight: 700 }}>AI-powered, real-time feedback, secure & private.</span>
          </Text>
        </div>
        <div className="swipe-auth-features">
          <Space size="large">
            <div className="swipe-feature-card">
              <ThunderboltOutlined className="swipe-feature-icon" />
              <Text strong>AI-Powered Questions</Text>
              <Text type="secondary">Personalized for your resume & experience</Text>
            </div>
            <div className="swipe-feature-card">
              <CheckCircleOutlined className="swipe-feature-icon" />
              <Text strong>Real-time Feedback</Text>
              <Text type="secondary">Instant scoring & improvement tips</Text>
            </div>
            <div className="swipe-feature-card">
              <SafetyOutlined className="swipe-feature-icon" />
              <Text strong>Secure & Private</Text>
              <Text type="secondary">Your data stays on your device</Text>
            </div>
          </Space>
        </div>
        <div className="swipe-auth-form-wrapper">
          <Card className="swipe-auth-card">
            <div style={{ padding: '32px 24px', boxShadow: '0 8px 32px #0a7cff22', borderRadius: 24, background: 'rgba(255,255,255,0.98)' }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                onTabClick={handleTabChange}
                size="large"
                centered
                items={[{
                  key: 'signin',
                  label: <span className="swipe-auth-tab">Sign In</span>,
                  children: (
                    <div className="swipe-auth-form-content" style={{ padding: '16px 0 0 0' }}>
                      <Title level={3} className="swipe-auth-form-title">Welcome Back</Title>
                      <Text className="swipe-auth-form-subtitle">Sign in to continue your interview journey</Text>
                      <Form name="signin" onFinish={handleSignIn} layout="vertical" size="large">
                        <Form.Item
                          name="email"
                          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                        >
                          <Input prefix={<MailOutlined style={{ color: '#0a7cff' }} />} placeholder="Enter your email address" size="large" />
                        </Form.Item>
                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
                        >
                          <Input.Password prefix={<LockOutlined style={{ color: '#0a7cff' }} />} placeholder="Enter your password" size="large" />
                        </Form.Item>
                        <Form.Item style={{ marginTop: '32px' }}>
                          <Button type="primary" htmlType="submit" loading={isLoading} size="large" className="swipe-auth-btn">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  )
                }, {
                  key: 'signup',
                  label: <span className="swipe-auth-tab">Sign Up</span>,
                  children: (
                    <div className="swipe-auth-form-content" style={{ padding: '16px 0 0 0' }}>
                      <Title level={3} className="swipe-auth-form-title">Get Started</Title>
                      <Text className="swipe-auth-form-subtitle">Create your account and start practicing interviews</Text>
                      <Form name="signup" onFinish={handleSignUp} layout="vertical" size="large">
                        <Form.Item
                          name="name"
                          rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                          <Input prefix={<UserOutlined style={{ color: '#0a7cff' }} />} placeholder="Enter your full name" size="large" />
                        </Form.Item>
                        <Form.Item
                          name="email"
                          rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}
                        >
                          <Input prefix={<MailOutlined style={{ color: '#0a7cff' }} />} placeholder="Enter your email address" size="large" />
                        </Form.Item>
                        <Form.Item
                          name="password"
                          rules={[{ required: true, message: 'Please input your password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
                        >
                          <Input.Password prefix={<LockOutlined style={{ color: '#0a7cff' }} />} placeholder="Create a strong password" size="large" />
                        </Form.Item>
                        <Form.Item
                          name="confirmPassword"
                          dependencies={['password']}
                          rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('Passwords do not match!')); }, })]}
                        >
                          <Input.Password prefix={<LockOutlined style={{ color: '#0a7cff' }} />} placeholder="Confirm your password" size="large" />
                        </Form.Item>
                        <Form.Item style={{ marginTop: '32px' }}>
                          <Button type="primary" htmlType="submit" loading={isLoading} size="large" className="swipe-auth-btn">
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                          </Button>
                        </Form.Item>
                      </Form>
                    </div>
                  ),
                }]}
              />
            </div>
                            {error && (
                              <div className="swipe-auth-error">{error}</div>
                            )}
                            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '24px 0' }} />
                            <div className="swipe-auth-terms">
                              <Text type="secondary">By signing up, you agree to our Terms of Service and Privacy Policy</Text>
                            </div>
                            <RoleSlider selectedRole={selectedRole} onChange={setSelectedRole} />
                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                              <Button
                                type="primary"
                                size="large"
                                style={{ width: 240, fontWeight: 700, fontSize: '1.1rem', borderRadius: 16, background: 'linear-gradient(90deg, #0a7cff 0%, #00e0ff 100%)', border: 'none' }}
                                onClick={() => handleRoleSelect(selectedRole)}
                              >
                                Continue as {selectedRole === 'interviewee' ? 'Interviewee' : 'Interviewer'}
                              </Button>
                            </div>
                          </Card>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
