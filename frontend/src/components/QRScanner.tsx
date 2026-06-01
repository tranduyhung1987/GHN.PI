// src/components/QRScanner.tsx
// Lazy-loaded QR Scanner để giảm bundle size của WarehousePage

import React, { useEffect, useRef } from 'react';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: any) => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef<any>(null);
  const containerId = 'qr-reader-lazy';

  useEffect(() => {
    let isMounted = true;

    const initScanner = async () => {
      try {
        // Dynamic import - chỉ tải html5-qrcode khi thực sự cần
        const { Html5QrcodeScanner } = await import('html5-qrcode');

        if (!isMounted) return;

        scannerRef.current = new Html5QrcodeScanner(
          containerId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          false
        );

        scannerRef.current.render(
          (decodedText: string) => {
            onScanSuccess(decodedText);
          },
          (error: any) => {
            if (onScanError) onScanError(error);
          }
        );
      } catch (err) {
        console.error('Failed to load QR Scanner:', err);
      }
    };

    initScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [onScanSuccess, onScanError]);

  return (
    <div>
      <div id={containerId} style={{ marginBottom: '12px' }} />
      <p style={{ fontSize: 12, color: '#64748b', textAlign: 'center' }}>
        Đặt mã QR vào khung để quét
      </p>
    </div>
  );
};
