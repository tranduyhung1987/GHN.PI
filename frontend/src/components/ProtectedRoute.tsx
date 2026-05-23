import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { RoleType } from '../utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: RoleType[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#4c1d95' }}>Đang xác thực...</div>;
  }

  const currentRole = userRole as RoleType;

  if (!userRole || !allowedRoles.includes(currentRole)) {
    return <Navigate to="/dang-ky" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;