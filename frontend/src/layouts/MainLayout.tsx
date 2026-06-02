import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f3e8ff' }}>
      {/* Content wrapper gets the bottom padding to reserve space under fixed nav */}
      <div style={{ paddingBottom: '80px' }}>
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default MainLayout;