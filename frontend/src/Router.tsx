import { createBrowserRouter, Navigate } from "react-router-dom";

// Import Layouts
import GuestLayout from "./components/layouts/GuestLayout";
import MemberLayout from "./components/layouts/MemberLayout";
import AdminLayout from "./components/layouts/AdminLayout";

export const router = createBrowserRouter([
  { 
    path: "/", 
    element: <GuestLayout />,
    children: [{ index: true, element: <div className="p-8 text-center text-3xl text-cyan-400">🏠 Trang chủ GHN.PI</div> }] 
  },
  { 
    path: "/member", 
    element: <MemberLayout />,
    children: [{ index: true, element: <div className="p-10 text-center text-2xl text-cyan-400">🎉 Chào mừng Thành viên!</div> }] 
  },
  { 
    path: "/admin", 
    element: <AdminLayout />,
    children: [{ index: true, element: <div className="p-10 text-center text-3xl text-red-400">👑 ADMIN DASHBOARD</div> }] 
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

export default router;