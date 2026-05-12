// src/Router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";

// Pages
import CaNhanPage from "./pages/CaNhanPage";
import DonHangPage from "./pages/DonHangPage";
import GuiHangPage from "./pages/GuiHangPage";
import KhoHubPage from "./pages/KhoHubPage";
import NhanHangPage from "./pages/NhanHangPage";
import DoiSoatPage from "./pages/DoiSoatPage";
import ChatPage from "./pages/ChatPage";
import KhieuNaiPage from "./pages/KhieuNaiPage";
import TrackingPage from "./pages/TrackingPage";
import TaiXePage from "./pages/TaiXePage";
import AdminPage from "./pages/AdminPage";
import Shop from "./pages/Shop";
import TraCuuCuocPage from "./pages/TraCuuCuocPage";

export const router = createBrowserRouter([
  // ====================== GUEST ======================
  {
    path: "/",
    element: <div className="min-h-screen bg-gray-950 text-white">Guest Layout</div>,
    children: [
      { 
        index: true, 
        element: <div className="p-10 text-center text-4xl text-cyan-400">🏠 GHN.PI - Trang chủ</div> 
      },
      { path: "tra-cuu-cuoc", element: <TraCuuCuocPage /> },
      { path: "shop", element: <Shop /> },
    ],
  },

  // ====================== MEMBER ======================
  {
    path: "/member",
    element: <div className="min-h-screen bg-gray-950 text-white p-4">Member Layout</div>,
    children: [
      { index: true, element: <Navigate to="/member/don-hang" replace /> },

      { path: "ca-nhan", element: <CaNhanPage /> },
      { path: "don-hang", element: <DonHangPage /> },
      { path: "gui-hang", element: <GuiHangPage /> },
      { path: "kho-hub", element: <KhoHubPage /> },
      { path: "nhan-hang", element: <NhanHangPage /> },
      { path: "doi-soat", element: <DoiSoatPage /> },
      { path: "chat", element: <ChatPage /> },
      { path: "khieu-nai", element: <KhieuNaiPage /> },
      { path: "tracking", element: <TrackingPage /> },
      { path: "tai-xe", element: <TaiXePage /> },
    ],
  },

  // ====================== ADMIN ======================
  {
    path: "/admin",
    element: <div className="min-h-screen bg-gray-950 text-white">Admin Layout</div>,
    children: [
      { index: true, element: <AdminPage /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export default router;