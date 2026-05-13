// src/pages/KhieuNaiPage.tsx
import { useState, useRef, useEffect } from 'react';

export default function KhieuNaiPage() {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
  const [rating, setRating] = useState<number>(0);
  const [selectedTarget, setSelectedTarget] = useState<string>('');

  const [formData, setFormData] = useState({
    maDon: '',
    lyDo: '',
    moTa: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [myComplaints, setMyComplaints] = useState([
    { id: "KN001", maDon: "GHN17488902", lyDo: "Hàng hóa bị hỏng", target: "Tài xế Nguyễn Văn A", rating: 2, trangThai: "Đang xử lý", ngay: "08/05/2026", color: "#eab308" as const },
    { id: "KN002", maDon: "GHN17488754", lyDo: "Thiếu hàng", target: "Kho Hub Đà Nẵng", rating: 1, trangThai: "Đã giải quyết", ngay: "06/05/2026", color: "#4ade80" as const },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setPreviews(prev => [...prev, ev.target!.result as string]);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        setPreviews(prev => [...prev, URL.createObjectURL(file)]);
      }
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviews(prev => [...prev, url]);
        setAttachments(prev => [...prev, new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' })]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Không thể truy cập camera/micro!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const removePreview = (index: number) => {
    const newPreviews = [...previews];
    const newAttachments = [...attachments];
    if (newPreviews[index].startsWith('blob:')) URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    newAttachments.splice(index, 1);
    setPreviews(newPreviews);
    setAttachments(newAttachments);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.maDon || !formData.lyDo || !selectedTarget || rating === 0) {
      alert("Vui lòng điền đầy đủ thông tin và đánh giá sao!");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1400));

    const newComplaint = {
      id: `KN${String(Date.now()).slice(-4)}`,
      maDon: formData.maDon,
      lyDo: formData.lyDo,
      target: selectedTarget,
      rating,
      trangThai: "Đang xử lý",
      ngay: new Date().toLocaleDateString('vi-VN'),
      color: "#eab308" as const
    };

    setMyComplaints(prev => [newComplaint, ...prev]);
    alert(`✅ Khiếu nại đã được ghi nhận!`);

    setFormData({ maDon: '', lyDo: '', moTa: '' });
    setRating(0);
    setSelectedTarget('');
    setAttachments([]);
    setPreviews([]);
    setIsSubmitting(false);
  };

  useEffect(() => {
    return () => {
      previews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, [previews]);

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ fontSize: '52px' }}>⚠️</div>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 }}>KHIẾU NẠI & ĐÁNH GIÁ</h1>
          <p style={{ color: '#6b21a8', margin: 0 }}>Minh bạch • On-chain • Ảnh hưởng Reputation</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={tabContainerStyle}>
        <button onClick={() => setActiveTab('new')} style={activeTab === 'new' ? activeTabStyle : tabStyle}>Gửi Khiếu Nại Mới</button>
        <button onClick={() => setActiveTab('history')} style={activeTab === 'history' ? activeTabStyle : tabStyle}>Lịch sử ({myComplaints.length})</button>
      </div>

      {activeTab === 'new' && (
        <div style={mainCardStyle}>
          <form onSubmit={handleSubmit}>
            <select name="maDon" value={formData.maDon} onChange={handleChange} style={inputStyle} required>
              <option value="">Chọn mã đơn hàng</option>
              <option value="GHN17488902">GHN17488902 - Đà Nẵng → TP.HCM</option>
              <option value="GHN17488754">GHN17488754 - Hà Nội → Đà Nẵng</option>
              <option value="GHN17489123">GHN17489123 - TP.HCM → Hà Nội</option>
            </select>

            <select name="lyDo" value={formData.lyDo} onChange={handleChange} style={inputStyle} required>
              <option value="">Chọn lý do khiếu nại</option>
              <option value="Hàng hỏng">Hàng hóa bị hỏng</option>
              <option value="Thiếu hàng">Thiếu số lượng</option>
              <option value="Chậm giao">Giao hàng chậm</option>
              <option value="Không nhận được">Không nhận được hàng</option>
              <option value="Khác">Khác</option>
            </select>

            <select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)} style={inputStyle} required>
              <option value="">Chọn đối tượng bị khiếu nại</option>
              <option value="Tài xế Nguyễn Văn A">Tài xế Nguyễn Văn A</option>
              <option value="Kho Hub Đà Nẵng">Kho Hub Đà Nẵng</option>
              <option value="Kho Hub TP.HCM">Kho Hub TP.HCM</option>
              <option value="Người gửi">Người gửi</option>
            </select>

            {/* Đánh giá sao */}
            <div style={{ margin: '24px 0 16px' }}>
              <label style={labelStyle}>Đánh giá chất lượng (1-5 sao)</label>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', fontSize: '52px' }}>
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)} style={starStyle(star <= rating)}>★</button>
                ))}
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <label style={labelStyle}>Mô tả chi tiết vấn đề</label>
            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Mô tả chi tiết vấn đề..."
            />

            {/* Đính kèm - ĐÃ CHỈNH CÂN ĐỐI */}
            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>📎 Đính kèm ảnh / video</label>
              
              <div style={fileUploadContainer}>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  multiple 
                  onChange={handleFileUpload} 
                  style={fileInputStyle}
                />
                <span style={filePlaceholder}>Không có tệp nào được chọn</span>
              </div>

              <button 
                type="button" 
                onClick={isRecording ? stopRecording : startRecording} 
                style={cameraButtonStyle}
              >
                {isRecording ? '⏹️ Dừng quay' : '📹 Quay video trực tiếp'}
              </button>

              {previews.length > 0 && (
                <div style={previewContainerStyle}>
                  {previews.map((src, i) => (
                    <div key={i} style={previewWrapperStyle}>
                      {src.includes('video') || src.startsWith('blob:') ? (
                        <video src={src} controls style={previewMediaStyle} />
                      ) : (
                        <img src={src} alt="preview" style={previewMediaStyle} />
                      )}
                      <button type="button" onClick={() => removePreview(i)} style={removeBtnStyle}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" style={submitButtonStyle} disabled={isSubmitting}>
              {isSubmitting ? 'Đang ghi nhận...' : '🚨 GỬI KHIẾU NẠI'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myComplaints.map((item) => (
            <div key={item.id} style={complaintCardStyle}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#22d3ee' }}>{item.maDon}</div>
                <div style={{ color: '#4c1d95' }}>{item.lyDo}</div>
                <div style={{ color: '#64748b', fontSize: '14px' }}>→ {item.target}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#fbbf24', fontSize: '20px' }}>{'★'.repeat(item.rating)}</div>
                <div style={{ color: item.color, fontWeight: '600' }}>{item.trangThai}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{item.ngay}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const pageContainer = { minHeight: '100vh', width: '100%', background: '#f3e8ff', padding: '16px 14px 100px', boxSizing: 'border-box' as const } as const;

const headerStyle = { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' } as const;

const tabContainerStyle = { display: 'flex', background: '#ede9fe', borderRadius: '9999px', padding: '6px', marginBottom: '28px', border: '1px solid #c4b5fd' } as const;

const activeTabStyle = { flex: 1, padding: '14px', borderRadius: '9999px', background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a', fontWeight: '700', border: 'none' } as const;

const tabStyle = { flex: 1, padding: '14px', borderRadius: '9999px', background: 'transparent', color: '#4c1d95', border: 'none' } as const;

const mainCardStyle = { background: '#ede9fe', padding: '32px 24px', borderRadius: '24px', border: '1px solid #c4b5fd' } as const;

const inputStyle = { width: '100%', padding: '16px 18px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95', fontSize: '16px', marginBottom: '16px', boxSizing: 'border-box' as const } as const;

const textareaStyle = { width: '100%', padding: '16px 18px', background: '#f3e8ff', border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95', fontSize: '16px', minHeight: '140px', resize: 'vertical' as const, boxSizing: 'border-box' as const } as const;

const labelStyle = { color: '#4c1d95', display: 'block', marginBottom: '8px', fontWeight: '600' } as const;

/* Phần đính kèm đã được chỉnh sửa cân đối */
const fileUploadContainer = {
  position: 'relative',
  width: '100%',
  marginBottom: '12px'
} as const;

const fileInputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: '#f3e8ff',
  border: '1px solid #c4b5fd',
  borderRadius: '12px',
  color: '#4c1d95',
  cursor: 'pointer',
  boxSizing: 'border-box' as const
} as const;

const filePlaceholder = {
  position: 'absolute',
  top: '50%',
  left: '16px',
  transform: 'translateY(-50%)',
  color: '#94a3b8',
  pointerEvents: 'none' as const,
  fontSize: '15px'
} as const;

const cameraButtonStyle = { width: '100%', padding: '15px', background: '#1e2937', border: '2px solid #22d3ee', color: '#22d3ee', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', marginBottom: '16px' } as const;

const previewContainerStyle = { display: 'flex', flexWrap: 'wrap' as const, gap: '12px', marginTop: '12px' } as const;
const previewWrapperStyle = { position: 'relative' as const } as const;
const previewMediaStyle = { maxWidth: '160px', maxHeight: '160px', borderRadius: '10px', border: '2px solid #c4b5fd', objectFit: 'cover' as const } as const;
const removeBtnStyle = { position: 'absolute' as const, top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer' } as const;

const submitButtonStyle = { width: '100%', padding: '18px', background: 'linear-gradient(90deg, #ef4444, #f59e0b)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: '700', fontSize: '17px', marginTop: '20px', cursor: 'pointer' } as const;

const complaintCardStyle = { background: '#ede9fe', padding: '20px', borderRadius: '16px', border: '1px solid #c4b5fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as const;

const starStyle = (active: boolean) => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: active ? '#fbbf24' : '#cbd5e1',
  fontSize: '52px',
  transition: 'all 0.2s ease',
  transform: active ? 'scale(1.15)' : 'scale(1)'
});