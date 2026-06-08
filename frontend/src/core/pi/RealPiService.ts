// src/core/pi/RealPiService.ts

import type { PiAdapter, PiPayment, PiPaymentResult, PiUser } from './PiAdapter';
import type { PiAuthResult } from '@/types/pi-sdk';
import { saveIncompletePayment } from '@/services/firebase/incompletePaymentService';

export class RealPiService implements PiAdapter {
  public readonly isReal = true;

  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    if (typeof window === 'undefined' || !window.Pi) {
      throw new Error('Pi SDK not available');
    }

    const auth: PiAuthResult = await window.Pi.authenticate(['payments', 'username'], {
      onIncompletePaymentFound: async (payment: any) => {
        await saveIncompletePayment({
          identifier: payment.identifier,
          amount: payment.amount,
          memo: payment.memo,
          metadata: payment.metadata,
          detectedAt: Date.now(),
        }, (auth as any).user?.uid);
      },
    });

    // Lấy username một cách phòng thủ nhất có thể
    const piUser: any = auth?.user || auth || {};

    this.currentUser = {
      uid: piUser.uid || piUser.id || `pi-${piUser.username || 'unknown'}`,
      username: piUser.username || piUser.userName || piUser.name || 'pi-user',
      name: piUser.name || piUser.username || 'Pi User',
    };
    this.accessToken = (auth as any).accessToken || null;

    return this.currentUser;
  }

  async getUser(): Promise<PiUser | null> {
    if (this.currentUser) return this.currentUser;

    if (window.Pi) {
      try {
        const auth: any = await window.Pi.authenticate(['username'], {});
        const piUser: any = auth?.user || auth || {};

        this.currentUser = {
          uid: piUser.uid || piUser.id || `pi-${piUser.username || 'unknown'}`,
          username: piUser.username || piUser.userName || piUser.name || 'pi-user',
          name: piUser.name || piUser.username || 'Pi User',
        };
      } catch {
        // Không làm gì nếu không lấy được
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    this.accessToken = null;
  }

  async createPayment(payment: PiPayment): Promise<PiPaymentResult> {
    // Giữ nguyên logic createPayment (sẽ làm sau)
    return new Promise((resolve) => {
      if (!window.Pi) {
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
          onReadyForServerCompletion: (_: string, txid: string) => resolve({ success: true, transactionId: txid }),
          onCancel: () => resolve({ success: false, error: 'Đã hủy' }),
          onError: (e: Error) => resolve({ success: false, error: e.message }),
        }
      );
    });
  }
}