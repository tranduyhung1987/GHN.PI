import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import GuestLayout from './components/layouts/GuestLayout';
import MemberLayout from './components/layouts/MemberLayout';
import AdminLayout from './components/layouts/AdminLayout';

import BottomNav from './components/BottomNav';
import RoleSelector from './components/auth/RoleSelector';

// Các trang
import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';
import DonHangPage from './pages/DonHangPage';
import TrackingPage from './pages/TrackingPage';
import TaiXePage from './pages/TaiXePage';
import NhanHangPage from './pages/NhanHangPage';
import KhoHubPage from './pages/KhoHubPage';
import ChatPage from './pages/ChatPage';
import DoiSoatPage from './pages/DoiSoatPage';
import KhieuNaiPage from './pages/KhieuNaiPage';
import CaNhanPage from './pages/CaNhanPage';
import TraCuuCuocPage from './pages/TraCuuCuocPage';
import AdminPage from './pages/AdminPage';

function App() {
  const { role } = useAuth();

  const CurrentLayout = role === 'admin' 
    ? AdminLayout 
    : (['shop', 'driver', 'warehouse'].includes(role) ? MemberLayout : GuestLayout);

  return (
    <Router>
      <CurrentLayout>
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e2937 100%)',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ 
            maxWidth: '640px', 
            margin: '0 auto', 
            padding: role === 'admin' ? '0' : '20px', 
            paddingBottom: role === 'admin' ? '0' : '100px' 
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gui-hang" element={<GuiHangPage />} />
              <Route path="/don-hang" element={<DonHangPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/tai-xe" element={<TaiXePage />} />
              <Route path="/nhan-hang" element={<NhanHangPage />} />
              <Route path="/kho-hub" element={<KhoHubPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/doi-soat" element={<DoiSoatPage />} />
              <Route path="/khieu-nai" element={<KhieuNaiPage />} />
              <Route path="/ca-nhan" element={<CaNhanPage />} />
              <Route path="/tra-cuu-cuoc" element={<TraCuuCuocPage />} />
              <Route path="/admin" element={<AdminPage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {role !== 'admin' && <BottomNav />}
        </div>
      </CurrentLayout>

      {/* ẨN HOÀN TOÀN ROLE SELECTOR TRÊN LIVE */}
      {import.meta.env.DEV && <RoleSelector />}
    </Router>
  );
}

export default App;