import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Xác nhận",
  cancelText = "Đóng",
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        background: '#f3e8ff',           // ← Tím nhạt theo theme app
        borderRadius: '28px',
        width: '92%',
        maxWidth: '420px',
        overflow: 'hidden',
        boxShadow: '0 30px 90px rgba(124, 58, 237, 0.45)',
      }}>
        {/* Header Gradient */}
        <div style={{
          background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #a855f7)',
          color: 'white',
          padding: '32px 24px 24px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '26px', 
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            {title}
          </h2>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Nội dung - Tím nhạt */}
        <div style={{ 
          padding: '32px 28px', 
          textAlign: 'center', 
          color: '#4c1d95', 
          fontSize: '16.5px',
          lineHeight: '1.6'
        }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #e0d4ff',
          background: '#f3e8ff',
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '20px',
              fontSize: '17px',
              fontWeight: '600',
              color: '#6b21a8',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '20px',
                fontSize: '17px',
                fontWeight: '700',
                color: 'white',
                background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;