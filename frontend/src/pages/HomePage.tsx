import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getIncompletePayments } from '../services/firebase/incompletePaymentService';
import { useTracking } from '../hooks/useTracking';
import { useAppController } from '../hooks/useAppController';
import Modal from '../components/Modal';
import { journeyStore } from '../core/journey/journeyStore';
import { QRScanner } from '../components/QRScanner';
import { REGISTRABLE_ROLES, ROLE_INFO, getRoleLabel } from '../utils/constants';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, role, login } = useAuth();
  const piUsername = user?.username || '';

  const { orders: allOrders, loadOrders } = useTracking();
  const { updateTracking } = useAppController();

  const [incompleteCount, setIncompleteCount] = useState(0);

  // Lock prompt for guest / new users
  const [showPiLoginPrompt, setShowPiLoginPrompt] = useState(false);

  // Mobile detection - more aggressive for Pi Browser WebView
  const [isMobile, setIsMobile] = useState(false);

  // QR Scanner for driver - state for best UX modal (quick confirm orders from home)
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

  // QR helpers for driver - best practice: support manual + simulated camera + list quick scan + real update
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
        setQrResult({ error: `Không tìm thấy đơn ${maDon}. Kiểm tra lại mã.` });
        return;
      }

      // Update order status (pickup confirmation typical for QR scan in delivery)
      const now = Date.now();
      const nextStatus = 'picked_up'; // or based on current, but for confirm pickup

      // 1. local
      const key = 'ghn_pi_orders';
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedList = list.map((o: any) => o.maDon === maDon ? { ...o, status: nextStatus, trangThai: nextStatus, updatedAt: now, qrConfirmedAt: now } : o);
      localStorage.setItem(key, JSON.stringify(updatedList));

      // 2. engine + journey
      await updateTracking({ ...found, maDon, status: nextStatus, trangThai: nextStatus, updatedAt: now });
      journeyStore.addStep(maDon, 'QR_CONFIRMED_PICKUP');

      // 3. refresh local data in Home
      loadOrders?.();

      setQrResult({ success: true, order: { ...found, status: nextStatus, maDon } });

      // Optional: reload if hook supports, but since may be cached
    } catch (e) {
      setQrResult({ error: 'Lỗi khi xác nhận QR. Thử lại.' });
    } finally {
      setIsQRScanning(false);
    }
  };

  const simulateCameraScan = () => {
    // Best UX: if manual code, use it; else pick first available driver order for demo
    const code = qrManualCode.trim() || (driverActiveOrders[0]?.maDon || '');
    if (code) {
      handleQRScan(code);
    } else {
      setQrResult({ error: 'Không có đơn để quét. Nhập mã thủ công.' });
    }
  };

  const closeQRModal = () => {
    setShowQRModal(false);
    setQrManualCode('');
    setQrResult(null);
    setIsQRScanning(false);
  };

  // Kiểm tra Incomplete Payments (yêu cầu của Pi Network)
  useEffect(() => {
    const checkIncomplete = async () => {
      try {
        const list = await getIncompletePayments();
        setIncompleteCount(list.length);
      } catch {}
    };
    checkIncomplete();
  }, []);

  // Helper for locked guest actions - shows Pi login prompt then leads to role registration
  const handleLockedGuestAction = () => {
    setShowPiLoginPrompt(true);
  };

  // === Reverted to original beautiful UI/UX (exact from bc8ef68) ===
  // Only minimal change: 2 columns on small screens so the 8 cards can be seen without being tiny
  const mobile = isMobile;

  // Exact original beautiful sizes (desktop and phone cards look "như cũ")
  const pageContainer: React.CSSProperties = { 
    padding: '20px', 
    background: '#f3e8ff', 
    minHeight: '100dvh', 
    boxSizing: 'border-box' 
  };
  const headerContainer: React.CSSProperties = { 
    textAlign: 'center', 
    marginBottom: '30px' 
  };
  const logoStyle: React.CSSProperties = { 
    fontSize: '42px', 
    fontWeight: 700, 
    color: '#4c1d95', 
    margin: 0 
  };
  const subtitleStyle: React.CSSProperties = { 
    color: '#64748b', 
    fontSize: '15px', 
    margin: '4px 0 0 0' 
  };
  const piButtonContainer: React.CSSProperties = { 
    margin: '0 auto 30px', 
    maxWidth: '340px' 
  };
  const piButton: React.CSSProperties = { 
    padding: '18px 40px', 
    background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '9999px', 
    fontWeight: 700, 
    fontSize: '17px', 
    width: '100%', 
    cursor: 'pointer' 
  };
  const cardsGrid: React.CSSProperties = { 
    display: 'grid', 
    gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : '1fr 1fr', 
    gap: '16px',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden'
  };
  const warningStyle: React.CSSProperties = { 
    marginTop: '30px', 
    padding: '18px', 
    background: '#fef2f2', 
    color: '#991b1b', 
    borderRadius: '16px', 
    fontSize: '13.5px', 
    textAlign: 'center', 
    border: '2px solid #f87171',
    lineHeight: '1.5'
  };

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={headerContainer}>
        <div style={logoStyle}>🚚 GHN.PI</div>
        <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        {/* Incomplete Payment Warning (original) */}
        {incompleteCount > 0 && (
          <div 
            onClick={() => navigate('/incomplete-payments')}
            style={{
              marginTop: 10,
              background: '#fee2e2',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid #fca5a5',
            }}
          >
            ⚠️ {incompleteCount} giao dịch Pi chưa hoàn tất. <u>Xem & xử lý</u>
          </div>
        )}
      </div>

      {/* NÚT ĐĂNG NHẬP PI */}
      <div style={piButtonContainer}>
        <button 
          style={piButton} 
          onClick={() => {
            if (!role || role === 'guest') {
              setShowPiLoginPrompt(true);
            } else {
              navigate('/dang-ky');
            }
          }}
        >
          {piUsername ? `Đã kết nối: ${piUsername}` : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      {/* GRID CARDS - Role Specific (original beautiful layout) */}
      <div style={cardsGrid}>
        {/* DRIVER */}
        {role === 'driver' && (
          <>
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📦" desc="Các đơn cần giao ngay" onClick={() => navigate('/driver')} />
            {/* QUÉT QR moved to top-right, first row, horizontally aligned with ĐƠN HÀNG CỦA TÔI for easy access by driver (grid 2-col auto places it right) */}
            <Card title="QUÉT QR" icon="📷" desc="Xác nhận đơn hàng" onClick={() => setShowQRModal(true)} />
            <Card title="BẢN ĐỒ" icon="🗺️" desc="Xem tuyến đường" onClick={() => navigate('/tracking?view=map')} />
            <Card title="LỊCH SỬ GIAO" icon="📋" desc="Đơn đã hoàn thành" onClick={() => navigate('/orders')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
          </>
        )}

        {/* WAREHOUSE */}
        {role === 'warehouse' && (
          <>
            <Card title="NHẬP KHO" icon="📥" desc="Nhận hàng vào kho" onClick={() => navigate('/warehouse')} />
            <Card title="XUẤT KHO" icon="📤" desc="Giao hàng ra ngoài" onClick={() => navigate('/warehouse')} />
            <Card title="TỒN KHO" icon="📊" desc="Quản lý hàng tồn" onClick={() => navigate('/warehouse')} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={() => navigate('/tracking')} />
          </>
        )}

        {/* NGƯỜI GỬI HÀNG (sender) - 5 cards focused (clean & practical) */}
        {role === 'sender' && (
          <>
            <Card title="GỬI HÀNG MỚI" icon="📦" desc="Tạo đơn gửi hàng" onClick={() => navigate('/gui-hang')} />
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📋" desc="Quản lý đơn đã tạo" onClick={() => navigate('/orders')} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} />
            <Card title="THEO DÕI ĐƠN" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
          </>
        )}

        {/* NGƯỜI NHẬN HÀNG (receiver) - 5 cards focused (clean & practical) */}
        {role === 'receiver' && (
          <>
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} />
            <Card title="ĐƠN HÀNG CỦA TÔI" icon="📋" desc="Quản lý đơn đã nhận" onClick={() => navigate('/orders')} />
            <Card title="THEO DÕI ĐƠN" icon="🔍" desc="Theo dõi đơn hàng" onClick={() => navigate('/tracking')} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={() => navigate('/warehouse')} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={() => navigate('/chat')} />
          </>
        )}

        {/* ADMIN */}
        {role === 'admin' && (
          <>
            <Card title="DASHBOARD" icon="📊" desc="Thống kê tổng quan" onClick={() => navigate('/admin')} />
            <Card title="QUẢN LÝ NGƯỜI DÙNG" icon="👥" desc="Quản lý tài khoản" onClick={() => navigate('/admin')} />
            <Card title="BÁO CÁO" icon="📈" desc="Báo cáo & thống kê" onClick={() => navigate('/admin')} />
            <Card title="INCOMPLETE PAYMENTS" icon="⚠️" desc="Giao dịch Pi chưa hoàn tất" onClick={() => navigate('/incomplete-payments')} />
          </>
        )}

        {/* NGƯỜI MỚI (guest) - locked cards (added direct "Đăng ký vai trò" card aligned with "Đóng góp" in last row) */}
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

      {/* WARNING */}
      <div style={warningStyle}>
        ⚠️ <strong>CẢNH BÁO BẢO MẬT QUAN TRỌNG</strong><br />
        ❌ Tuyệt đối KHÔNG nhập mật khẩu ví Pi vào bất kỳ đâu!<br />
        ✅ Chỉ đăng nhập bằng Pi Network và chọn vai trò để sử dụng ứng dụng một cách an toàn.
      </div>

      {/* Pi Login Required Prompt Modal for Người mới (guest) - functional only, no change to existing cards/UI */}
      {showPiLoginPrompt && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setShowPiLoginPrompt(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '320px',
              width: '90%',
              textAlign: 'center',
              border: '2px solid #e0d4ff',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
            <h3 style={{ margin: '0 0 8px', color: '#4c1d95', fontSize: '18px', fontWeight: 700 }}>
              Đăng nhập với Pi Network
            </h3>
            <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '14px', lineHeight: 1.4 }}>
              Bạn cần đăng nhập với Pi Network và chọn vai trò để sử dụng tính năng này.
              <br />
              <span style={{ fontSize: '12px', color: '#16a34a' }}>
                Mở link này trong Pi Browser + đã khai báo domain trong Pi Developer Portal (Develop section) thì mới dùng được Pi thật.
              </span>
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={async () => {
                  setShowPiLoginPrompt(false);
                  await login();
                  navigate('/dang-ky');
                }}
                style={{
                  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                ⭐ Đăng nhập với Pi
              </button>
              <button
                onClick={() => setShowPiLoginPrompt(false)}
                style={{
                  background: 'white',
                  color: '#4c1d95',
                  border: '1px solid #e0d4ff',
                  borderRadius: '9999px',
                  padding: '10px 16px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  flex: 1,
                }}
              >
                Để sau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal for Driver - best design: prominent on home, rich functional scanner without breaking visual rules */}
      {showQRModal && role === 'driver' && (
        <Modal
          isOpen={showQRModal}
          onClose={closeQRModal}
          title="📷 QUÉT QR XÁC NHẬN ĐƠN"
          cancelText="Đóng"
        >
          <div style={{ fontSize: 14 }}>
            {/* Real QR Scanner integration for consistency with Warehouse (use html5-qrcode) */}
            <div style={{ marginBottom: 12 }}>
              <QRScanner 
                onScanSuccess={(code) => handleQRScan(code)}
                onScanError={(err) => console.warn('QR scan error', err)}
              />
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, textAlign: 'center' }}>
              Hoặc dùng camera thật bên trên • Hoặc nhập thủ công
            </div>

            {/* Manual input - essential for testnet / no camera */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 12, color: '#64748b' }}>Nhập mã đơn (QR thủ công)</label>
              <input
                value={qrManualCode}
                onChange={(e) => setQrManualCode(e.target.value)}
                placeholder="VD: GHN123456"
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #c4b5fd', background: '#f8f7ff', fontSize: 15, boxSizing: 'border-box' as const, marginTop: 4 }}
              />
            </div>

            {/* Quick list of scannable orders (best UX - tap to scan like real GHN driver app) */}
            {driverActiveOrders.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Đơn sẵn sàng quét:</div>
                {driverActiveOrders.slice(0, 3).map((o: any) => (
                  <button
                    key={o.maDon}
                    onClick={() => handleQRScan(o.maDon)}
                    disabled={isQRScanning}
                    style={{ width: '100%', textAlign: 'left', padding: '8px 10px', marginBottom: 4, background: '#f0fdfa', border: '1px solid #86efac', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                  >
                    {o.maDon} • {o.nguoiNhan || 'KH'} → Quét xác nhận
                  </button>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={simulateCameraScan}
                disabled={isQRScanning || (!qrManualCode.trim() && driverActiveOrders.length === 0)}
                style={{ flex: 1, padding: '12px', background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', border: 'none', borderRadius: 999, fontWeight: 700, fontSize: 14 }}
              >
                {isQRScanning ? 'Đang quét...' : '📷 QUÉT / XÁC NHẬN'}
              </button>
              <button
                onClick={() => {
                  // Attempt real camera (Pi Browser may support)
                  if (navigator.mediaDevices) {
                    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
                      alert('Camera thật đã kích hoạt (demo). Trong môi trường thật sẽ decode QR từ video. Dùng nút trên hoặc danh sách để xác nhận.');
                      // In full impl: attach to video, use jsQR or BarcodeDetector on frames
                      stream.getTracks().forEach(t => t.stop());
                    }).catch(() => alert('Không truy cập được camera. Dùng nhập mã thủ công hoặc danh sách bên trên.'));
                  }
                }}
                style={{ padding: '12px 16px', background: 'white', color: '#4c1d95', border: '1px solid #c4b5fd', borderRadius: 999, fontSize: 13 }}
              >
                Camera thật
              </button>
            </div>

            {/* Result */}
            {qrResult && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: qrResult.error ? '#fef2f2' : '#f0fdf4', border: qrResult.error ? '1px solid #fca5a5' : '1px solid #86efac' }}>
                {qrResult.error ? (
                  <div style={{ color: '#991b1b' }}>❌ {qrResult.error}</div>
                ) : (
                  <div style={{ color: '#166534' }}>
                    ✅ Đã xác nhận đơn <strong>{qrResult.order.maDon}</strong> bằng QR!<br />
                    Trạng thái: {qrResult.order.status || 'picked_up'} • Cập nhật hành trình.
                    <div style={{ marginTop: 8 }}>
                      <button onClick={() => { closeQRModal(); navigate('/driver'); }} style={{ fontSize: 12, padding: '4px 10px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: 999 }}>Đến Đơn hàng của tôi</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <p style={{ fontSize: 11, color: '#64748b', marginTop: 10, textAlign: 'center' }}>
              Quét QR gói hàng hoặc mã khách để xác nhận lấy/giao. Dữ liệu sync realtime.
            </p>
          </div>
        </Modal>
      )}

      {/* Dev Tools - Top Right (only visible in development) */}
      {import.meta.env.DEV && (
        <div
          style={{
            position: 'fixed',
            top: '8px',
            right: '8px',
            zIndex: 99998,
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {/* Existing Guest Mode Toggle */}
          <button
            onClick={() => {
              if (localStorage.getItem('devForceGuest') === 'true') {
                localStorage.removeItem('devForceGuest');
              } else {
                localStorage.setItem('devForceGuest', 'true');
              }
              window.location.reload();
            }}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              background: localStorage.getItem('devForceGuest') === 'true' ? '#dc2626' : '#4c1d95',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              opacity: 0.85,
            }}
            title="Dev tool: Bật/tắt chế độ ép Người mới (devForceGuest)"
          >
            {localStorage.getItem('devForceGuest') === 'true' ? 'Dev: Guest ON' : 'Dev: Guest OFF'}
          </button>

          {/* Role Switcher Dropdown */}
          <select
            value={localStorage.getItem('selectedRole') || ''}
            onChange={(e) => {
              const newRole = e.target.value;
              if (newRole) {
                localStorage.setItem('selectedRole', newRole);

                // Auto handle guest mode
                if (newRole === 'guest') {
                  localStorage.setItem('devForceGuest', 'true');
                } else {
                  localStorage.removeItem('devForceGuest');
                }

                // Set a representative mock username for realism
                const mockMap: Record<string, string> = {
                  guest: 'guest_user',
                  sender: 'sender_test',
                  driver: 'driver_test',
                  warehouse: 'warehouse_test',
                  receiver: 'receiver_test',
                  admin: 'admin_demo',
                };
                if (mockMap[newRole]) {
                  localStorage.setItem('devMockPiUsername', mockMap[newRole]);
                }

                window.location.reload();
              }
            }}
            style={{
              fontSize: '11px',
              padding: '3px 6px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              background: '#f8fafc',
              color: '#1e2937',
              cursor: 'pointer',
              opacity: 0.9,
            }}
            title="Dev tool: Chuyển nhanh giữa các vai trò để test giao diện"
          >
            <option value="">-- Chọn vai trò --</option>
            {(['guest', ...REGISTRABLE_ROLES, 'admin'] as const).map((k) => (
              <option key={k} value={k}>{ROLE_INFO[k]?.label || k}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

// Card - exact original beautiful style (from bc8ef68) - no size reduction
const Card = ({ 
  title, icon, desc, onClick 
}: { 
  title: string; icon: string; desc: string; onClick: () => void;
}) => {
  const cardStyle: React.CSSProperties = {
    background: 'white',
    padding: '20px 12px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
    border: '2px solid #e0d4ff',
    cursor: 'pointer',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
  };
  const iconStyle: React.CSSProperties = { 
    fontSize: '36px', 
    marginBottom: '8px', 
    display: 'block',
    lineHeight: 1
  };
  const cardTitle: React.CSSProperties = { 
    fontSize: '15px', 
    fontWeight: 700, 
    color: '#4c1d95', 
    margin: '0 0 4px 0',
    lineHeight: '1.2',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  };
  const cardDesc: React.CSSProperties = { 
    fontSize: '12px', 
    color: '#64748b', 
    margin: 0,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  };
  return (
    <div style={cardStyle} onClick={onClick}>
      <span style={iconStyle}>{icon}</span>
      <h3 style={cardTitle}>{title}</h3>
      <p style={cardDesc}>{desc}</p>
    </div>
  );
};

