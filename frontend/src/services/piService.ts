// src/services/piService.ts

export const piService = {
  // Hàm này thay thế cho việc gọi trực tiếp window.Pi trong các Layout
  authenticate: async (): Promise<{ username: string } | null> => {
    try {
      if (window.Pi) {
        const user = await window.Pi.authenticate(['payments'], { onIncompletePaymentFound: () => {} });
        return { username: user.username };
      }
      return null;
    } catch (err) {
      console.error("Lỗi xác thực Pi:", err);
      return null;
    }
  }
};