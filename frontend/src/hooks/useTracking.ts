import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/firebase/orderService';

interface TrackingOrder {
  maDon: string;
  loaiDon?: string;
  nguoiNhan?: string;
  diaChiNhan?: string;
  trangThai?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: number | string;
  [key: string]: any;
}

const LOCAL_KEY = 'ghn_pi_orders';

export const useTracking = () => {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Ưu tiên lấy từ Firebase
      const firebaseOrders = await getAllOrders(50);

      if (firebaseOrders.length > 0) {
        const mapped = firebaseOrders.map((o: any) => ({
          ...o,
          trangThai: o.status || o.trangThai || 'created',
        }));
        setOrders(mapped);
        // Đồng bộ về localStorage làm cache
        localStorage.setItem(LOCAL_KEY, JSON.stringify(mapped));
      } else {
        // Fallback localStorage (offline hoặc chưa có data trên Firebase)
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setOrders(parsed);
        }
      }
    } catch (e) {
      console.warn('[useTracking] Firebase load failed, using localStorage');
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) setOrders(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return { orders, loading, loadOrders };
};