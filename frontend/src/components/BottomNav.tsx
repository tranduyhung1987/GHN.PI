import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      path: '/', 
      label: 'Trang chủ', 
      icon: '🏠' 
    },
    { 
      path: '/don-hang', 
      label: 'Đơn hàng', 
      icon: '📦' 
    },
    { 
      path: '/chat', 
      label: 'Chat', 
      icon: '💬' 
    },
    { 
      path: '/doi-soat', 
      label: 'Đối soát', 
      icon: '📊' 
    },
    { 
      path: '/khieu-nai', 
      label: 'Khiếu nại', 
      icon: '⚠️' 
    },
    { 
      path: '/ca-nhan', 
      label: 'Cá nhân', 
      icon: '👤' 
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e2937',
      borderTop: '1px solid #334155',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 0 4px 0',
      height: '70px',
      zIndex: 1000,
    }}>
      {navItems.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: location.pathname === item.path ? '#22d3ee' : '#94a3b8',
            cursor: 'pointer',
            flex: 1,
          }}
        >
          <div style={{ fontSize: '26px', marginBottom: '2px' }}>{item.icon}</div>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: location.pathname === item.path ? '600' : '400' 
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
