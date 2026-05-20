import React, { useState, useEffect, useRef } from 'react';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface DangKyVaiTroPageProps {
  onNavigate: (page: string) => void;
}

const DangKyVaiTroPage: React.FC<DangKyVaiTroPageProps> = ({ onNavigate }) => {
  const { setAuth } = useAuth();
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedPi = localStorage.getItem('piUsername');
    if (savedPi) {
      setIsPiConnected(true);
      setPiUsername(savedPi);
    }
    
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('userAvatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

const handlePiLogin = async () => {
    setIsLoading(true);
    try {
      // Gọi SDK Pi để xác thực người dùng thật
      await window.Pi.authenticate(['username'], 
        (authResult: any) => {
          const username = authResult.user.username; // Lấy username thật từ Pi
          setIsPiConnected(true);
          setPiUsername(username);
          localStorage.setItem('piUsername', username);
          setIsLoading(false);
          alert(`✅ Đăng nhập Pi Network thành công!\nChào mừng @${username}`);
        }, 
        (error: any) => {
          console.error("Lỗi xác thực Pi:", error);
          setIsLoading(false);
          alert("Kết nối Pi thất bại!");
        }
      );
    } catch (err) {
      console.error("Lỗi:", err);
      setIsLoading(false);
    }
  };

  const handleSelectRole = (role: string, label: string) => {
    localStorage.setItem('userRole', role);
    localStorage.setItem('currentPage', 'home');
    alert(`🎉 ĐÃ CHỌN VAI TRÒ: ${label}\n\nTrang sẽ tải lại để áp dụng giao diện!`);
    window.location.reload();
  };

  const roles = [
    { id: 'sender', label: 'Người Gửi Hàng', icon: '📦', desc: 'Tạo đơn & thanh toán Pi' },
    { id: 'driver', label: 'Tài Xế', icon: '🏍️', desc: 'Nhận đơn giao hàng' },
    { id: 'warehouse', label: 'Kho Trung Chuyển', icon: '🏬', desc: 'Quản lý kho' },
    { id: 'receiver', label: 'Người Nhận Hàng', icon: '🖐️', desc: 'Xác nhận nhận hàng' },
  ];

  return (
    <div style={pageContainer}>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*" 
      />

      <div style={headerStyle}>
        <div style={avatarContainerStyle} onClick={handleAvatarClick}>
          <img 
            src={avatarUrl || "https://minepi.com/wp-content/uploads/2019/04/pi-logo.png"} 
            alt="Avatar" 
            style={avatarImageStyle} 
          />
        </div>
        
        <h1 style={titleStyle}>CHỌN VAI TRÒ CỦA BẠN</h1>
        
        {isPiConnected ? (
          <div style={statusBoxStyle}>✅ Đã kết nối @{piUsername}</div>
        ) : (
          <p style={subtitleStyle}>Bạn phải đăng nhập Pi Network trước khi chọn vai trò</p>
        )}
      </div>

      {!isPiConnected ? (
        <div style={warningBox}>
          <div style={warningContent}>
            <span style={{ fontSize: '28px', marginRight: '12px' }}>⚠️</span>
            <strong>Chưa kết nối Pi Network</strong>
          </div>
          <button onClick={handlePiLogin} disabled={isLoading} style={piLoginButton}>
            {isLoading ? 'Đang kết nối...' : '⭐ Đăng nhập với Pi Network'}
          </button>
        </div>
      ) : (
        <div style={rolesGrid}>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleSelectRole(role.id, role.label)}
              style={roleCard}
            >
              <div style={roleIcon}>{role.icon}</div>
              <h3 style={roleTitle}>{role.label}</h3>
              <p style={roleDesc}>{role.desc}</p>
            </div>
          ))}
        </div>
      )}

      <BottomNav
        onNavigate={onNavigate}
        currentPage="dang-ky-vai-tro"
      />
    </div>
  );
};

/* ===================== STYLES ===================== */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)',
  padding: '20px 14px 90px',
  boxSizing: 'border-box',
};

const headerStyle: React.CSSProperties = { textAlign: 'center' as const, marginBottom: '30px' };

const avatarContainerStyle: React.CSSProperties = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  overflow: 'hidden', 
  cursor: 'pointer',
  margin: '0 auto 12px auto',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  border: '4px solid #ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const avatarImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',        // Lệnh "tự zoom lấp đầy khung"
  objectPosition: 'center',  // Luôn căn giữa ảnh
  display: 'block',
  
  // MẸO: Nếu ảnh vẫn chưa full, bạn tăng giá trị scale lên (ví dụ 1.2, 1.3, 1.4)
  // 1.0 là mặc định. Bạn tăng dần lên cho đến khi thấy vừa mắt nhất.
  transform: 'scale(1.4)', 
  
  // Thêm cái này để tránh việc zoom bị lệch
  transition: 'transform 0.2s ease-in-out'
};

const titleStyle: React.CSSProperties = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: '0 0 8px 0' };
const subtitleStyle: React.CSSProperties = { color: '#6b21a8', fontSize: '15.5px' };

const warningBox: React.CSSProperties = {
  background: 'white',
  border: '3px solid #ef4444',
  borderRadius: '20px',
  padding: '24px 20px',
  marginBottom: '30px',
  textAlign: 'center' as const,
};

const statusBoxStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '2px solid #a78bfa',
  borderRadius: '12px',
  padding: '10px 20px',
  marginTop: '15px',
  display: 'inline-block',
  color: '#4c1d95',
  fontWeight: '600'
};

const warningContent: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '20px',
  fontSize: '17px',
  color: '#b91c1c',
};

const piLoginButton: React.CSSProperties = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  cursor: 'pointer',
};

const rolesGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const roleCard: React.CSSProperties = {
  background: 'white',
  borderRadius: '20px',
  padding: '24px 16px',
  textAlign: 'center' as const,
  border: '1px solid #e0d4ff',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
  cursor: 'pointer',
};
const roleIcon: React.CSSProperties = { fontSize: '52px', marginBottom: '12px' };
const roleTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', color: '#4c1d95', margin: '0 0 6px 0' };
const roleDesc: React.CSSProperties = { fontSize: '13.5px', color: '#64748b', margin: 0 };

export default DangKyVaiTroPage;