import { useState, useEffect } from 'react';

// Import tất cả trang
import HomePage from './pages/HomePage';
import KhoHubPage from './pages/KhoHubPage';
import GuiHangPage from './pages/GuiHangPage';
import TrackingPage from './pages/TrackingPage';
import NhanHangPage from './pages/NhanHangPage';
import TraCuuCuocPage from './pages/TraCuuCuocPage';
import TaiXePage from './pages/TaiXePage';
import CaNhanPage from './pages/CaNhanPage';
import DonHangPage from './pages/DonHangPage';
import DoiSoatPage from './pages/DoiSoatPage';
import KhieuNaiPage from './pages/KhieuNaiPage';
import ChatPage from './pages/ChatPage';
import DangKyVaiTroPage from './pages/DangKyVaiTroPage';   // ← THÊM DÒNG NÀY

import BottomNav from './components/BottomNav';
import Modal from './components/Modal';
import Toast from './components/Toast';
import PullToRefresh from './components/PullToRefresh';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

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
  | 'dang-ky-vai-tro';   // ← THÊM DÒNG NÀY

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem('currentPage') as Page;
    return savedPage && savedPage !== 'home' ? savedPage : 'home';
  });

  const [userRole, setUserRole] = useState<string>(() => 
    localStorage.getItem('userRole') || ''
  );

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'userRole') {
        const newRole = localStorage.getItem('userRole') || '';
        setUserRole(newRole);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const [modal, setModal] = useState({ isOpen: false, title: '', children: null as React.ReactNode, onConfirm: undefined as (() => void) | undefined });
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const goTo = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      const { title, children, onConfirm } = e.detail || {};
      setModal({ isOpen: true, title: title || "Thông báo", children: children || null, onConfirm });
    };
    const handleShowToast = (e: any) => {
      const { message, type } = e.detail || {};
      if (message) showToast(message, type);
    };
    const handleCloseModal = () => closeModal();

    window.addEventListener('openModal', handleOpenModal);
    window.addEventListener('showToast', handleShowToast);
    window.addEventListener('closeModal', handleCloseModal);

    return () => {
      window.removeEventListener('openModal', handleOpenModal);
      window.removeEventListener('showToast', handleShowToast);
      window.removeEventListener('closeModal', handleCloseModal);
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider>
        <PullToRefresh onRefresh={() => window.location.reload()}>
          <div className="min-h-screen" style={{ paddingBottom: '80px' }}>
            {/* Routing */}
            {currentPage === 'home' && <HomePage onNavigate={goTo} userRole={userRole} />}
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
            {currentPage === 'dang-ky-vai-tro' && <DangKyVaiTroPage onNavigate={goTo} />}   {/* ← THÊM DÒNG NÀY */}

            <BottomNav 
              onNavigate={goTo} 
              currentPage={currentPage} 
              userRole={userRole} 
            />

            <Modal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} onConfirm={modal.onConfirm}>
              {modal.children}
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
          </div>
        </PullToRefresh>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;