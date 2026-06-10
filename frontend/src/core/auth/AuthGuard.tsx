// src/core/auth/AuthGuard.tsx
import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, allowedRoles }: Props) {
  const { user, role, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Chưa đăng nhập
  if (!isAuthenticated || !user) {
    return (
      <div style={blockStyle}>
        🚫 Bạn chưa đăng nhập<br />
        <span style={{ fontSize: '13px', fontWeight: 400 }}>
          Vui lòng đăng nhập để tiếp tục
        </span>
        <button 
          onClick={() => navigate('/login')} 
          style={buttonStyle}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  // Role = guest (chưa chọn vai trò)
  if (role === 'guest') {
    return (
      <div style={blockStyle}>
        📝 Bạn chưa chọn vai trò<br />
        <span style={{ fontSize: '13px', fontWeight: 400 }}>
          Vui lòng chọn vai trò để sử dụng tính năng này
        </span>
        <button 
          onClick={() => navigate('/dang-ky')} 
          style={buttonStyle}
        >
          Chọn vai trò
        </button>
      </div>
    );
  }

  // Kiểm tra quyền
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

const buttonStyle: React.CSSProperties = {
  marginTop: 16,
  padding: '10px 20px',
  background: '#4c1d95',
  color: 'white',
  border: 'none',
  borderRadius: 9999,
  fontWeight: 600,
  cursor: 'pointer',
};