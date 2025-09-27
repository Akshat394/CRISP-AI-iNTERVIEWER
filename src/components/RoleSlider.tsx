import React from 'react';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import './RoleSlider.css';

interface RoleSliderProps {
  selectedRole: 'interviewee' | 'interviewer';
  onChange: (role: 'interviewee' | 'interviewer') => void;
}

const RoleSlider: React.FC<RoleSliderProps> = ({ selectedRole, onChange }) => {
  return (
    <div className="role-slider-container">
      <div className="role-slider-track">
        <div
          className="role-slider-thumb"
          style={{ left: selectedRole === 'interviewee' ? 4 : 164 }}
        >
          {selectedRole === 'interviewee' ? 'Interviewee' : 'Interviewer'}
        </div>
        <div
          className="role-slider-label"
          onClick={() => onChange('interviewee')}
          style={{ color: selectedRole === 'interviewee' ? '#0a7cff' : '#fff' }}
        >
          <UserOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} /> Interviewee
        </div>
        <div
          className="role-slider-label"
          onClick={() => onChange('interviewer')}
          style={{ color: selectedRole === 'interviewer' ? '#0a7cff' : '#fff' }}
        >
          <TeamOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} /> Interviewer
        </div>
      </div>
    </div>
  );
};

export default RoleSlider;
