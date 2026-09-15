import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'

const KEY_ENV = 'TOKEN_ENCRYPTION_KEY'

function key() {
  const raw = process.env[KEY_ENV]
  if (!raw) throw new Error(`${KEY_ENV} is required in production`)
  return createHash('sha256').update(raw).digest()
}

export function encryptSecret(value: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`
}

export function decryptSecret(payload: string) {
  const [ivRaw, tagRaw, dataRaw] = payload.split('.')
  if (!ivRaw || !tagRaw || !dataRaw) throw new Error('Invalid encrypted secret')
  const decipher = createDecipheriv('aes-256-gcm', key(), Buffer.from(ivRaw, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagRaw, 'base64url'))
  return Buffer.concat([decipher.update(Buffer.from(dataRaw, 'base64url')), decipher.final()]).toString('utf8')
}

export function decryptSecretOrPlain(payload: string) { try { return decryptSecret(payload) } catch { return payload } }
