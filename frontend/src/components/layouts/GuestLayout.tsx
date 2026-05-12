// src/components/layouts/GuestLayout.tsx
import * as React from 'react';
import BottomNav from '../BottomNav';

interface Props {
  children: React.ReactNode;
}

export default function GuestLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}