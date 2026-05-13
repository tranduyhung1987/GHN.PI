// src/pages/TrackingPage.tsx
import { useState } from 'react';
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
  repScore?: number;
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
      thoiGian: "Đang cách điểm giao 8 phút",
      icon: "🏍️",
      repScore: 92
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
      thoiGian: "Giao lúc 14:35 hôm nay",
      icon: "✅",
      repScore: 81
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
      icon: "⏳",
      repScore: 67
    }
  ]);

  const [filter, setFilter] = useState<'All' | 'DangGiao' | 'DaGiao' | 'DangCho' | 'Huy'>('All');
  const [refreshing, setRefreshing] = useState(false);

  const filteredDonHangs = donHangs.filter(d => filter === 'All' || d.trangThai === filter);

  const refreshTracking = () => {
    setRefreshing(true);
    setTimeout(() => {
      setDonHangs(prev => prev.map(d => {
        if (d.trangThai === 'DangGiao') {
          return { ...d, khoangCach: "0.8km", thoiGian: "Đang đến nơi trong 5 phút" };
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

  const getRepColor = (score?: number) => {
    if (!score) return '#64748b';
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleKhiếuNại = (maDon: string, taiXe: string) => {
    navigate(`/khieu-nai?maDon=${maDon}&target=${encodeURIComponent(taiXe)}`);
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>📍 TRACKING</h1>
        <button onClick={refreshTracking} disabled={refreshing} style={refreshBtn}>
          {refreshing ? '🔄 Đang cập nhật...' : '🔄 Cập nhật'}
        </button>
      </div>

      <p style={{ color: '#6b21a8', marginBottom: '20px', fontSize: '15px' }}>
        Theo dõi đơn hàng thời gian thực • Minh bạch trên blockchain
      </p>

      {/* Filter Tabs */}
      <div style={filterContainer}>
        {(['All', 'DangGiao', 'DaGiao', 'DangCho', 'Huy'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            style={filter === f ? activeFilterStyle : inactiveFilterStyle}
          >
            {f === 'All' ? 'Tất cả' : getStatusText(f)}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredDonHangs.length === 0 ? (
        <div style={emptyState}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>📦</div>
          <p>Không có đơn hàng nào phù hợp</p>
        </div>
      ) : (
        filteredDonHangs.map(don => (
          <div key={don.maDon} style={orderCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#4c1d95' }}>{don.maDon}</span>
                <span style={{ marginLeft: '10px', color: '#6b21a8' }}>{don.loai}</span>
              </div>
              <span style={{ 
                padding: '4px 12px', 
                borderRadius: '9999px', 
                backgroundColor: getStatusColor(don.trangThai) + '20',
                color: getStatusColor(don.trangThai),
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {getStatusText(don.trangThai)}
              </span>
            </div>

            <div style={{ marginBottom: '14px', lineHeight: '1.5' }}>
              <strong>Người nhận:</strong> {don.nguoiNhan}<br />
              <span style={{ color: '#64748b' }}>{don.diaChi}</span>
            </div>

            <div style={driverInfo}>
              <div>{don.icon} {don.taiXe}</div>
              {don.repScore && (
                <div style={{ color: getRepColor(don.repScore), fontWeight: '700' }}>
                  {don.repScore} ★
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: '#22d3ee' }}>
                  {don.soPi.toLocaleString()} <span style={{ fontSize: '16px' }}>Pi</span>
                </div>
                <div style={{ color: '#64748b' }}>{don.khoangCach}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {don.trangThai === 'DangGiao' && (
                  <button onClick={() => huyDon(don.maDon)} style={cancelBtn}>Hủy đơn</button>
                )}
                <button onClick={() => handleKhiếuNại(don.maDon, don.taiXe)} style={complainBtn}>
                  ⚠️ Khiếu nại
                </button>
              </div>
            </div>

            <div style={{ marginTop: '14px', fontSize: '14.5px', color: '#64748b' }}>
              {don.thoiGian}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer = {
  minHeight: '100vh',
  width: '100%',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const
} as const;

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px'
} as const;

const filterContainer = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto' as const,
  paddingBottom: '12px',
  marginBottom: '20px',
  scrollbarWidth: 'none' as const
} as const;

const activeFilterStyle = {
  padding: '10px 20px',
  borderRadius: '9999px',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: '700',
  whiteSpace: 'nowrap' as const,
  border: 'none',
  flexShrink: 0
} as const;

const inactiveFilterStyle = {
  padding: '10px 20px',
  borderRadius: '9999px',
  background: '#ede9fe',
  color: '#4c1d95',
  border: '1px solid #c4b5fd',
  whiteSpace: 'nowrap' as const,
  flexShrink: 0
} as const;

const orderCard = {
  background: '#ede9fe',
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '16px',
  border: '1px solid #c4b5fd',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
} as const;

const driverInfo = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#1e2937',
  color: 'white',
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '16px'
} as const;

const cancelBtn = {
  padding: '10px 18px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '14px',
  cursor: 'pointer'
} as const;

const complainBtn = {
  padding: '10px 18px',
  background: '#f59e0b',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '14px',
  fontWeight: '600',
  cursor: 'pointer'
} as const;

const refreshBtn = {
  padding: '10px 20px',
  background: '#ede9fe',
  color: '#4c1d95',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  cursor: 'pointer',
  fontWeight: '600'
} as const;

const emptyState = {
  textAlign: 'center' as const,
  padding: '60px 20px',
  color: '#64748b'
} as const;