// src/core/pi/RealPiService.ts
import type { PiAdapter, PiPayment, PiPaymentResult, PiUser } from './PiAdapter';

export class RealPiService implements PiAdapter {
  public readonly isReal = true;

  private currentUser: PiUser | null = null;
  private accessToken: string | null = null;

  async authenticate(): Promise<PiUser> {
    if (typeof window === 'undefined' || !(window as any).Pi) {
      return {
        uid: 'sandbox-dummy',
        username: 'sandbox_user',
        name: 'Sandbox User',
      };
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
      console.error('[RealPiService] authenticate error (Sandbox):', err);
      return {
        uid: 'sandbox-dummy',
        username: 'sandbox_user',
        name: 'Sandbox User',
      };
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
        // --- ĐOẠN XỬ LÝ SỬA LỖI METADATA ---
        let safeMetadata: Record<string, any> = {};
        
        if (payment.metadata) {
          if (typeof payment.metadata === 'string') {
            try {
              // Nếu truyền vào là chuỗi JSON, ta parse ra thành object phẳng
              safeMetadata = JSON.parse(payment.metadata);
            } catch {
              // Nếu chuỗi thường, gán vào 1 key mặc định
              safeMetadata = { data: payment.metadata };
            }
          } else if (typeof payment.metadata === 'object' && payment.metadata !== null) {
            // Đảm bảo tất cả các value bên trong metadata đều là String/Number đơn giản, không chứa object lồng nhau
            safeMetadata = {};
            for (const [key, value] of Object.entries(payment.metadata)) {
              safeMetadata[key] = typeof value === 'object' ? JSON.stringify(value) : value;
            }
          }
        }
        // ------------------------------------

        (window as any).Pi.createPayment(
          {
            identifier: payment.identifier,
            amount: payment.amount,
            memo: payment.memo,
            metadata: safeMetadata, // Sử dụng metadata đã được chuẩn hóa an toàn
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