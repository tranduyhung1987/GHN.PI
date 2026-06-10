// FORCE DEPLOY - 10/06/2026 15:47 - Fix JSON Sandbox
// src/core/pi/RealPiService.ts
import type { PiAdapter, PiPayment, PiPaymentResult, PiUser } from './PiAdapter';
import { saveIncompletePayment } from '@/services/firebase/incompletePaymentService';

export class RealPiService implements PiAdapter {
  public readonly isReal = true;

  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      throw new Error('Pi SDK not available');
    }

    // ✅ TẠM TẮT CALLBACK để test (sẽ bật lại sau khi ổn)
    const auth: any = await (window as any).Pi.authenticate(
      ['payments', 'username']
      // onIncompletePaymentFound đã tắt tạm
    );

    const piUser = auth?.user || auth || {};

    this.currentUser = {
      uid: piUser.uid || piUser.id || `pi-${piUser.username || 'unknown'}`,
      username: piUser.username || piUser.userName || piUser.name || 'pi-user',
      name: piUser.name || piUser.username || 'Pi User',
    };
    this.accessToken = auth?.accessToken || null;

    return this.currentUser;
  }

  async getUser(): Promise<PiUser | null> {
    if (this.currentUser) return this.currentUser;

    if ((window as any).Pi) {
      try {
        const auth: any = await (window as any).Pi.authenticate(['username']);
        const piUser = auth?.user || auth || {};

        this.currentUser = {
          uid: piUser.uid || piUser.id || `pi-${piUser.username || 'unknown'}`,
          username: piUser.username || piUser.userName || piUser.name || 'pi-user',
          name: piUser.name || piUser.username || 'Pi User',
        };
      } catch (err) {
        console.warn('[RealPiService] getUser error:', err);
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
    return new Promise((resolve) => {
      if (!(window as any).Pi) {
        resolve({ success: false, error: 'Pi SDK không khả dụng' });
        return;
      }

      (window as any).Pi.createPayment(
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