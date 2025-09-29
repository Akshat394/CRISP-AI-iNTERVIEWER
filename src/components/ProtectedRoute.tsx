import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to the correct dashboard based on the user's actual role
    if (user.role === UserRole.INTERVIEWER) {
      return <Navigate to="/interviewer" replace />;
    } else {
      return <Navigate to="/interviewee" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
