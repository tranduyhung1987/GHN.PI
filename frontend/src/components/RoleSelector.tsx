import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleSelectorProps {
  onNavigate?: (page: string) => void;
}

const RoleSelector = ({ onNavigate }: RoleSelectorProps) => {
  const { setAuth, piUsername, userRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(userRole);

  // Tự động load role từ AuthContext
  useEffect(() => {
    if (userRole) setSelectedRole(userRole);
  }, [userRole]);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    console.log(`🎯 Chọn vai trò: ${role} cho user: ${piUsername}`);

    // Đồng bộ AuthContext + localStorage
    setAuth(piUsername || '', role);

    if (onNavigate) {
      // Chuyển mượt mà không reload
      setTimeout(() => onNavigate('home'), 600);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-violet-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-900 mb-2">Chào mừng đến với GHN.PI</h1>
          <p className="text-gray-600">Vui lòng chọn vai trò của bạn</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSelectRole('sender')}
            className="w-full p-6 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md active:scale-95"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">📦</div>
            <div className="text-left">
              <div className="font-semibold text-lg">Người gửi hàng</div>
              <div className="text-sm text-gray-500">Tạo đơn, theo dõi vận chuyển</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('receiver')}
            className="w-full p-6 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md active:scale-95"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">📬</div>
            <div className="text-left">
              <div className="font-semibold text-lg">Người nhận hàng</div>
              <div className="text-sm text-gray-500">Nhận hàng, khiếu nại</div>
            </div>
          </button>

          <button
            onClick={() => handleSelectRole('driver')}
            className="w-full p-6 bg-white border-2 border-purple-200 hover:border-purple-500 rounded-2xl flex items-center gap-4 transition-all hover:shadow-md active:scale-95"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-3xl">🏍️</div>
            <div className="text-left">
              <div className="font-semibold text-lg">Tài xế</div>
              <div className="text-sm text-gray-500">Nhận đơn, giao hàng</div>
            </div>
          </button>
        </div>

        {selectedRole && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-2xl text-center text-green-700 text-sm">
            Đã chọn: <strong>{selectedRole === 'sender' ? 'Người gửi hàng' : selectedRole === 'receiver' ? 'Người nhận hàng' : 'Tài xế'}</strong><br />
            Đang chuyển hướng...
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelector;