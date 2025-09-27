import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;
