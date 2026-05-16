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
import Modal from './components/Modal'
import Toast from './components/Toast'
import PullToRefresh from './components/PullToRefresh'   // ← Import PullToRefresh

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

  // Modal State
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    children: null as React.ReactNode,
    onConfirm: undefined as (() => void) | undefined,
  });

  // Toast State
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const goTo = (page: string) => {
    setCurrentPage(page as Page)
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  // Event Listener cho Modal
  useEffect(() => {
    const handleOpenModal = (e: any) => {
      const { title, children, onConfirm } = e.detail || {};
      setModal({ 
        isOpen: true, 
        title: title || "Thông báo", 
        children: children || null, 
        onConfirm 
      });
    };

    window.addEventListener('openModal', handleOpenModal);

    return () => window.removeEventListener('openModal', handleOpenModal);
  }, []);

  // Event Listener cho Toast
  useEffect(() => {
    const handleShowToast = (e: any) => {
      const { message, type } = e.detail || {};
      if (message) {
        setToast({ message, type: type || 'success' });
      }
    };

    window.addEventListener('showToast', handleShowToast);

    return () => window.removeEventListener('showToast', handleShowToast);
  }, []);

  return (
    <PullToRefresh onRefresh={() => window.location.reload()}>
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

        {/* Toast Notification */}
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={hideToast} 
          />
        )}
      </div>
    </PullToRefresh>
  )
}

export default App