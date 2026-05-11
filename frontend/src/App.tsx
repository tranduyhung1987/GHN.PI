import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🚀 GHN.PI</h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>
          Giao Hàng Nhanh - Thanh Toán Bằng Pi
        </p>
        <p style={{ color: '#22d3ee', fontSize: '18px' }}>
          Đã tắt Pi SDK tạm thời.<br />
          App đang chạy ở chế độ test.
        </p>
        <button 
          onClick={() => alert('Test thành công!')}
          style={{
            padding: '20px 40px',
            fontSize: '18px',
            background: '#22d3ee',
            color: '#0f172a',
            border: 'none',
            borderRadius: '9999px',
            marginTop: '30px',
            cursor: 'pointer'
          }}
        >
          Test Click
        </button>
      </div>
    </Router>
  );
}

export default App;
