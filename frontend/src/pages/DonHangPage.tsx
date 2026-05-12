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
  repScore?: number;        // Uy tín của tài xế/hub
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
    <div style={{ padding: '20px 0', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontSize: '48px' }}>📦</div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>ĐƠN HÀNG CỦA TÔI</h1>
      </div>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
        Quản lý tất cả đơn hàng • Tổng {donHangs.length} đơn • Uy tín minh bạch
      </p>

      {/* TẠO ĐƠN MỚI */}
      <button 
        onClick={() => navigate('/gui-hang')}
        style={{
          width: '100%', padding: '18px', marginBottom: '24px',
          background: 'linear-gradient(90deg, #22d3ee, #67e8f9)',
          color: '#0f172a', border: 'none', borderRadius: '999px',
          fontSize: '17px', fontWeight: 'bold', cursor: 'pointer',
          boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)'
        }}
      >
        + TẠO ĐƠN HÀNG MỚI
      </button>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Tìm mã đơn hoặc tên người nhận..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%', padding: '16px 20px', background: '#1e2937',
          border: '1px solid #475569', borderRadius: '999px',
          color: 'white', fontSize: '16px', marginBottom: '20px'
        }}
      />

      {/* FILTER TABS */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
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
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              background: filter === item.key ? '#22d3ee' : '#1e2937',
              color: filter === item.key ? '#0f172a' : '#94a3b8',
              border: filter === item.key ? 'none' : '1px solid #475569',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* LIST OF ORDERS */}
      {filteredDonHangs.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>Không tìm thấy đơn hàng nào</p>
      ) : (
        filteredDonHangs.map(don => (
          <div key={don.maDon} style={{
            background: '#1e2937',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '16px',
            border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22d3ee' }}>{don.maDon}</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>{don.ngayTao} • {don.loai}</div>
              </div>
              <span style={{ 
                color: don.color, 
                fontWeight: 'bold', 
                padding: '4px 12px', 
                background: '#0f172a', 
                borderRadius: '999px', 
                fontSize: '13px' 
              }}>
                {don.trangThaiText}
              </span>
            </div>

            <div style={{ marginBottom: '12px', color: '#e2e8f0' }}>
              <strong>Người nhận:</strong> {don.nguoiNhan}<br />
              {don.diaChi}
            </div>

            {/* REPUTATION SECTION */}
            {don.taiXe && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                background: '#0f172a', 
                padding: '10px 14px', 
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>Người thực hiện:</div>
                <div style={{ fontWeight: 'bold' }}>{don.taiXe}</div>
                <div style={{ 
                  color: getRepColor(don.repScore), 
                  fontWeight: 'bold', 
                  marginLeft: 'auto' 
                }}>
                  {don.repScore} ★
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#22d3ee' }}>
                {don.soPi.toLocaleString()} <span style={{ fontSize: '18px' }}>Pi</span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => navigate(`/tracking?maDon=${don.maDon}`)}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#22d3ee', 
                    color: '#0f172a', 
                    border: 'none', 
                    borderRadius: '999px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}
                >
                  Theo dõi
                </button>

                <button 
                  onClick={() => handleKhiếuNại(don.maDon, don.taiXe)}
                  style={{ 
                    padding: '10px 20px', 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '999px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer' 
                  }}
                >
                  Khiếu nại
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}