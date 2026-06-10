// src/core/pi/RealPiService.ts
import type { PiAdapter, PiPayment, PiPaymentResult, PiUser } from './PiAdapter';

export class RealPiService implements PiAdapter {
  public readonly isReal = true;

  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      // ✅ Không truyền object, không có callback
      const auth: any = await (window as any).Pi.authenticate(['payments', 'username']);
      const piUser = auth?.user || auth || {};

      this.currentUser = {
        uid: piUser.uid || piUser.id || `pi-${piUser.username || 'unknown'}`,
        username: piUser.username || piUser.userName || piUser.name || 'pi-user',
        name: piUser.name || piUser.username || 'Pi User',
      };
      this.accessToken = auth?.accessToken || null;

      return this.currentUser;
    } catch (err) {
      console.error('[RealPiService] authenticate error:', err);
      throw err;
    }
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
      try {
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
      } catch (err) {
        resolve({ success: false, error: (err as Error).message });
      }
    });
  }
}