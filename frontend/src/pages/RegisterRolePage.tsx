// src/pages/RegisterRolePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import type { AppRole } from '../utils/constants';
import { REGISTRABLE_ROLES, ROLE_INFO, getRoleLabel } from '../utils/constants';

// Sử dụng single source from constants.ts (không duplicate data)
const roleOptions = REGISTRABLE_ROLES.map((key) => ROLE_INFO[key]);

const RegisterRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, logout, role, updateRole, isLoading: authLoading } = useAuth();

  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AppRole | null>(role);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');
  const [justSaved, setJustSaved] = useState(false);

  // Tối ưu: Tự động nhận diện đã đăng nhập Pi từ context (không cần bấm nút lại nếu đã login trước đó)
  useEffect(() => {
    if (user?.username) {
      setIsPiConnected(true);
      setPiUsername(user.username);
      setError(''); // clear lỗi cũ
    }
    if (role) {
      setSelectedRole(role);
    }
  }, [user?.username, role]);

  // Auto navigate sau khi lưu thành công (hiển thị trạng thái success trước)
  useEffect(() => {
    if (justSaved && selectedRole && role === selectedRole) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 450);
      return () => clearTimeout(timer);
    }
  }, [justSaved, role, selectedRole, navigate]);

  // Khôi phục draft role từ local (nếu context chưa có)
  useEffect(() => {
    if (!selectedRole) {
      const saved = localStorage.getItem('selectedRole') as AppRole | null;
      if (saved && REGISTRABLE_ROLES.includes(saved)) {
        setSelectedRole(saved);
      }
    }
  }, [selectedRole]);

  const clearError = () => setError('');

  const handlePiConnect = async () => {
    clearError();
    try {
      setIsConnecting(true);
      await login();
      // Sau khi login, useEffect trên sẽ tự sync isPiConnected + username từ context user
    } catch (error: any) {
      console.error(error);
      setError('Kết nối Pi thất bại: ' + (error?.message || 'Hãy mở trong Pi Browser (sdk.minepi.com)'));
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSelectRole = (roleKey: AppRole) => {
    clearError();
    setSelectedRole(roleKey);
    setJustSaved(false);
  };

  // Seed tối thiểu profile để các form (Gửi hàng, Tra cứu cước...) tự điền tên từ Pi, tránh gõ tay lần đầu
  const seedProfileForRole = (chosen: AppRole, uname: string, displayName?: string) => {
    const name = displayName || uname || 'Người dùng Pi';
    if (chosen === 'sender') {
      const existing = localStorage.getItem('mySenderInfo');
      if (!existing) {
        localStorage.setItem('mySenderInfo', JSON.stringify({
          nguoiGui: name,
          sdtGui: '',
          diaChiGui: '',
        }));
      }
    } else if (chosen === 'receiver') {
      const existing = localStorage.getItem('lastReceiverInfo');
      if (!existing) {
        localStorage.setItem('lastReceiverInfo', JSON.stringify({
          nguoiNhan: name,
          sdtNhan: '',
          diaChiNhan: '',
        }));
      }
    }
    // driver/warehouse: có thể mở rộng sau nếu cần profile riêng
  };

  const handleConfirmRole = async () => {
    clearError();
    if (!selectedRole) {
      setError('Vui lòng chọn một vai trò trong 4 lựa chọn bên dưới');
      return;
    }
    if (!isPiConnected) {
      setError('Bạn cần kết nối / xác thực với Pi Network trước khi chọn vai trò');
      return;
    }

    setIsSaving(true);
    try {
      updateRole(selectedRole);

      // Lưu username tiện dụng
      if (piUsername) {
        localStorage.setItem('piUsername', piUsername);
      }

      // Seed profile info (tối ưu UX cho form sau này)
      seedProfileForRole(selectedRole, piUsername, user?.name);

      setJustSaved(true);
      // Navigation sẽ do useEffect xử lý sau khi context cập nhật + delay nhỏ để user thấy trạng thái success
    } catch (e: any) {
      setError('Lưu vai trò thất bại. Thử lại nhé.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeepCurrentRole = () => {
    clearError();
    navigate('/');
  };

  const handleLogout = () => {
    clearError();
    logout();
    setIsPiConnected(false);
    setPiUsername('');
    setSelectedRole(null);
    setJustSaved(false);
    // Now logout in context also removes selectedRole; go back to guest Home
    navigate('/');
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

        {/* Inline error (thay alert, không đổi style card) */}
        {error && (
          <div style={{ marginTop: 10, fontSize: 12, color: '#dc2626', background: '#fef2f2', padding: '6px 10px', borderRadius: 8 }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* === BƯỚC 2: CHỌN VAI TRÒ === */}
      <div style={card}>
        <div style={{ marginBottom: 12, fontWeight: 600, color: '#4c1d95' }}>
          Bước 2: Chọn vai trò của bạn
          {role && role !== 'guest' && (
            <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}> — đang thay đổi từ: {getRoleLabel(role)}</span>
          )}
        </div>

        <div style={roleGrid}>
          {roleOptions.map((r) => (
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

        {/* Giữ nguyên (nếu đang đổi vai trò) - functional button, reuse style nhỏ */}
        {role && role !== 'guest' && selectedRole !== role && (
          <button
            onClick={handleKeepCurrentRole}
            style={{ ...logoutSmallBtn, marginTop: 12, color: '#4c1d95', textDecoration: 'none', fontSize: 13 }}
          >
            ← Giữ nguyên vai trò hiện tại ({getRoleLabel(role)})
          </button>
        )}
      </div>

      {/* Nút xác nhận (có trạng thái success) */}
      <button
        onClick={handleConfirmRole}
        disabled={!isPiConnected || !selectedRole || isSaving || justSaved}
        style={{
          ...confirmButton,
          background: justSaved ? '#86efac' : ((!isPiConnected || !selectedRole) ? '#cbd5e1' : 'linear-gradient(90deg, #22d3ee, #67e8f9)'),
          color: justSaved ? '#166534' : ((!isPiConnected || !selectedRole) ? '#64748b' : '#0f172a'),
        }}
      >
        {justSaved ? '✅ ĐÃ LƯU VAI TRÒ — ĐANG VÀO APP...' : (isSaving ? 'Đang lưu vai trò...' : 'XÁC NHẬN VAI TRÒ & VÀO APP')}
      </button>

      <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 16 }}>
        Vai trò có thể đổi sau trong mục Cá nhân • Dành cho 4 vai trò hoạt động (Admin gán riêng)
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