import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  // Lấy role từ localStorage (đã được lưu khi đăng nhập thành công)
  const userRole = localStorage.getItem('userRole') || ''; 

  // Nếu không có quyền, đẩy về trang chủ
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Nếu đủ quyền, cho phép truy cập
  return <>{children}</>;
};

export default ProtectedRoute;