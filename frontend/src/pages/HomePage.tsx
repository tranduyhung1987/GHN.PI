import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getIncompletePayments } from '../services/firebase/incompletePaymentService';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const piUsername = user?.username || '';

  const [incompleteCount, setIncompleteCount] = useState(0);

  // Lock prompt for guest / new users
  const [showPiLoginPrompt, setShowPiLoginPrompt] = useState(false);

  // Mobile detection - more aggressive for Pi Browser WebView
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
            <Card title="BẢN ĐỒ" icon="🗺️" desc="Xem tuyến đường" onClick={() => navigate('/tracking')} />
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

        {/* NGƯỜI MỚI (guest) - locked cards (no direct role registration card here) */}
        {(!role || role === 'guest') && (
          <>
            <Card title="GỬI HÀNG" icon="📦" desc="Tạo đơn gửi hàng" onClick={handleLockedGuestAction} />
            <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={handleLockedGuestAction} />
            <Card title="KHO HUB" icon="🏬" desc="Trung chuyển kho" onClick={handleLockedGuestAction} />
            <Card title="TÀI XẾ" icon="🏍️" desc="Đơn hàng tài xế" onClick={handleLockedGuestAction} />
            <Card title="TRACKING" icon="🔍" desc="Theo dõi đơn" onClick={handleLockedGuestAction} />
            <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={handleLockedGuestAction} />
            <Card title="ĐÓNG GÓP" icon="❤️" desc="Góp ý cộng đồng" onClick={handleLockedGuestAction} />
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
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowPiLoginPrompt(false);
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
                  admin: 'nguyenhoi123455',
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
            <option value="guest">Người mới</option>
            <option value="sender">Người gửi</option>
            <option value="driver">Tài xế</option>
            <option value="warehouse">Kho trung chuyển</option>
            <option value="receiver">Người nhận</option>
            <option value="admin">Admin</option>
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

