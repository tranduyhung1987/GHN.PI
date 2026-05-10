// src/pages/KhieuNaiPage.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KhieuNaiPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    maDon: '',
    lyDo: '',
    moTa: ''
  });

  const [attachments, setAttachments] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [myComplaints] = useState([
    { id: "KN001", maDon: "GHN17488902", lyDo: "Hàng hóa bị hỏng", trangThai: "Đang xử lý", ngay: "08/05/2026", color: "#eab308" },
    { id: "KN002", maDon: "GHN17488754", lyDo: "Thiếu hàng", trangThai: "Đã giải quyết", ngay: "06/05/2026", color: "#4ade80" },
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setPreviews(prev => [...prev, url]);
        setAttachments(prev => [...prev, new File([blob], "video.webm", { type: 'video/webm' })]);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Không thể truy cập camera!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setIsRecording(false);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.maDon || !formData.lyDo) {
      alert("Vui lòng chọn mã đơn và lý do khiếu nại!");
      return;
    }
    alert(`🚨 Khiếu nại đã được gửi!\nMã đơn: ${formData.maDon}\nĐính kèm: ${attachments.length} file`);
    setFormData({ maDon: '', lyDo: '', moTa: '' });
    setAttachments([]);
    setPreviews([]);
  };

  return (
    <>
      {/* === VÙNG 2 ĐÃ ĐƯỢC NÂNG CẤP === */}
      <div style={neonHeaderStyle}>
        <div style={{ fontSize: '52px', filter: 'drop-shadow(0 0 12px #eab308)' }}>⚠️</div>
        <div>
          <h1 style={neonTitleStyle}>KHIẾU NẠI</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '17px' }}>Trang khiếu nại & Hỗ trợ</p>
        </div>
      </div>

      <div style={mainCardStyle}>
        <h3 style={{ marginBottom: '24px', color: '#eab308' }}>📋 Gửi khiếu nại mới</h3>

        <form onSubmit={handleSubmit}>
          <select name="maDon" value={formData.maDon} onChange={handleChange} style={inputStyle} required>
            <option value="">Chọn mã đơn hàng</option>
            <option value="GHN17488902">GHN17488902 - Đà Nẵng → TP.HCM</option>
            <option value="GHN17488754">GHN17488754 - Hà Nội → Đà Nẵng</option>
          </select>

          <select name="lyDo" value={formData.lyDo} onChange={handleChange} style={inputStyle} required>
            <option value="">Chọn lý do khiếu nại</option>
            <option value="Hàng hỏng">Hàng hóa bị hỏng</option>
            <option value="Thiếu hàng">Thiếu số lượng</option>
            <option value="Sai sản phẩm">Nhận sai sản phẩm</option>
            <option value="Không nhận được">Không nhận được hàng</option>
            <option value="Khác">Khác</option>
          </select>

          <textarea
            name="moTa"
            value={formData.moTa}
            onChange={handleChange}
            style={textareaStyle}        // ← Đã thu nhỏ
            placeholder="Mô tả chi tiết vấn đề..."
          />

          {/* Đính kèm */}
          <div style={{ marginTop: '24px' }}>
            <label style={{ color: '#e2e8f0', display: 'block', marginBottom: '10px' }}>
              Đính kèm ảnh / video
            </label>
            <input 
              type="file" 
              accept="image/*,video/*" 
              multiple 
              onChange={handleFileUpload} 
              style={fileInputStyle}      // ← Đã thu nhỏ
            />

            <button 
              type="button" 
              onClick={isRecording ? stopRecording : startRecording} 
              style={cameraButtonStyle}
            >
              {isRecording ? '⏹️ Dừng quay' : '📹 Quay video trực tiếp'}
            </button>

            {previews.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
                {previews.map((src, i) => (
                  <div key={i}>
                    {src.includes('blob:') || src.startsWith('data:video') ? (
                      <video src={src} controls style={previewStyle} />
                    ) : (
                      <img src={src} alt="preview" style={previewStyle} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" style={submitButtonStyle}>
            🚨 Gửi Khiếu Nại
          </button>
        </form>
      </div>

      {/* Khiếu nại của tôi */}
      <h3 style={{ color: '#e2e8f0', margin: '40px 0 16px 0' }}>Khiếu nại của tôi</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {myComplaints.map((item) => (
          <div key={item.id} style={complaintCardStyle}>
            <div>
              <div style={{ fontWeight: 'bold', color: '#22d3ee' }}>{item.maDon}</div>
              <div style={{ color: '#cbd5e1' }}>{item.lyDo}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: item.color }}>{item.trangThai}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{item.ngay}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ====================== STYLES ====================== */

const neonHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  marginBottom: '32px',
  padding: '20px 28px',
  backgroundColor: '#1e2937',
  borderRadius: '20px',
  border: '2px solid #eab308',
  boxShadow: '0 0 25px #eab308, 0 0 40px rgba(234, 179, 8, 0.6)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'default',
};

const neonTitleStyle = {
  fontSize: '38px',
  fontWeight: 'bold',
  margin: 0,
  color: '#ffffff',
  textShadow: '0 0 15px #eab308, 0 0 30px #f59e0b',
  transition: 'all 0.4s ease',
};

const mainCardStyle = {
  backgroundColor: '#1e2937',
  padding: '32px',
  borderRadius: '24px',
  border: '2px solid #334155'
};

const inputStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  marginBottom: '16px'
};

// Thu nhỏ textarea và file input để thẳng hàng với ô trên
const textareaStyle = {
  width: '100%',
  maxWidth: '100%',           // Đảm bảo không tràn
  padding: '16px',
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  fontSize: '16px',
  minHeight: '120px',
  resize: 'vertical' as const,
  boxSizing: 'border-box' as const
};

const fileInputStyle = {
  width: '100%',
  maxWidth: '100%',           // Đảm bảo không tràn
  padding: '12px',
  backgroundColor: '#0f172a',
  border: '1px solid #475569',
  borderRadius: '12px',
  color: 'white',
  marginBottom: '12px',
  boxSizing: 'border-box' as const
};

const cameraButtonStyle = {
  width: '100%',
  padding: '14px',
  backgroundColor: '#1e2937',
  border: '2px solid #22d3ee',
  color: '#22d3ee',
  borderRadius: '12px',
  cursor: 'pointer',
  marginBottom: '20px',
  fontWeight: 'bold'
};

const submitButtonStyle = {
  width: '100%',
  padding: '18px',
  background: 'linear-gradient(90deg, #ef4444, #f97316)',
  color: 'white',
  border: 'none',
  borderRadius: '9999px',
  fontWeight: 'bold',
  fontSize: '17px',
  cursor: 'pointer',
  marginTop: '10px'
};

const previewStyle = {
  maxWidth: '160px',
  maxHeight: '160px',
  borderRadius: '8px',
  border: '1px solid #334155'
};

const complaintCardStyle = {
  backgroundColor: '#1e2937',
  padding: '20px',
  borderRadius: '16px',
  border: '1px solid #334155',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

// Hover effect cho header neon
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
  [data-neon-header]:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 0 35px #eab308, 0 0 55px rgba(234, 179, 8, 0.8);
  }
`;
document.head.appendChild(styleSheet);