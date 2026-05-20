import { useState, useEffect } from 'react';
import { db } from './firebase'; // Import db từ file firebase.js
import { collection, getDocs } from "firebase/firestore"; // Import các hàm để truy vấn dữ liệu

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
import DangKyVaiTroPage from './pages/DangKyVaiTroPage';

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
  | 'dang-ky-vai-tro';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<string>('');

  // --- LOGIC FIREBASE ---
  useEffect(() => {
    // Kiểm tra kết nối Firestore khi app khởi động
    const checkFirebase = async () => {
      try {
        console.log("Đang kiểm tra kết nối Firestore...");
        // Đoạn này dùng để test: thử lấy dữ liệu từ một collection bất kỳ (nếu đã tạo)
        // const querySnapshot = await getDocs(collection(db, "test_collection"));
        // console.log("Kết nối Firestore thành công!");
      } catch (error) {
        console.error("Lỗi kết nối Firebase:", error);
      }
    };
    checkFirebase();
  }, []);
  // ----------------------

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage') as Page;
    if (savedPage) setCurrentPage(savedPage);

    const savedRole = localStorage.getItem('userRole') || '';
    if (savedRole) setUserRole(savedRole);
  }, []);

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const goTo = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    children: null as React.ReactNode,
    onConfirm: undefined as (() => void) | undefined,
  });

  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' | 'info' } | null>(null);

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => 
    setToast({ message, type });
  const hideToast = () => setToast(null);

  return (
    <AuthProvider>
      <ThemeProvider>
        <PullToRefresh onRefresh={() => window.location.reload()}>
          <div className="min-h-screen" style={{ paddingBottom: '80px' }}>
            {/* Routing */}
            {currentPage === 'home' && <HomePage onNavigate={goTo} userRole={userRole} />}
            {currentPage === 'dang-ky-vai-tro' && <DangKyVaiTroPage onNavigate={goTo} />}

            {/* Khối định tuyến an toàn cho các subpages tránh lỗi strict type checking */}
            {(() => {
              const Pages: Record<string, React.ComponentType<any>> = {
                'kho-hub': KhoHubPage,
                'gui-hang': GuiHangPage,
                'tracking': TrackingPage,
                'nhan-hang': NhanHangPage,
                'tra-cuu-cuoc': TraCuuCuocPage,
                'tai-xe': TaiXePage,
                'ca-nhan': CaNhanPage,
                'don-hang': DonHangPage,
                'doi-soat': DoiSoatPage,
                'khieu-nai': KhieuNaiPage,
                'chat': ChatPage,
              };

              const Component = Pages[currentPage];
              return Component ? <Component onNavigate={goTo} /> : null;
            })()}

            <BottomNav 
              onNavigate={goTo} 
              currentPage={currentPage} 
            />

            <Modal 
              isOpen={modal.isOpen} 
              onClose={closeModal} 
              title={modal.title}
              onConfirm={modal.onConfirm}
            >
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