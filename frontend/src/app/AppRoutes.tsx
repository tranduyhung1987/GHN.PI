import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthGuard from '../core/auth/AuthGuard';

const HomePage = lazy(() => import('../pages/HomePage'));
const RegisterRolePage = lazy(() => import('../pages/RegisterRolePage'));
const CreateShipmentPage = lazy(() => import('../pages/CreateShipmentPage'));
const ShippingFeePage = lazy(() => import('../pages/ShippingFeePage'));
const WarehousePage = lazy(() => import('../pages/WarehousePage'));
const DriverPage = lazy(() => import('../pages/DriverPage'));
const TrackingPage = lazy(() => import('../pages/TrackingPage'));
const ReceivePackagePage = lazy(() => import('../pages/ReceivePackagePage'));
const CommunityFeedback = lazy(() => import('../pages/CommunityFeedback'));

// Các trang đã tồn tại nhưng chưa được route
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const OrderPage = lazy(() => import('../pages/OrderPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const IncompletePaymentsPage = lazy(() => import('../pages/IncompletePaymentsPage'));

// Simple placeholder cho các route chưa có UI đầy đủ
const PlaceholderPage = ({ title, desc }: { title: string; desc?: string }) => (
  <div style={{ padding: 40, textAlign: 'center', minHeight: '60vh' }}>
    <h2 style={{ color: '#4c1d95' }}>{title}</h2>
    <p style={{ color: '#64748b', marginTop: 12 }}>{desc || 'Tính năng đang được hoàn thiện cho Pi Testnet.'}</p>
    <p style={{ marginTop: 20, fontSize: 13, color: '#94a3b8' }}>GHN.PI • Pi Network</p>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div style={{padding: '50px', textAlign: 'center'}}>Đang tải...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dang-ky" element={<RegisterRolePage />} />
          <Route path="login" element={<LoginPage />} />

          {/* Core logistics flows - protected for sender/admin (guard shows simple block for others; also soft check inside page) */}
          <Route 
            path="gui-hang" 
            element={
              <AuthGuard allowedRoles={['sender', 'admin']}>
                <CreateShipmentPage />
              </AuthGuard>
            } 
          />
          <Route path="tra-cuu-cuoc" element={<ShippingFeePage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="driver" element={<DriverPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="tracking/:maDon" element={<TrackingPage />} />
          <Route path="nhan-hang" element={<ReceivePackagePage />} />

          {/* BottomNav routes + các route hay được tham chiếu */}
          <Route path="don-hang" element={<OrderPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="ca-nhan" element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Advanced / Future pages (đã có code trong core) */}
          <Route path="chat" element={<CommunityFeedback />} />
          <Route path="admin" element={<PlaceholderPage title="🛡️ Trang Quản trị" />} />

          {/* Pi Network Compliance */}
          <Route path="incomplete-payments" element={<IncompletePaymentsPage />} />
          <Route path="payments/incomplete" element={<IncompletePaymentsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};