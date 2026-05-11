import { ReactNode } from 'react';
import BottomNav from '../BottomNav';   // <-- sửa nếu đường dẫn khác

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', position: 'relative' }}>
      {/* Content chính */}
      <main style={{ paddingBottom: '80px' }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}