import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestLayout from './components/layouts/GuestLayout';

import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';
// import các page khác nếu cần sau

function App() {
  return (
    <Router>
      <GuestLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/gui-hang" element={<GuiHangPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </GuestLayout>
    </Router>
  );
}

export default App;