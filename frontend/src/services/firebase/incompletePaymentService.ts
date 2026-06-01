// src/services/firebase/incompletePaymentService.ts
// Xử lý Incomplete Payments theo yêu cầu của Pi Network

import { db } from '../../firebase';
import { collection, doc, setDoc, getDocs, Timestamp } from 'firebase/firestore';

const COLLECTION = 'incomplete_payments';

export interface IncompletePayment {
  identifier: string;
  amount: number;
  memo?: string;
  metadata?: Record<string, any>;
  userId?: string;
  detectedAt: number;
}

const col = collection(db, COLLECTION);

/**
 * Lưu incomplete payment khi Pi SDK báo
 */
export async function saveIncompletePayment(payment: IncompletePayment, userId?: string) {
  try {
    const id = payment.identifier || `inc_${Date.now()}`;
    await setDoc(doc(col, id), {
      ...payment,
      userId: userId || 'unknown',
      detectedAt: Date.now(),
      syncedAt: Timestamp.now(),
    });
    console.warn('[IncompletePayment] Saved to Firebase:', id);
  } catch (e) {
    console.error('[IncompletePayment] Failed to save:', e);
    // Fallback localStorage
    const key = 'ghn_pi_incomplete_payments';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push({ ...payment, detectedAt: Date.now() });
    localStorage.setItem(key, JSON.stringify(existing));
  }
}

/**
 * Lấy danh sách incomplete payments
 */
export async function getIncompletePayments(): Promise<IncompletePayment[]> {
  try {
    const snap = await getDocs(col);
    return snap.docs.map(d => d.data() as IncompletePayment);
  } catch {
    const key = 'ghn_pi_incomplete_payments';
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}
