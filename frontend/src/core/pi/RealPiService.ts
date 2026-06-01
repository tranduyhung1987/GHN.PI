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
  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi SDK not available. Vui lòng mở trong Pi Browser.');
      }

      const auth: PiAuthResult = await window.Pi.authenticate(
        ['payments', 'username'],
        {
          onIncompletePaymentFound: async (payment: any) => {
            console.warn('[Pi SDK] Incomplete payment found:', payment);

            // Lưu vào Firebase + local (theo yêu cầu Pi Network)
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
    // Nếu chưa có trong memory, thử lấy lại (Pi Browser có thể đã auth sẵn)
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
        // ignore - user chưa login
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
        resolve({ success: false, error: 'Pi SDK không khả dụng (chỉ chạy trong Pi Browser)' });
        return;
      }

      console.log('%c[Real Pi] Bắt đầu tạo payment qua Pi SDK', 'color:#22d3ee', payment);

      try {
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
              // TODO: Gọi backend /payments/approve
            },
            onReadyForServerCompletion: (paymentId: string, txid: string) => {
              console.log('[Pi Payment] Completed! txid=', txid);
              resolve({
                success: true,
                transactionId: txid,
              });
            },
            onCancel: (paymentId: string) => {
              console.warn('[Pi Payment] User cancelled:', paymentId);
              resolve({ success: false, error: 'Người dùng đã hủy thanh toán' });
            },
            onError: (error: Error, paymentData) => {
              console.error('[Pi Payment] Error:', error, paymentData);
              resolve({
                success: false,
                error: error?.message || 'Lỗi thanh toán Pi',
              });
            },
          }
        );
      } catch (err: any) {
        console.error('[Real Pi] createPayment exception:', err);
        resolve({
          success: false,
          error: err?.message || 'Không thể khởi tạo thanh toán Pi',
        });
      }
    });
  }
}