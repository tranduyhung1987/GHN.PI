import React, { useState, useRef, useEffect } from 'react';

interface NhanHangPageProps {
  onNavigate: (page: string) => void;
}

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

function NhanHangPage({ onNavigate }: NhanHangPageProps) {
  const [activeTab, setActiveTab] = useState<'danhSach' | 'lichSu' | 'doiTra'>('danhSach');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showComplaint, setShowComplaint] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [complaintInfo, setComplaintInfo] = useState({
    doiTuong: 'taiXe' as 'taiXe' | 'nguoiBan',
    lyDo: '',
    moTa: '',
    fileName: 'Chưa chọn tệp',
    mediaPreview: '' as string
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [doiTraInfo, setDoiTraInfo] = useState({ lyDo: '', moTa: '', fileName: 'Chưa chọn tệp' });

  const loadOrders = () => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      const mapped = parsed.map((o: any) => ({
        maDon: o.maDon || o.id,
        nguoiGui: o.nguoiGui || 'Người gửi',
        nguoiNhan: o.nguoiNhan || 'Bạn',
        diaChiNhan: o.diaChiNhan || '',
        trangThai: o.status,
        paymentMethod: o.paymentMethod,
        totalAmount: o.totalAmount,
        loaiDon: o.loaiDon,
        createdAt: o.createdAt
      }));
      setOrders(mapped);
    }
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('storage', loadOrders);
    return () => window.removeEventListener('storage', loadOrders);
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      mediaStreamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (err) {
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền trên Pi Browser.");
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setShowCamera(false);
    setIsRecording(false);
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setComplaintInfo(prev => ({ ...prev, mediaPreview: dataUrl, fileName: `photo_${Date.now()}.jpg` }));
    stopCamera();
  };

  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    const recorder = new MediaRecorder(mediaStreamRef.current);
    mediaRecorderRef.current = recorder;
    recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setComplaintInfo(prev => ({ ...prev, mediaPreview: url, fileName: `video_${Date.now()}.mp4` }));
    };
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const xacNhanNhanHang = (order: Order) => {
    if (!window.confirm(`✅ Xác nhận bạn đã nhận hàng đầy đủ?\nMã đơn: ${order.maDon}`)) return;
    const saved = localStorage.getItem('orders');
    if (saved) {
      const allOrders = JSON.parse(saved);
      const updated = allOrders.map((o: any) => 
        (o.maDon === order.maDon || o.id === order.maDon) 
          ? { ...o, status: 'hoan-thanh', updatedAt: new Date().toISOString() }
          : o
      );
      localStorage.setItem('orders', JSON.stringify(updated));
    }
    alert(`🎉 Xác nhận nhận hàng thành công!\nMã đơn: ${order.maDon}\nTiền đã chuyển cho tài xế.`);
    loadOrders();
  };

  const guiKhiEuNai = () => {
    if (!complaintInfo.lyDo || !complaintInfo.moTa) return alert("Vui lòng chọn lý do và mô tả chi tiết!");
    alert(`🚨 Khiếu nại đã được gửi thành công!\nMã đơn: ${selectedOrder?.maDon}\nChúng tôi sẽ xử lý trong 24h.`);
    setShowComplaint(false);
    setSelectedOrder(null);
    setComplaintInfo({ doiTuong: 'taiXe', lyDo: '', moTa: '', fileName: 'Chưa chọn tệp', mediaPreview: '' });
  };

  const guiYeuCauDoiTra = () => {
    if (!doiTraInfo.lyDo || !doiTraInfo.moTa) return alert("Vui lòng điền đầy đủ!");
    alert("✅ Yêu cầu đổi trả đã được gửi thành công!");
    setDoiTraInfo({ lyDo: '', moTa: '', fileName: 'Chưa chọn tệp' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (showComplaint) {
        setComplaintInfo(prev => ({ ...prev, mediaPreview: url, fileName: file.name }));
      } else {
        setDoiTraInfo(prev => ({ ...prev, fileName: file.name }));
      }
    }
  };

  const lyDoOptions = ["Hàng hư hỏng", "Thiếu hàng", "Giao sai địa chỉ", "Thái độ kém", "Chậm trễ", "Không đúng mô tả", "Hàng giả", "Khác"];
  const pendingOrders = orders.filter(o => o.trangThai !== 'hoan-thanh');
  const completedOrders = orders.filter(o => o.trangThai === 'hoan-thanh');

  return (
    <div style={pageContainer}>
      <div style={header}>
        <h1 style={title}>📦 NHẬN HÀNG</h1>
      </div>

      <div style={tabContainer}>
        <button onClick={() => setActiveTab('danhSach')} style={activeTab === 'danhSach' ? activeTabBtn : tabBtn}>Danh sách</button>
        <button onClick={() => setActiveTab('lichSu')} style={activeTab === 'lichSu' ? activeTabBtn : tabBtn}>Lịch sử</button>
        <button onClick={() => setActiveTab('doiTra')} style={activeTab === 'doiTra' ? activeTabBtn : tabBtn}>Đổi trả</button>
      </div>

      {activeTab === 'danhSach' && (
        <div style={mainCard}>
          {pendingOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>✅ Không còn đơn nào</p>
          ) : (
            pendingOrders.map(order => (
              <div key={order.maDon} style={orderItem} onClick={() => setSelectedOrder(order)}>
                <div>
                  <strong>{order.maDon}</strong><br />
                  <small>{order.nguoiGui} - {order.diaChiNhan}</small>
                </div>
                <button onClick={(e) => { e.stopPropagation(); xacNhanNhanHang(order); }} style={confirmButton}>Xác nhận</button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'lichSu' && (
        <div style={mainCard}>
          {completedOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chưa có đơn hàng nào</p>
          ) : (
            completedOrders.map(order => (
              <div key={order.maDon} style={orderItemCompleted}>
                <div>
                  <strong>{order.maDon}</strong><br />
                  <small style={{ color: '#10b981' }}>✅ Đã nhận</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'doiTra' && (
        <div style={mainCard}>
          <select value={doiTraInfo.lyDo} onChange={(e) => setDoiTraInfo(p => ({...p, lyDo: e.target.value}))} style={inputField}>
            <option value="">Chọn lý do</option>
            {lyDoOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
          </select>
          <textarea placeholder="Mô tả chi tiết..." value={doiTraInfo.moTa} onChange={(e) => setDoiTraInfo(p => ({...p, moTa: e.target.value}))} style={textareaStyle} />
          <div onClick={() => fileInputRef.current?.click()} style={fileUploadBox}>📎 {doiTraInfo.fileName}</div>
          <button onClick={guiYeuCauDoiTra} style={purpleButton}>🚀 Gửi yêu cầu</button>
        </div>
      )}

      {selectedOrder && !showComplaint && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Chi tiết đơn</h2>
            <div style={infoBox}>
              <p><strong>Mã đơn:</strong> {selectedOrder.maDon}</p>
              <p><strong>Người gửi:</strong> {selectedOrder.nguoiGui}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.diaChiNhan}</p>
            </div>
            <button onClick={() => setShowComplaint(true)} style={complaintButton}>🚨 Khiếu nại</button>
            <button onClick={() => setSelectedOrder(null)} style={closeButton}>Đóng</button>
          </div>
        </div>
      )}

      {showComplaint && selectedOrder && (
        <div style={modalOverlay}>
          <div style={modalContentComplaint}>
            <h2>Khiếu nại #{selectedOrder.maDon}</h2>
            <div style={{ display: 'flex', gap: '12px', margin: '12px 0' }}>
              <button onClick={() => setComplaintInfo(p => ({...p, doiTuong: 'taiXe'}))} style={complaintInfo.doiTuong === 'taiXe' ? selectedBtn : unselectedBtn}>👨‍✈️ Tài xế</button>
              <button onClick={() => setComplaintInfo(p => ({...p, doiTuong: 'nguoiBan'}))} style={complaintInfo.doiTuong === 'nguoiBan' ? selectedBtn : unselectedBtn}>🛒 Người bán</button>
            </div>
            <select value={complaintInfo.lyDo} onChange={(e) => setComplaintInfo(p => ({...p, lyDo: e.target.value}))} style={inputField}>
              <option value="">Chọn lý do</option>
              {lyDoOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
            </select>
            <textarea placeholder="Mô tả chi tiết..." value={complaintInfo.moTa} onChange={(e) => setComplaintInfo(p => ({...p, moTa: e.target.value}))} style={textareaStyle} />
            <div style={{ display: 'flex', gap: '10px', margin: '12px 0' }}>
              <button onClick={startCamera} style={cameraBtn}>📸 Camera</button>
              <button onClick={() => fileInputRef.current?.click()} style={uploadBtn}>📎 Tệp tin</button>
            </div>
            <button onClick={guiKhiEuNai} style={purpleButton}>Gửi khiếu nại</button>
            <button onClick={() => setShowComplaint(false)} style={closeButton}>Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================== STYLES ĐỒNG BỘ ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: 'linear-gradient(180deg, #f3e8ff 0%, #ede9fe 100%)', padding: '16px 14px 100px', boxSizing: 'border-box' };
const header: React.CSSProperties = { textAlign: 'center', marginBottom: '24px' };
const title: React.CSSProperties = { fontSize: '24px', fontWeight: '800', color: '#4c1d95', margin: 0 };
const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px', justifyContent: 'center' };
const tabBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: '9999px', background: 'white', border: '1px solid #e9d5ff', color: '#64748b', fontWeight: '600', cursor: 'pointer' };
const activeTabBtn: React.CSSProperties = { padding: '10px 16px', borderRadius: '9999px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' };

const mainCard: React.CSSProperties = { background: 'white', padding: '20px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.05)', border: '1px solid #f3e8ff' };
const orderItem: React.CSSProperties = { background: '#fdfbff', padding: '16px', borderRadius: '16px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e9d5ff' };
const orderItemCompleted: React.CSSProperties = { ...orderItem, background: '#f0fdf4', borderColor: '#bbf7d0' };

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(76, 29, 149, 0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContent: React.CSSProperties = { background: 'white', padding: '24px', borderRadius: '28px', width: '100%', maxWidth: '360px' };
const modalContentComplaint: React.CSSProperties = { ...modalContent, maxHeight: '90vh', overflowY: 'auto' };

const infoBox: React.CSSProperties = { background: '#fdfbff', padding: '16px', borderRadius: '16px', marginBottom: '16px', fontSize: '14px' };
const complaintButton: React.CSSProperties = { width: '100%', padding: '14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', marginBottom: '10px' };
const closeButton: React.CSSProperties = { width: '100%', padding: '14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: '9999px', fontWeight: '700' };

const inputField: React.CSSProperties = { width: '100%', padding: '14px', border: '1px solid #e9d5ff', borderRadius: '14px', marginBottom: '12px', background: '#fdfbff' };
const textareaStyle: React.CSSProperties = { ...inputField, height: '100px' };
const purpleButton: React.CSSProperties = { width: '100%', padding: '16px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' };
const confirmButton: React.CSSProperties = { padding: '10px 16px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', fontSize: '12px' };

const selectedBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '600' };
const unselectedBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#f3e8ff', color: '#4c1d95', border: '1px solid #e9d5ff', borderRadius: '9999px', fontWeight: '600' };
const fileUploadBox: React.CSSProperties = { padding: '16px', border: '2px dashed #e9d5ff', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', marginBottom: '16px', color: '#7c3aed', fontWeight: '600' };
const cameraBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#e9d5ff', color: '#4c1d95', border: 'none', borderRadius: '9999px', fontWeight: '600' };
const uploadBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: '9999px', fontWeight: '600' };

export default NhanHangPage;