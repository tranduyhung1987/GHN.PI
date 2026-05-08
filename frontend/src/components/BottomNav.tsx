// src/components/BottomNav.tsx
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname === '/' ? 'home' : location.pathname.slice(1);

  const navItems = [
    { icon: "🏠", label: "Trang chủ", path: "/" },
    { icon: "📦", label: "Gửi hàng", path: "/gui-hang" },
    { icon: "🏬", label: "Kho hàng", path: "/kho-hub" },
    { icon: "🏍️", label: "Tài xế", path: "/tai-xe" },
    { icon: "📍", label: "Theo dõi", path: "/tracking" }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e2937',
      borderTop: '1px solid #334155',
      padding: '12px 0',
      zIndex: 100
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
        {navItems.map((item) => {
          const isActive = currentPath === (item.path === '/' ? 'home' : item.path.slice(1));
          return (
            <div 
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ 
                textAlign: 'center', 
                color: isActive ? '#22d3ee' : '#94a3b8',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <div style={{ fontSize: '28px' }}>{item.icon}</div>
              <div style={{ fontSize: '11px', marginTop: '4px' }}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}