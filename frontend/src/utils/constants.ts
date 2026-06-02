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

// ==================== SINGLE SOURCE OF TRUTH FOR DISPLAY (tối ưu Register + toàn app) ====================
// Chỉ 4 vai trò dưới đây cho phép người dùng tự chọn tại trang Đăng ký vai trò.
// guest = mặc định (bị khóa), admin = chỉ gán qua VITE_ADMIN_USERNAMES hardcode.
export interface RoleMeta {
  key: AppRole;
  label: string;
  icon: string;
  desc: string;
}

export const ROLE_INFO: Record<AppRole, RoleMeta> = {
  guest:     { key: 'guest',     label: 'Người mới',        icon: '👤', desc: 'Chưa chọn vai trò - cần đăng ký để sử dụng đầy đủ' },
  sender:    { key: 'sender',    label: 'Người gửi hàng',   icon: '📦', desc: 'Tạo đơn gửi hàng & thanh toán Pi' },
  driver:    { key: 'driver',    label: 'Tài xế',           icon: '🏍️', desc: 'Nhận đơn & giao hàng' },
  warehouse: { key: 'warehouse', label: 'Kho trung chuyển', icon: '🏬', desc: 'Quản lý nhập - xuất kho, trung chuyển' },
  receiver:  { key: 'receiver',  label: 'Người nhận hàng',  icon: '📥', desc: 'Nhận hàng & xác nhận giao hàng' },
  admin:     { key: 'admin',     label: 'Admin',            icon: '🛡️', desc: 'Quản trị hệ thống (chỉ định danh qua username)' },
};

// 4 vai trò cho phép tự đăng ký (loại guest + admin)
export const REGISTRABLE_ROLES: AppRole[] = ['sender', 'driver', 'warehouse', 'receiver'];

export const getRoleLabel = (role: AppRole | null | undefined): string => {
  if (!role || role === 'guest') return 'Người mới (chưa chọn vai trò)';
  return ROLE_INFO[role]?.label || role;
};

export const getRoleInfo = (role: AppRole | null | undefined): RoleMeta => {
  if (!role) return ROLE_INFO.guest;
  return ROLE_INFO[role] || ROLE_INFO.guest;
};

export default {
  ROLES,
};