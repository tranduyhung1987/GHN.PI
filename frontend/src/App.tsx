import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f172a', 
        color: 'white',
        paddingBottom: '70px'  // dành chỗ cho bottom nav
      }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;