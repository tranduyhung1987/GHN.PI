import React from 'react';
import BottomNav from '../BottomNav';   // ← Đường dẫn đúng

interface ShipLayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
  currentPage?: string;
}

const ShipLayout: React.FC<ShipLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage = 'tai-xe' 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Tài xế */}
      <div className="bg-blue-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">🏍️ Tài Xế GHN.PI</h1>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>

      {/* BottomNav */}
      {onNavigate && (
        <BottomNav 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
        />
      )}
    </div>
  );
};

export default ShipLayout;