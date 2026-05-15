// src/components/AppLayout.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

import BottomNav from './BottomNav';

// Import các Layout theo tên mới
import MemberLayout from '../layouts/ShopLayout';        // Member / Shop
import AdminLayout from '../layouts/AdminLayout';
import ShipLayout from '../layouts/ShipLayout';          // Tài Xế
import KhoHubLayout from '../layouts/KhoHubLayout';      // Kho Trung Chuyển
import GuestLayout from '../layouts/KhachMoiLayout';     // Khách mới

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { role } = useAuth();

  // Nếu là Guest (chưa đăng nhập)
  if (!role || role === 'guest') {
    return <GuestLayout>{children}</GuestLayout>;
  }

  // Theo từng Role
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
          <BottomNav />
        </MemberLayout>
      );
  }
};

export default AppLayout;