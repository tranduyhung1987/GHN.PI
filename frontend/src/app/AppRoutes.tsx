import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

const HomePage = lazy(() => import('../pages/HomePage'));
const RegisterRolePage = lazy(() => import('../pages/RegisterRolePage'));
const CreateShipmentPage = lazy(() => import('../pages/CreateShipmentPage'));
const ShippingFeePage = lazy(() => import('../pages/ShippingFeePage'));
const WarehousePage = lazy(() => import('../pages/WarehousePage'));
const DriverPage = lazy(() => import('../pages/DriverPage'));
const TrackingPage = lazy(() => import('../pages/TrackingPage'));
const ReceivePackagePage = lazy(() => import('../pages/ReceivePackagePage'));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div style={{padding: '50px', textAlign: 'center'}}>Đang tải...</div>}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="dang-ky" element={<RegisterRolePage />} />
          
          {/* Các route cho card HomePage */}
          <Route path="gui-hang" element={<CreateShipmentPage />} />
          <Route path="tra-cuu-cuoc" element={<ShippingFeePage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="driver" element={<DriverPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="nhan-hang" element={<ReceivePackagePage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};