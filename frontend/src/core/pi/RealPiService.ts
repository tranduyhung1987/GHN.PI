// src/core/pi/RealPiService.ts

import type {
  PiAdapter,
  PiPayment,
  PiPaymentResult,
  PiUser,
} from './PiAdapter';
import type { PiAuthResult } from '@/types/pi-sdk';
import { saveIncompletePayment } from '@/services/firebase/incompletePaymentService';

export class RealPiService implements PiAdapter {
  public readonly isReal = true;           // ← Dùng để check nhanh: if (service.isReal)

  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        console.warn('[Real Pi] Pi SDK not available');
        throw new Error('Pi SDK not available');
      }

      const auth: PiAuthResult = await window.Pi.authenticate(
        ['payments', 'username'],
        {
          onIncompletePaymentFound: async (payment: any) => {
            console.warn('[Pi SDK] Incomplete payment found:', payment);
            await saveIncompletePayment({
              identifier: payment.identifier,
              amount: payment.amount,
              memo: payment.memo,
              metadata: payment.metadata,
              detectedAt: Date.now(),
            }, auth.user?.uid);
          },
        }
      );

      this.currentUser = {
        uid: auth.user.uid,
        username: auth.user.username,
        name: auth.user.name,
      };
      this.accessToken = auth.accessToken;

      console.log('%c[Real Pi] Đăng nhập thành công', 'color: green; font-weight: bold', this.currentUser);
      return this.currentUser;
    } catch (error) {
      console.error('[Real Pi] Authenticate failed:', error);
      throw error;
    }
  }

  async getUser(): Promise<PiUser | null> {
    if (!this.currentUser && window.Pi) {
      try {
        const auth = await window.Pi.authenticate(['username'], {});
        this.currentUser = {
          uid: auth.user.uid,
          username: auth.user.username,
          name: auth.user.name,
        };
        this.accessToken = auth.accessToken;
      } catch {
        // user chưa login
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  logout(): void {
    this.currentUser = null;
    this.accessToken = null;
    console.log('%c[Real Pi] Logout', 'color: red; font-weight: bold');
  }

  async createPayment(payment: PiPayment): Promise<PiPaymentResult> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.Pi) {
        resolve({ success: false, error: 'Pi SDK không khả dụng' });
        return;
      }

      window.Pi.createPayment(
        {
          identifier: payment.identifier,
          amount: payment.amount,
          memo: payment.memo,
          metadata: payment.metadata || {},
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            console.log('[Pi Payment] Ready for server approval:', paymentId);
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            resolve({ success: true, transactionId: txid });
          },
          onCancel: (paymentId: string) => {
            resolve({ success: false, error: 'Người dùng đã hủy thanh toán' });
          },
          onError: (error: Error) => {
            resolve({ success: false, error: error?.message || 'Lỗi thanh toán Pi' });
          },
        }
      );
    });
  }

  /** Thông tin môi trường — hỗ trợ hiển thị badge */
  getEnvironmentInfo() {
    return {
      type: 'real' as const,
      hasPiSDK: typeof window !== 'undefined' && !!window.Pi,
      username: this.currentUser?.username || null,
    };
  }
}