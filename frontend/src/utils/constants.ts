// src/utils/constants.ts

// ==================== ROLES (Chuẩn hóa 6 vai trò) ====================
// Lưu ý: 
// - "guest" (Người mới) là trạng thái mặc định, KHÔNG cho chọn trong trang đăng ký.
// - "admin" chỉ được gán tự động qua hardcode username (xem AuthContext).
export type AppRole = 
  | "guest"       // Người mới (chưa chọn vai trò) - trạng thái mặc định
  | "sender"      // Người gửi hàng
  | "driver"      // Tài xế
  | "warehouse"   // Kho trung chuyển
  | "receiver"    // Người nhận hàng
  | "admin";      // Admin / Quản trị (chỉ gán thủ công)

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