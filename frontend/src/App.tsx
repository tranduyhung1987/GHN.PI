// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelector from './components/auth/RoleSelector';

// Layouts
import GuestLayout from './components/layouts/GuestLayout';
import MemberLayout from './components/layouts/MemberLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';
import TrackingPage from './pages/TrackingPage';
import TaiXePage from './pages/TaiXePage';
import NhanHangPage from './pages/NhanHangPage';
import KhoHubPage from './pages/KhoHubPage';
import CaNhanPage from './pages/CaNhanPage';
import DoiSoatPage from './pages/DoiSoatPage';
import DonHangPage from './pages/DonHangPage';
import ChatPage from './pages/ChatPage';
import KhieuNaiPage from './pages/KhieuNaiPage';
import TraCuuCuocPage from './pages/TraCuuCuocPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <RoleSelector />
      
      <Routes>
        <Route path="/" element={<GuestLayout><HomePage /></GuestLayout>} />
        
        {/* Member Routes */}
        <Route path="/gui-hang" element={<MemberLayout><GuiHangPage /></MemberLayout>} />
        <Route path="/tracking" element={<MemberLayout><TrackingPage /></MemberLayout>} />
        <Route path="/tai-xe" element={<MemberLayout><TaiXePage /></MemberLayout>} />
        <Route path="/nhan-hang" element={<MemberLayout><NhanHangPage /></MemberLayout>} />
        <Route path="/kho-hub" element={<MemberLayout><KhoHubPage /></MemberLayout>} />
        <Route path="/ca-nhan" element={<MemberLayout><CaNhanPage /></MemberLayout>} />
        <Route path="/don-hang" element={<MemberLayout><DonHangPage /></MemberLayout>} />
        <Route path="/doi-soat" element={<MemberLayout><DoiSoatPage /></MemberLayout>} />
        <Route path="/chat" element={<MemberLayout><ChatPage /></MemberLayout>} />
        <Route path="/khieu-nai" element={<MemberLayout><KhieuNaiPage /></MemberLayout>} />
        <Route path="/tra-cuu-cuoc" element={<MemberLayout><TraCuuCuocPage /></MemberLayout>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout><AdminPage /></AdminLayout>} />

        {/* Fallback */}
        <Route path="*" element={<GuestLayout><HomePage /></GuestLayout>} />
      </Routes>
    </Router>
  );
}

export default App;