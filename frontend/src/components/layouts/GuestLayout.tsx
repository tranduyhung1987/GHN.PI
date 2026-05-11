import { ReactNode } from 'react';
import BottomNav from '../BottomNav';

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a' }}>
      <main style={{ paddingBottom: '85px' }}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
