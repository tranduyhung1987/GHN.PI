import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useAuth();

  const currentPath = location.pathname;

  // ADMIN NAV
  if (role === 'admin') {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1e2937',
        borderTop: '3px solid #ef4444',
        padding: '12px 0',
        zIndex: 100,
        textAlign: 'center',
        color: '#ef4444',
        fontWeight: 'bold',
        boxShadow: '0 -4px 20px rgba(239, 68, 68, 0.5)'
      }}>
        👑 QUẢN TRỊ VIÊN
      </div>
    );
  }

  // THÀNH VIÊN NAV - CÓ HIỆU ỨNG HOVER
  const navItems = [
    { icon: "🏠", label: "Trang chủ", path: "/" },
    { icon: "📦", label: "Đơn hàng", path: "/gui-hang" },
    { icon: "💬", label: "Chat", path: "/chat" },
    { icon: "📊", label: "Đối soát", path: "/doi-soat" },
    { icon: "⚠️", label: "Khiếu nại", path: "/khieu-nai" },
    { icon: "👤", label: "Cá nhân", path: "/ca-nhan" },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e2937',
      borderTop: '1px solid #334155',
      padding: '8px 0 6px 0',
      zIndex: 100,
      boxShadow: '0 -4px 25px rgba(0, 0, 0, 0.6)',
    }}>
      <div style={{ 
        maxWidth: '640px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-around' 
      }}>
        {navItems.map((item) => {
          const isActive = currentPath === item.path || 
                          (item.path === "/gui-hang" && currentPath.includes("don"));

          return (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                textAlign: 'center',
                color: isActive ? '#22d3ee' : '#94a3b8',
                cursor: 'pointer',
                flex: 1,
                padding: '6px 0',
                transition: 'all 0.25s ease',
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15)';
                e.currentTarget.style.color = '#67e8f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.color = isActive ? '#22d3ee' : '#94a3b8';
              }}
            >
              <div style={{ 
                fontSize: '28px', 
                marginBottom: '4px',
                filter: isActive ? 'drop-shadow(0 0 8px #22d3ee)' : 'none'
              }}>
                {item.icon}
              </div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: isActive ? '600' : '500'
              }}>
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}