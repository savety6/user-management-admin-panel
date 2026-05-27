export type UserRole = 'admin' | 'editor' | 'viewer'
export type UserStatus = 'active' | 'pending' | 'suspended'

export function getUserRole(userId: number): UserRole {
  if (userId <= 2) return 'admin'
  if (userId <= 5) return 'editor'
  return 'viewer'
}

export function getUserStatus(userId: number): UserStatus {
  if (userId === 9) return 'pending'
  if (userId === 10) return 'suspended'
  return 'active'
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(' ')
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  }
}

export function formatUserId(id: number): string {
  return `#${String(id).padStart(4, '0')}`
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
}

const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
}

export const getRoleLabel = (role: UserRole) => ROLE_LABELS[role]
export const getStatusLabel = (status: UserStatus) => STATUS_LABELS[status]
