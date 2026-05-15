import { useState } from 'react';

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

  const goTo = (page: string) => {
    setCurrentPage(page as Page)
  }

  return (
    <div className="min-h-screen" style={{ paddingBottom: '80px' }}>   {/* Để BottomNav không che nội dung */}
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

      {/* BottomNav luôn hiển thị ở tất cả các trang */}
      <BottomNav onNavigate={goTo} currentPage={currentPage} />
    </div>
  )
}

export default App