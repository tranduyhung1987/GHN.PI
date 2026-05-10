import React, { type ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar Admin */}
      <div className="w-64 bg-gray-950 border-r border-red-500 p-4 hidden md:block">
        <h2 className="text-red-400 font-bold text-xl mb-8 flex items-center gap-2">
          👑 ADMIN PANEL
        </h2>
        <nav className="space-y-2 text-sm">
          <div className="p-3 bg-red-900/30 rounded-xl text-white font-medium">📊 Dashboard</div>
          <div className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer">👥 Quản lý Người dùng</div>
          <div className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer">📦 Tất cả Đơn hàng</div>
          <div className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer">💰 Doanh thu Pi</div>
          <div className="p-3 hover:bg-gray-800 rounded-xl cursor-pointer">⚙️ Cài đặt hệ thống</div>
        </nav>
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        <header className="bg-black/90 border-b border-red-500 p-4 sticky top-0 z-40">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-400">GHN.PI - ADMIN DASHBOARD</h1>
            <div className="text-emerald-400 text-sm">Chào Chủ dự án</div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;