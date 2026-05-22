import { useState, useEffect } from 'react';

// Định nghĩa kiểu dữ liệu cho user để tránh lỗi TypeScript
interface PiUser {
  username: string;
  uid: string;
}

export const usePiAuth = () => {
  const [piUsername, setPiUsername] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // 1. Khởi tạo SDK Pi khi app load
    const initPiSDK = async () => {
      try {
        if (window.Pi) {
          window.Pi.init({ version: "2.0" });
          
          // Kiểm tra xem đã đăng nhập trước đó chưa (dựa vào localStorage)
          const savedPi = localStorage.getItem('piUsername');
          if (savedPi) setPiUsername(savedPi);
        }
      } catch (err) {
        console.warn("Pi SDK init error:", err);
      }
    };
    initPiSDK();
  }, []);

  // 2. Hàm đăng nhập thực tế
  const loginWithPi = async () => {
    setLoading(true);
    try {
      // Gọi SDK Pi để xác thực
      const auth = await window.Pi.authenticate(['username', 'payments'], 
        (authResult: any) => {
          // Xử lý khi đăng nhập thành công
          const user = authResult.user;
          setPiUsername(user.username);
          localStorage.setItem('piUsername', user.username);
          localStorage.setItem('piUid', user.uid);
          console.log("Đăng nhập thành công:", user);
        }, 
        (err: any) => {
          // Xử lý khi có lỗi hoặc người dùng hủy
          console.error("Lỗi xác thực Pi:", err);
        }
      );
    } catch (err) {
      console.error("Lỗi gọi SDK:", err);
    } finally {
      setLoading(false);
    }
  };

  return { piUsername, loginWithPi, loading };
};