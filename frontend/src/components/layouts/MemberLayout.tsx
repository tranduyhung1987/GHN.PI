import React, { type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface MemberLayoutProps {
  children: ReactNode;
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* HEADER ĐÃ BỊ XÓA */}

      <main className="pb-20">{children}</main>
    </div>
  );
};

export default MemberLayout;