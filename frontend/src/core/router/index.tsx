import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';

// Pages
import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import DashboardPage from "../../pages/DashboardPage";
import DriverPage from "../../pages/DriverPage";
import TaiXePage from "../../pages/TaiXePage";
import AdminPage from "../../pages/AdminPage";
import OrderPage from "../../pages/OrderPage";
import TrackingPage from "../../pages/TrackingPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />

        {/* ================= DASHBOARD ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* ================= DRIVER ================= */}

        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={['driver', 'admin']}>
              <DriverPage />
            </ProtectedRoute>
          }
        />

        {/* ================= TAIXE ================= */}

        <Route
          path="/taixe"
          element={
            <ProtectedRoute allowedRoles={['driver', 'admin']}>
              <TaiXePage />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* ================= ORDER ================= */}

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />

        {/* ================= TRACKING ================= */}

        <Route
          path="/tracking"
          element={
            <ProtectedRoute>
              <TrackingPage />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}