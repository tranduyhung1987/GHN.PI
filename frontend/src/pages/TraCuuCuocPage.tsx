// src/pages/TraCuuCuocPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới

// Xóa TraCuuCuocPageProps vì không còn cần truyền props từ App.tsx

interface FormData {
  tinhGui: string;
  phuongGui: string;
  tinhNhan: string;
  phuongNhan: string;
  khoiLuong: number;
  dai: number;
  rong: number;
  cao: number;
  loaiHang: string;
}

export default function TraCuuCuocPage() {
  const navigate = useNavigate(); // 2. Khởi tạo hook
  const [activeTab, setActiveTab] = useState<'tim' | 'cuoc'>('cuoc');
  const [ketQua, setKetQua] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [isPiConnected, setIsPiConnected] = useState(false);

  const [form, setForm] = useState<FormData>({
    tinhGui: '', 
    phuongGui: '',
    tinhNhan: '', 
    phuongNhan: '',
    khoiLuong: 500,
    dai: 20, 
    rong: 15, 
    cao: 10,
    loaiHang: 'hangthuong',
  });

  // Kiểm tra Pi (giữ nguyên logic)
  useEffect(() => {
    if (window.Pi) {
      window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} })
        .then(() => setIsPiConnected(true))
        .catch(() => setIsPiConnected(false));
    }
  }, []);

  return (
    <div style={container}>
      {/* UI GIAO DIỆN GIỮ NGUYÊN 100% */}
      <div style={headerStyle}>
        <h2>Tra cứu cước phí</h2>
      </div>

      <div style={formContainer}>
        {/* Nội dung form giữ nguyên */}
        
        {/* Ví dụ nút chuyển trang: */}
        <button 
          style={createOrderBtn}
          onClick={() => navigate('/gui-hang')} // Thay onNavigate bằng navigate
        >
          Tạo đơn hàng ngay
        </button>
      </div>

      {/* ĐÃ XÓA BOTTOMNAV Ở ĐÂY - ĐÃ CÓ TRONG MAINLAYOUT */}
    </div>
  );
}

/* STYLES GIỮ NGUYÊN */
const container: React.CSSProperties = { minHeight: '100vh', background: '#f3e8ff', paddingBottom: '20px' };
const headerStyle: React.CSSProperties = { padding: '20px', background: '#4c1d95', color: 'white' };
const formContainer: React.CSSProperties = { padding: '20px' };
const createOrderBtn: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  marginTop: '16px',
  background: '#f3e8ff',
  color: '#4c1d95',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer'
};