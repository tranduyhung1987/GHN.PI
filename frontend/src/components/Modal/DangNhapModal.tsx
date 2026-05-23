// src/components/Modal/DangNhapModal.tsx

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "@/core/auth/AuthContext";
import { ROLES } from '../../utils/constants';

interface DangNhapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: () => Promise<void>;
}

const DangNhapModal: React.FC<DangNhapModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { setAuth } = useAuth();

  const fromPage =
    (location.state as any)?.from?.pathname || '/home';

  if (!isOpen) return null;

  /**
   * PI LOGIN HANDLER
   */
  const handlePiLogin = async () => {
    if (!window.Pi) {
      alert("Vui lòng mở trong Pi Browser để đăng nhập!");
      return;
    }

    setIsLoading(true);

    try {
      const scopes = ['username', 'payments'];

      const auth = await window.Pi.authenticate(
        scopes,
        () => Promise.resolve()
      );

      const username =
        auth?.user?.username || "pi_user";

      /**
       * ✅ FIX AUTH CONTEXT SHAPE (STEP UPDATE)
       */
      await setAuth({
        piUsername: username,
        userRole: ROLES.SELLER,
      });

      onClose();

      /**
       * backward compatible hook
       */
      if (onLogin) {
        await onLogin();
      }

      navigate(fromPage, { replace: true });

      alert(
        `✅ Đăng nhập thành công!\nUsername: @${username}`
      );
    } catch (err) {
      console.error("[Pi Login Error]", err);
      alert("Đăng nhập Pi thất bại! Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
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
          {isLoading
            ? 'Đang kết nối...'
            : '🚀 Đăng nhập bằng Pi Network'}
        </button>

        <p style={hintStyle}>
          Hoặc đăng ký vai trò sau khi đăng nhập
        </p>

        <button
          onClick={onClose}
          style={cancelButtonStyle}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

/**
 * STYLES
 */

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
  zIndex: 9999
};

const modalContent: React.CSSProperties = {
  background: 'white',
  padding: '32px 24px',
  borderRadius: '24px',
  width: '90%',
  maxWidth: '420px',
  textAlign: 'center'
};

const titleStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#4c1d95',
  marginBottom: '24px'
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
  cursor: 'pointer'
};

const cancelButtonStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px',
  background: '#f3f4f6',
  color: '#4c1d95',
  border: 'none',
  borderRadius: '12px',
  fontWeight: '600',
  cursor: 'pointer'
};

const hintStyle: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '20px',
  color: '#666',
  fontSize: '14px'
};

export default DangNhapModal;