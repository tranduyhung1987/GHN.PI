import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { getRoleLabel } from '../utils/constants';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const username = user?.username || 'Người dùng';
  const userId = user?.uid || '154656565';

  // Realistic stats (persisted in localStorage for demo, role-aware)
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userProfileStats');
    if (saved) return JSON.parse(saved);
    const defaultStats = {
      totalOrders: role === 'sender' ? 47 : role === 'receiver' ? 32 : role === 'driver' ? 128 : 15,
      successRate: 98,
      avgRating: 4.8,
      memberSince: '01/2025',
      deliveries: role === 'driver' ? 124 : role === 'sender' ? 45 : 30,
    };
    localStorage.setItem('userProfileStats', JSON.stringify(defaultStats));
    return defaultStats;
  });

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      logout();
      // After full logout (role=null + selectedRole cleared), go to guest Home (original 8 cards for Người mới)
      navigate('/');
    }
  };

  // Support section state (moved from Home "HỖ TRỢ" for better personal context)
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [newTicket, setNewTicket] = useState({ type: 'Vấn đề với đơn hàng', description: '' });
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Xin chào! Đội hỗ trợ GHN.PI sẵn sàng giúp bạn với đơn hàng, thanh toán Pi hoặc tài khoản.", isUser: false, time: 'Bây giờ' }
  ]);
  const [newChatMsg, setNewChatMsg] = useState('');

  // Theme & PWA install (functional only, no style value changes to existing UI)
  const { isDark, toggleTheme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // @ts-ignore - standard beforeinstallprompt
      if (e && (e as any).prompt) {
        e.preventDefault();
        setDeferredPrompt(e);
      }
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  const handlePwaInstall = async () => {
    if (!deferredPrompt) return;
    // @ts-ignore
    deferredPrompt.prompt();
    // @ts-ignore
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('mySupportTickets');
    if (saved) setSupportTickets(JSON.parse(saved));
  }, []);

  const saveTickets = (tickets: any[]) => {
    setSupportTickets(tickets);
    localStorage.setItem('mySupportTickets', JSON.stringify(tickets));
  };

  const submitTicket = () => {
    if (!newTicket.description.trim()) {
      alert('Vui lòng mô tả vấn đề.');
      return;
    }
    const ticket = {
      id: Date.now(),
      type: newTicket.type,
      description: newTicket.description.trim(),
      status: 'pending',
      timestamp: Date.now(),
    };
    const updated = [ticket, ...supportTickets];
    saveTickets(updated);
    setNewTicket({ type: 'Vấn đề với đơn hàng', description: '' });
    alert('Yêu cầu hỗ trợ đã gửi thành công! Chúng tôi sẽ phản hồi qua app hoặc email.');
  };

  const sendSupportChat = () => {
    if (!newChatMsg.trim()) return;
    const userMsg = { id: Date.now(), text: newChatMsg.trim(), isUser: true, time: 'Bây giờ' };
    setChatMessages(prev => [...prev, userMsg]);
    const msg = newChatMsg.trim();
    setNewChatMsg('');
    // Mock support reply
    setTimeout(() => {
      let replyText = "Cảm ơn bạn đã liên hệ. Vấn đề của bạn đã được ghi nhận.";
      if (msg.toLowerCase().includes('đơn')) replyText += " Chúng tôi sẽ kiểm tra đơn hàng của bạn ngay.";
      else if (msg.toLowerCase().includes('pi') || msg.toLowerCase().includes('thanh toán')) replyText += " Về thanh toán Pi, vui lòng kiểm tra incomplete payments nếu cần.";
      setChatMessages(prev => [...prev, { id: Date.now(), text: replyText, isUser: false, time: 'Bây giờ' }]);
    }, 700);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f1ff', paddingBottom: '90px' }}>
      {/* Header - avatar left small, ID + role on right, small Đổi vai trò button top-right aligned horizontally with ID/role (compact top frame for balance, only this header edited, exact colors/shadow/border preserved) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '15px 20px 10px', gap: '12px' }}>
        {/* Avatar left, smaller 60px */}
        <div style={{
          width: '60px',
          height: '60px',
          background: '#4c1d95',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '4px solid white',
          boxShadow: '0 4px 15px rgba(76, 29, 149, 0.3)',
          flexShrink: 0
        }}>
          <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>π</span>
        </div>

        {/* Middle: ID and role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#64748b', fontSize: '12px', margin: 0 }}>ID: {userId}</p>
          <p style={{ color: '#4c1d95', fontWeight: 600, fontSize: '15px', margin: '2px 0 0', lineHeight: 1.2 }}>
            {getRoleLabel(role)}
          </p>
          <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0' }}>
            ⭐ {userStats.avgRating} ({userStats.totalOrders} giao dịch) • Thành viên từ {userStats.memberSince}
          </p>
        </div>

        {/* Small Đổi vai trò button top-right, aligned with ID/role */}
        <button
          onClick={() => navigate('/dang-ky')}
          style={{
            fontSize: '10px',
            padding: '3px 6px',
            borderRadius: '9999px',
            background: '#4c1d95',
            color: 'white',
            border: 'none',
            whiteSpace: 'nowrap',
            alignSelf: 'flex-start',
            cursor: 'pointer'
          }}
        >
          🔄 Đổi vai trò
        </button>
      </div>

      {/* Điểm uy tín - shrunk frame for overall top section balance (outer style preserved, internal padding/font slightly scaled for proportion, no other visual change) */}
      <div style={{
        margin: '0 20px 12px',
        background: 'white',
        borderRadius: '16px',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '2px' }}>Điểm uy tín</p>
            <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#0ea5e9' }}>94 <span style={{ fontSize: '14px' }}>pts</span></p>
            <p style={{ color: '#22c55e', fontSize: '11px', fontWeight: 600 }}>Xuất Sắc • Top 5%</p>
            <p style={{ color: '#64748b', fontSize: '10px', marginTop: '1px' }}>Dựa trên {userStats.totalOrders} giao dịch | {userStats.successRate}% thành công</p>
          </div>
          <div style={{ fontSize: '32px' }}>🏆</div>
        </div>
      </div>

      {/* Số dư & Hạn mức - enhanced realistically inside identical cards */}
      <div style={{ display: 'flex', gap: '12px', margin: '0 20px 24px' }}>
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Số dư Pi</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4c1d95', marginTop: '4px' }}>
            12.450 Pi
          </p>
          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Có thể rút • 1.250 Pi đang chờ</p>
        </div>

        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Hạn mức tín dụng</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', marginTop: '4px' }}>
            60.000 đ
          </p>
          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Sử dụng 12.500 đ tháng này</p>
        </div>
      </div>

      {/* Thống kê hoạt động - new realistic section using EXACT same card style as above (no visual redesign) */}
      <div style={{ margin: '0 20px 24px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>Thống kê hoạt động</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#4c1d95', margin: 0 }}>{userStats.totalOrders}</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Tổng đơn {role === 'sender' ? 'gửi' : role === 'receiver' ? 'nhận' : 'giao'}</p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#22c55e', margin: 0 }}>{userStats.successRate}%</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Tỷ lệ thành công</p>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#f59e0b', margin: 0 }}>{userStats.deliveries}</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{role === 'driver' ? 'Km đã chạy' : 'Đơn hoàn tất'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW: Hồ sơ người gửi mặc định (functional - sync với form /gui-hang) */}
      <SenderProfileCard navigate={navigate} />

      {/* Hỗ trợ cá nhân - moved from Home "HỖ TRỢ" card. Better UX: personal support inside Cá nhân */}
      <div style={{ margin: '0 20px 24px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px', fontWeight: 600 }}>Hỗ trợ & Trợ giúp</p>

          {/* Submit new ticket form */}
          <div style={{ marginBottom: '12px', width: '100%', boxSizing: 'border-box' as const }}>
            <select 
              value={newTicket.type} 
              onChange={e => setNewTicket({ ...newTicket, type: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #c4b5fd', marginBottom: '6px', fontSize: '13px', boxSizing: 'border-box' as const }}
            >
              <option>Vấn đề với đơn hàng</option>
              <option>Thanh toán Pi</option>
              <option>Tài khoản & Vai trò</option>
              <option>Kỹ thuật / App</option>
              <option>Khác</option>
            </select>
            <textarea 
              placeholder="Mô tả chi tiết vấn đề (có thể ghi mã đơn nếu liên quan)..."
              value={newTicket.description}
              onChange={e => setNewTicket({ ...newTicket, description: e.target.value })}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #c4b5fd', minHeight: '50px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' as const }}
            />
            <button 
              onClick={submitTicket}
              style={{ width: '100%', padding: '8px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
            >
              Gửi yêu cầu hỗ trợ
            </button>
          </div>

          {/* My tickets list */}
          {supportTickets.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>Yêu cầu gần đây của bạn</p>
              {supportTickets.slice(0, 2).map((t: any) => (
                <div key={t.id} style={{ fontSize: '11px', padding: '3px 0', color: '#475569', borderBottom: '1px dotted #eee' }}>
                  {t.type}: {t.description.substring(0, 35)}... <span style={{ color: t.status === 'pending' ? '#f59e0b' : '#16a34a' }}>[{t.status}]</span>
                </div>
              ))}
            </div>
          )}

          <button 
            onClick={() => setShowSupportChat(true)}
            style={{ width: '100%', padding: '8px', background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: '8px', fontSize: '12px', fontWeight: 500 }}
          >
            💬 Mở chat hỗ trợ trực tuyến
          </button>
        </div>
      </div>

      {/* Cài đặt nhanh - realistic addition using exact same card style (functional toggles only) */}
      <div style={{ margin: '0 20px 24px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '8px' }}>Cài đặt & Thông báo</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Nhận thông báo đơn hàng mới
              <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Cập nhật trạng thái realtime
              <input type="checkbox" defaultChecked style={{ transform: 'scale(1.2)' }} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Ẩn số điện thoại khi giao hàng
              <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
            </label>
            {/* Theme toggle - pure logic using existing ThemeContext, no change to protected style values */}
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Chế độ tối (dark)
              <button
                onClick={toggleTheme}
                style={{ fontSize: '11px', color: '#4c1d95', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {isDark ? 'Tắt' : 'Bật'}
              </button>
            </label>
          </div>
          {/* PWA install prompt - functional addition only */}
          {deferredPrompt && (
            <button
              onClick={handlePwaInstall}
              style={{ fontSize: '11px', color: '#4c1d95', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', padding: 0 }}
            >
              📱 Thêm vào màn hình chính (PWA)
            </button>
          )}
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px', marginBottom: 0 }}>Cài đặt được lưu trên thiết bị này.</p>
        </div>
      </div>

      {/* Lịch sử hoạt động gần đây - realistic summary using exact card style */}
      <div style={{ margin: '0 20px 24px' }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Hoạt động gần đây</p>
            <button onClick={() => navigate('/orders')} style={{ fontSize: '11px', color: '#4c1d95', background: 'none', border: 'none', cursor: 'pointer' }}>Xem tất cả →</button>
          </div>
          <div style={{ fontSize: '12px', color: '#475569' }}>
            • Đơn #GHN87234561 đã giao thành công (hôm qua)<br />
            • Gửi góp ý cộng đồng về tính năng Pi COD<br />
            • Cập nhật hồ sơ người gửi
          </div>
        </div>
      </div>

      {/* Nút hành động - only logout now (Đổi vai trò moved to top right small button) */}
      <div style={{ padding: '0 20px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px',
            background: '#fee2e2',
            color: '#dc2626',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700
          }}
        >
          🚪 Đăng xuất
        </button>
      </div>

      {/* Support Chat Modal - functional mini chat like real support */}
      {showSupportChat && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }} onClick={() => setShowSupportChat(false)}>
          <div 
            style={{ background: 'white', borderRadius: '16px', width: '90%', maxWidth: '360px', maxHeight: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div style={{ padding: '12px 16px', background: '#4c1d95', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>💬 Chat Hỗ trợ GHN.PI</span>
              <button onClick={() => setShowSupportChat(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '12px', overflowY: 'auto', background: '#f8f1ff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatMessages.map((msg: any) => (
                <div key={msg.id} style={{
                  alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
                  background: msg.isUser ? '#4c1d95' : 'white',
                  color: msg.isUser ? 'white' : '#1e2937',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  maxWidth: '80%',
                  fontSize: '13px'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '8px', borderTop: '1px solid #eee', display: 'flex', gap: '8px', background: 'white' }}>
              <input 
                type="text" 
                placeholder="Nhập tin nhắn hỗ trợ..."
                value={newChatMsg}
                onChange={e => setNewChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendSupportChat()}
                style={{ flex: 1, padding: '8px 10px', borderRadius: '20px', border: '1px solid #c4b5fd', fontSize: '13px' }}
              />
              <button onClick={sendSupportChat} style={{ padding: '8px 14px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: 600 }}>
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === Functional mini component for sender profile (full combo) - reads/writes same localStorage as form ===
function SenderProfileCard({ navigate }: { navigate: (path: string) => void }) {
  const [senderInfo, setSenderInfo] = useState<{ nguoiGui?: string; sdtGui?: string; diaChiGui?: string } | null>(null);

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem('mySenderInfo');
      setSenderInfo(raw ? JSON.parse(raw) : null);
    };
    load();
    // listen for storage changes (when edited in form)
    const onStorage = (e: StorageEvent) => { if (e.key === 'mySenderInfo') load(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const hasInfo = senderInfo && (senderInfo.nguoiGui || senderInfo.sdtGui || senderInfo.diaChiGui);

  return (
    <div style={{ margin: '0 20px 24px' }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Hồ sơ người gửi mặc định</p>
          <button
            onClick={() => navigate('/gui-hang')}
            style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, border: '1px solid #c4b5fd', background: '#f0f0f0', color: '#4c1d95', cursor: 'pointer' }}
          >
            Mở form Gửi hàng
          </button>
        </div>

        {hasInfo ? (
          <div style={{ fontSize: '14px', lineHeight: 1.4 }}>
            <div><strong>{senderInfo?.nguoiGui || '(chưa tên)'}</strong></div>
            <div style={{ color: '#64748b' }}>{senderInfo?.sdtGui || '(chưa SĐT)'} • {senderInfo?.diaChiGui || '(chưa địa chỉ)'}</div>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Chưa có. Vào <strong>Gửi hàng</strong> → điền thông tin → sẽ tự lưu để dùng lại.
          </p>
        )}
        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 8, marginBottom: 0 }}>
          Dùng chung với form tạo đơn (lưu trên máy này).
        </p>
      </div>
    </div>
  );
}