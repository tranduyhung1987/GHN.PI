// src/core/pi/MockPiService.ts
import { PiAdapter, PiPayment, PiPaymentResult, PiUser } from "./PiAdapter";

export class MockPiService implements PiAdapter {
  private _currentUser: PiUser | null = null;

  get currentUser(): PiUser | null {
    return this._currentUser;
  }

  isAuthenticated(): boolean {
    return this._currentUser !== null;
  }

  async getUser(): Promise<PiUser | null> {
    return this._currentUser;
  }

  async authenticate(): Promise<PiUser> {
    // === DEV HELPER: Ưu tiên username do dev đặt ===
    const devUsername = localStorage.getItem('devMockPiUsername');
    const saved = localStorage.getItem('mockPiUsername');
    const username = devUsername || saved || `pi_user_${Math.floor(Math.random() * 10000)}`;

    // ✅ TỰ ĐỘNG SET ROLE MẶC ĐỊNH = 'sender' nếu chưa có (dành cho dev)
    if (!localStorage.getItem('selectedRole')) {
      localStorage.setItem('selectedRole', 'sender');
      if (import.meta.env.DEV) {
        console.log('%c[Mock Pi] Auto set default role = sender', 'color: #22c55e');
      }
    }

    const mockUser: PiUser = {
      uid: `mock-uid-${Date.now()}`,
      username,
      name: username,
      role: (localStorage.getItem('mockPiRole') as any) || undefined,
    };

    this._currentUser = mockUser;

    // Lưu lại để lần sau dùng
    if (devUsername) {
      localStorage.setItem('devMockPiUsername', username);
    } else {
      localStorage.setItem('mockPiUsername', username);
    }

    if (import.meta.env.DEV) {
      console.log('%c[Mock Pi] Authenticated as', 'color: orange', mockUser);
      console.log('%c[Mock Pi] Current role from localStorage:', 'color: orange', localStorage.getItem('selectedRole'));
    }

    return mockUser;
  }

  logout(): void {
    this._currentUser = null;
    localStorage.removeItem('mockPiUsername');
    localStorage.removeItem('devMockPiUsername');
    if (import.meta.env.DEV) console.log('%c[Mock Pi] Logged out', 'color: orange');
  }

  async createPayment(payment: PiPayment): Promise<PiPaymentResult> {
    if (import.meta.env.DEV) console.log('%c[Mock Pi] Simulating Pi Payment...', 'color:#f59e0b', payment);

    await new Promise((r) => setTimeout(r, 1200));

    const success = Math.random() > 0.05;

    if (success) {
      const txid = `MOCK-TX-${Date.now()}`;
      if (import.meta.env.DEV) console.log('%c[Mock Pi] Payment SUCCESS', 'color:#22c55e', txid);
      return {
        success: true,
        transactionId: txid,
      };
    } else {
      return {
        success: false,
        error: 'Mock payment failed (simulated)',
      };
    }
  }
}