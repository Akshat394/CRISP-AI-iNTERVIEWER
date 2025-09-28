import React, { useState } from 'react';
import { Card, Tabs, Form, Input, Button, Typography, App, Avatar } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, RocketOutlined, CheckCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { signIn, signUp, clearError } from '../store/authSlice';
import RoleSlider from '../components/RoleSlider';

import './AuthPage.css';

const { Title, Text } = Typography;

const AuthPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('signin');
  const { message } = App.useApp();
  const [selectedRole, setSelectedRole] = useState<'interviewee' | 'interviewer'>('interviewee');

  const features = [
    {
      icon: <RocketOutlined className="feature-icon" />,
      title: 'AI-Powered Interviews',
      description: 'Experience realistic interview simulations with our advanced AI technology'
    },
    {
      icon: <CheckCircleOutlined className="feature-icon" />,
      title: 'Instant Feedback',
      description: 'Get detailed feedback and insights to improve your interview performance'
    },
    {
      icon: <SafetyOutlined className="feature-icon" />,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security measures'
    }
  ];


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
          <div className="brand-top">
            <Avatar size={88} className="brand-avatar">
              <RocketOutlined />
            </Avatar>
            <div className="brand-headline">
              <Title className="swipe-auth-title" level={1}>CRISP AI</Title>
              <Text className="swipe-auth-subtitle">
                Master Your Interview Skills with AI-Powered Practice
              </Text>
            </div>
          </div>

          <div className="trust-row">
            <div className="trust-badge"><CheckCircleOutlined /> <span>No credit card</span></div>
            <div className="trust-badge"><SafetyOutlined /> <span>Privacy-first</span></div>
            <div className="trust-badge"><RocketOutlined /> <span>Try instantly</span></div>
          </div>

          <div style={{ marginTop: 14 }}>
            <Button className="btn-primary" style={{ marginRight: 12 }}>Get Started</Button>
            <Button className="btn-ghost" onClick={() => message.info('Demo started (local)')}>Try Demo</Button>
          </div>
        </div>

        <div className="auth-features">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card">
              <Card.Meta
                avatar={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Card>
          ))}
        </div>

  <Card className="auth-card">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => {
              setActiveTab(key);
              handleTabChange();
            }}
            items={[
              {
                key: 'signin',
                label: 'Sign In',
                children: (
                  <Form
                    name="signin"
                    onFinish={handleSignIn}
                    layout="vertical"
                    className="auth-form"
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Email address"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="Password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button htmlType="submit" loading={isLoading} block className="btn-primary">
                        Sign In
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: 'signup',
                label: 'Sign Up',
                children: (
                  <Form
                    name="signup"
                    onFinish={handleSignUp}
                    layout="vertical"
                    className="auth-form"
                  >
                    <Form.Item
                      name="name"
                      rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        placeholder="Full name"
                      />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                      ]}
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        placeholder="Email address"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 6, message: 'Password must be at least 6 characters!' }
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined />} 
                        placeholder="Password"
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button htmlType="submit" loading={isLoading} block className="btn-primary">
                        Create Account
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
          {error && (
            <div style={{ color: 'var(--text-primary)', marginTop: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </Card>

        <div className="role-selector">
          <Title level={4} style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Choose Your Role
          </Title>
          <RoleSlider selectedRole={selectedRole} onChange={setSelectedRole} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;