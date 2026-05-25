// src/components/Modal/DangNhapModal.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePiAuth } from '@/hooks/usePiAuth';
import { ROLES } from '@/utils/constants';

interface DangNhapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => Promise<void>;
}

const DangNhapModal: React.FC<DangNhapModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [localLoading, setLocalLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { loginWithPi, loading: authLoading, piUsername } = usePiAuth();

  const fromPage = (location.state as any)?.from?.pathname || '/';

  if (!isOpen) return null;

  const isLoading = localLoading || authLoading;

  /**
   * PI LOGIN HANDLER - SỬ DỤNG ADAPTER
   */
  const handlePiLogin = async () => {
    setLocalLoading(true);

    try {
      await loginWithPi();        // ← Đi qua PiAdapter (Real hoặc Mock)

      onClose();

      if (onLogin) {
        await onLogin();
      }

      navigate(fromPage, { replace: true });

      alert(`✅ Đăng nhập thành công!\nUsername: @${piUsername || 'pi_user'}`);
    } catch (err) {
      console.error("[Pi Login Error]", err);
      alert("Đăng nhập Pi thất bại! Vui lòng thử lại.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div style={modalOverlay}>
      <div style={modalContent}>
        <h2 style={titleStyle}>Đăng Nhập</h2>

        <button
          onClick={handlePiLogin}
          disabled={isLoading}
          style={piButtonStyle}
        >
          {isLoading ? 'Đang kết nối...' : '🚀 Đăng nhập bằng Pi Network'}
        </button>

        <p style={hintStyle}>
          Hoặc đăng ký vai trò sau khi đăng nhập
        </p>

        <button onClick={onClose} style={cancelButtonStyle}>
          Đóng
        </button>
      </div>
    </div>
  );
};

/* ==================== STYLES ==================== */
const modalOverlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalContent: React.CSSProperties = {
  background: 'white',
  padding: '32px 24px',
  borderRadius: '24px',
  width: '90%',
  maxWidth: '420px',
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#4c1d95',
  marginBottom: '24px',
  fontSize: '24px',
  fontWeight: 700,
};

const piButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '18px',
  background: '#4c1d95',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  marginBottom: '16px',
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#f3f4f6',
  color: '#4c1d95',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  cursor: 'pointer',
};

const hintStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: '#666',
  fontSize: '14px',
};

export default DangNhapModal;