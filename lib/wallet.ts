import { Prisma } from '@prisma/client'
import { db } from './db'

export async function ensureWallet(studentId:string, tx:Prisma.TransactionClient|typeof db=db){
  const id = `wallet_${studentId}`
  await tx.$executeRaw(Prisma.sql`
    INSERT INTO "Wallet" ("id","studentId") VALUES (${id},${studentId})
    ON CONFLICT ("studentId") DO NOTHING
  `)
  return id
}

export function money(value:unknown){ return Math.round(Number(value)*100)/100 }
