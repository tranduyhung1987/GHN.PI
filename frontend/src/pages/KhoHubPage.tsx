// src/pages/KhoHubPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Dùng Router thay vì Props
import { Html5QrcodeScanner } from 'html5-qrcode';

// Interface chỉ còn giữ lại phần logic dữ liệu
interface Order {
  maDon: string;
  nguoiNhan: string;
  status: string;
  [key: string]: any;
}

export default function KhoHubPage() {
  const navigate = useNavigate(); // Sử dụng điều hướng của Router
  const [activeTab, setActiveTab] = useState<'nhap' | 'xuat' | 'ton'>('nhap');
  const [orders, setOrders] = useState<Order[]>([]);
  const [scanCode, setScanCode] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi đọc dữ liệu:", e);
      }
    }
  }, []);

  // Thay vì gọi onNavigate('...'), bạn dùng navigate('/...')
  // Ví dụ: onClick={() => navigate('/home')}

  return (
    <div style={pageContainer}>
      {/* UI giữ nguyên 100% */}
      <div style={tabContainer}>
        <button 
          style={activeTab === 'nhap' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('nhap')}
        >Nhập kho</button>
        <button 
          style={activeTab === 'xuat' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('xuat')}
        >Xuất kho</button>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Quản lý đơn hàng</h3>
        <input 
          style={inputStyle}
          value={scanCode}
          onChange={(e) => setScanCode(e.target.value)}
          placeholder="Nhập mã đơn hàng..."
        />
        {/* Các logic khác giữ nguyên */}
      </div>

      {/* ĐÃ XÓA BOTTOMNAV Ở ĐÂY VÌ ĐÃ CÓ TRONG MAINLAYOUT */}
    </div>
  );
}

/* STYLES GIỮ NGUYÊN */
const pageContainer: React.CSSProperties = { padding: '20px 14px' };
const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '16px', background: '#4c1d95', color: '#fff', border: 'none', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '16px', background: '#fff', color: '#4c1d95', border: '1px solid #e9d5ff', fontWeight: '600' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(124,58,237,0.05)' };
const sectionTitle: React.CSSProperties = { color: '#4c1d95', marginBottom: '15px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e9d5ff', marginBottom: '12px', boxSizing: 'border-box' };