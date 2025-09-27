import React, { useState, useCallback } from 'react';
import { Upload, Button, Typography, Card, Space, Tag, App, Progress, Divider } from 'antd';
import { InboxOutlined, FileTextOutlined, DeleteOutlined, CloudUploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ResumeData } from '../types';
import { resumeParser } from '../services/resumeParser';

const { Dragger } = Upload;
const { Title, Text } = Typography;

interface ResumeUploadProps {
  onResumeParsed: (resumeData: ResumeData) => void;
  onClearResume: () => void;
  resumeData?: ResumeData | null;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onResumeParsed,
  onClearResume,
  resumeData,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { message } = App.useApp();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file) return false;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      message.error('Please upload a PDF or DOCX file only!');
      return false;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      message.error('File size must be less than 10MB!');
      return false;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const parsedData = await resumeParser.parseResume(file);
      setUploadProgress(100);
      setTimeout(() => {
        onResumeParsed(parsedData);
        message.success('Resume parsed successfully!');
      }, 500);
    } catch (error: any) {
      clearInterval(progressInterval);
      message.error(error.message || 'Failed to parse resume');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }

    return false; // Prevent default upload behavior
  }, [onResumeParsed, message]);

  const uploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload: handleFileUpload,
    showUploadList: false,
    accept: '.pdf,.docx,.doc',
  };

  if (resumeData) {
    return (
      <Card className="glass-card">
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space align="center">
              <CheckCircleOutlined style={{ fontSize: '1.5rem', color: '#52c41a' }} />
              <Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>
                Resume Uploaded Successfully
              </Title>
            </Space>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={onClearResume}
              danger
              style={{ 
                border: '1px solid rgba(255, 77, 79, 0.3)',
                borderRadius: '8px'
              }}
            >
              Remove
            </Button>
          </div>

          <div>
            <Text strong style={{ color: 'var(--text-primary)' }}>File: </Text>
            <Tag 
              icon={<FileTextOutlined />} 
              style={{ 
                background: 'var(--success-gradient)', 
                color: 'white', 
                border: 'none',
                borderRadius: '12px',
                fontWeight: '500'
              }}
            >
              {resumeData.fileName}
            </Tag>
          </div>

          <Divider style={{ borderColor: 'var(--glass-border)', margin: '16px 0' }} />
          
          {resumeData.name && (
            <div style={{ padding: '12px 0' }}>
              <Text strong style={{ color: 'var(--text-primary)' }}>Name: </Text>
              <Text style={{ color: 'var(--text-primary)' }}>{resumeData.name}</Text>
            </div>
          )}

          {resumeData.email && (
            <div style={{ padding: '12px 0' }}>
              <Text strong style={{ color: 'var(--text-primary)' }}>Email: </Text>
              <Text style={{ color: 'var(--text-primary)' }}>{resumeData.email}</Text>
            </div>
          )}

          {resumeData.phone && (
            <div style={{ padding: '12px 0' }}>
              <Text strong style={{ color: 'var(--text-primary)' }}>Phone: </Text>
              <Text style={{ color: 'var(--text-primary)' }}>{resumeData.phone}</Text>
            </div>
          )}

          {(!resumeData.name || !resumeData.email) && (
            <div style={{ 
              padding: 16, 
              background: 'rgba(255, 193, 7, 0.1)', 
              border: '1px solid rgba(255, 193, 7, 0.3)', 
              borderRadius: '12px',
              color: '#856404',
              backdropFilter: 'blur(10px)'
            }}>
              <Text style={{ color: '#856404' }}>
                Some information couldn't be extracted automatically. 
                You can still proceed with the interview.
              </Text>
            </div>
          )}
        </Space>
      </Card>
    );
  }

  return (
    <Card className="glass-card" style={{ padding: 'var(--spacing-xxl)' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div style={{ textAlign: 'center' }}>
          <CloudUploadOutlined style={{ fontSize: '4rem', color: '#667eea', marginBottom: 'var(--spacing-lg)' }} />
          <Title level={2} style={{ 
            color: 'var(--text-primary)', 
            marginBottom: 'var(--spacing-md)', 
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-extrabold)'
          }}>
            📄 Upload Your Resume
          </Title>
          <Text style={{ 
            fontSize: 'var(--font-size-xl)', 
            color: 'var(--text-secondary)', 
            maxWidth: '700px', 
            margin: '0 auto', 
            lineHeight: 'var(--line-height-relaxed)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Upload your PDF or DOCX resume to get personalized interview questions tailored to your experience and skills.
          </Text>
        </div>

        {isUploading && (
          <div style={{ margin: 'var(--spacing-xl) 0' }}>
            <Progress 
              percent={Math.round(uploadProgress)} 
              strokeColor={{
                '0%': '#667eea',
                '100%': '#764ba2',
              }}
              trailColor="rgba(255, 255, 255, 0.15)"
              style={{ 
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: 'var(--spacing-sm)',
                height: '16px'
              }}
            />
            <Text style={{ 
              textAlign: 'center', 
              display: 'block', 
              marginTop: 'var(--spacing-sm)',
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              fontWeight: '500'
            }}>
              Processing your resume...
            </Text>
          </div>
        )}

        <Dragger 
          {...uploadProps}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '3px dashed rgba(255, 255, 255, 0.4)',
            borderRadius: '24px',
            padding: 'var(--spacing-xxl) var(--spacing-xl)',
            minHeight: '200px',
            transition: 'var(--transition)'
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ fontSize: '4rem', color: '#667eea' }} />
          </p>
          <p className="ant-upload-text" style={{ 
            color: 'var(--text-primary)', 
            fontSize: 'var(--font-size-xl)', 
            fontWeight: 'var(--font-weight-semibold)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint" style={{ 
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Support for PDF and DOCX files. Maximum file size: 10MB
          </p>
        </Dragger>

        <Divider style={{ borderColor: 'var(--glass-border)', margin: 'var(--spacing-lg) 0' }} />

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ 
            fontSize: 'var(--font-size-base)', 
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-relaxed)'
          }}>
            🔒 Your resume data is processed locally and used only to generate relevant interview questions.
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default ResumeUpload;
