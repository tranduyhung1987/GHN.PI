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

  // ===================== TEST THANH TOÁN PI (GIỮ NGUYÊN GỐC) =====================
  const handleTestPayment = async () => {
    if (typeof window.Pi === 'undefined') {
      alert("⚠️ Lỗi: Không tìm thấy window.Pi. Bạn có chắc đang mở trong Pi Browser không?");
      return;
    }
    try {
      alert("Đang khởi tạo SDK...");
      await (window as any).Pi.init({ version: "2.0", sandbox: true });
      alert("SDK sẵn sàng! Đang gọi lệnh thanh toán...");

      const paymentData = {
        amount: 0.1,
        memo: "Thử nghiệm thanh toán",
        metadata: { orderId: "test_123" },
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId: string) => alert("✅ Đã sẵn sàng duyệt: " + paymentId),
        onReadyForServerCompletion: (paymentId: string, txid: string) => alert("🎉 Giao dịch thành công! TXID: " + txid),
        onCancel: (paymentId: string) => alert("❌ Người dùng đã hủy giao dịch"),
        onError: (error: any, paymentId: string) => alert("❌ Lỗi SDK: " + JSON.stringify(error)),
      };

      window.Pi.requestPayment(paymentData, callbacks);
    } catch (err) {
      alert("❌ Lỗi hệ thống khi gọi thanh toán: " + err);
      console.error("Lỗi chi tiết:", err);
    }
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

  // ===================== GIAO DIỆN MẶC ĐỊNH (6 THẺ GỐC) =====================
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

  return (
    <div style={pageContainer}>
      <div style={logoContainer}>
        <h1 style={logoStyle}>GHN.PI</h1>
        <p style={subtitleStyle}>Hệ Thống Giao Nhận Phi Tập Trung Tiên Phong</p>
      </div>

      <div style={piButtonContainer}>
        {isPiConnected ? (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <button style={{...piButton, marginBottom: '10px', background: 'linear-gradient(135deg, #059669, #10b981)'}} onClick={handleLogout}>
              ⚡ @{piUsername} ({currentRole === 'driver' || currentRole === 'tai-xe' ? 'Tài Xế' : 'Khách Hàng'})
            </button>
            <button style={{...piButton, background: '#f59e0b', maxWidth: '340px'}} onClick={handleTestPayment}>
              💰 Test Thanh Toán (SDK)
            </button>
          </div>
        ) : (
          <button style={piButton} onClick={() => setShowLoginModal(true)}>
            🔮 Kết Nối Pi Network
          </button>
        )}
      </div>

      {/* === PHẦN QUAN TRỌNG: RENDER THEO ROLE === */}
      {(currentRole === 'driver' || currentRole === 'tai-xe') 
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

/* ==================== SYSTEM STYLES (GIỮ NGUYÊN 100% GỐC) ==================== */
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

export default HomePage;