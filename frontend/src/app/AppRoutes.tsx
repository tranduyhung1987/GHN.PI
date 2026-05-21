// src/app/AppRoutes.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Sử dụng lazy để tách code
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
    // Suspense hiển thị nội dung thay thế (loading) khi file đang được tải
    <Suspense fallback={<div>Đang tải...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="kho-hub" element={<KhoHubPage />} />
          <Route path="gui-hang" element={<GuiHangPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="nhan-hang" element={<NhanHangPage />} />
          <Route path="tra-cuu-cuoc" element={<TraCuuCuocPage />} />
          <Route path="tai-xe" element={<TaiXePage />} />
          <Route path="ca-nhan" element={<CaNhanPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="dang-ky" element={<DangKyVaiTroPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};