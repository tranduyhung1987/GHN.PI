// src/pages/NhanHangPage.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng

interface Order {
  maDon: string;
  nguoiGui: string;
  nguoiNhan: string;
  diaChiNhan: string;
  trangThai: string;
  paymentMethod?: 'prepaid' | 'cod';
  totalAmount?: number;
  loaiDon?: string;
  createdAt?: string;
}

export default function NhanHangPage() {
  const navigate = useNavigate(); // 2. Khởi tạo hook
  const [activeTab, setActiveTab] = useState<'danhSach' | 'lichSu' | 'doiTra'>('danhSach');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Các state khác giữ nguyên
  const [orders, setOrders] = useState<Order[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div style={container}>
      {/* UI GIAO DIỆN GIỮ NGUYÊN */}
      <div style={headerStyle}>
        <h2 style={{ color: 'white' }}>Nhận hàng</h2>
      </div>

      <div style={tabContainer}>
        <button style={activeTab === 'danhSach' ? selectedBtn : unselectedBtn} onClick={() => setActiveTab('danhSach')}>Danh sách</button>
        <button style={activeTab === 'lichSu' ? selectedBtn : unselectedBtn} onClick={() => setActiveTab('lichSu')}>Lịch sử</button>
        <button style={activeTab === 'doiTra' ? selectedBtn : unselectedBtn} onClick={() => setActiveTab('doiTra')}>Đổi trả</button>
      </div>

      {/* Nội dung danh sách đơn hàng... */}
      
      {/* Ví dụ nút điều hướng quay về trang chủ */}
      <button style={purpleButton} onClick={() => navigate('/')}>
        Về trang chủ
      </button>

      {/* ĐÃ XÓA BOTTOMNAV Ở ĐÂY - Layout đã tự xử lý */}
    </div>
  );
}

/* STYLES GIỮ NGUYÊN UI CỦA BẠN */
const container: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', paddingBottom: '90px' };
const headerStyle: React.CSSProperties = { padding: '20px', background: '#4c1d95' };
const tabContainer: React.CSSProperties = { display: 'flex', gap: '10px', padding: '16px' };
const purpleButton: React.CSSProperties = { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' };
const selectedBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '600' };
const unselectedBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#f3e8ff', color: '#4c1d95', border: '1px solid #e9d5ff', borderRadius: '9999px', fontWeight: '600' };