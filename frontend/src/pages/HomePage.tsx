import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import DangNhapModal from '../components/Modal/DangNhapModal';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { userRole, piUsername } = useAuth();
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') || userRole || '';
    const savedPi = localStorage.getItem('piUsername');
    
    setCurrentRole(savedRole);
    
    if (savedPi) {
      setIsPiConnected(true);
    }

    if (window.Pi) {
      window.Pi.init({ version: "2.0" })
        .then(() => console.log("✅ Pi SDK initialized successfully"))
        .catch((err: any) => console.warn("Pi SDK init warning:", err));
    }
  }, [userRole]);

  const handleLoginSuccess = (username: string) => {
    setIsPiConnected(true);
    localStorage.setItem('piUsername', username);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất tài khoản Pi Network?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // ===================== GIAO DIỆN TÀI XẾ =====================
  const renderDriverHome = () => (
    <div style={cardsGrid}>
      <div style={cardStyle} onClick={() => onNavigate('tai-xe')}>
        <span style={iconStyle}>🏍️</span>
        <h3 style={cardTitle}>Nhận Đơn Mới</h3>
        <p style={cardDesc}>Đơn hàng gần bạn - kiếm Pi ngay</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('tai-xe')}>
        <span style={iconStyle}>📦</span>
        <h3 style={cardTitle}>Đơn Đang Giao</h3>
        <p style={cardDesc}>Theo dõi & hoàn thành đơn</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('tracking')}>
        <span style={iconStyle}>🔍</span>
        <h3 style={cardTitle}>Lịch Sử Giao Hàng</h3>
        <p style={cardDesc}>Xem tất cả đơn đã giao</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('tai-xe')}>
        <span style={iconStyle}>💰</span>
        <h3 style={cardTitle}>Thu Nhập Pi</h3>
        <p style={cardDesc}>Số dư & lịch thanh toán</p>
      </div>
    </div>
  );

  // ===================== 6 THẺ GỐC =====================
  const renderDefaultHome = () => (
    <div style={cardsGrid}>
      <div style={cardStyle} onClick={() => onNavigate('gui-hang')}>
        <span style={iconStyle}>📦</span>
        <h3 style={cardTitle}>Gửi Hàng Hỏa Tốc</h3>
        <p style={cardDesc}>Tạo đơn giao nhận tức thì bằng Pi</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('tra-cuu-cuoc')}>
        <span style={iconStyle}>💰</span>
        <h3 style={cardTitle}>Tra Cứu Giá Cước</h3>
        <p style={cardDesc}>Tính toán chi phí vận chuyển ước tính</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('kho-hub')}>
        <span style={iconStyle}>🏬</span>
        <h3 style={cardTitle}>Kho Trung Chuyển</h3>
        <p style={cardDesc}>Quản lý trạm Hub phân phối</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('tai-xe')}>
        <span style={iconStyle}>🏍️</span>
        <h3 style={cardTitle}>Đối Tác Tài Xế</h3>
        <p style={cardDesc}>Giao hàng kiếm thu nhập Pi</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('nhan-hang')}>
        <span style={iconStyle}>📥</span>
        <h3 style={cardTitle}>Xác Nhận Nhận Hàng</h3>
        <p style={cardDesc}>Dành cho người mua nhận bưu kiện</p>
      </div>
      <div style={cardStyle} onClick={() => onNavigate('tracking')}>
        <span style={iconStyle}>🔍</span>
        <h3 style={cardTitle}>Tracking Đơn Hàng</h3>
        <p style={cardDesc}>Tra cứu lộ trình thời gian thực</p>
      </div>
    </div>
  );

  // ===================== CHƯA CHỌN VAI TRÒ =====================
  const renderNoRoleHome = () => (
    <div style={noRoleContainer}>
      <div style={noRoleBox}>
        <span style={{ fontSize: '80px', marginBottom: '20px' }}>👤</span>
        <h2 style={{ color: '#4c1d95', marginBottom: '8px' }}>Chào @{piUsername || 'Pioneer'}</h2>
        <p style={{ color: '#6b21a8', fontSize: '18px', marginBottom: '30px', textAlign: 'center' as const }}>
          Bạn chưa chọn vai trò.<br />
          Vui lòng chọn vai trò để sử dụng đầy đủ tính năng GHN.PI
        </p>
        <button 
          onClick={() => onNavigate('dang-ky-vai-tro')}
          style={chooseRoleButton}
        >
          🎯 Chọn vai trò ngay
        </button>
      </div>
    </div>
  );

  return (
    <div style={pageContainer}>
      <div style={logoContainer}>
        <h1 style={logoStyle}>GHN.PI</h1>
        <p style={subtitleStyle}>Hệ Thống Giao Nhận Phi Tập Trung Tiên Phong</p>
      </div>

      <div style={piButtonContainer}>
        {isPiConnected ? (
          <button 
            style={{...piButton, background: 'linear-gradient(135deg, #059669, #10b981)'}} 
            onClick={handleLogout}
          >
            ⚡ @{piUsername} ({(currentRole === 'driver' || currentRole === 'tai-xe') ? 'Tài Xế' : 'Khách Hàng'})
          </button>
        ) : (
          <button style={piButton} onClick={() => setShowLoginModal(true)}>
            🔮 Kết Nối Pi Network
          </button>
        )}
      </div>

      {/* === LOGIC HIỂN THỊ THEO TRẠNG THÁI === */}
      {!currentRole 
        ? renderNoRoleHome()
        : (currentRole === 'driver' || currentRole === 'tai-xe') 
          ? renderDriverHome() 
          : renderDefaultHome()
      }

      <DangNhapModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess}
      />

      <BottomNav onNavigate={onNavigate} currentPage="home" />
    </div>
  );
};

/* ==================== STYLES (GIỮ NGUYÊN 100% GỐC + THÊM PHẦN CHƯA CHỌN VAI TRÒ) ==================== */
const pageContainer: React.CSSProperties = { 
  minHeight: '100vh', 
  background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', 
  padding: '16px 14px 90px', 
  boxSizing: 'border-box' 
};
const logoContainer: React.CSSProperties = { textAlign: 'center' as const, marginBottom: '30px' };
const logoStyle: React.CSSProperties = { fontSize: '52px', fontWeight: '700', color: '#4c1d95' };
const subtitleStyle: React.CSSProperties = { color: '#6b21a8', marginTop: '4px' };
const piButtonContainer: React.CSSProperties = { display: 'flex', justifyContent: 'center' as const, marginBottom: '40px', padding: '0 14px' };
const piButton: React.CSSProperties = { padding: '18px 40px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', fontSize: '17px', cursor: 'pointer', width: '100%', maxWidth: '340px' };
const cardsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const cardStyle: React.CSSProperties = { background: 'white', padding: '20px 14px', borderRadius: '24px', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.06)', border: '1px solid #f3e8ff', transition: 'transform 0.2s, box-shadow 0.2s', minHeight: '145px', boxSizing: 'border-box' };
const iconStyle: React.CSSProperties = { fontSize: '48px', marginBottom: '12px', display: 'block', textAlign: 'center' as const };
const cardTitle: React.CSSProperties = { fontSize: '17px', fontWeight: '700', color: '#4c1d95', margin: '0 0 6px 0', textAlign: 'center' as const, width: '100%', display: 'block' };
const cardDesc: React.CSSProperties = { fontSize: '13.5px', color: '#64748b', margin: 0, textAlign: 'center' as const, width: '100%', display: 'block' };

// === PHẦN MỚI: CHƯA CHỌN VAI TRÒ ===
const noRoleContainer: React.CSSProperties = { 
  display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', padding: '20px' 
};
const noRoleBox: React.CSSProperties = { 
  background: 'white', borderRadius: '24px', padding: '40px 20px', textAlign: 'center' as const, boxShadow: '0 4px 20px rgba(124, 58, 237, 0.1)', maxWidth: '340px', width: '100%' 
};
const chooseRoleButton: React.CSSProperties = { 
  background: '#4c1d95', color: 'white', border: 'none', borderRadius: '9999px', padding: '18px 40px', fontSize: '17px', fontWeight: '700', width: '100%', cursor: 'pointer' 
};

export default HomePage;