import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const RoleSelector = () => {
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'shop', label: 'Thành Viên / Shop', icon: '👤', desc: 'Tạo đơn, theo dõi hàng' },
    { id: 'driver', label: 'Tài Xế', icon: '🏍️', desc: 'Nhận đơn giao hàng' },
    { id: 'warehouse', label: 'Kho Trung Chuyển', icon: '🏬', desc: 'Quản lý kho' },
    { id: 'admin', label: 'Quản Trị Viên', icon: '👑', desc: 'Quản lý hệ thống' },
  ];

  const handleSelect = (role: string) => {
    setRole(role as any);
    navigate('/');           // Quay về trang chủ sau khi chọn role
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-900 mb-3">Chọn vai trò của bạn</h1>
          <p className="text-purple-600">Bạn sẽ sử dụng GHN.PI với tư cách nào?</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleSelect(role.id)}
              className="bg-white p-6 rounded-3xl shadow hover:shadow-xl cursor-pointer transition border border-purple-100 hover:border-primary"
            >
              <div className="text-5xl mb-4">{role.icon}</div>
              <h3 className="font-semibold text-xl text-purple-900">{role.label}</h3>
              <p className="text-gray-600 mt-1">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;