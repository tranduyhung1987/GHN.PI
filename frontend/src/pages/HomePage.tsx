import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getIncompletePayments } from '../services/firebase/incompletePaymentService';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';
import Modal from '../components/Modal';
import { journeyStore } from '../core/journey/journeyStore';
import { QRScanner } from '../components/QRScanner';
import { REGISTRABLE_ROLES, ROLE_INFO } from '../utils/constants';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, role, login, isLoading, loginError } = useAuth();
  const piUsername = user?.username || '';

  const { orders: allOrders, loadOrders } = useTracking();
  const { updateTracking } = useAppController();

  const [incompleteCount, setIncompleteCount] = useState(0);
  const [showPiLoginPrompt, setShowPiLoginPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrManualCode, setQrManualCode] = useState('');
  const [qrResult, setQrResult] = useState<any>(null);
  const [isQRScanning, setIsQRScanning] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const driverActiveOrders = React.useMemo(() => {
    if (role !== 'driver' && role !== 'admin') return [];
    return (allOrders || []).filter((o: any) => {
      const s = (o.trangThai || o.status || '').toLowerCase();
      return ['created', 'confirmed', 'paid', 'picked_up', 'in_transit'].some(k => s.includes(k));
    });
  }, [allOrders, role]);

  const handleQRScan = async (code: string) => {
    if (!code.trim()) return;
    setIsQRScanning(true);
    setQrResult(null);

    try {
      const maDon = code.trim().toUpperCase();
      const found = (allOrders || []).find((o: any) => (o.maDon || '').toUpperCase() === maDon);

      if (!found) {
        setQrResult({ error: `Không tìm thấy đơn ${maDon}` });
        return;
      }

      const now = Date.now();
      const nextStatus = 'picked_up';

      const key = 'ghn_pi_orders';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedList = list.map((o: any) => 
        o.maDon === maDon ? { ...o, status: nextStatus, trangThai: nextStatus, updatedAt: now } : o
      );
      localStorage.setItem(key, JSON.stringify(updatedList));

      await updateTracking({ ...found, maDon, status: nextStatus, trangThai: nextStatus, updatedAt: now });
      journeyStore.addStep(maDon, 'QR_CONFIRMED_PICKUP');
      loadOrders?.();

      setQrResult({ success: true, order: { ...found, status: nextStatus, maDon } });
    } catch {
      setQrResult({ error: 'Lỗi khi xác nhận QR' });
    } finally {
      setIsQRScanning(false);
    }
  };

  const simulateCameraScan = () => {
    const code = qrManualCode.trim() || (driverActiveOrders[0]?.maDon || '');
    if (code) handleQRScan(code);
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setQrManualCode('');
    setQrResult(null);
    setIsQRScanning(false);
  };

  useEffect(() => {
    const checkIncomplete = async () => {
      try {
        const list = await getIncompletePayments();
        setIncompleteCount(list.length);
      } catch {}
    };
    checkIncomplete();
  }, []);

  const handleLockedGuestAction = () => setShowPiLoginPrompt(true);

  const mobile = isMobile;

  const pageContainer: React.CSSProperties = { padding: '20px', background: '#f3e8ff', minHeight: '100dvh' };
  const headerContainer: React.CSSProperties = { textAlign: 'center', marginBottom: '30px' };
  const logoStyle: React.CSSProperties = { fontSize: '42px', fontWeight: 700, color: '#4c1d95', margin: 0 };
  const subtitleStyle: React.CSSProperties = { color: '#64748b', fontSize: '15px', margin: '4px 0 0 0' };
  const piButtonContainer: React.CSSProperties = { margin: '0 auto 30px', maxWidth: '340px' };
  const piButton: React.CSSProperties = { 
    padding: '18px 40px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
    color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 700, fontSize: '17px', width: '100%' 
  };
  const cardsGrid: React.CSSProperties = { 
    display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : '1fr 1fr', gap: '16px' 
  };
  const warningStyle: React.CSSProperties = { 
    marginTop: '30px', padding: '18px', background: '#fef2f2', color: '#991b1b', borderRadius: '16px', fontSize: '13.5px', textAlign: 'center', border: '2px solid #f87171' 
  };

  return (
    <div style={pageContainer}>
      <div style={headerContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        {incompleteCount > 0 && (
          <div onClick={() => navigate('/incomplete-payments')} style={{ marginTop: 10, background: '#fee2e2', color: '#991b1b', padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            ⚠️ {incompleteCount} giao dịch Pi chưa hoàn tất. <u>Xem & xử lý</u>
          </div>
        )}
      </div>

      {/* NÚT ĐĂNG NHẬP */}
      <div style={piButtonContainer}>
        <button 
          style={{ ...piButton, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }} 
          disabled={isLoading}
          onClick={async () => {
            if (!user) {
              await login();
            } else {
              navigate('/dang-ky');
            }
          }}
        >
          {isLoading ? 'Đang kết nối với Pi...' : piUsername ? `Đã kết nối: ${piUsername}` : '★ Đăng nhập với Pi Network'}
        </button>

        {/* HIỂN THỊ LỖI ĐĂNG NHẬP */}
        {loginError && (
          <div style={{ color: '#dc2626', marginTop: '12px', fontSize: '14px', textAlign: 'center' }}>
            ⚠️ {loginError}
          </div>
        )}
      </div>

      {/* CARDS */}
      <div style={cardsGrid}>
        {role === 'driver' && (
          <>
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📦" desc="Các đơn cần giao ngay" onClick={() => navigate('/driver')} />
            <Card title="QUÉT QR" icon="📷" desc="Xác nhận đơn hàng" onClick={() => setShowQRModal(true)} />
            <Card title="BẢN ĐỒ" icon="🗺️" desc="Xem tuyến đường" onClick={() => navigate('/tracking?view=map')} />
            <Card title="LỊCH SỬ GIAO" icon="📋" desc="Đơn đã hoàn thành" onClick={() => navigate('/orders')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
          </>
        )}

        {role === 'warehouse' && (
          <>
            <Card title="NHẬP KHO" icon="📥" desc="Nhận hàng vào kho" onClick={() => navigate('/warehouse')} />
            <Card title="XUẤT KHO" icon="📤" desc="Giao hàng ra ngoài" onClick={() => navigate('/warehouse')} />
            <Card title="TỒN KHO" icon="📊" desc="Quản lý hàng tồn" onClick={() => navigate('/warehouse')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} />
          </>
        )}

        {role === 'sender' && (
          <>
            <Card title="GỬI HÀNG MỚI" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} />
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📋" desc="Quản lý đơn đã tạo" onClick={() => navigate('/orders')} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} />
            <Card title="THEO DÕI ĐƠN" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
          </>
        )}

        {role === 'receiver' && (
          <>
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} />
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📋" desc="Quản lý đơn đã nhận" onClick={() => navigate('/orders')} />
            <Card title="THEO DÕI ĐƠN" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
          </>
        )}

        {role === 'admin' && (
          <>
            <Card title="DASHBOARD" icon="📊" desc="Thống kê tổng quan" onClick={() => navigate('/admin')} />
            <Card title="QUẢN LÝ NGƯỜI DÙNG" icon="👥" desc="Quản lý tài khoản" onClick={() => navigate('/admin')} />
            <Card title="BÁO CÁO" icon="📈" desc="Báo cáo & thống kê" onClick={() => navigate('/admin')} />
            <Card title="INCOMPLETE PAYMENTS" icon="⚠️" desc="Giao dịch Pi chưa hoàn tất" onClick={() => navigate('/incomplete-payments')} />
          </>
        )}

        {(!role || role === 'guest') && (
          <>
            <Card title="GỬI HÀNG" icon="📦" desc="Tạo đơn gửi hàng" onClick={handleLockedGuestAction} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={handleLockedGuestAction} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={handleLockedGuestAction} />
            <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={handleLockedGuestAction} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={handleLockedGuestAction} />
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={handleLockedGuestAction} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={handleLockedGuestAction} />
            <Card title="ĐĂNG KÝ VAI TRÒ" icon="📝" desc="Chọn vai trò để sử dụng đầy đủ" onClick={handleLockedGuestAction} />
          </>
        )}
      </div>

      <div style={warningStyle}>
        ⚠️ <strong>CẢNH BÁO BẢO MẬT QUAN TRỌNG</strong><br />
        ❌ Tuyệt đối KHÔNG nhập mật khẩu ví Pi vào bất kỳ đâu!
      </div>

      {/* Modal Pi Login */}
      {showPiLoginPrompt && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowPiLoginPrompt(false)}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', maxWidth: '320px', width: '90%', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h3>Đăng nhập với Pi Network</h3>
            <button onClick={async () => { setShowPiLoginPrompt(false); await login(); navigate('/dang-ky'); }} style={{ background: '#4c1d95', color: 'white', padding: '10px 20px', borderRadius: '999px', marginTop: '15px' }}>
              ⭐ Đăng nhập với Pi
            </button>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && role === 'driver' && (
        <Modal isOpen={showQRModal} onClose={closeQRModal} title="QUÉT QR">
          <QRScanner onScanSuccess={handleQRScan} />
        </Modal>
      )}
    </div>
  );
}

const Card = ({ title, icon, desc, onClick }: { title: string; icon: string; desc: string; onClick: () => void }) => (
  <div onClick={onClick} style={{ background: 'white', padding: '20px 12px', borderRadius: '20px', textAlign: 'center', border: '2px solid #e0d4ff', cursor: 'pointer' }}>
    <span style={{ fontSize: '36px', marginBottom: '8px', display: 'block' }}>{icon}</span>
    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#4c1d95', margin: '0 0 4px' }}>{title}</h3>
    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{desc}</p>
  </div>
);