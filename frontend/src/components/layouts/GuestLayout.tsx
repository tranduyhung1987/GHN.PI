import { Outlet } from 'react-router-dom';
import BottomNav from '../BottomNav';

export default function GuestLayout() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e2937 100%)',
      color: 'white'
    }}>
      {/* ĐÃ XÓA HEADER HOÀN TOÀN */}
      
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <Outlet />
      </div>

      <BottomNav />
    </div>
  );
}