import React from 'react';

interface RoleSelectorProps {
  onSelectRole: (role: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole }) => {
  const roles = [
    { id: 'member', label: 'Thành Viên', icon: '👤', color: '#4c1d95' },
    { id: 'driver', label: 'Tài Xế', icon: '🏍️', color: '#22d3ee' },
    { id: 'warehouse', label: 'Kho Trung Chuyển', icon: '🏬', color: '#a855f7' },
    { id: 'admin', label: 'Quản Trị Viên', icon: '⚡', color: '#eab308' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3e8ff 0%, #e0e7ff 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#4c1d95', fontSize: '32px', marginBottom: '8px' }}>
          Chào mừng đến với GHN.PI
        </h1>
        <p style={{ color: '#6b21a8', fontSize: '18px' }}>
          Vui lòng chọn vai trò của bạn
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%', maxWidth: '420px' }}>
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '24px 16px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              border: '2px solid transparent'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = role.color}
            onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
          >
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>{role.icon}</div>
            <h3 style={{ color: '#4c1d95', margin: '0 0 4px 0' }}>{role.label}</h3>
            <p style={{ color: '#64748b', fontSize: '14px' }}>Nhấn để tiếp tục</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;