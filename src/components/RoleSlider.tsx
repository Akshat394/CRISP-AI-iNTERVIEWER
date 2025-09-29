import React from 'react';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import './RoleSlider.css';
import { UserRole } from '../types';

interface RoleSliderProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSlider: React.FC<RoleSliderProps> = ({ selectedRole, onChange }) => {
  return (
    <div className="role-slider-container">
      <div className="role-slider-track">
        <div
          className="role-slider-thumb"
          style={{ left: selectedRole === UserRole.INTERVIEWEE ? 4 : 164 }}
        >
          {selectedRole === UserRole.INTERVIEWEE ? 'Interviewee' : 'Interviewer'}
        </div>
        <div
          className="role-slider-label"
          onClick={() => onChange(UserRole.INTERVIEWEE)}
          style={{ color: selectedRole === UserRole.INTERVIEWEE ? '#0a7cff' : '#fff' }}
        >
          <UserOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} /> Interviewee
        </div>
        <div
          className="role-slider-label"
          onClick={() => onChange(UserRole.INTERVIEWER)}
          style={{ color: selectedRole === UserRole.INTERVIEWER ? '#0a7cff' : '#fff' }}
        >
          <TeamOutlined style={{ marginRight: 8, fontSize: '1.5rem' }} /> Interviewer
        </div>
      </div>
    </div>
  );
};

export default RoleSlider;
