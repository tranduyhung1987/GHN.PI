import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleSelector() {
  const { role, setRole } = useAuth();
  const [position, setPosition] = useState({ x: 50, y: 60 }); // vị trí ban đầu (%)
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const roles = [
    { value: 'shop', label: 'Shop', emoji: '🏪' },
    { value: 'driver', label: 'Tài xế', emoji: '🏍️' },
    { value: 'warehouse', label: 'Kho', emoji: '📦' },
    { value: 'admin', label: 'Admin', emoji: '👑' },
  ];

  // ==================== KÉO THẢ ====================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;
    setIsDragging(true);
    const rect = ref.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newX = ((e.clientX - dragOffset.x) / window.innerWidth) * 100;
    const newY = ((e.clientY - dragOffset.y) / window.innerHeight) * 100;
    setPosition({
      x: Math.max(5, Math.min(95, newX)),
      y: Math.max(5, Math.min(85, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '14px 20px',
        borderRadius: '16px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.6)',
        zIndex: 9999,
        width: '90%',
        maxWidth: '380px',
        textAlign: 'center',
        border: '3px solid #a855f7',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', color: '#1e2937' }}>
        🔧 TEST ROLE - DÙNG ĐỂ KIỂM TRA GIAO DIỆN
      </div>

      <div style={{ marginBottom: '10px', color: '#334155' }}>
        Role hiện tại: <strong>{role}</strong>
      </div>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {roles.map(r => (
          <button
            key={r.value}
            onClick={() => setRole(r.value as any)}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              border: role === r.value ? '2px solid #22d3ee' : '1px solid #cbd5e1',
              background: role === r.value ? '#0f172a' : 'white',
              color: role === r.value ? 'white' : '#0f172a',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setRole('guest')}
        style={{ marginTop: '12px', fontSize: '13px', color: '#ef4444', fontWeight: '500' }}
      >
        Đăng xuất (Guest)
      </button>

      {/* Hướng dẫn kéo thả */}
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '8px' }}>
        🖱️ Kéo thả khung này để di chuyển
      </div>
    </div>
  );
}