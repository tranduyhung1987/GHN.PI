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
        // CHUẨN HÓA METADATA
        let safeMetadata: Record<string, string | number> = {};
        if (payment.metadata) {
          const rawMetadata = typeof payment.metadata === 'string' 
            ? JSON.parse(payment.metadata) 
            : payment.metadata;

          for (const [key, value] of Object.entries(rawMetadata)) {
            if (value !== null && value !== undefined) {
              safeMetadata[key] = typeof value === 'object' ? JSON.stringify(value) : String(value);
            }
          }
        }

        let isSettled = false;

        (window as any).Pi.createPayment(
          {
            identifier: payment.identifier,
            amount: payment.amount,
            memo: payment.memo,
            metadata: safeMetadata,
          },
          {
            onReadyForServerApproval: (paymentId: string) => {
              console.log('[Pi SDK] Sẵn sàng phê duyệt trên Server:', paymentId);
            },
            onReadyForServerCompletion: (paymentId: string, txid: string) => {
              if (!isSettled) {
                isSettled = true;
                resolve({ success: true, transactionId: txid });
              }
            },
            onCancel: (paymentId: string) => {
              if (!isSettled) {
                isSettled = true;
                resolve({ success: false, error: 'Đã hủy giao dịch' });
              }
            },
            onError: (error: Error, paymentId?: string) => {
              if (!isSettled) {
                isSettled = true;
                resolve({ success: false, error: error.message || 'Lỗi thanh toán' });
              }
            },
          }
        );
      } catch (err) {
        resolve({ success: false, error: (err as Error).message });
      }
    });
  }
}