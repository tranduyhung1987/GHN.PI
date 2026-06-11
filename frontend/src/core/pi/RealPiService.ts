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

    try {
      // ✅ Yêu cầu cả username và payments
      const auth: any = await (window as any).Pi.authenticate(
        ['username', 'payments'],
        {
          onIncompletePaymentFound: async (payment: any) => {
            console.warn('[RealPiService] Incomplete payment found:', payment);
            
            // Lưu incomplete payment
            await saveIncompletePayment({
              identifier: payment.identifier,
              amount: payment.amount,
              memo: payment.memo,
              metadata: payment.metadata,
              detectedAt: Date.now(),
            });
          },
        }
      );

      const piUser = auth?.user || auth || {};

      this.currentUser = {
        uid: piUser.uid || piUser.id || `pi-${piUser.username || 'unknown'}`,
        username: piUser.username || piUser.userName || piUser.name || 'pi-user',
        name: piUser.name || piUser.username || 'Pi User',
      };
      this.accessToken = auth?.accessToken || null;

      return this.currentUser;
    } catch (err: any) {
      console.error('[RealPiService] authenticate error:', err);
      throw new Error(err?.message || 'Pi Authentication failed');
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
        // Chuẩn hóa metadata
        const safeMetadata: Record<string, string | number> = {};
        if (payment.metadata) {
          const raw = typeof payment.metadata === 'string' 
            ? JSON.parse(payment.metadata) 
            : payment.metadata;

          Object.entries(raw).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              safeMetadata[key] = typeof value === 'object' 
                ? JSON.stringify(value) 
                : String(value);
            }
          });
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
              console.log('[Pi SDK] Ready for server approval:', paymentId);
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
      } catch (err: any) {
        resolve({ success: false, error: err.message });
      }
    });
  }
}