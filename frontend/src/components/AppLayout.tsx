import React from 'react';
import { useAuth } from '../contexts/AuthContext';

import BottomNav from './BottomNav';

// Import Layouts (giữ nguyên như bạn có)
import MemberLayout from '../layouts/ShopLayout';
import AdminLayout from '../layouts/AdminLayout';
import ShipLayout from '../layouts/ShipLayout';
import KhoHubLayout from '../layouts/KhoHubLayout';
import GuestLayout from '../layouts/KhachMoiLayout';

interface AppLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;          // ← Thêm prop này
}

const AppLayout: React.FC<AppLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage 
}) => {
  const { role } = useAuth();

  if (!role || role === 'guest') {
    return <GuestLayout>{children}</GuestLayout>;
  }

  switch (role) {
    case 'admin':
      return <AdminLayout>{children}</AdminLayout>;

    case 'driver':
      return <ShipLayout>{children}</ShipLayout>;

    case 'warehouse':
      return <KhoHubLayout>{children}</KhoHubLayout>;

    case 'shop':
    default:
      return (
        <MemberLayout>
          {children}
          {/* Truyền đầy đủ props cho BottomNav */}
          <BottomNav 
            onNavigate={onNavigate} 
            currentPage={currentPage} 
          />
        </MemberLayout>
      );
  }
};

export default AppLayout;