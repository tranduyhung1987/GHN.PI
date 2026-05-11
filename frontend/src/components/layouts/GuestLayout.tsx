import { ReactNode } from 'react';
import BottomNav from '../BottomNav';

interface GuestLayoutProps {
  children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a',
      position: 'relative',
      paddingBottom: '80px' 
    }}>
      {children}
      <BottomNav />
    </div>
  );
}
