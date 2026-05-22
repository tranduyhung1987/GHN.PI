// src/utils/constants.ts

export const ROLES = {
  ADMIN: 'admin',
  WAREHOUSE: 'warehouse',
  DRIVER: 'driver',
  SENDER: 'sender',
  RECEIVER: 'receiver',
  GUEST: 'guest'
} as const; // 'as const' giúp TypeScript hiểu đây là các giá trị cố định không đổi

export type RoleType = typeof ROLES[keyof typeof ROLES];