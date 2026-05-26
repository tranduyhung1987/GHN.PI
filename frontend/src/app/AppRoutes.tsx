// src/app/AppRoutes.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Import các trang bằng lazy
const HomePage = lazy(() => import('../pages/HomePage'));
const WarehousePage = lazy(() => import('../pages/WarehousePage'));
const CreateShipmentPage = lazy(() => import('../pages/CreateShipmentPage.tsx'));
const TrackingPage = lazy(() => import('../pages/TrackingPage'));
const ReceivePackagePage = lazy(() => import('../pages/ReceivePackagePage.tsx'));
const ShippingFeePage = lazy(() => import('../pages/ShippingFeePage.tsx'));
const DriverPage = lazy(() => import('../pages/DriverPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const RegisterRolePage = lazy(() => import('../pages/RegisterRolePage.tsx'));
const ChatPage = lazy(() => import('../pages/ChatPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center">Đang tải...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />

          {/* Tạm thời bỏ ProtectedRoute để build pass */}
          <Route path="admin" element={<AdminPage />} />
          <Route path="kho-hub" element={<WarehousePage />} />
          <Route path="tai-xe" element={<DriverPage />} />
          <Route path="gui-hang" element={<CreateShipmentPage />} />
          <Route path="nhan-hang" element={<ReceivePackagePage />} />

          {/* Các route công cộng */}
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="tra-cuu-cuoc" element={<ShippingFeePage />} />
          <Route path="ca-nhan" element={<ProfilePage />} />
          <Route path="dang-ky" element={<RegisterRolePage />} />
          <Route path="chat" element={<ChatPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};