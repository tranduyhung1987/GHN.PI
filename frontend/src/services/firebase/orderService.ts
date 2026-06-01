// src/services/firebase/orderService.ts
// Service đơn giản để đồng bộ đơn hàng với Firestore

import { db } from '../../firebase';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';

const ORDERS_COLLECTION = 'orders';

export interface OrderData {
  maDon: string;
  nguoiGui?: string;
  sdtGui?: string;
  diaChiGui?: string;
  nguoiNhan?: string;
  sdtNhan?: string;
  diaChiNhan?: string;
  loaiDon?: string;
  trongLuong?: number;
  totalAmount?: number;
  paymentMethod?: 'prepaid' | 'cod';
  status?: string;
  piUsername?: string;
  createdAt?: number;
  updatedAt?: number;
  paymentTxId?: string;
  [key: string]: any;
}

const ordersCol = collection(db, ORDERS_COLLECTION);

/**
 * Lưu hoặc cập nhật đơn hàng lên Firestore
 */
export async function saveOrder(order: OrderData): Promise<void> {
  try {
    const orderRef = doc(ordersCol, order.maDon);
    await setDoc(orderRef, {
      ...order,
      updatedAt: Date.now(),
      syncedAt: Timestamp.now(),
    }, { merge: true });
    console.log('[Firebase] Order saved:', order.maDon);
  } catch (error) {
    console.error('[Firebase] Failed to save order:', error);
    throw error;
  }
}

/**
 * Lấy tất cả đơn hàng (mới nhất trước)
 */
export async function getAllOrders(max = 50): Promise<OrderData[]> {
  try {
    const q = query(ordersCol, orderBy('createdAt', 'desc'), limit(max));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as any;
      return {
        ...data,
        maDon: doc.id,
      };
    });
  } catch (error) {
    console.error('[Firebase] Failed to fetch orders:', error);
    return [];
  }
}

/**
 * Cập nhật trạng thái đơn hàng
 */
export async function updateOrderStatus(maDon: string, status: string): Promise<void> {
  try {
    const orderRef = doc(ordersCol, maDon);
    await updateDoc(orderRef, {
      status,
      updatedAt: Date.now(),
      syncedAt: Timestamp.now(),
    });
    console.log('[Firebase] Order status updated:', maDon, status);
  } catch (error) {
    console.error('[Firebase] Failed to update status:', error);
    throw error;
  }
}
