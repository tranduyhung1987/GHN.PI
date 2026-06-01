import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const MainLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', background: '#f3e8ff' }}>
      <Outlet />
      <BottomNav />
    </div>
  );
};

export default MainLayout;