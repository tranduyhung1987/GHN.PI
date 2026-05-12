import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestLayout from './components/layouts/GuestLayout';

import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';
import TrackingPage from './pages/TrackingPage';
import TaiXePage from './pages/TaiXePage';

function App() {
  return (
    <Router>
      <GuestLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gui-hang" element={<GuiHangPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/tai-xe" element={<TaiXePage />} />

          {/* Tạm redirect các trang chưa hoàn thiện về Home */}
          <Route path="/don-hang" element={<Navigate to="/" replace />} />
          <Route path="/chat" element={<Navigate to="/" replace />} />
          <Route path="/doi-soat" element={<Navigate to="/" replace />} />
          <Route path="/khieu-nai" element={<Navigate to="/" replace />} />
          <Route path="/ca-nhan" element={<Navigate to="/" replace />} />
          <Route path="/tra-cuu-cuoc" element={<Navigate to="/" replace />} />
          <Route path="/kho-hub" element={<Navigate to="/" replace />} />
          <Route path="/nhan-hang" element={<Navigate to="/" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GuestLayout>
    </Router>
  );
}

export default App;
