// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';

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

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/gui-hang" element={<AppLayout><GuiHangPage /></AppLayout>} />
          <Route path="/tra-cuu-cuoc" element={<AppLayout><TraCuuCuocPage /></AppLayout>} />
          <Route path="/tracking" element={<AppLayout><TrackingPage /></AppLayout>} />
          <Route path="/ca-nhan" element={<AppLayout><CaNhanPage /></AppLayout>} />
          <Route path="/tai-xe" element={<AppLayout><TaiXePage /></AppLayout>} />
          <Route path="/kho-hub" element={<AppLayout><KhoHubPage /></AppLayout>} />
          <Route path="/nhan-hang" element={<AppLayout><NhanHangPage /></AppLayout>} />
          <Route path="/don-hang" element={<AppLayout><DonHangPage /></AppLayout>} />
          <Route path="/khieu-nai" element={<AppLayout><KhieuNaiPage /></AppLayout>} />
          <Route path="/doi-soat" element={<AppLayout><DoiSoatPage /></AppLayout>} />
          <Route path="/chat" element={<AppLayout><ChatPage /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminPage /></AppLayout>} />
          <Route path="/dang-ky-vai-tro" element={<DangKyVaiTroPage />} />

          <Route path="*" element={<AppLayout><HomePage /></AppLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;