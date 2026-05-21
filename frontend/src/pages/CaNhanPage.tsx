// src/pages/CaNhanPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới
import { useAuth } from '../contexts/AuthContext'; // Giả sử bạn có AuthContext để lấy thông tin user

// Đã loại bỏ interface CaNhanPageProps vì không còn cần truyền props từ App.tsx

const CaNhanPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook
  const { userRole } = useAuth(); // Lấy role từ Context thay vì từ props
  
  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState('Thành Viên GHN.PI');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);

  // Lấy vai trò hiện tại
  const currentRole = userRole || localStorage.getItem('userRole') || 'sender';

  useEffect(() => {
    // Logic Pi SDK giữ nguyên
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then((user: any) => {
          setIsPiConnected(true);
          setPiUsername(user?.username || 'Thành Viên GHN.PI');
        })
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  return (
    <div style={pageContainer}>
      {/* HEADER GIỮ NGUYÊN UI */}
      <div style={header}>
        <div style={avatar}>👤</div>
        <h2 style={name}>@{piUsername}</h2>
        <p style={role}>Vai trò: {currentRole}</p>
      </div>

      {/* CÁC NÚT ĐIỀU HƯỚNG */}
      <div style={menuList}>
        <button style={menuItem} onClick={() => navigate('/admin')}>
          👑 Trang quản trị (Admin)
        </button>
        <button style={menuItem} onClick={() => navigate('/ca-nhan/chinh-sua')}>
          ✏️ Chỉnh sửa thông tin
        </button>
        <button style={menuItem} onClick={() => navigate('/chat')}>
          💬 Liên hệ hỗ trợ
        </button>
      </div>
    </div>
  );
};

/* STYLES GIỮ NGUYÊN 100% */
const pageContainer = { minHeight: '100vh', background: '#f3e8ff', padding: '20px' };
const header = { textAlign: 'center' as const, marginBottom: '30px' };
const avatar = { fontSize: '64px', marginBottom: '12px' };
const name = { fontSize: '22px', fontWeight: '700', color: '#4c1d95', margin: '8px 0' };
const role = { color: '#6b21a8', marginBottom: '8px' };
const menuList = { display: 'flex', flexDirection: 'column' as const, gap: '12px' };
const menuItem = { padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #e9d5ff', textAlign: 'left' as const, cursor: 'pointer', fontWeight: '600', color: '#4c1d95' };

export default CaNhanPage;