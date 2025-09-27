import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Typography, App, Space, Divider, Row, Col, Avatar } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, RocketOutlined, StarOutlined, CheckCircleOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signIn, signUp, clearError } from '../store/authSlice';

const { Title, Text } = Typography;

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('signin');
  const { message } = App.useApp();

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      await dispatch(signIn(values)).unwrap();
      message.success('Signed in successfully!');
    } catch (error: any) {
      message.error(error.message || 'Sign in failed');
    }
  };

  const handleSignUp = async (values: { email: string; password: string; name?: string }) => {
    try {
      await dispatch(signUp(values)).unwrap();
      message.success('Account created successfully!');
      setActiveTab('signin');
    } catch (error: any) {
      message.error(error.message || 'Sign up failed');
    }
  };

  const handleTabChange = () => {
    dispatch(clearError());
  };

  return (
    <div className="auth-container">
      <Row gutter={[48, 48]} style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Left Side - Branding & Features */}
        <Col xs={24} lg={12}>
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'left'
          }}>
            {/* Brand Section */}
            <div style={{ marginBottom: '48px' }}>
              <Space align="center" style={{ marginBottom: '24px' }}>
                <Avatar 
                  size={64} 
                  style={{ 
                    background: 'var(--success-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <RocketOutlined style={{ fontSize: '2rem', color: 'white' }} />
                </Avatar>
                <div>
                  <Title className="auth-title" level={1} style={{ margin: 0, fontSize: '2.5rem' }}>
                    Crisp AI
                  </Title>
                  <Text className="auth-subtitle" style={{ fontSize: '1.2rem' }}>
                    AI-Powered Interview Assistant
                  </Text>
                </div>
              </Space>
              
              <Space style={{ marginBottom: '32px' }}>
                {[...Array(5)].map((_, i) => (
                  <StarOutlined key={i} style={{ color: '#ffd700', fontSize: '1.2rem' }} />
                ))}
                <Text style={{ color: 'var(--text-primary)', fontWeight: '600', marginLeft: '8px' }}>
                  4.9/5 from 10,000+ users
                </Text>
              </Space>
            </div>

            {/* Features Section */}
            <div>
              <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: '32px', fontWeight: '600' }}>
                Why Choose Crisp AI?
              </Title>
              
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--success-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ThunderboltOutlined style={{ color: 'white', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <Text style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px', display: 'block' }}>
                      AI-Powered Questions
                    </Text>
                    <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Get personalized questions based on your resume and experience
                    </Text>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircleOutlined style={{ color: 'white', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <Text style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px', display: 'block' }}>
                      Real-time Feedback
                    </Text>
                    <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Instant scoring and detailed feedback on your answers
                    </Text>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--warning-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SafetyOutlined style={{ color: 'white', fontSize: '1.5rem' }} />
                  </div>
                  <div>
                    <Text style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '16px', display: 'block' }}>
                      Secure & Private
                    </Text>
                    <Text style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      Your data is processed locally and never shared
                    </Text>
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </Col>

        {/* Right Side - Authentication Form */}
        <Col xs={24} lg={12}>
          <Card className="auth-card" style={{ 
            maxWidth: '500px', 
            margin: '0 auto',
            minHeight: '600px'
          }}>
            <div style={{ padding: '20px' }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                onTabClick={handleTabChange}
                size="large"
                items={[
                  {
                    key: 'signin',
                    label: (
                      <span style={{ fontSize: '16px', fontWeight: '600', padding: '0 8px' }}>
                        Sign In
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                          <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Welcome Back
                          </Title>
                          <Text className="auth-subtitle">
                            Sign in to continue your interview preparation
                          </Text>
                        </div>

                        <Form
                          name="signin"
                          onFinish={handleSignIn}
                          layout="vertical"
                          size="large"
                        >
                          <Form.Item
                            name="email"
                            rules={[
                              { required: true, message: 'Please input your email!' },
                              { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined style={{ color: '#667eea' }} />}
                              placeholder="Enter your email address"
                              size="large"
                              style={{ height: '56px', fontSize: '16px' }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            rules={[
                              { required: true, message: 'Please input your password!' },
                              { min: 6, message: 'Password must be at least 6 characters!' },
                            ]}
                          >
                            <Input.Password
                              prefix={<LockOutlined style={{ color: '#667eea' }} />}
                              placeholder="Enter your password"
                              size="large"
                              style={{ height: '56px', fontSize: '16px' }}
                            />
                          </Form.Item>

                          <Form.Item style={{ marginTop: '32px' }}>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={isLoading}
                              size="large"
                              style={{ 
                                width: '100%', 
                                height: '56px', 
                                fontSize: '18px', 
                                fontWeight: '600',
                                borderRadius: '12px'
                              }}
                            >
                              {isLoading ? 'Signing In...' : 'Sign In'}
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    ),
                  },
                  {
                    key: 'signup',
                    label: (
                      <span style={{ fontSize: '16px', fontWeight: '600', padding: '0 8px' }}>
                        Sign Up
                      </span>
                    ),
                    children: (
                      <div style={{ padding: '20px 0' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                          <Title level={3} style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Get Started
                          </Title>
                          <Text className="auth-subtitle">
                            Create your account and start practicing interviews
                          </Text>
                        </div>

                        <Form
                          name="signup"
                          onFinish={handleSignUp}
                          layout="vertical"
                          size="large"
                        >
                          <Form.Item
                            name="name"
                            rules={[
                              { required: true, message: 'Please input your name!' },
                            ]}
                          >
                            <Input
                              prefix={<UserOutlined style={{ color: '#667eea' }} />}
                              placeholder="Enter your full name"
                              size="large"
                              style={{ height: '56px', fontSize: '16px' }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="email"
                            rules={[
                              { required: true, message: 'Please input your email!' },
                              { type: 'email', message: 'Please enter a valid email!' },
                            ]}
                          >
                            <Input
                              prefix={<MailOutlined style={{ color: '#667eea' }} />}
                              placeholder="Enter your email address"
                              size="large"
                              style={{ height: '56px', fontSize: '16px' }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="password"
                            rules={[
                              { required: true, message: 'Please input your password!' },
                              { min: 6, message: 'Password must be at least 6 characters!' },
                            ]}
                          >
                            <Input.Password
                              prefix={<LockOutlined style={{ color: '#667eea' }} />}
                              placeholder="Create a strong password"
                              size="large"
                              style={{ height: '56px', fontSize: '16px' }}
                            />
                          </Form.Item>

                          <Form.Item
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                              { required: true, message: 'Please confirm your password!' },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(new Error('Passwords do not match!'));
                                },
                              }),
                            ]}
                          >
                            <Input.Password
                              prefix={<LockOutlined style={{ color: '#667eea' }} />}
                              placeholder="Confirm your password"
                              size="large"
                              style={{ height: '56px', fontSize: '16px' }}
                            />
                          </Form.Item>

                          <Form.Item style={{ marginTop: '32px' }}>
                            <Button
                              type="primary"
                              htmlType="submit"
                              loading={isLoading}
                              size="large"
                              style={{ 
                                width: '100%', 
                                height: '56px', 
                                fontSize: '18px', 
                                fontWeight: '600',
                                borderRadius: '12px'
                              }}
                            >
                              {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                          </Form.Item>
                        </Form>
                      </div>
                    ),
                  },
                ]}
              />

              {error && (
                <div style={{ 
                  marginTop: '24px', 
                  padding: '16px', 
                  background: 'rgba(255, 77, 79, 0.1)', 
                  border: '1px solid rgba(255, 77, 79, 0.3)', 
                  borderRadius: '12px',
                  color: '#ff4d4f',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {error}
                </div>
              )}
              
              <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '24px 0' }} />
              
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '12px' }}>
                <Text type="secondary">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AuthPage;