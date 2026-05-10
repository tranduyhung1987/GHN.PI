import React, { type ReactNode } from 'react';

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header cho Guest */}
      <header className="bg-black/80 border-b border-cyan-500 p-4 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-cyan-400">GHN.PI</h1>
          <p className="text-gray-400 text-sm">Logistics Ecosystem v14 Pro</p>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default GuestLayout;