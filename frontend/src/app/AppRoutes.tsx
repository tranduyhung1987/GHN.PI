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

// Routed pages (some have internal role guards)
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const OrderPage = lazy(() => import('../pages/OrderPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const IncompletePaymentsPage = lazy(() => import('../pages/IncompletePaymentsPage'));
const AdminPage = lazy(() => import('../pages/AdminPage'));

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
          <Route path="admin" element={<AdminPage />} />

          {/* Pi Network Compliance */}
          <Route path="incomplete-payments" element={<IncompletePaymentsPage />} />
          <Route path="payments/incomplete" element={<IncompletePaymentsPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};