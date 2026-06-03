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
    // 1. devMockPiUsername (dùng để test dễ dàng, ví dụ: admin_demo)
    // 2. mockPiUsername (cách cũ)
    // 3. Random (mặc định)
    const devUsername = localStorage.getItem('devMockPiUsername');
    const saved = localStorage.getItem('mockPiUsername');
    const username = devUsername || saved || `pi_user_${Math.floor(Math.random() * 10000)}`;

    const mockUser: PiUser = {
      uid: `mock-uid-${Date.now()}`,
      username,
      name: username,
      role: (localStorage.getItem('mockPiRole') as any) || undefined,
    };

    this._currentUser = mockUser;

    // Lưu lại để lần sau dùng (ưu tiên dev key nếu có)
    if (devUsername) {
      localStorage.setItem('devMockPiUsername', username);
    } else {
      localStorage.setItem('mockPiUsername', username);
    }

    if (import.meta.env.DEV) console.log('%c[Mock Pi] Authenticated as', 'color: orange', mockUser);
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

    // Giả lập độ trễ mạng + user confirm
    await new Promise((r) => setTimeout(r, 1200));

    // 95% success rate trong mock
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