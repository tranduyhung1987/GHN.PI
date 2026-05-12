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
    { 
      id: "KN001", 
      maDon: "GHN17488902", 
      lyDo: "Hàng hóa bị hỏng", 
      target: "Tài xế Nguyễn Văn A",
      rating: 2,
      trangThai: "Đang xử lý", 
      ngay: "08/05/2026", 
      color: "#eab308" as const
    },
    { 
      id: "KN002", 
      maDon: "GHN17488754", 
      lyDo: "Thiếu hàng", 
      target: "Kho Hub Đà Nẵng",
      rating: 1,
      trangThai: "Đã giải quyết", 
      ngay: "06/05/2026", 
      color: "#4ade80" as const
    },
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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: true 
      });
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
    if (newPreviews[index].startsWith('blob:')) {
      URL.revokeObjectURL(newPreviews[index]);
    }
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

    alert(`✅ Khiếu nại đã được ghi nhận!\nĐánh giá ${rating} sao cho ${selectedTarget}\nReputation sẽ được cập nhật.`);

    // Reset form
    setFormData({ maDon: '', lyDo: '', moTa: '' });
    setRating(0);
    setSelectedTarget('');
    setAttachments([]);
    setPreviews([]);
    setIsSubmitting(false);
  };

  // Cleanup memory
  useEffect(() => {
    return () => {
      previews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [previews]);

  return (
    <>
      <div style={neonHeaderStyle}>
        <div style={{ fontSize: '52px', filter: 'drop-shadow(0 0 15px #eab308)' }}>⚠️</div>
        <div>
          <h1 style={neonTitleStyle}>KHIẾU NẠI & ĐÁNH GIÁ</h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>Minh bạch • On-chain • Ảnh hưởng Reputation</p>
        </div>
      </div>

      <div style={tabContainerStyle}>
        <button 
          onClick={() => setActiveTab('new')} 
          style={activeTab === 'new' ? activeTabStyle : inactiveTabStyle}
        >
          Gửi Khiếu Nại Mới
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          style={activeTab === 'history' ? activeTabStyle : inactiveTabStyle}
        >
          Lịch sử ({myComplaints.length})
        </button>
      </div>

      {activeTab === 'new' ? (
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

            {/* ĐÁNH GIÁ REPUTATION */}
            <div style={{ margin: '24px 0' }}>
              <label style={labelStyle}>Đối tượng bị khiếu nại</label>
              <select 
                value={selectedTarget} 
                onChange={(e) => setSelectedTarget(e.target.value)} 
                style={inputStyle} 
                required
              >
                <option value="">Chọn đối tượng</option>
                <option value="Tài xế Nguyễn Văn A">Tài xế Nguyễn Văn A</option>
                <option value="Kho Hub Đà Nẵng">Kho Hub Đà Nẵng</option>
                <option value="Kho Hub TP.HCM">Kho Hub TP.HCM</option>
                <option value="Người gửi">Người gửi</option>
              </select>

              <label style={labelStyle}>Đánh giá chất lượng (1-5 sao)</label>
              <div style={{ display: 'flex', gap: '20px', fontSize: '200px', margin: '16px 0', padding: '6px 0'}}>
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: star <= rating ? '#fbbf24' : '#475569',
                      textShadow: star <= rating ? '0 0 12px #fbbf24' : 'none',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <textarea
              name="moTa"
              value={formData.moTa}
              onChange={handleChange}
              style={textareaStyle}
              placeholder="Mô tả chi tiết vấn đề..."
            />

            {/* Đính kèm */}
            <div style={{ marginTop: '24px' }}>
              <label style={labelStyle}>📎 Đính kèm ảnh / video</label>
              <input 
                type="file" 
                accept="image/*,video/*" 
                multiple 
                onChange={handleFileUpload} 
                style={fileInputStyle}
              />

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
              {isSubmitting ? 'Đang ghi nhận on-chain...' : '🚨 GỬI KHIẾU NẠI & CẬP NHẬT REPUTATION'}
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myComplaints.map((item) => (
            <div key={item.id} style={complaintCardStyle}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#22d3ee' }}>{item.maDon}</div>
                <div style={{ color: '#cbd5e1' }}>{item.lyDo}</div>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>→ {item.target}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#fbbf24', fontSize: '22px' }}>{'★'.repeat(item.rating)}</div>
                <div style={{ color: item.color, fontWeight: '600' }}>{item.trangThai}</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>{item.ngay}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

/* ====================== STYLES ====================== */
const neonHeaderStyle = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', padding: '24px 28px', backgroundColor: '#1e2937', borderRadius: '20px', border: '2px solid #eab308', boxShadow: '0 0 30px #eab308' };
const neonTitleStyle = { fontSize: '38px', fontWeight: 'bold', margin: 0, color: '#fff', textShadow: '0 0 20px #eab308' };

const tabContainerStyle = { display: 'flex', backgroundColor: '#1e2937', borderRadius: '16px', padding: '6px', marginBottom: '24px', border: '1px solid #334155' };
const activeTabStyle = { flex: 1, padding: '14px', borderRadius: '12px', background: 'linear-gradient(90deg, #eab308, #f59e0b)', color: '#000', fontWeight: 'bold', border: 'none' };
const inactiveTabStyle = { flex: 1, padding: '14px', borderRadius: '12px', backgroundColor: 'transparent', color: '#94a3b8', border: 'none' };

const mainCardStyle = { backgroundColor: '#1e2937', padding: '32px', borderRadius: '24px', border: '2px solid #334155' };
const inputStyle = { width: '100%', padding: '16px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '12px', color: 'white', fontSize: '16px', marginBottom: '16px' };
const textareaStyle = { width: '100%', padding: '16px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '12px', color: 'white', fontSize: '16px', minHeight: '130px', resize: 'vertical' as const };
const labelStyle = { color: '#e2e8f0', display: 'block', marginBottom: '8px', fontWeight: '500' };
const fileInputStyle = { width: '100%', padding: '12px', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '12px', color: 'white', marginBottom: '12px' };
const cameraButtonStyle = { width: '100%', padding: '15px', backgroundColor: '#1e2937', border: '2px solid #22d3ee', color: '#22d3ee', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '16px' };

const previewContainerStyle = { display: 'flex', flexWrap: 'wrap' as const, gap: '12px', marginTop: '12px' };
const previewWrapperStyle = { position: 'relative' as const };
const previewMediaStyle = { maxWidth: '160px', maxHeight: '160px', borderRadius: '10px', border: '2px solid #334155', objectFit: 'cover' as const };
const removeBtnStyle = { position: 'absolute' as const, top: -8, right: -8, background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer' };

const submitButtonStyle = { width: '100%', padding: '18px', marginTop: '12px', background: 'linear-gradient(90deg, #ef4444, #f97316)', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 'bold', fontSize: '17px' };

const complaintCardStyle = { backgroundColor: '#1e2937', padding: '20px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };