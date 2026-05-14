// src/components/AppLayout.tsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BottomNav from './BottomNav';
import GuestLayout from '../layouts/GuestLayout';
import MemberLayout from '../layouts/MemberLayout';
import AdminLayout from '../layouts/AdminLayout';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role } = useAuth();
  const location = useLocation();

  // Guest chỉ xem được HomePage
  if (role === 'guest' && location.pathname !== '/') {
    return <GuestLayout>{children}</GuestLayout>;
  }

  if (role === 'admin') {
    return <AdminLayout>{children}</AdminLayout>;
  }

  return (
    <MemberLayout>
      {children}
      <BottomNav />
    </MemberLayout>
  );
};

export default AppLayout;