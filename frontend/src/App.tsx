// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';
import TraCuuCuocPage from './pages/TraCuuCuocPage';
import TrackingPage from './pages/TrackingPage';
import CaNhanPage from './pages/CaNhanPage';
import TaiXePage from './pages/TaiXePage';
import KhoHubPage from './pages/KhoHubPage';
import NhanHangPage from './pages/NhanHangPage';
import DonHangPage from './pages/DonHangPage';
import KhieuNaiPage from './pages/KhieuNaiPage';
import DoiSoatPage from './pages/DoiSoatPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';
import DangKyVaiTroPage from './pages/DangKyVaiTroPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gui-hang" element={<GuiHangPage />} />
          <Route path="/tra-cuu-cuoc" element={<TraCuuCuocPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/ca-nhan" element={<CaNhanPage />} />
          <Route path="/tai-xe" element={<TaiXePage />} />
          <Route path="/kho-hub" element={<KhoHubPage />} />
          <Route path="/nhan-hang" element={<NhanHangPage />} />
          <Route path="/don-hang" element={<DonHangPage />} />
          <Route path="/khieu-nai" element={<KhieuNaiPage />} />
          <Route path="/doi-soat" element={<DoiSoatPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/dang-ky-vai-tro" element={<DangKyVaiTroPage />} />

          {/* Fallback route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;