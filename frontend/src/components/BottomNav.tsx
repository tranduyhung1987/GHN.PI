import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/don-hang', label: 'Đơn hàng', icon: '📦' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/doi-soat', label: 'Đối soát', icon: '📊' },
    { path: '/khieu-nai', label: 'Khiếu nại', icon: '⚠️' },
    { path: '/ca-nhan', label: 'Cá nhân', icon: '👤' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '72px',
      backgroundColor: '#1e2937',
      borderTop: '1px solid #334155',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 10000,
      boxShadow: '0 -4px 12px rgba(0,0,0,0.5)'
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: isActive ? '#22d3ee' : '#94a3b8',
              cursor: 'pointer',
              flex: 1,
              padding: '6px 0',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '3px' }}>{item.icon}</div>
            <div style={{ fontSize: '10.5px', fontWeight: isActive ? '700' : '500' }}>
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
