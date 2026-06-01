import { useState, useEffect } from 'react';
import { getAllOrders, saveOrder, updateOrderStatus } from '../services/firebase/orderService';

interface Order {
  maDon: string;
  nguoiNhan?: string;
  status?: string;
  [key: string]: any;
}

const LOCAL_KEY = 'ghn_pi_orders';

export const useWarehouse = () => {
  const [activeTab, setActiveTab] = useState<'nhap' | 'xuat' | 'ton'>('nhap');
  const [orders, setOrders] = useState<Order[]>([]);
  const [scanCode, setScanCode] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Load từ Firebase (ưu tiên) + fallback localStorage
  const loadOrders = async () => {
    setLoading(true);
    try {
      const firebaseOrders = await getAllOrders(100);
      if (firebaseOrders.length > 0) {
        setOrders(firebaseOrders);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(firebaseOrders));
      } else {
        const saved = localStorage.getItem(LOCAL_KEY);
        if (saved) setOrders(JSON.parse(saved));
      }
    } catch {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) setOrders(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Khi thêm/cập nhật đơn → sync cả local + Firebase
  const syncOrder = async (order: Order) => {
    const updated = [order, ...orders.filter(o => o.maDon !== order.maDon)];
    setOrders(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));

    try {
      await saveOrder(order);
    } catch (e) {
      console.warn('[useWarehouse] Firebase sync failed, kept in local');
    }
  };

  const handleScan = async (code: string) => {
    setScanCode(code);
    console.log("✅ Quét mã thành công:", code);

    const newOrder: Order = {
      maDon: code,
      nguoiNhan: "Người nhận từ QR",
      status: activeTab === 'nhap' ? 'Đã nhập kho' : 'Đang xuất kho',
      updatedAt: Date.now(),
      source: 'warehouse-scan',
    };

    await syncOrder(newOrder);

    // Cập nhật status trên Firebase
    try {
      await updateOrderStatus(code, newOrder.status || 'Đã xử lý');
    } catch {}
  };

  const addMockOrder = async () => {
    const mock: Order = {
      maDon: `DH${Date.now().toString().slice(-6)}`,
      nguoiNhan: "Thanh Pi User (Mock)",
      status: activeTab === 'nhap' ? 'Đã nhập kho' : 'Đã xuất kho',
      updatedAt: Date.now(),
      source: 'mock',
    };

    await syncOrder(mock);
  };

  const updateOrderStatusLocal = async (maDon: string, newStatus: string = 'Đã xử lý') => {
    const updatedOrders = orders.map(o =>
      o.maDon === maDon ? { ...o, status: newStatus, updatedAt: Date.now() } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedOrders));

    try {
      await updateOrderStatus(maDon, newStatus);
    } catch {}
  };

  return {
    activeTab,
    setActiveTab,
    orders,
    scanCode,
    setScanCode,
    handleScan,
    addMockOrder,
    loading,
    updateOrderStatus: updateOrderStatusLocal,
    reload: loadOrders,
  };
};