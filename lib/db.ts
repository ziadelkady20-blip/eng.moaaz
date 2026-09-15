import { PrismaClient } from '@prisma/client'
import { assertProductionEnv } from './env'
assertProductionEnv()

declare global { var prisma: PrismaClient | undefined }
export const db = globalThis.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
