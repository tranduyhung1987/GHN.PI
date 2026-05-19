import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import BottomNav from '../components/BottomNav';

// 1. Khai báo các Interface để triệt tiêu lỗi TypeScript
interface Order {
  maDon: string;
  nguoiNhan: string;
  status: string;
  [key: string]: any;
}

interface KhoHubPageProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

declare global {
  interface Window {
    Pi: any;
  }
}

export default function KhoHubPage({ onNavigate, currentPage }: KhoHubPageProps) {
  const [activeTab, setActiveTab] = useState<'nhap' | 'xuat' | 'ton'>('nhap');
  const [orders, setOrders] = useState<Order[]>([]);
  const [scanCode, setScanCode] = useState<string>('');
  
  // Ref để quản lý instance của scanner
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Tải dữ liệu an toàn
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

  // Xử lý logic camera khi chuyển tab
  useEffect(() => {
    if (activeTab === 'nhap') {
      const scanner = new Html5QrcodeScanner(
        "reader", 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        (decodedText) => {
          setScanCode(decodedText);
          // Tạm thời hiển thị mã quét được, người dùng nhấn XÁC NHẬN để xử lý
        },
        (error) => {
          // console.warn(error); // Bỏ qua các log lỗi nhỏ trong quá trình quét
        }
      );

      scannerRef.current = scanner;
    }

    // Dọn dẹp scanner khi rời tab hoặc unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error("Lỗi khi tắt camera:", err));
        scannerRef.current = null;
      }
    };
  }, [activeTab]);

  // Hàm xử lý trạng thái
  const handleUpdateStatus = (maDon: string, newStatus: string): void => {
    const updated = orders.map((o: Order) => 
      (o.maDon === maDon || o.id === maDon) ? { ...o, status: newStatus } : o
    );
    localStorage.setItem('orders', JSON.stringify(updated));
    setOrders(updated);
    setScanCode('');
    alert(`Đã cập nhật ${maDon} sang ${newStatus}`);
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={khoHeader}>
        <h2 style={titleText}>📦 KHO HUB</h2>
      </div>

      <div style={mainContent}>
        {/* Tab Selector */}
        <div style={tabContainer}>
          <button onClick={() => setActiveTab('nhap')} style={activeTab === 'nhap' ? activeTabStyle : inactiveTabStyle}>📥 Nhập</button>
          <button onClick={() => setActiveTab('xuat')} style={activeTab === 'xuat' ? activeTabStyle : inactiveTabStyle}>🚀 Xuất</button>
          <button onClick={() => setActiveTab('ton')} style={activeTab === 'ton' ? activeTabStyle : inactiveTabStyle}>📦 Tồn</button>
        </div>

        {/* Nội dung Tab */}
        <div style={cardStyle}>
          {activeTab === 'nhap' && (
            <div>
              <h3 style={sectionTitle}>Quét nhập kho</h3>
              {/* Vùng chứa camera */}
              <div id="reader" style={{ width: '100%', marginBottom: '15px' }}></div>
              
              <input style={inputStyle} value={scanCode} onChange={(e) => setScanCode(e.target.value)} placeholder="Quét QR hoặc nhập mã đơn..." />
              <button style={actionBtn} onClick={() => handleUpdateStatus(scanCode, 'da-nhap-kho')}>XÁC NHẬN NHẬP KHO</button>
            </div>
          )}

          {activeTab === 'xuat' && (
            <div>
              <h3 style={sectionTitle}>Xuất kho</h3>
              {orders.filter(o => o.status === 'da-nhap-kho').map((o) => (
                <div key={o.maDon} style={itemStyle}>
                  <span>{o.maDon}</span>
                  <button style={smallBtn} onClick={() => handleUpdateStatus(o.maDon, 'dang-giao')}>Xuất đi 🚀</button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'ton' && (
            <div>
              <h3 style={sectionTitle}>Tồn kho</h3>
              <p style={textStyle}>Tổng tồn: {orders.filter(o => o.status === 'da-nhap-kho').length} đơn</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
}

// 2. Định nghĩa Style với React.CSSProperties để hết lỗi đỏ
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f3e8ff', paddingBottom: '100px' };
const khoHeader: React.CSSProperties = { background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', padding: '24px 20px' };
const titleText: React.CSSProperties = { margin: 0, fontSize: '20px', fontWeight: '800' };
const mainContent: React.CSSProperties = { padding: '20px 14px' };
const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '16px', background: '#4c1d95', color: '#fff', border: 'none', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '16px', background: '#fff', color: '#4c1d95', border: '1px solid #e9d5ff', fontWeight: '600' };
const cardStyle: React.CSSProperties = { background: '#fff', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(124,58,237,0.05)' };
const sectionTitle: React.CSSProperties = { color: '#4c1d95', marginBottom: '15px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e9d5ff', marginBottom: '12px', boxSizing: 'border-box' };
const actionBtn: React.CSSProperties = { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700' };
const itemStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid #f3e8ff' };
const smallBtn: React.CSSProperties = { padding: '6px 12px', background: '#f3e8ff', color: '#4c1d95', borderRadius: '8px', border: 'none', fontWeight: '600', fontSize: '12px' };
const textStyle: React.CSSProperties = { color: '#6b21a8' };