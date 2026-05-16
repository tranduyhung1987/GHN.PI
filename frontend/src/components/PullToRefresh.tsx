import React, { useState, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => void;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setStartY(e.touches[0].clientY);
      setPullDistance(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;
      if (distance > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(distance * 0.6, 120));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 80 && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh();
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 1200);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh, startY]);

  return (
    <div style={{ position: 'relative' }}>
      {pullDistance > 0 && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: `translateX(-50%)`,
          zIndex: 9999,
          padding: '10px 24px',
          background: 'white',
          borderRadius: '30px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
          fontSize: '14px',
          color: '#4c1d95',
          whiteSpace: 'nowrap'
        }}>
          {isRefreshing ? 'Đang tải mới...' : '↓ Kéo xuống để làm mới'}
        </div>
      )}
      {children}
    </div>
  );
};

export default PullToRefresh;