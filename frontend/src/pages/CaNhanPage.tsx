import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface CaNhanPageProps {
  onNavigate: (page: string) => void;
}

const CaNhanPage: React.FC<CaNhanPageProps> = ({ onNavigate }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '20px 14px', paddingBottom: '100px', background: isDark ? '#1f2937' : '#f3e8ff', minHeight: '100vh', color: isDark ? '#e5e7eb' : '#1f2937' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', textAlign: 'center', marginBottom: '30px' }}>
        👤 CÁ NHÂN
      </h1>

      <div style={{ background: isDark ? '#374151' : 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '12px' }}>👤</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700' }}>{user?.name || 'Khách'}</h2>
          <p style={{ color: isDark ? '#9ca3af' : '#6b21a8' }}>{user?.id || 'Chưa đăng nhập'}</p>
        </div>

        {/* Nút Dark Mode */}
        <button
          onClick={toggleTheme}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '16px',
            background: isDark ? '#4c1d95' : '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {isDark ? '☀️ Chuyển sang Light Mode' : '🌙 Chuyển sang Dark Mode'}
        </button>
      </div>

      {isAuthenticated && (
        <button 
          onClick={logout}
          style={{
            width: '100%',
            padding: '16px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '9999px',
            fontWeight: '700',
            marginTop: '10px'
          }}
        >
          Đăng xuất
        </button>
      )}
    </div>
  );
};

export default CaNhanPage;