import React from 'react';

interface BottomNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const BottomNav: React.FC<BottomNavProps> = ({ onNavigate, currentPage }) => {
  const navItems = [
    { key: 'home', label: 'Trang chủ', icon: '🏠' },
    { key: 'tracking', label: 'Theo dõi', icon: '🔍' },
    { key: 'orders', label: 'Đơn hàng', icon: '📦' },
    { key: 'profile', label: 'Cá nhân', icon: '👤' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2.5 z-50 shadow-lg">
      {navItems.map((item) => {
        const isActive = currentPage === item.key || 
                        (item.key === 'home' && currentPage === '');

        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all active:scale-95 ${
              isActive 
                ? 'text-[#4c1d95]' 
                : 'text-gray-500'
            }`}
          >
            <span className={`text-2xl mb-0.5 transition-all ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[13px] font-medium ${isActive ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;