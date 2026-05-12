// src/components/layouts/MemberLayout.tsx
import { ReactNode } from 'react';
import BottomNav from '../BottomNav';

interface Props {
  children: ReactNode;
}

export default function MemberLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}