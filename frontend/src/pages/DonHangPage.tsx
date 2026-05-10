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
  trangThai: 'ChoXacNhan' | 'DangChuanBi' | 'DangGiao' | 'DaGiao' | 'Huy';
  trangThaiText: string;
  color: string;
}

export default function DonHangPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'All' | 'ChoXacNhan' | 'DangChuanBi' | 'DangGiao' | 'DaGiao' | 'Huy'>('All');

  const [donHangs] = useState<DonHang[]>([
    { maDon: "GHN17489231", ngayTao: "10/05/2026", loai: "Hỏa Tốc", nguoiNhan: "Nguyễn Thị Lan", diaChi: "123 Đường ABC, Quận 1, TP.HCM", soPi: 45000, trangThai: 'DangGiao', trangThaiText: "Đang giao", color: "#22d3ee" },
    { maDon: "GHN17488902", ngayTao: "09/05/2026", loai: "Đường Dài", nguoiNhan: "Trần Văn Hải", diaChi: "456 Nguyễn Văn Linh, Quận 7", soPi: 28500, trangThai: 'DaGiao', trangThaiText: "Đã giao", color: "#22c55e" },
    { maDon: "GHN17487654", ngayTao: "08/05/2026", loai: "Hỏa Tốc", nguoiNhan: "Lê Thị Hoa", diaChi: "89 Lê Lợi, Quận 1", soPi: 32000, trangThai: 'ChoXacNhan', trangThaiText: "Chờ xác nhận", color: "#eab308" },
    { maDon: "GHN17486543", ngayTao: "07/05/2026", loai: "Đường Dài", nguoiNhan: "Phạm Minh Quân", diaChi: "101 Pasteur, Quận 3", soPi: 41500, trangThai: 'DangChuanBi', trangThaiText: "Đang chuẩn bị", color: "#a855f7" },
    { maDon: "GHN17485432", ngayTao: "06/05/2026", loai: "Hỏa Tốc", nguoiNhan: "Vũ Thị Ngọc", diaChi: "222 Võ Văn Kiệt, Quận 5", soPi: 19500, trangThai: 'Huy', trangThaiText: "Đã hủy", color: "#ef4444" },
  ]);

  const filteredDonHangs = filter === 'All' ? donHangs : donHangs.filter(d => d.trangThai === filter);

  return (
    <div style={{ padding: '20px 0' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>📦 ĐƠN HÀNG CỦA TÔI</h1>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Quản lý tất cả đơn hàng đã tạo</p>

      {/* NÚT TẠO ĐƠN - ĐẶT Ở TRÊN (theo ý bạn) */}
      <button 
        onClick={() => navigate('/gui-hang')}
        style={createButtonTopStyle}
      >
        + Tạo đơn hàng mới
      </button>

      {/* FILTER */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { key: 'All', label: 'Tất cả' },
          { key: 'ChoXacNhan', label: 'Chờ' },
          { key: 'DangChuanBi', label: 'Chuẩn bị' },
          { key: 'DangGiao', label: 'Đang giao' },
          { key: 'DaGiao', label: 'Đã giao' },
          { key: 'Huy', label: 'Đã hủy' }
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

      {/* DANH SÁCH ĐƠN HÀNG */}
      {filteredDonHangs.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>Không có đơn hàng nào</p>
      ) : (
        filteredDonHangs.map(don => (
          <div key={don.maDon} style={orderCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22d3ee' }}>{don.maDon}</div>
              <span style={{ color: don.color, fontWeight: 'bold' }}>{don.trangThaiText}</span>
            </div>

            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '12px' }}>
              {don.ngayTao} • {don.loai}
            </div>

            <div style={{ marginBottom: '16px', color: '#e2e8f0' }}>
              <strong>Người nhận:</strong> {don.nguoiNhan}<br />
              {don.diaChi}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#22d3ee' }}>
                {don.soPi.toLocaleString()} <span style={{ fontSize: '18px' }}>Pi</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => navigate(`/tracking?maDon=${don.maDon}`)} style={viewBtn}>Theo dõi</button>
                {(don.trangThai === 'DangGiao' || don.trangThai === 'ChoXacNhan' || don.trangThai === 'DangChuanBi') && (
                  <button onClick={() => alert(`Hủy đơn ${don.maDon}`)} style={cancelBtn}>Hủy</button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ====================== STYLES ====================== */
const createButtonTopStyle = {
  width: '100%',
  padding: '16px',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '17px',
  fontWeight: 'bold',
  marginBottom: '24px',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
};

const orderCardStyle = {
  backgroundColor: '#1e2937',
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '18px',
  border: '1px solid #334155',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
};

const activeFilterStyle = {
  padding: '8px 16px',
  borderRadius: '9999px',
  background: '#22d3ee',
  color: '#0f172a',
  fontWeight: 'bold',
  whiteSpace: 'nowrap' as const,
  border: 'none',
  fontSize: '14px'
};

const inactiveFilterStyle = {
  padding: '8px 16px',
  borderRadius: '9999px',
  background: '#1e2937',
  color: '#94a3b8',
  border: '1px solid #475569',
  whiteSpace: 'nowrap' as const,
  fontSize: '14px'
};

const viewBtn = {
  padding: '9px 18px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const cancelBtn = {
  padding: '9px 18px',
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '14px',
  cursor: 'pointer'
};