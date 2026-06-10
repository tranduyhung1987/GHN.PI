// src/core/auth/AuthGuard.tsx
import React from 'react';
import { useAuth } from './AuthContext';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { user, role, isAuthenticated } = useAuth();

  // Chưa đăng nhập
  if (!isAuthenticated || !user) {
    return (
      <div style={blockStyle}>
        🚫 Bạn chưa đăng nhập<br />
        <span style={{ fontSize: '13px', fontWeight: 400 }}>Vui lòng đăng nhập để tiếp tục</span>
      </div>
    );
  }

  // Kiểm tra role (đã sửa đúng)
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div style={blockStyle}>
        ⛔ Không có quyền truy cập<br />
        <span style={{ fontSize: '13px', fontWeight: 400 }}>
          Trang này chỉ dành cho: {allowedRoles.join(', ')}
        </span>
      </div>
    );
  }

  return <>{children}</>;
}

const blockStyle: React.CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: '#dc2626',
  fontWeight: 600,
  background: '#fef2f2',
  borderRadius: 16,
  margin: 20,
};