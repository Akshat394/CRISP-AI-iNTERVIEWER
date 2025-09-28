import React, { useState } from 'react';
import './RoleSwitcher.css';
import { Button, Drawer, Typography, Divider } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface RoleSwitcherProps {
  onSelectRole: (role: 'interviewee' | 'interviewer') => void;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onSelectRole }) => {
  const [visible, setVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'interviewee' | 'interviewer'>('interviewee');

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <button
          className="role-switcher-btn"
          onClick={() => setVisible(true)}
        >
          Choose Role
        </button>
      </div>
      <Drawer
        title={<Title level={3} style={{ margin: 0 }}>Select Your Role</Title>}
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={340}
        bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 40 }}
      >
        <div className="role-switcher-slider">
          <div className="role-switcher-slider-track">
            <div
              className="role-switcher-slider-thumb"
              style={{ left: selectedRole === 'interviewee' ? 4 : 164 }}
            >
              {selectedRole === 'interviewee' ? 'Interviewee' : 'Interviewer'}
            </div>
            <div
              className="role-switcher-slider-label"
              onClick={() => setSelectedRole('interviewee')}
              style={{ color: selectedRole === 'interviewee' ? '#0a7cff' : '#fff' }}
            >
              <UserOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} /> Interviewee
            </div>
            <div
              className="role-switcher-slider-label"
              onClick={() => setSelectedRole('interviewer')}
              style={{ color: selectedRole === 'interviewer' ? '#0a7cff' : '#fff' }}
            >
              <TeamOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} /> Interviewer
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            className="btn-primary"
            style={{ marginTop: 32, width: 240, fontWeight: 700, fontSize: '1.1rem', borderRadius: 16 }}
            onClick={() => { onSelectRole(selectedRole); setVisible(false); }}
          >
            Continue as {selectedRole === 'interviewee' ? 'Interviewee' : 'Interviewer'}
          </Button>
        </div>
        <Divider />
        <Text type="secondary" style={{ textAlign: 'center', marginTop: 16 }}>
          Interviewers can view interviewee progress and analytics.<br />Interviewees can take mock interviews and view feedback.
        </Text>
      </Drawer>
    </>
  );
};

export default RoleSwitcher;
