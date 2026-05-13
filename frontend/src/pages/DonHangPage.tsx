// src/pages/DonHangPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonHang {
  maDon: string;
  ngayTao: string;
  loai: string;
  nguoiNhan: string;
  diaChi: string;
  soPi: number;
  trangThai: string;
  trangThaiText: string;
  color: string;
  taiXe?: string;
  repScore?: number;
}

export default function DonHangPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'ChoXacNhan' | 'DangChuanBi' | 'DangGiao' | 'DaGiao' | 'Huy'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [donHangs] = useState<DonHang[]>([
    { 
      maDon: "GHN17489231", ngayTao: "12/05/2026", loai: "Hỏa Tốc", 
      nguoiNhan: "Nguyễn Thị Lan", diaChi: "123 Đường ABC, Quận 1", 
      soPi: 45000, trangThai: 'DangGiao', trangThaiText: "Đang giao", color: "#22d3ee",
      taiXe: "Tài xế Nguyễn Văn A", repScore: 92 
    },
    { 
      maDon: "GHN17488902", ngayTao: "11/05/2026", loai: "Đường Dài", 
      nguoiNhan: "Trần Văn Hải", diaChi: "456 Nguyễn Văn Linh, Quận 7", 
      soPi: 28500, trangThai: 'DaGiao', trangThaiText: "Đã giao", color: "#22c55e",
      taiXe: "Tài xế Trần Thị B", repScore: 78 
    },
    { 
      maDon: "GHN17487654", ngayTao: "10/05/2026", loai: "Hỏa Tốc", 
      nguoiNhan: "Lê Thị Hoa", diaChi: "89 Lê Lợi, Quận 1", 
      soPi: 32000, trangThai: 'ChoXacNhan', trangThaiText: "Chờ xác nhận", color: "#eab308",
      taiXe: "Tài xế Phạm Minh C", repScore: 65 
    },
    { 
      maDon: "GHN17486543", ngayTao: "09/05/2026", loai: "Đường Dài", 
      nguoiNhan: "Phạm Minh Quân", diaChi: "101 Pasteur, Quận 3", 
      soPi: 41500, trangThai: 'DangChuanBi', trangThaiText: "Đang chuẩn bị", color: "#a855f7",
      taiXe: "Kho Hub TP.HCM", repScore: 88 
    },
    { 
      maDon: "GHN17485432", ngayTao: "08/05/2026", loai: "Hỏa Tốc", 
      nguoiNhan: "Vũ Thị Ngọc", diaChi: "222 Võ Văn Kiệt, Quận 5", 
      soPi: 19500, trangThai: 'Huy', trangThaiText: "Đã hủy", color: "#ef4444",
      taiXe: "Tài xế Lê Văn D", repScore: 45 
    },
  ]);

  const filteredDonHangs = donHangs.filter(d => {
    const matchFilter = filter === 'All' || d.trangThai === filter;
    const matchSearch = d.maDon.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        d.nguoiNhan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getRepColor = (score?: number) => {
    if (!score) return '#64748b';
    if (score >= 90) return '#22c55e';
    if (score >= 75) return '#eab308';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const handleKhiếuNại = (maDon: string, taiXe?: string) => {
    navigate(`/khieu-nai?maDon=${maDon}${taiXe ? `&target=${encodeURIComponent(taiXe)}` : ''}`);
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>ĐƠN HÀNG CỦA TÔI</h1>
          <p style={{ color: '#6b21a8', margin: 0 }}>Tổng {donHangs.length} đơn • Quản lý & theo dõi</p>
        </div>
      </div>

      {/* Nút Tạo Đơn */}
      <button 
        onClick={() => navigate('/gui-hang')}
        style={createOrderBtn}
      >
        + TẠO ĐƠN HÀNG MỚI
      </button>

      {/* Search */}
      <div style={{ padding: '0 14px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm mã đơn hoặc tên người nhận..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* Filter Tabs */}
      <div style={filterContainer}>
        {[
          { key: 'All', label: 'Tất cả' },
          { key: 'ChoXacNhan', label: 'Chờ' },
          { key: 'DangChuanBi', label: 'Chuẩn bị' },
          { key: 'DangGiao', label: 'Đang giao' },
          { key: 'DaGiao', label: 'Đã giao' },
          { key: 'Huy', label: 'Hủy' }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key as any)}
            style={filter === item.key ? activeFilterStyle : inactiveFilterStyle}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Danh sách đơn hàng */}
      {filteredDonHangs.length === 0 ? (
        <div style={emptyState}>Không tìm thấy đơn hàng nào</div>
      ) : (
        filteredDonHangs.map(don => (
          <div key={don.maDon} style={orderCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#4c1d95' }}>{don.maDon}</div>
                <div style={{ color: '#6b21a8', fontSize: '14px' }}>{don.ngayTao} • {don.loai}</div>
              </div>
              <span style={{ 
                padding: '6px 14px', 
                borderRadius: '9999px', 
                backgroundColor: don.color + '20',
                color: don.color,
                fontWeight: '600',
                fontSize: '14px'
              }}>
                {don.trangThaiText}
              </span>
            </div>

            <div style={{ marginBottom: '14px', lineHeight: '1.5' }}>
              <strong>Người nhận:</strong> {don.nguoiNhan}<br />
              <span style={{ color: '#64748b' }}>{don.diaChi}</span>
            </div>

            {don.taiXe && (
              <div style={driverBox}>
                <div>{don.taiXe}</div>
                {don.repScore && (
                  <div style={{ color: getRepColor(don.repScore), fontWeight: '700' }}>
                    {don.repScore} ★
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <div style={{ fontSize: '22px', fontWeight: '700', color: '#22d3ee' }}>
                {don.soPi.toLocaleString()} <span style={{ fontSize: '16px' }}>Pi</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => navigate(`/tracking?maDon=${don.maDon}`)}
                  style={trackBtn}
                >
                  Theo dõi
                </button>
                <button 
                  onClick={() => handleKhiếuNại(don.maDon, don.taiXe)}
                  style={complainBtn}
                >
                  ⚠️ Khiếu nại
                </button>
              </div>
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
  alignItems: 'center',
  gap: '14px',
  marginBottom: '20px'
} as const;

const createOrderBtn = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: '700',
  marginBottom: '24px',
  cursor: 'pointer'
} as const;

const searchInputStyle = {
  width: '100%',
  padding: '16px 20px',
  background: '#f3e8ff',
  border: '1px solid #c4b5fd',
  borderRadius: '9999px',
  fontSize: '16px',
  color: '#4c1d95',
  boxSizing: 'border-box' as const
} as const;

const filterContainer = {
  display: 'flex',
  gap: '8px',
  overflowX: 'auto',
  paddingBottom: '12px',
  marginBottom: '24px',
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

const driverBox = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: '#1e2937',
  color: 'white',
  padding: '12px 16px',
  borderRadius: '12px',
  marginBottom: '16px'
} as const;

const trackBtn = {
  padding: '10px 20px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
} as const;

const complainBtn = {
  padding: '10px 20px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: '600',
  cursor: 'pointer'
} as const;

const emptyState = {
  textAlign: 'center' as const,
  padding: '80px 20px',
  color: '#64748b'
} as const;