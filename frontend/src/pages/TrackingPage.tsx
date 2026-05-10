// src/pages/TrackingPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonHang {
  maDon: string;
  loai: string;
  nguoiNhan: string;
  diaChi: string;
  taiXe: string;
  trangThai: 'DangGiao' | 'DaGiao' | 'DangCho' | 'Huy';
  soPi: number;
  khoangCach: string;
  thoiGian: string;
  icon: string;
}

export default function TrackingPage() {
  const navigate = useNavigate();
  const [donHangs, setDonHangs] = useState<DonHang[]>([
    {
      maDon: "GHN17489231",
      loai: "Hỏa Tốc",
      nguoiNhan: "Nguyễn Thị Lan",
      diaChi: "123 Đường ABC, Quận 1, TP.HCM",
      taiXe: "Anh Minh • BKS 51H-12345",
      trangThai: 'DangGiao',
      soPi: 45000,
      khoangCach: "1.2km",
      thoiGian: "Đang cách điểm giao",
      icon: "🏍️"
    },
    {
      maDon: "GHN17488902",
      loai: "Đường Dài",
      nguoiNhan: "Trần Văn Hải",
      diaChi: "456 Nguyễn Văn Linh, Quận 7, TP.HCM",
      taiXe: "Chị Ngọc • BKS 79A-56789",
      trangThai: 'DaGiao',
      soPi: 28500,
      khoangCach: "Hoàn thành",
      thoiGian: "Giao lúc 14:35",
      icon: "✅"
    },
    {
      maDon: "GHN17487654",
      loai: "Hỏa Tốc",
      nguoiNhan: "Lê Thị Hoa",
      diaChi: "89 Lê Lợi, Quận 1, TP.HCM",
      taiXe: "Anh Tuấn • BKS 50F-11223",
      trangThai: 'DangCho',
      soPi: 32000,
      khoangCach: "Chờ lấy hàng",
      thoiGian: "Đang chờ tài xế",
      icon: "⏳"
    }
  ]);

  const [filter, setFilter] = useState<'All' | 'DangGiao' | 'DaGiao' | 'DangCho' | 'Huy'>('All');
  const [refreshing, setRefreshing] = useState(false);

  // Lọc đơn hàng
  const filteredDonHangs = donHangs.filter(d => filter === 'All' || d.trangThai === filter);

  // Giả lập cập nhật realtime
  const refreshTracking = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDonHangs(prev => prev.map(d => {
        if (d.trangThai === 'DangGiao') {
          return { ...d, khoangCach: "0.8km", thoiGian: "Đang đến nơi" };
        }
        return d;
      }));
      setRefreshing(false);
    }, 1200);
  };

  const huyDon = (maDon: string) => {
    if (window.confirm(`Bạn chắc chắn muốn hủy đơn ${maDon}?`)) {
      setDonHangs(prev => prev.map(d => 
        d.maDon === maDon ? { ...d, trangThai: 'Huy', thoiGian: 'Đã hủy' } : d
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DangGiao': return '#22d3ee';
      case 'DaGiao': return '#22c55e';
      case 'DangCho': return '#eab308';
      case 'Huy': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DangGiao': return 'Đang giao';
      case 'DaGiao': return 'Đã giao';
      case 'DangCho': return 'Đang chờ';
      case 'Huy': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div style={{ padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>📍 TRACKING</h1>
        <button onClick={refreshTracking} disabled={refreshing} style={refreshBtn}>
          {refreshing ? 'Đang cập nhật...' : '🔄 Cập nhật'}
        </button>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '25px' }}>Theo dõi đơn hàng thời gian thực</p>

      {/* FILTER */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {(['All', 'DangGiao', 'DaGiao', 'DangCho', 'Huy'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={filter === f ? activeFilter : inactiveFilter}>
            {f === 'All' ? 'Tất cả' : getStatusText(f)}
          </button>
        ))}
      </div>

      {/* DANH SÁCH ĐƠN HÀNG */}
      {filteredDonHangs.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>Không có đơn hàng nào</p>
      ) : (
        filteredDonHangs.map(don => (
          <div key={don.maDon} style={orderCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <span style={{ color: '#22d3ee', fontWeight: 'bold', fontSize: '18px' }}>{don.maDon}</span>
                <span style={{ marginLeft: '12px', color: '#94a3b8' }}>{don.loai}</span>
              </div>
              <span style={{ color: getStatusColor(don.trangThai), fontWeight: 'bold' }}>
                {getStatusText(don.trangThai)}
              </span>
            </div>

            <div style={{ marginBottom: '12px', color: '#e2e8f0' }}>
              <strong>Người nhận:</strong> {don.nguoiNhan}<br />
              {don.diaChi}
            </div>

            <div style={{ color: '#94a3b8', marginBottom: '16px' }}>
              {don.icon} {don.taiXe}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#22d3ee' }}>
                  {don.soPi.toLocaleString()} <span style={{ fontSize: '16px' }}>Pi</span>
                </div>
                <div style={{ fontSize: '14px', color: '#94a3b8' }}>{don.khoangCach}</div>
              </div>

              {don.trangThai === 'DangGiao' && (
                <button onClick={() => huyDon(don.maDon)} style={cancelBtn}>
                  Hủy đơn
                </button>
              )}
            </div>

            <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b' }}>
              {don.thoiGian}
            </div>
          </div>
        ))
      )}

      <button onClick={() => navigate('/gui-hang')} style={newOrderBtn}>
        + Tạo đơn hàng mới
      </button>
    </div>
  );
}

/* ====================== STYLES ====================== */
const orderCard = {
  backgroundColor: '#1e2937',
  borderRadius: '16px',
  padding: '20px',
  marginBottom: '16px',
  border: '1px solid #334155'
};

const activeFilter = {
  padding: '10px 18px',
  borderRadius: '9999px',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: 'bold',
  whiteSpace: 'nowrap' as const,
  border: 'none'
};

const inactiveFilter = {
  padding: '10px 18px',
  borderRadius: '9999px',
  background: '#1e2937',
  color: 'white',
  border: '1px solid #475569',
  whiteSpace: 'nowrap' as const
};

const refreshBtn = {
  padding: '10px 20px',
  background: '#334155',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  cursor: 'pointer'
};

const cancelBtn = {
  padding: '8px 16px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '14px',
  cursor: 'pointer'
};

const newOrderBtn = {
  width: '100%',
  padding: '18px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: 'bold',
  marginTop: '20px',
  cursor: 'pointer'
};