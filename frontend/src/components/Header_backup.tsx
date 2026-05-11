// src/components/Header.tsx
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header style={{
      backgroundColor: '#1e2937',
      padding: '20px 24px',
      borderBottom: '1px solid #334155',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ 
        maxWidth: '640px', 
        margin: '0 auto', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        
        {/* Logo + Tên App */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          <span style={{ fontSize: '48px' }}>🚚</span>
          <div>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: 'bold', 
              margin: 0 
            }}>GHN.PI</h1>
            <p style={{ 
              color: '#94a3b8', 
              margin: 0, 
              fontSize: '14px' 
            }}>Logistics Ecosystem v14 Pro</p>
          </div>
        </div>

        {/* Nút Đăng nhập Pi */}
        <button 
          style={{
            backgroundColor: '#22d3ee',
            color: '#0f172a',
            padding: '12px 28px',
            borderRadius: '9999px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Đăng nhập với Pi
        </button>
      </div>
    </header>
  );
}