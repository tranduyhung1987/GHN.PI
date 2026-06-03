import { describe, it, expect } from 'vitest'
import { getRoleLabel, REGISTRABLE_ROLES } from '../utils/constants'

describe('constants roles', () => {
  it('returns correct labels', () => {
    expect(getRoleLabel('sender')).toBe('Người gửi hàng')
    expect(getRoleLabel(null)).toBe('Người mới (chưa chọn vai trò)')
  })

  it('has 4 registrable roles', () => {
    expect(REGISTRABLE_ROLES.length).toBe(4)
    expect(REGISTRABLE_ROLES).toContain('driver')
  })
})
