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
  public readonly isReal = true;

  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi SDK not available');
      }

      const auth: PiAuthResult = await window.Pi.authenticate(
        ['payments', 'username'],
        {
          onIncompletePaymentFound: async (payment: any) => {
            await saveIncompletePayment({
              identifier: payment.identifier,
              amount: payment.amount,
              memo: payment.memo,
              metadata: payment.metadata,
              detectedAt: Date.now(),
            }, (auth as any).user?.uid);
          },
        }
      );

      // === FIX MẠNH: Lấy username cực kỳ phòng thủ (hỗ trợ nhiều cấu trúc Pi SDK trên mobile) ===
      const piUserData: any = auth?.user || auth || {};

      this.currentUser = {
        uid: piUserData.uid || piUserData.id || `pi-${piUserData.username || piUserData.userName || 'unknown'}`,
        username: piUserData.username || piUserData.userName || piUserData.name || piUserData.piUsername || 'pi-user',
        name: piUserData.name || piUserData.username || piUserData.userName || 'Pi User',
      };
      this.accessToken = (auth as any).accessToken || null;

      return this.currentUser;
    } catch (error) {
      console.error('[Real Pi] Authenticate failed:', error);
      throw error;
    }
  }

  async getUser(): Promise<PiUser | null> {
    // Ưu tiên trả ngay user đã cache từ lần authenticate thành công
    if (this.currentUser) {
      return this.currentUser;
    }

    if (window.Pi) {
      try {
        const auth: any = await window.Pi.authenticate(['username'], {});
        const piUserData = auth?.user || auth || {};

        this.currentUser = {
          uid: piUserData.uid || piUserData.id || `pi-${piUserData.username || 'unknown'}`,
          username: piUserData.username || piUserData.userName || piUserData.name || 'pi-user',
          name: piUserData.name || piUserData.username || 'Pi User',
        };
        this.accessToken = auth?.accessToken || null;
      } catch {
        // im lặng nếu không lấy được
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
          onReadyForServerApproval: () => {},
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            resolve({ success: true, transactionId: txid });
          },
          onCancel: () => {
            resolve({ success: false, error: 'Người dùng đã hủy' });
          },
          onError: (error: Error) => {
            resolve({ success: false, error: error?.message || 'Lỗi thanh toán' });
          },
        }
      );
    });
  }

  getEnvironmentInfo() {
    return {
      type: 'real' as const,
      hasPiSDK: typeof window !== 'undefined' && !!window.Pi,
      username: this.currentUser?.username || null,
    };
  }
}