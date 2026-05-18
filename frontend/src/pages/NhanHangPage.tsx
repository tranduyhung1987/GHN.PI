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
    const doiTuongText = complaintInfo.doiTuong === 'taiXe' ? 'Tài xế' : 'Người bán';
    alert(`🚨 Khiếu nại đã được gửi thành công!\nMã đơn: ${selectedOrder?.maDon}\nĐối tượng: ${doiTuongText}\nChúng tôi sẽ xử lý trong 24h.`);
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
        <div style={{ fontSize: '42px' }}>🖐️</div>
        <h1 style={title}>NHẬN HÀNG</h1>
      </div>

      <p style={subtitle}>Xác nhận nhận hàng • Thanh toán Pi minh bạch</p>

      <div style={tabContainer}>
        <button onClick={() => setActiveTab('danhSach')} style={activeTab === 'danhSach' ? activeTabBtn : tabBtn}>Danh sách đơn</button>
        <button onClick={() => setActiveTab('lichSu')} style={activeTab === 'lichSu' ? activeTabBtn : tabBtn}>Lịch sử</button>
        <button onClick={() => setActiveTab('doiTra')} style={activeTab === 'doiTra' ? activeTabBtn : tabBtn}>Đổi trả</button>
      </div>

      {activeTab === 'danhSach' && (
        <div style={mainCard}>
          <h3>Danh sách đơn cần nhận</h3>
          {pendingOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>✅ Không còn đơn nào cần nhận</p>
          ) : (
            pendingOrders.map(order => (
              <div key={order.maDon} style={orderItem} onClick={() => setSelectedOrder(order)}>
                <div>
                  <strong>{order.maDon}</strong> - {order.nguoiGui}<br />
                  <small>{order.diaChiNhan}</small><br />
                  <small style={{ color: '#22d3ee' }}>{order.loaiDon === 'hoatoc' ? '⚡ Hỏa Tốc' : '🛣️ Đường Dài'}</small>
                </div>
                <button onClick={(e) => { e.stopPropagation(); xacNhanNhanHang(order); }} style={confirmButton}>
                  ✅ Xác nhận nhận hàng
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'lichSu' && (
        <div style={mainCard}>
          <h3>Lịch sử nhận hàng</h3>
          {completedOrders.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Chưa có đơn hàng nào được nhận</p>
          ) : (
            completedOrders.map(order => (
              <div key={order.maDon} style={orderItemCompleted} onClick={() => setSelectedOrder(order)}>
                <div>
                  <strong>{order.maDon}</strong> - {order.nguoiGui}<br />
                  <small>{order.diaChiNhan}</small><br />
                  <small style={{ color: '#10b981' }}>✅ Đã nhận • Hoàn thành</small>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'doiTra' && (
        <div style={mainCard}>
          <h3>Yêu cầu đổi trả</h3>
          <select value={doiTraInfo.lyDo} onChange={(e) => setDoiTraInfo(p => ({...p, lyDo: e.target.value}))} style={inputField}>
            <option value="">Chọn lý do</option>
            {lyDoOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
          </select>
          <textarea placeholder="Mô tả chi tiết..." value={doiTraInfo.moTa} onChange={(e) => setDoiTraInfo(p => ({...p, moTa: e.target.value}))} style={textareaStyle} />
          <div onClick={() => fileInputRef.current?.click()} style={fileUploadBox}>📎 {doiTraInfo.fileName}</div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" style={{ display: 'none' }} />
          <button onClick={guiYeuCauDoiTra} style={cyanButton}>🚀 Gửi yêu cầu đổi trả</button>
        </div>
      )}

      {selectedOrder && !showComplaint && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2>Chi tiết đơn hàng</h2>
            <div style={infoBox}>
              <p><strong>Mã đơn:</strong> {selectedOrder.maDon}</p>
              <p><strong>Người gửi:</strong> {selectedOrder.nguoiGui}</p>
              <p><strong>Người nhận:</strong> {selectedOrder.nguoiNhan}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.diaChiNhan}</p>
              <p><strong>Trạng thái:</strong> <span style={{ color: '#10b981' }}>Hoàn thành</span></p>
            </div>
            <button onClick={() => setShowComplaint(true)} style={complaintButton}>🚨 Khiếu nại đơn hàng</button>
            <button onClick={() => setSelectedOrder(null)} style={closeButton}>Đóng</button>
          </div>
        </div>
      )}

      {showComplaint && selectedOrder && (
        <div style={modalOverlay}>
          <div style={modalContentComplaint}>
            <h2>Khiếu nại đơn #{selectedOrder.maDon}</h2>
            
            <label>Khiếu nại với:</label>
            <div style={{ display: 'flex', gap: '12px', margin: '12px 0 20px' }}>
              <button onClick={() => setComplaintInfo(p => ({...p, doiTuong: 'taiXe'}))} style={complaintInfo.doiTuong === 'taiXe' ? selectedBtn : unselectedBtn}>👨‍✈️ Tài xế</button>
              <button onClick={() => setComplaintInfo(p => ({...p, doiTuong: 'nguoiBan'}))} style={complaintInfo.doiTuong === 'nguoiBan' ? selectedBtn : unselectedBtn}>🛒 Người bán</button>
            </div>

            <select value={complaintInfo.lyDo} onChange={(e) => setComplaintInfo(p => ({...p, lyDo: e.target.value}))} style={inputField}>
              <option value="">Chọn lý do khiếu nại</option>
              {lyDoOptions.map((item, i) => <option key={i} value={item}>{item}</option>)}
            </select>

            <textarea placeholder="Mô tả chi tiết vấn đề..." value={complaintInfo.moTa} onChange={(e) => setComplaintInfo(p => ({...p, moTa: e.target.value}))} style={textareaStyle} />

            <div style={{ display: 'flex', gap: '10px', margin: '12px 0' }}>
              <button onClick={startCamera} style={cameraBtn}>📸 Mở Camera</button>
              <button onClick={() => fileInputRef.current?.click()} style={uploadBtn}>📎 Chọn từ thư viện</button>
            </div>

            {complaintInfo.mediaPreview && (
              <div style={{ margin: '12px 0', textAlign: 'center' }}>
                {complaintInfo.fileName.endsWith('.mp4') ? (
                  <video src={complaintInfo.mediaPreview} controls style={{ width: '100%', borderRadius: '12px' }} />
                ) : (
                  <img src={complaintInfo.mediaPreview} alt="preview" style={{ width: '100%', borderRadius: '12px' }} />
                )}
                <small>{complaintInfo.fileName}</small>
              </div>
            )}

            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" style={{ display: 'none' }} />

            <button onClick={guiKhiEuNai} style={cyanButton}>Gửi khiếu nại</button>
            <button onClick={() => setShowComplaint(false)} style={closeButton}>Hủy</button>
          </div>
        </div>
      )}

      {showCamera && (
        <div style={modalOverlay}>
          <div style={{ background: '#000', padding: '10px', borderRadius: '16px', width: '94%', maxWidth: '420px' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '12px' }} />
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              {!isRecording ? (
                <>
                  <button onClick={takePhoto} style={photoBtn}>📸 Chụp ảnh</button>
                  <button onClick={startRecording} style={recordBtn}>🎥 Bắt đầu quay</button>
                </>
              ) : (
                <button onClick={stopRecording} style={stopRecordBtn}>⏹ Dừng quay</button>
              )}
              <button onClick={stopCamera} style={closeButton}>Đóng camera</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES (ĐÃ SỬA HOÀN TOÀN) ===================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 14px 90px', boxSizing: 'border-box', fontFamily: 'system-ui' };
const header: React.CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' };
const title: React.CSSProperties = { fontSize: '28px', fontWeight: '700', color: '#4c1d95' };
const subtitle: React.CSSProperties = { color: '#64748b', textAlign: 'center' as const, marginBottom: '24px' };

const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '28px', justifyContent: 'center', flexWrap: 'wrap' as const };
const tabBtn: React.CSSProperties = { padding: '10px 20px', borderRadius: '9999px', border: '2px solid #c4b5fd', background: '#fff', color: '#64748b', fontWeight: '600', cursor: 'pointer' };
const activeTabBtn: React.CSSProperties = { padding: '10px 20px', borderRadius: '9999px', border: '2px solid #22d3ee', background: '#22d3ee', color: '#0f172a', fontWeight: '600', cursor: 'pointer' };

const mainCard: React.CSSProperties = { background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' };
const orderItem: React.CSSProperties = { background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e0d4ff', cursor: 'pointer' };
const orderItemCompleted: React.CSSProperties = { background: '#f0fdf4', padding: '16px', borderRadius: '12px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #86efac', cursor: 'pointer' };

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent: React.CSSProperties = { background: 'white', padding: '24px', borderRadius: '20px', width: '90%', maxWidth: '420px', maxHeight: '85vh', overflow: 'auto' };
const modalContentComplaint: React.CSSProperties = { background: 'white', padding: '20px 24px 120px', borderRadius: '20px', width: '90%', maxWidth: '420px', maxHeight: '92vh', overflow: 'auto' };

const infoBox: React.CSSProperties = { background: '#f8fafc', padding: '20px', borderRadius: '16px', lineHeight: '1.8', margin: '16px 0' };
const complaintButton: React.CSSProperties = { width: '100%', padding: '14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', margin: '12px 0' };
const closeButton: React.CSSProperties = { width: '100%', padding: '14px', background: '#64748b', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '600' };

const inputField: React.CSSProperties = { width: '100%', padding: '14px', border: '1px solid #c4b5fd', borderRadius: '12px', margin: '12px 0' };
const textareaStyle: React.CSSProperties = { width: '100%', padding: '14px', border: '1px solid #c4b5fd', borderRadius: '12px', height: '110px', margin: '12px 0' };
const cyanButton: React.CSSProperties = { width: '100%', padding: '16px', background: '#22d3ee', color: '#0f172a', border: 'none', borderRadius: '9999px', fontWeight: '700', cursor: 'pointer' };
const confirmButton: React.CSSProperties = { padding: '10px 20px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700' };

const selectedBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#22d3ee', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '600' };
const unselectedBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#f1f5f9', color: '#64748b', border: '1px solid #c4b5fd', borderRadius: '9999px', fontWeight: '600' };

const fileUploadBox: React.CSSProperties = { padding: '16px', border: '2px dashed #22d3ee', borderRadius: '12px', textAlign: 'center' as const, cursor: 'pointer', margin: '12px 0' };

const cameraBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '9999px' };
const recordBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '9999px' };
const stopRecordBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#eab308', color: 'white', border: 'none', borderRadius: '9999px' };
const uploadBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '9999px' };
const photoBtn: React.CSSProperties = { flex: 1, padding: '12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '9999px' };

export default NhanHangPage;