import React, { useState } from 'react';

// Import Pages
import HomePage from './pages/HomePage';
import KhoHubPage from './pages/KhoHubPage';
import GuiHangPage from './pages/GuiHangPage';
import TrackingPage from './pages/TrackingPage';
import NhanHangPage from './pages/NhanHangPage';
import TraCuuCuocPage from './pages/TraCuuCuocPage';
import TaiXePage from './pages/TaiXePage';
import CaNhanPage from './pages/CaNhanPage';
import AdminPage from './pages/AdminPage';
import DangKyVaiTroPage from './pages/DangKyVaiTroPage';
import ChatPage from './pages/ChatPage';

// Import Components
import BottomNav from './components/BottomNav';
import Modal from './components/Modal';
import Toast from './components/Toast';
import PullToRefresh from './components/PullToRefresh';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [modal, setModal] = useState({ isOpen: false, title: '', children: null as React.ReactNode, onConfirm: () => {} });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const goTo = (page: string) => setCurrentPage(page);

  // Định nghĩa danh sách các trang
  const Pages: Record<string, React.ComponentType<any>> = {
    'home': HomePage,
    'kho-hub': KhoHubPage,
    'gui-hang': GuiHangPage,
    'tracking': TrackingPage,
    'nhan-hang': NhanHangPage,
    'tra-cuu-cuoc': TraCuuCuocPage,
    'tai-xe': TaiXePage,
    'ca-nhan': CaNhanPage,
    'admin': AdminPage,
    'dang-ky-vai-tro': DangKyVaiTroPage,
    'chat': ChatPage,
  };

  const CurrentComponent = Pages[currentPage] || HomePage;

  return (
    <PullToRefresh onRefresh={() => window.location.reload()}>
      <div className="app-container" style={{ minHeight: '100vh', background: '#f9fafb' }}>
        
        {/* Render trang hiện tại */}
        <CurrentComponent onNavigate={goTo} />

        {/* Ẩn BottomNav nếu đang ở trang Đăng ký vai trò */}
        {currentPage !== 'dang-ky-vai-tro' && (
          <BottomNav onNavigate={goTo} currentPage={currentPage} />
        )}

        {/* Modal toàn cục */}
        <Modal 
          isOpen={modal.isOpen} 
          onClose={() => setModal({ ...modal, isOpen: false })} 
          title={modal.title}
          onConfirm={modal.onConfirm}
        >
          {modal.children}
        </Modal>

        {/* Toast thông báo */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </PullToRefresh>
  );
}