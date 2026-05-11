import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GuestLayout from './components/layouts/GuestLayout';

import HomePage from './pages/HomePage';
import GuiHangPage from './pages/GuiHangPage';

function App() {
  return (
    <Router>
      <GuestLayout>
        <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gui-hang" element={<GuiHangPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </GuestLayout>
    </Router>
  );
}

export default App;