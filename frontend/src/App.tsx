import { useState } from 'react';

type Page = 'home' | 'gui-hang' | 'tai-xe' | 'nhan-hang' | 'tracking' | 'kho-hub';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isLoading, setIsLoading] = useState(false);

  const navigateTo = (page: Page) => {
    if (page === currentPage) return;
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  const goBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage('home');
      setIsLoading(false);
    }, 300);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e2937 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#1e2937',
        padding: '20px 24px',
        borderBottom: '1px solid #334155',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={goBack}>
            <span style={{ fontSize: '48px' }}>🚚</span>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', margin: 0 }}>GHN.PI</h1>
              <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Logistics Ecosystem v14 Pro</p>
            </div>
          </div>

          <button style={{
            backgroundColor: '#22d3ee',
            color: '#0f172a',
            padding: '12px 28px',
            borderRadius: '9999px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}>
            Đăng nhập với Pi
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Status */}
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#4ade80',
          padding: '12px 20px',
          borderRadius: '9999px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <div style={{ width: '10px', height: '10px', backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
          Hệ thống trực tuyến (Nhấn để Debug)
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              width: '70px',
              height: '70px',
              border: '6px solid #334155',
              borderTop: '6px solid #22d3ee',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
          </div>
        )}

        {/* Nội dung chính */}
        {currentPage === 'home' ? (
          <HomeContent navigateTo={navigateTo} />
        ) : currentPage === 'gui-hang' ? (
          <GuiHangPage goBack={goBack} />
        ) : (
          <PageContent title={currentPage} goBack={goBack} />
        )}
      </div>

      <BottomNav currentPage={currentPage} navigateTo={navigateTo} />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ==================== TRANG CHỦ (Giữ nguyên) ==================== */
function HomeContent({ navigateTo }: { navigateTo: (page: Page) => void }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { id: 'gui-hang', icon: "📦", title: "GỬI HÀNG", desc: "Tạo đơn & Quản lý" },
          { id: 'tai-xe', icon: "🏍️", title: "TÀI XẾ", desc: "Nhận đơn & Giao hàng" },
          { id: 'nhan-hang', icon: "🖐️", title: "NHẬN HÀNG", desc: "Kiểm tra & Xác nhận" },
          { id: 'tracking', icon: "📍", title: "TRACKING", desc: "Bản đồ thời gian thực" }
        ].map((item) => (
          <div 
            key={item.id}
            onClick={() => navigateTo(item.id as Page)}
            style={{
              backgroundColor: '#1e2937',
              padding: '28px 20px',
              borderRadius: '24px',
              border: '1px solid #334155',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = '#22d3ee'}
            onMouseOut={(e) => e.currentTarget.style.borderColor = '#334155'}
          >
            <div style={{ fontSize: '52px', marginBottom: '16px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>{item.title}</h3>
            <p style={{ color: '#94a3b8' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Kho Hub */}
      <div onClick={() => navigateTo('kho-hub')} style={{
        marginTop: '24px',
        backgroundColor: '#1e2937',
        padding: '28px 20px',
        borderRadius: '24px',
        border: '1px solid #334155',
        cursor: 'pointer'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '52px' }}>🏬</div>
          <div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>QUẢN LÝ KHO TRUNG CHUYỂN (HUBS)</h3>
            <p style={{ color: '#94a3b8' }}>Cấu hình mạng lưới logistics đường dài</p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ==================== TRANG GỬI HÀNG (ĐẦY ĐỦ) ==================== */
function GuiHangPage({ goBack }: { goBack: () => void }) {
  const [form, setForm] = useState({
    loaiDon: 'hoatoc' as 'hoatoc' | 'duongdai',
    nguoiGui: '', sdtGui: '',
    nguoiNhan: '', sdtNhan: '',
    diaChiNhan: '', trongLuong: 1, ghiChu: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const piAmount = Math.round(form.trongLuong * 25000);
    alert(`✅ Tạo đơn hàng thành công!\nMã đơn: GHN${Date.now().toString().slice(-6)}\nThanh toán: ${piAmount.toLocaleString()} Pi`);
    setForm({ loaiDon: 'hoatoc', nguoiGui: '', sdtGui: '', nguoiNhan: '', sdtNhan: '', diaChiNhan: '', trongLuong: 1, ghiChu: '' });
  };

  return (
    <div>
      <button onClick={goBack} style={{ color: '#22d3ee', marginBottom: '20px', background: 'none', border: 'none' }}>
        ← Quay lại Trang chủ
      </button>

      <h1 style={{ marginBottom: '8px' }}>GỬI HÀNG</h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Tạo đơn vận chuyển mới</p>

      <form onSubmit={handleSubmit} style={{ background: '#1e2937', padding: '32px', borderRadius: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600' }}>Loại đơn hàng:</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}
              style={{ flex: 1, padding: '16px', borderRadius: '12px', background: form.loaiDon === 'hoatoc' ? '#22d3ee' : '#334155', color: form.loaiDon === 'hoatoc' ? '#000' : '#fff' }}>
              🔥 Hỏa Tốc
            </button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}
              style={{ flex: 1, padding: '16px', borderRadius: '12px', background: form.loaiDon === 'duongdai' ? '#22d3ee' : '#334155', color: form.loaiDon === 'duongdai' ? '#000' : '#fff' }}>
              🛣️ Đường Dài
            </button>
          </div>
        </div>

        <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui} onChange={e => setForm({ ...form, nguoiGui: e.target.value })} style={inputStyle} required />
        <input type="tel" placeholder="Số điện thoại người gửi" value={form.sdtGui} onChange={e => setForm({ ...form, sdtGui: e.target.value })} style={inputStyle} required />

        <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan} onChange={e => setForm({ ...form, nguoiNhan: e.target.value })} style={inputStyle} required />
        <input type="tel" placeholder="Số điện thoại người nhận" value={form.sdtNhan} onChange={e => setForm({ ...form, sdtNhan: e.target.value })} style={inputStyle} required />
        <input type="text" placeholder="Địa chỉ nhận hàng chi tiết" value={form.diaChiNhan} onChange={e => setForm({ ...form, diaChiNhan: e.target.value })} style={inputStyle} required />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Trọng lượng (kg)</label>
            <input type="number" value={form.trongLuong} onChange={e => setForm({ ...form, trongLuong: parseFloat(e.target.value) || 1 })} style={inputStyle} min="0.1" step="0.1" required />
          </div>
          <div>
            <label>Ghi chú</label>
            <input type="text" placeholder="Ghi chú cho tài xế" value={form.ghiChu} onChange={e => setForm({ ...form, ghiChu: e.target.value })} style={inputStyle} />
          </div>
        </div>

        <button type="submit" style={{
          marginTop: '32px', width: '100%', padding: '18px', background: '#22d3ee',
          color: '#0f172a', fontSize: '18px', fontWeight: 'bold', border: 'none', borderRadius: '9999px'
        }}>
          Tạo Đơn Hàng & Thanh Toán {Math.round(form.trongLuong * 25000).toLocaleString()} Pi
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '16px', marginBottom: '16px',
  backgroundColor: '#0f172a', border: '1px solid #475569',
  borderRadius: '12px', color: 'white', fontSize: '16px'
};

/* Các trang khác */
function PageContent({ title, goBack }: { title: Page; goBack: () => void }) {
  return (
    <div>
      <button onClick={goBack} style={{ color: '#22d3ee', marginBottom: '20px', background: 'none', border: 'none' }}>← Quay lại</button>
      <div style={{ padding: '60px 20px', background: '#1e2937', borderRadius: '24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px' }}>{title.toUpperCase()}</h2>
        <p style={{ color: '#94a3b8', marginTop: '30px' }}>Chức năng đang được phát triển...</p>
      </div>
    </div>
  );
}

function BottomNav({ currentPage, navigateTo }: any) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      backgroundColor: '#1e2937', borderTop: '1px solid #334155',
      padding: '12px 0', zIndex: 100
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
        {[
          { icon: "🏠", label: "Trang chủ", page: 'home' },
          { icon: "📦", label: "Gửi hàng", page: 'gui-hang' },
          { icon: "🏍️", label: "Tài xế", page: 'tai-xe' },
          { icon: "📍", label: "Theo dõi", page: 'tracking' }
        ].map(item => (
          <div key={item.label} onClick={() => navigateTo(item.page)} style={{
            textAlign: 'center', color: currentPage === item.page ? '#22d3ee' : '#94a3b8', cursor: 'pointer'
          }}>
            <div style={{ fontSize: '28px' }}>{item.icon}</div>
            <div style={{ fontSize: '11px' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </nav>
  );
}

export default App;