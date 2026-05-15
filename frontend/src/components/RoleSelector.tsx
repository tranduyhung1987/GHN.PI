// src/components/RoleSelector.tsx
import { useAuth } from '../contexts/AuthContext';

const RoleSelector = () => {
  const { login } = useAuth();   // ← Phải khớp với AuthContext

  const roles = [
    { 
      id: 'member', 
      label: 'Thành Viên / Shop', 
      icon: '👤', 
      color: '#4c1d95',
      desc: 'Tạo đơn, theo dõi hàng' 
    },
    { 
      id: 'driver', 
      label: 'Tài Xế', 
      icon: '🏍️', 
      color: '#22d3ee',
      desc: 'Nhận đơn giao hàng' 
    },
    { 
      id: 'warehouse', 
      label: 'Kho Trung Chuyển', 
      icon: '🏬', 
      color: '#a855f7',
      desc: 'Quản lý kho & vận chuyển' 
    },
    { 
      id: 'admin', 
      label: 'Quản Trị Viên', 
      icon: '👑', 
      color: '#eab308',
      desc: 'Quản lý hệ thống' 
    },
  ];

  const handleSelect = (role: string) => {
    login({ 
      role: role as any, 
      name: `Người dùng ${role}` 
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#4c1d95', fontSize: '32px', marginBottom: '8px' }}>
          Chào mừng đến GHN.PI
        </h1>
        <p style={{ color: '#6b21a8', fontSize: '18px' }}>
          Vui lòng chọn vai trò của bạn
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px', 
        width: '100%', 
        maxWidth: '460px' 
      }}>
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => handleSelect(role.id)}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '28px 20px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '2px solid transparent'
            }}
          >
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>{role.icon}</div>
            <h3 style={{ color: '#4c1d95', margin: '0 0 6px 0' }}>{role.label}</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{role.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;