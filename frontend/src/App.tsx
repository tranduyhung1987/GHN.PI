// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import BottomNav from './components/BottomNav';

import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';
import TaiXePage from './pages/TaiXePage';
import NhanHangPage from './pages/NhanHangPage';
import TrackingPage from './pages/TrackingPage';
import KhoHubPage from './pages/KhoHubPage';

function App() {
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e2937 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {/* ĐÃ XÓA <Header /> ở đây */}

        <div style={{ 
          maxWidth: '640px', 
          margin: '0 auto', 
          padding: '20px', 
          paddingBottom: '100px' 
        }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gui-hang" element={<GuiHangPage />} />
            <Route path="/tai-xe" element={<TaiXePage />} />
            <Route path="/nhan-hang" element={<NhanHangPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/kho-hub" element={<KhoHubPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;