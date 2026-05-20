import React, { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';
import DangNhapModal from '../components/Modal/DangNhapModal';

interface HomePageProps {
  onNavigate: (page: string) => void;
  userRole?: string;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, userRole = '' }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState<string>('');
  const [currentRole, setCurrentRole] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Load từ localStorage
    const savedRole = localStorage.getItem('userRole') || userRole || '';
    const savedPi = localStorage.getItem('piUsername');
    
    setCurrentRole(savedRole);
    
    if (savedPi) {
      setIsPiConnected(true);
      setPiUsername(savedPi);
    }

    if (window.Pi) {
      window.Pi.init({ version: "2.0" })
        .then(() => console.log("✅ Pi SDK initialized successfully"))
        .catch((err: any) => console.warn("Pi SDK init warning:", err));
    }
  }, [userRole]);

  // ===================== LOGIN SUCCESS =====================
  const handleLoginSuccess = (username: string) => {
    setIsPiConnected(true);
    setPiUsername(username);
    setShowLoginModal(false);

    // Lưu thông tin
    localStorage.setItem('piUsername', username);
    localStorage.setItem('isPiConnected', 'true');

    // Chuyển hướng theo vai trò (nếu có)
    const savedRole = localStorage.getItem('userRole');
    if (savedRole === 'tai-xe') {
      onNavigate('tai-xe');
    } else if (savedRole === 'kho-hub') {
      onNavigate('kho-hub');
    }
  };

  // Thêm hàm này vào component HomePage - test thanh toán Pi
const handleTestPayment = async () => {
  // 1. Kiểm tra sự tồn tại của Pi SDK
  if (typeof window.Pi === 'undefined') {
    alert("⚠️ Lỗi: Không tìm thấy window.Pi. Bạn có chắc đang mở trong Pi Browser không?");
    return;
  }

  try {
    // 2. Feedback cho người dùng biết là đã bấm được nút
    alert("Đang khởi tạo SDK...");

    // 3. Khởi tạo lại SDK ngay trước khi thanh toán để đảm bảo an toàn
    await (window as any).Pi.init({ version: "2.0", sandbox: true });
    
    alert("SDK sẵn sàng! Đang gọi lệnh thanh toán...");

    // 4. Định nghĩa dữ liệu thanh toán
    const paymentData = {
      amount: 0.1,
      memo: "Thử nghiệm thanh toán",
      metadata: { orderId: "test_123" },
    };

    // 5. Định nghĩa callback
    const callbacks = {
      onReadyForServerApproval: (paymentId: string) => {
        alert("✅ Đã sẵn sàng duyệt: " + paymentId);
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        alert("🎉 Giao dịch thành công! TXID: " + txid);
      },
      onCancel: (paymentId: string) => {
        alert("❌ Người dùng đã hủy giao dịch");
      },
      onError: (error: any, paymentId: string) => {
        alert("❌ Lỗi SDK: " + JSON.stringify(error));
      },
    };

    // 6. Thực hiện thanh toán
    window.Pi.requestPayment(paymentData, callbacks);

  } catch (err) {
    // Nếu có lỗi, nó sẽ hiển thị ở đây
    alert("❌ Lỗi hệ thống khi gọi thanh toán: " + err);
    console.error("Lỗi chi tiết:", err);
  }
};

  // ===================== DANG XUAT =====================
  const handleLogout = () => {
    if(window.confirm("Bạn có chắc muốn đăng xuất tài khoản Pi Network?")) {
      localStorage.clear();
      setIsPiConnected(false);
      setPiUsername('');
      setCurrentRole('');
      window.location.reload();
    }
  };

  return (
    <div style={pageContainer}>
      {/* LOGO SECTION */}
      <div style={logoContainer}>
        <h1 style={logoStyle}>GHN.PI</h1>
        <p style={subtitleStyle}>Hệ Thống Giao Nhận Phi Tập Trung Tiên Phong</p>
      </div>

      {/* PI NETWORK CONNECTION BUTTON */}
      <div style={piButtonContainer}>
        {isPiConnected ? (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <button style={{...piButton, marginBottom: '10px', background: 'linear-gradient(135deg, #059669, #10b981)'}} onClick={handleLogout}>
              ⚡ @{piUsername} ({currentRole === 'tai-xe' ? 'Tài Xế' : currentRole === 'kho-hub' ? 'Chủ Kho' : 'Khách Hàng'})
            </button>
            {/* Nút Test Thanh Toán mới */}
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

      {/* CORE FEATURES GRID */}
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

      {/* LOGIN MODAL COMPONENT */}
      <DangNhapModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

/* ==================== SYSTEM STYLES (TRẢ VỀ BẢN CŨ NGUYÊN GỐC) ==================== */
const pageContainer: React.CSSProperties = { 
  minHeight: '100vh', 
  background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', 
  padding: '16px 14px 90px', 
  boxSizing: 'border-box' 
};

const logoContainer: React.CSSProperties = { textAlign: 'center' as const, marginBottom: '30px' };
const logoStyle: React.CSSProperties = { fontSize: '52px', fontWeight: '700', color: '#4c1d95' };
const subtitleStyle: React.CSSProperties = { color: '#6b21a8', marginTop: '4px' };

const piButtonContainer: React.CSSProperties = { 
  display: 'flex', justifyContent: 'center' as const, marginBottom: '40px', padding: '0 14px' 
};
const piButton: React.CSSProperties = { 
  padding: '18px 40px', 
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
  color: 'white', 
  border: 'none', 
  borderRadius: '9999px', 
  fontWeight: '700', 
  fontSize: '17px', 
  cursor: 'pointer', 
  width: '100%', 
  maxWidth: '340px' 
};

const cardsGrid: React.CSSProperties = { 
  display: 'grid', 
  gridTemplateColumns: '1fr 1fr', 
  gap: '16px' 
};

const cardStyle: React.CSSProperties = { 
  background: 'white', 
  padding: '20px 14px', 
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column' as const, // Thêm as const sửa lỗi TypeScript
  alignItems: 'center',
  justifyContent: 'center',        // Giữ căn dọc giữa block của bạn
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(124, 58, 237, 0.06)',
  border: '1px solid #f3e8ff',
  transition: 'transform 0.2s, box-shadow 0.2s',
  minHeight: '145px',
  boxSizing: 'border-box'  
};

const iconStyle: React.CSSProperties = { 
  fontSize: '48px', 
  marginBottom: '12px',
  display: 'block',                 // Đưa icon về dạng khối độc lập để cân bằng tâm
  textAlign: 'center' as const
};

// Giữ nguyên size 17px gốc và màu tím nguyên bản của bạn
const cardTitle: React.CSSProperties = { 
  fontSize: '17px', 
  fontWeight: '700', 
  color: '#4c1d95', 
  margin: '0 0 6px 0',
  textAlign: 'center' as const,     // Căn giữa chữ tiêu đề
  width: '100%',                     // Chiếm toàn bộ độ rộng ô để textAlign hoạt động
  display: 'block'
};

// Giữ nguyên size 13.5px gốc và màu xám xanh nguyên bản của bạn
const cardDesc: React.CSSProperties = { 
  fontSize: '13.5px', 
  color: '#64748b', 
  margin: 0,
  textAlign: 'center' as const,     // Căn giữa chữ mô tả
  width: '100%',                     // Chiếm toàn bộ độ rộng ô để textAlign hoạt động
  display: 'block'
};

export default HomePage;