import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: '/', label: 'Trang chủ', icon: '🏠' },
    { path: '/don-hang', label: 'Đơn hàng', icon: '📦' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/tai-xe', label: 'Tài xế', icon: '🏍️' },
    { path: '/ca-nhan', label: 'Tôi', icon: '👤' },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '70px',
      backgroundColor: '#1e2937',
      borderTop: '1px solid #334155',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      {items.map((item) => (
        <div
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            textAlign: 'center',
            color: location.pathname === item.path ? '#22d3ee' : '#94a3b8',
            cursor: 'pointer',
            padding: '6px 0',
            flex: 1,
          }}
        >
          <div style={{ fontSize: '26px', marginBottom: '2px' }}>{item.icon}</div>
          <div style={{ fontSize: '11px' }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}