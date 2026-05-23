import React from 'react';
import { useAuth } from "@/core/auth/AuthContext";
import { RoleType } from '../../utils/constants';
import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { userRole, loading } = useAuth();

  // ⏳ đang load session
  if (loading) {
    return <div>Loading session...</div>;
  }

  // ❌ chưa login
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // ❌ sai role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <div>⛔ Không có quyền truy cập</div>;
  }

  // ✅ OK
  return <>{children}</>;
}