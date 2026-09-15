import { cookies } from 'next/headers'
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { db } from './db'
import type { Role } from '@prisma/client'

const COOKIE = 'taallum_session'
const SECRET = process.env.AUTH_SECRET || (
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE !== 'phase-production-build'
    ? (()=>{ throw new Error('AUTH_SECRET is required in production') })()
    : 'dev-only-secret-change-me'
)
const TTL = 60 * 60 * 24 * 30

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string) {
  if (!stored.includes(':')) return false
  const [salt, expected] = stored.split(':')
  const actual = scryptSync(password, salt, 64)
  const expectedBuf = Buffer.from(expected, 'hex')
  return expectedBuf.length === actual.length && timingSafeEqual(actual, expectedBuf)
}

function sign(value: string) { return createHmac('sha256', SECRET).update(value).digest('base64url') }
export function createSession(userId: string, role: Role) {
  const payload = Buffer.from(JSON.stringify({ sub: userId, role, exp: Math.floor(Date.now()/1000)+TTL })).toString('base64url')
  return `${payload}.${sign(payload)}`
}
export function verifySession(token?: string) {
  if (!token) return null
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return null
  const expected = sign(payload)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a,b)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as {sub:string;role:Role;exp:number}
    if (data.exp < Math.floor(Date.now()/1000)) return null
    return data
  } catch { return null }
}

export async function setSession(userId: string, role: Role) {
  const store = await cookies()
  store.set(COOKIE, createSession(userId, role), { httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'lax', path:'/', maxAge:TTL })
}
export async function clearSession() { (await cookies()).delete(COOKIE) }
export async function getCurrentUser() {
  const session = verifySession((await cookies()).get(COOKIE)?.value)
  if (!session) return null
  return db.user.findUnique({ where:{id:session.sub}, include:{student:true,parent:true,teacher:true} })
}
export async function requireRole(roles: Role[]) {
  const user = await getCurrentUser()
  if (!user || !roles.includes(user.role)) throw new Error('UNAUTHORIZED')
  return user
}
