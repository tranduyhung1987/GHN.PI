import { useState, useEffect } from 'react';

// Import tất cả trang
import HomePage from './pages/HomePage'
import KhoHubPage from './pages/KhoHubPage'
import GuiHangPage from './pages/GuiHangPage'
import TrackingPage from './pages/TrackingPage'
import NhanHangPage from './pages/NhanHangPage'
import TraCuuCuocPage from './pages/TraCuuCuocPage'
import TaiXePage from './pages/TaiXePage'
import CaNhanPage from './pages/CaNhanPage'
import DonHangPage from './pages/DonHangPage'
import DoiSoatPage from './pages/DoiSoatPage'
import KhieuNaiPage from './pages/KhieuNaiPage'
import ChatPage from './pages/ChatPage'

import BottomNav from './components/BottomNav'
import Modal from './components/Modal';

type Page = 
  | 'home' 
  | 'kho-hub' 
  | 'gui-hang' 
  | 'tracking' 
  | 'nhan-hang' 
  | 'tra-cuu-cuoc' 
  | 'tai-xe'
  | 'ca-nhan'
  | 'don-hang'
  | 'doi-soat'
  | 'khieu-nai'
  | 'chat'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  // Modal state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    children: null,
    onConfirm: undefined,
  });

  const goTo = (page: string) => {
    setCurrentPage(page as Page)
  }

  // Hàm mở và đóng Modal
  const openModal = (title: string, children: React.ReactNode, onConfirm?: () => void) => {
    setModal({ isOpen: true, title, children, onConfirm });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Event Listener để mở Modal từ bất kỳ trang nào
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      const { title, children, onConfirm } = e.detail || {};
      setModal({ 
        isOpen: true, 
        title: title || "Thông báo", 
        children: children || "Nội dung mặc định", 
        onConfirm 
      });
    };

    window.addEventListener('openModal', handleOpenModal);

    return () => {
      window.removeEventListener('openModal', handleOpenModal);
    };
  }, []);

  return (
    <div className="min-h-screen" style={{ paddingBottom: '80px' }}>
      {/* Các trang chính */}
      {currentPage === 'home' && <HomePage onNavigate={goTo} />}
      {currentPage === 'kho-hub' && <KhoHubPage onNavigate={goTo} />}
      {currentPage === 'gui-hang' && <GuiHangPage onNavigate={goTo} />}
      {currentPage === 'tracking' && <TrackingPage onNavigate={goTo} />}
      {currentPage === 'nhan-hang' && <NhanHangPage onNavigate={goTo} />}
      {currentPage === 'tra-cuu-cuoc' && <TraCuuCuocPage onNavigate={goTo} />}
      {currentPage === 'tai-xe' && <TaiXePage onNavigate={goTo} />}
      {currentPage === 'ca-nhan' && <CaNhanPage onNavigate={goTo} />}
      {currentPage === 'don-hang' && <DonHangPage onNavigate={goTo} />}
      {currentPage === 'doi-soat' && <DoiSoatPage onNavigate={goTo} />}
      {currentPage === 'khieu-nai' && <KhieuNaiPage onNavigate={goTo} />}
      {currentPage === 'chat' && <ChatPage onNavigate={goTo} />}

      {/* BottomNav */}
      <BottomNav onNavigate={goTo} currentPage={currentPage} />

      {/* Modal dùng chung */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        onConfirm={modal.onConfirm}
      >
        {modal.children}
      </Modal>
    </div>
  )
}

export default App