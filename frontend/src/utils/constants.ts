// src/utils/constants.ts

// ==================== ROLES (Chuẩn hóa 6 vai trò) ====================
export type AppRole = 
  | "guest"       // Người mới (chưa chọn vai trò)
  | "sender"      // Người gửi hàng
  | "driver"      // Tài xế
  | "warehouse"   // Kho trung chuyển
  | "receiver"    // Người nhận hàng
  | "admin";      // Admin / Quản trị

export type RoleType = AppRole;

export const ROLES = {
  GUEST: "guest" as const,         // Người mới
  SENDER: "sender" as const,       // Người gửi hàng
  DRIVER: "driver" as const,       // Tài xế
  WAREHOUSE: "warehouse" as const, // Kho trung chuyển
  RECEIVER: "receiver" as const,   // Người nhận hàng
  ADMIN: "admin" as const,         // Admin
} as const;

// ==================== EXPORT DEFAULT (nếu cần) ====================
export default {
  ROLES,
};