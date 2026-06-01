// src/pages/RegisterRolePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import type { AppRole } from '../utils/constants';

const ROLES: { key: AppRole; label: string; icon: string; desc: string }[] = [
  { key: 'sender',    label: 'Người gửi hàng',     icon: '📦', desc: 'Tạo đơn gửi hàng & thanh toán Pi' },
  { key: 'driver',    label: 'Tài xế',             icon: '🏍️', desc: 'Nhận đơn & giao hàng' },
  { key: 'warehouse', label: 'Kho trung chuyển',   icon: '🏬', desc: 'Quản lý nhập - xuất kho, trung chuyển' },
  { key: 'receiver',  label: 'Người nhận hàng',    icon: '📥', desc: 'Nhận hàng & xác nhận giao hàng' },
];

const RegisterRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, logout, role, updateRole, isLoading: authLoading } = useAuth();

  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(role);
  const [isSaving, setIsSaving] = useState(false);

  // Đồng bộ state khi user/role thay đổi từ context
  useEffect(() => {
    if (user?.username) {
      setIsPiConnected(true);
      setPiUsername(user.username);
    }
    if (role) {
      setSelectedRole(role);
    }
  }, [user?.username, role]);

  // Auto navigate to Home after successful role selection (more reliable than timeout)
  useEffect(() => {
    if (selectedRole && role === selectedRole && isPiConnected) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [role, selectedRole, isPiConnected, navigate]);

  // Tự động khôi phục role đã chọn trước đó
  useEffect(() => {
    const saved = localStorage.getItem('selectedRole') as AppRole | null;
    if (saved && !selectedRole) {
      setSelectedRole(saved);
    }
  }, []);

  const handlePiConnect = async () => {
    try {
      setIsConnecting(true);
      await login();

      // Sau login thành công
      setIsPiConnected(true);
      if (user?.username) setPiUsername(user.username);
    } catch (error: any) {
      console.error(error);
      alert('Kết nối Pi thất bại: ' + (error?.message || 'Hãy mở trong Pi Browser'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectRole = (roleKey: AppRole) => {
    setSelectedRole(roleKey);
  };

  const handleConfirmRole = async () => {
    if (!selectedRole) {
      alert('Vui lòng chọn một vai trò');
      return;
    }
    if (!isPiConnected) {
      alert('Bạn cần kết nối Pi trước');
      return;
    }

    setIsSaving(true);
    try {
      updateRole(selectedRole);

      // Lưu thêm username để các trang khác dễ dùng
      if (piUsername) {
        localStorage.setItem('piUsername', piUsername);
      }

      // Navigation is now handled by the useEffect above (more reliable)
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsPiConnected(false);
    setPiUsername('');
    setSelectedRole(null);
    localStorage.removeItem('selectedRole');
  };

  return (
    <div style={container}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Quay lại</button>

      <h2 style={title}>Đăng ký vai trò</h2>
      <p style={subtitle}>Kết nối Pi Network và chọn vai trò để sử dụng GHN.PI</p>

      {/* === BƯỚC 1: KẾT NỐI PI === */}
      <div style={card}>
        <div style={{ marginBottom: 12, fontWeight: 600, color: '#4c1d95' }}>
          Bước 1: Xác thực với Pi Network
        </div>

        {!isPiConnected ? (
          <button
            onClick={handlePiConnect}
            disabled={isConnecting || authLoading}
            style={piButton}
          >
            {isConnecting ? 'Đang kết nối Pi...' : '⭐ Kết nối Pi Network'}
          </button>
        ) : (
          <div style={connectedBox}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>✅ Đã kết nối</div>
            <div style={{ color: '#22d3ee', fontWeight: 700, marginTop: 4 }}>
              @{piUsername}
            </div>
            <button onClick={handleLogout} style={logoutSmallBtn}>Đăng xuất</button>
          </div>
        )}
      </div>

      {/* === BƯỚC 2: CHỌN VAI TRÒ === */}
      <div style={card}>
        <div style={{ marginBottom: 12, fontWeight: 600, color: '#4c1d95' }}>
          Bước 2: Chọn vai trò của bạn
        </div>

        <div style={roleGrid}>
          {ROLES.map((r) => (
            <div
              key={r.key}
              onClick={() => isPiConnected && handleSelectRole(r.key)}
              style={{
                ...roleItem,
                border: selectedRole === r.key ? '2px solid #22d3ee' : '1px solid #e0d4ff',
                background: selectedRole === r.key ? '#f0fdfa' : 'white',
                opacity: isPiConnected ? 1 : 0.6,
                cursor: isPiConnected ? 'pointer' : 'not-allowed',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#4c1d95' }}>{r.label}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Nút xác nhận */}
      <button
        onClick={handleConfirmRole}
        disabled={!isPiConnected || !selectedRole || isSaving}
        style={{
          ...confirmButton,
          background: (!isPiConnected || !selectedRole) ? '#cbd5e1' : 'linear-gradient(90deg, #22d3ee, #67e8f9)',
          color: (!isPiConnected || !selectedRole) ? '#64748b' : '#0f172a',
        }}
      >
        {isSaving ? 'Đang lưu vai trò...' : 'XÁC NHẬN VAI TRÒ & VÀO APP'}
      </button>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 16 }}>
        Vai trò có thể đổi sau trong mục Cá nhân
      </p>
    </div>
  );
};

/* ==================== STYLES ==================== */
const container: React.CSSProperties = { padding: '18px 16px 100px', background: '#f3e8ff', minHeight: '100vh' };
const backBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#4c1d95', fontSize: 15, fontWeight: 600, marginBottom: 12 };
const title: React.CSSProperties = { color: '#4c1d95', margin: '0 0 4px', fontSize: 24, fontWeight: 700 };
const subtitle: React.CSSProperties = { color: '#64748b', fontSize: 13, marginBottom: 20 };

const card: React.CSSProperties = { background: 'white', borderRadius: 20, padding: 18, marginBottom: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' };

const piButton: React.CSSProperties = { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: 999, fontWeight: 700, fontSize: 16 };
const connectedBox: React.CSSProperties = { background: '#f0fdf4', padding: 14, borderRadius: 16, textAlign: 'center', border: '1px solid #86efac' };
const logoutSmallBtn: React.CSSProperties = { marginTop: 10, fontSize: 12, color: '#dc2626', background: 'none', border: 'none', textDecoration: 'underline' };

const roleGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 };
const roleItem: React.CSSProperties = { padding: '14px 10px', borderRadius: 16, textAlign: 'center', transition: 'all 0.2s' };

const confirmButton: React.CSSProperties = { width: '100%', padding: '18px', fontSize: 17, fontWeight: 700, border: 'none', borderRadius: 999, marginTop: 8 };

export default RegisterRolePage;