import React, { type ReactNode } from 'react';

interface MemberLayoutProps {
  children: ReactNode;
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* HEADER ĐÃ XÓA HOÀN TOÀN */}

      <main className="pb-20">{children}</main>
    </div>
  );
};

export default MemberLayout;