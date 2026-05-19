import React, { useState, useEffect } from 'react';
import ShipLayout from '../layouts/ShipLayout'; // Bọc khung giao diện tài xế
import KhoHubLayout from '../layouts/KhoHubLayout'; // Bọc khung giao diện kho trung chuyển

declare global {
  interface Window {
    Pi: any;
  }
}

// Khai báo kiểu dữ liệu (Props) nhận từ App.tsx để tránh lỗi strict type checking
interface CaNhanPageProps {
  userRole?: string;
  onNavigate: (page: string) => void;
  currentPage?: string;
}

const CaNhanPage: React.FC<CaNhanPageProps> = ({ userRole = '', onNavigate, currentPage = 'ca-nhan' }) => {
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('Thành Viên GHN.PI');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  // TRẠNG THÁI BỔ SUNG RIÊNG CHO TÀI XẾ & KHO
  const [isOnline, setIsOnline] = useState(true);

  // Lấy vai trò hiện tại (Ưu tiên Prop truyền xuống hoặc dữ liệu từ localStorage)
  const currentRole = userRole || localStorage.getItem('userRole') || 'sender';

  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Thành Viên GHN.PI');
        })
        .catch(() => setIsPiConnected(false));
    }

    const saved = localStorage.getItem('orders');
    if (saved) {
      const parsed = JSON.parse(saved).slice(0, 3);
      setRecentOrders(parsed);
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất và quay về giao diện người mới?')) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('piUsername');
      localStorage.removeItem('currentPage');

      alert('✅ Đăng xuất thành công!');
      window.location.reload();
    }
  };

  // =========================================================================
  // 🔀 BỘ ĐIỀU PHỐI PHẦN RUỘT THEO VAI TRÒ (GIỮ NGUYÊN CẤU TRÚC GỘP CHUNG)
  // =========================================================================
  switch (currentRole) {
    
    // 🏍️ TRƯỜNG HỢP 1: GIAO DIỆN HỒ SƠ TÀI XẾ (DRIVER)
    case 'driver':
      return (
        <ShipLayout onNavigate={onNavigate} currentPage={currentPage}>
          <div style={pageContainer}>
            {/* Thẻ thông tin tài xế & Công tắc làm việc */}
            <div style={profileCard}>
              <div style={avatar}>🏍️</div>
              <h3 style={name}>@{piUsername}</h3>
              <div style={{ ...role, color: '#1e40af', fontWeight: '700' }}>TÀI XẾ HOẠT ĐỘNG</div>
              
              <button 
                onClick={() => setIsOnline(!isOnline)} 
                style={{
                  ...mainButton, 
                  background: isOnline ? '#22c55e' : '#64748b',
                  color: 'white',
                  marginTop: '12px',
                  padding: '12px 20px'
                }}
              >
                {isOnline ? '🟢 Đang trực tuyến (Sẵn sàng nhận đơn)' : '🔴 Đang ngoại tuyến (Đã tắt nhận đơn)'}
              </button>
            </div>

            {/* Khối quản lý Ví thu nhập Pi tài xế */}
            <div style={balanceCard}>
              <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '15px' }}>Ví Thu Nhập Giao Hàng</p>
              <div style={balanceAmount}>128.50 Pi</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                <button onClick={() => onNavigate('doi-soat')} style={{ ...mainButton, flex: 1, padding: '12px', fontSize: '14px', background: '#8b5cf6', marginTop: 0, color: 'white' }}>📊 Thống kê</button>
                <button onClick={() => alert('Hệ thống đang liên kết cổng rút Pi Mainnet!')} style={{ ...mainButton, flex: 1, padding: '12px', fontSize: '14px', background: '#1e40af', marginTop: 0, color: 'white' }}>💰 Rút Pi</button>
              </div>
            </div>

            {/* Thông tin hiệu suất lái xe */}
            <div style={{ ...balanceCard, textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#4c1d95', borderBottom: '1px solid #ede9fe', paddingBottom: '8px', fontSize: '16px' }}>
                Thông tin phương tiện & Đánh giá
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <div>🆔 <b>Mã số đối tác:</b> TX-{piUsername.toUpperCase()}</div>
                <div>⭐ <b>Xếp hạng sao:</b> 4.95 / 5.0 (Đáng tin cậy)</div>
                <div>🛠️ <b>Trạng thái hồ sơ:</b> Đã xác minh bằng Pi Wallet</div>
              </div>
            </div>

            {/* Lịch sử cuốc xe chạy gần đây */}
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#4c1d95', margin: '20px 0 12px 4px', textAlign: 'left' }}>
              Lịch sử chuyến xe gần đây
            </h3>
            {recentOrders.length === 0 ? (
              <div style={{ ...balanceCard, color: '#64748b', padding: '30px' }}>
                Bạn chưa thực hiện đơn giao hàng nào trong ngày hôm nay.
              </div>
            ) : (
              recentOrders.map((ord, idx) => (
                <div key={idx} style={orderItem} onClick={() => onNavigate('don-hang')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '700', color: '#1e2937' }}>{ord.maDon || ord.id}</span>
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Hoàn thành</span>
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#475569', textAlign: 'left' }}>
                    📍 Đến: {ord.diaChiNhan || 'Địa điểm giao hàng'}
                  </div>
                </div>
              ))
            )}

            <button onClick={handleLogout} style={logoutBtn}>
              🚪 Đăng Xuất & Thay Đổi Vai Trò
            </button>
          </div>
        </ShipLayout>
      );

    // 🏬 TRƯỜNG HỢP 2: ĐỒNG BỘ GIAO DIỆN HỒ SƠ KHO TRUNG CHUYỂN HUB (WAREHOUSE)
    case 'warehouse':
      return (
        /* FIX LỖI ĐỎ: Bổ sung onNavigate và currentPage vào KhoHubLayout */
        <KhoHubLayout onNavigate={onNavigate} currentPage={currentPage}>
          <div style={pageContainer}>
            {/* Thẻ thông tin đối tác Kho Hub */}
            <div style={profileCard}>
              <div style={avatar}>🏬</div>
              <h3 style={name}>@{piUsername}</h3>
              <div style={{ ...role, color: '#1e3a8a', fontWeight: '700' }}>KHO TRUNG CHUYỂN HUB PARTNER</div>
              
              <div style={{ ...reputationBox, background: '#e0f2fe', marginTop: '14px' }}>
                <span style={{ color: '#0369a1', fontWeight: '600' }}>⭐ Điểm Uy Tín Kho:</span>
                <span style={{ fontSize: '22px', fontWeight: '700', color: '#0284c7' }}>92 / 100</span>
              </div>
            </div>

            {/* Quản lý Quỹ doanh thu lưu kho bằng Pi */}
            <div style={balanceCard}>
              <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '15px' }}>Quỹ Pi Tích Lũy Lưu Kho</p>
              <div style={{ ...balanceAmount, color: '#0284c7' }}>485.20 Pi</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '14px' }}>
                <button onClick={() => alert('Thống kê đơn xuất nhập kho đang đồng bộ!')} style={{ ...mainButton, flex: 1, padding: '12px', fontSize: '14px', background: '#0284c7', marginTop: 0, color: 'white' }}>📊 Nhật ký Kho</button>
                <button onClick={() => alert('Yêu cầu rút Pi quỹ liên kết về Pi Mainnet của đối tác kho thành công!')} style={{ ...mainButton, flex: 1, padding: '12px', fontSize: '14px', background: '#1e3a8a', marginTop: 0, color: 'white' }}>💰 Kết chuyển Pi</button>
              </div>
            </div>

            {/* Thông tin cấu hình kỹ thuật kho */}
            <div style={{ ...balanceCard, textAlign: 'left' }}>
              <h4 style={{ margin: '0 0 12px 0', color: '#1e3a8a', borderBottom: '1px solid #e0f2fe', paddingBottom: '8px', fontSize: '16px' }}>
                Thông số vận hành Trạm Hub
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: '#334155' }}>
                <div>🆔 <b>Mã trạm:</b> HUB-{piUsername.toUpperCase()}</div>
                <div>📦 <b>Sức chứa hiện tại:</b> Tốt (Dưới 70% tải)</div>
                <div>📍 <b>Trạng thái phân phối:</b> Đang kết nối luồng hỏa tốc</div>
              </div>
            </div>

            <button onClick={handleLogout} style={logoutBtn}>
              🚪 Đăng Xuất & Thay Đổi Vai Trò Kho
            </button>
          </div>
        </KhoHubLayout>
      );

    // 📦 TRƯỜNG HỢP MẶC ĐỊNH: GIỮ NGUYÊN VẸN GIAO DIỆN GỐC CỦA NGƯỜI GỬI (SENDER)
    case 'sender':
    default:
      return (
        <div style={pageContainer}>
          <div style={profileCard}>
            <div style={avatar}>👤</div>
            <h3 style={name}>@{piUsername}</h3>
            <div style={role}>Thành viên chuẩn Sàn GHN.PI</div>
            <div style={wallet}>
              {isPiConnected ? '🟢 Đã liên kết Ví Pi Network' : '🔴 Chưa kết nối cơ chế Pi'}
            </div>
            
            <div style={reputationBox}>
              <span>Uy tín:</span>
              <span style={reputationScore}>100</span>
            </div>
          </div>

          <div style={balanceCard}>
            <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '15px' }}>Số dư khả dụng</p>
            <div style={balanceAmount}>0.00 Pi</div>
            <button onClick={() => onNavigate('tra-cuu-cuoc')} style={mainButton}>
              ⚡ Nạp Pi Tiêu Dùng
            </button>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#4c1d95', margin: '24px 0 12px 6px', textAlign: 'left' }}>
            Lịch sử gửi hàng gần đây
          </h3>

          {recentOrders.length === 0 ? (
            <div style={{ ...balanceCard, color: '#64748b', padding: '40px' }}>
              Bạn chưa tạo đơn hàng nào trên hệ thống.
            </div>
          ) : (
            recentOrders.map((ord, idx) => (
              <div key={idx} style={orderItem} onClick={() => onNavigate('tracking')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700', color: '#1e2937' }}>{ord.maDon || ord.id}</span>
                  <span style={{ color: '#8b5cf6', fontWeight: '600' }}>{ord.loaiDon === 'hoatoc' ? '🚀 Hỏa tốc' : '📦 Đường dài'}</span>
                </div>
                <div style={{ fontSize: '13.5px', color: '#475569', textAlign: 'left' }}>
                  Người nhận: {ord.nguoiNhan} — {ord.diaChiNhan}
                </div>
              </div>
            ))
          )}

          <button onClick={handleLogout} style={logoutBtn}>
            🚪 Đăng Xuất Tài Khoản
          </button>
        </div>
      );
  }
};

/* ===================== CẤM SỬA: TOÀN BỘ STYLE GỐC HỆ THỐNG ĐƯỢC GIỮ NGUYÊN VẸN ===================== */
const pageContainer = { minHeight: '100vh', background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', padding: '16px 14px 100px', boxSizing: 'border-box' as const };
const profileCard = { background: 'white', padding: '24px', borderRadius: '20px', textAlign: 'center' as const, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', marginBottom: '20px' };
const avatar = { fontSize: '64px', marginBottom: '12px' };
const name = { fontSize: '22px', fontWeight: '700', color: '#4c1d95', margin: '8px 0' };
const role = { color: '#6b21a8', marginBottom: '8px' };
const wallet = { fontSize: '14px', color: '#64748b' };
const reputationBox = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', background: '#f3e8ff', padding: '12px', borderRadius: '9999px', marginTop: '16px' };
const reputationScore = { fontSize: '24px', fontWeight: '700', color: '#eab308' };
const balanceCard = { background: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center' as const, marginBottom: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
const balanceAmount = { fontSize: '32px', fontWeight: '700', color: '#22d3ee', fontFamily: 'monospace' };
const mainButton = { width: '100%', padding: '14px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '14px', transition: 'all 0.2s' };
const orderItem = { background: 'white', padding: '16px', borderRadius: '16px', marginBottom: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', cursor: 'pointer', borderLeft: '4px solid #8b5cf6' };
const logoutBtn = { width: '100%', padding: '14px', background: 'transparent', color: '#ef4444', border: '2px solid #fca5a5', borderRadius: '9999px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '20px' };

export default CaNhanPage;