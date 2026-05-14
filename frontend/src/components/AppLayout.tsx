// src/components/AppLayout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import BottomNav from './BottomNav';
import GuestLayout from '../layouts/GuestLayout.tsx';
import MemberLayout from '../layouts/MemberLayout.tsx';
import AdminLayout from '../layouts/AdminLayout.tsx';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role } = useAuth();
  const location = useLocation();

  // Guest chỉ được xem trang chủ
  if (role === 'guest' && location.pathname !== '/') {
    return <GuestLayout>{children}</GuestLayout>;
  }

  if (role === 'admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  // Các vai trò còn lại (shop, driver, warehouse...)
  return (
    <MemberLayout>
      {children}
      <BottomNav />
    </MemberLayout>
  );
};

export default AppLayout;