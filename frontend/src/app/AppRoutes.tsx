// src/app/AppRoutes.tsx
import { ROLES } from '../utils/constants'; // Import hằng số
import ProtectedRoute from '../components/ProtectedRoute';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Import các trang bằng lazy để tối ưu hiệu năng
const HomePage = lazy(() => import('../pages/HomePage'));
const KhoHubPage = lazy(() => import('../pages/KhoHubPage'));
const GuiHangPage = lazy(() => import('../pages/GuiHangPage'));
const TrackingPage = lazy(() => import('../pages/TrackingPage'));
const NhanHangPage = lazy(() => import('../pages/NhanHangPage'));
const TraCuuCuocPage = lazy(() => import('../pages/TraCuuCuocPage'));
const TaiXePage = lazy(() => import('../pages/TaiXePage'));
const CaNhanPage = lazy(() => import('../pages/CaNhanPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));
const DangKyVaiTroPage = lazy(() => import('../pages/DangKyVaiTroPage'));
const ChatPage = lazy(() => import('../pages/ChatPage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div className="p-10 text-center">Đang tải...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          
          {/* Các route bảo vệ theo role */}
          <Route path="admin" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminPage />
            </ProtectedRoute>
          } />

          <Route path="kho-hub" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.WAREHOUSE]}>
              <KhoHubPage />
            </ProtectedRoute>
          } />

          <Route path="tai-xe" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DRIVER]}>
              <TaiXePage />
            </ProtectedRoute>
          } />

          <Route path="gui-hang" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SENDER]}>
              <GuiHangPage />
            </ProtectedRoute>
          } />

          <Route path="nhan-hang" element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.RECEIVER]}>
              <NhanHangPage />
            </ProtectedRoute>
          } />

          {/* Các route công cộng */}
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="tra-cuu-cuoc" element={<TraCuuCuocPage />} />
          <Route path="ca-nhan" element={<CaNhanPage />} />
          <Route path="dang-ky" element={<DangKyVaiTroPage />} />
          <Route path="chat" element={<ChatPage />} />
          
          {/* Redirect mặc định */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};