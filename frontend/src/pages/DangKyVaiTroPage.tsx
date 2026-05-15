import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DangKyVaiTroPageProps {
  onNavigate?: (page: string) => void;
}

const DangKyVaiTroPage: React.FC<DangKyVaiTroPageProps> = ({ onNavigate }) => {
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setRole(role as any);   // ← Fix lỗi đỏ (type assertion)
    
    if (onNavigate) {
      setTimeout(() => {
        onNavigate('home');
      }, 800);
    } else {
      alert(`Đã chọn vai trò: ${role}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-violet-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Đăng Ký Vai Trò</h1>
          <p className="text-gray-600">Chọn vai trò phù hợp với bạn trên GHN.PI</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSelectRole('sender')}
            className="w-full p-6 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md active:scale-95"
          >
            <div className="text-4xl">📦</div>
            <div className="text-left">
              <div className="font-semibold text-lg">Người Gửi Hàng</div>
              <div className="text-sm text-gray-500">Tạo đơn hàng, theo dõi vận chuyển</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('receiver')}
            className="w-full p-6 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md active:scale-95"
          >
            <div className="text-4xl">📬</div>
            <div className="text-left">
              <div className="font-semibold text-lg">Người Nhận Hàng</div>
              <div className="text-sm text-gray-500">Nhận hàng, khiếu nại</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('driver')}
            className="w-full p-6 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md active:scale-95"
          >
            <div className="text-4xl">🏍️</div>
            <div className="text-left">
              <div className="font-semibold text-lg">Tài Xế</div>
              <div className="text-sm text-gray-500">Nhận đơn, giao hàng</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangKyVaiTroPage;