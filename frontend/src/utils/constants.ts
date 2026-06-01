// src/utils/constants.ts

// ==================== ROLES (Chuẩn hóa 5 vai trò chính) ====================
export type AppRole = 
  | "guest"
  | "sender"      // Người gửi hàng
  | "driver"      // Tài xế
  | "warehouse"   // Kho trung chuyển
  | "receiver"    // Người nhận hàng
  | "admin";      // Admin

export type RoleType = AppRole;

export const ROLES = {
  GUEST: "guest" as const,
  SENDER: "sender" as const,       // Người gửi
  DRIVER: "driver" as const,       // Tài xế
  WAREHOUSE: "warehouse" as const, // Kho trung chuyển
  RECEIVER: "receiver" as const,   // Người nhận hàng
  ADMIN: "admin" as const,
} as const;

// ==================== EXPORT DEFAULT (nếu cần) ====================
export default {
  ROLES,
};