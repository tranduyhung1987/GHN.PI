import React, { type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface MemberLayoutProps {
  children: ReactNode;
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="bg-black/90 border-b border-cyan-500 p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-cyan-400">GHN.PI • {role.toUpperCase()}</h1>
          <div className="text-emerald-400 text-sm">Đã đăng nhập</div>
        </div>
      </header>
      <main className="pb-20">{children}</main>
    </div>
  );
};

export default MemberLayout;