import { getCurrentUser } from '@/lib/auth'

export const SUPER_ADMIN_PHONE_ENV = 'SUPER_ADMIN_PHONE'

export function isSuperAdmin(user: { role?: string; phone?: string } | null | undefined) {
  if (!user || user.role !== 'ADMIN') return false
  const configured = process.env[SUPER_ADMIN_PHONE_ENV]
  if (configured) return user.phone === configured
  return process.env.NODE_ENV !== 'production' && user.phone === '01200000000'
}

export async function requireAdminAccess() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') throw new Error('UNAUTHORIZED')
  return user
}

export async function requireSuperAdmin() {
  const user = await requireAdminAccess()
  if (!isSuperAdmin(user)) throw new Error('SUPER_ADMIN_REQUIRED')
  return user
}
