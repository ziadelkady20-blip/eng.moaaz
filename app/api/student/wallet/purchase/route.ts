import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'
import { ensureWallet, money } from '@/lib/wallet'
import { randomUUID } from 'crypto'

export async function POST(req:Request){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student) return NextResponse.json({error:'غير مصرح'},{status:401})
    const body=await req.json().catch(()=>null)
    const courseId=typeof body?.courseId==='string'?body.courseId:''
    if(!courseId) return NextResponse.json({error:'الكورس غير محدد'},{status:400})
    const result=await db.$transaction(async tx=>{
      const courseRows=await tx.$queryRaw<any[]>(Prisma.sql`SELECT "id","title","price","gradeId" FROM "Course" WHERE "id"=${courseId} AND "published"=true LIMIT 1`)
      const course=courseRows[0]
      if(!course) throw new Error('الكورس غير متاح')
      if(!user.student!.gradeId||course.gradeId!==user.student!.gradeId) throw new Error('هذا المحتوى غير متاح لصفك')
      const owned=await tx.$queryRaw<any[]>(Prisma.sql`SELECT "id" FROM "ContentPurchase" WHERE "studentId"=${user.student!.id} AND "courseId"=${courseId} LIMIT 1`)
      if(owned.length) return {already:true,balance:null,title:course.title}
      const existingEnrollment=await tx.$queryRaw<any[]>(Prisma.sql`SELECT "courseId" FROM "CourseEnrollment" WHERE "studentId"=${user.student!.id} AND "courseId"=${courseId} LIMIT 1`)
      if(existingEnrollment.length) return {already:true,balance:null,title:course.title}
      const walletId=await ensureWallet(user.student!.id,tx)
      const walletRows=await tx.$queryRaw<any[]>(Prisma.sql`SELECT "balance" FROM "Wallet" WHERE "id"=${walletId} FOR UPDATE`)
      const balance=money(walletRows[0]?.balance||0)
      const price=money(course.price)
      if(balance<price) throw new Error(`رصيد المحفظة غير كافٍ. المطلوب ${price} ج.م والمتاح ${balance} ج.م`)
      const newBalance=money(balance-price)
      const transactionId=randomUUID()
      const purchaseId=randomUUID()
      await tx.$executeRaw(Prisma.sql`UPDATE "Wallet" SET "balance"=${newBalance},"updatedAt"=CURRENT_TIMESTAMP WHERE "id"=${walletId}`)
      await tx.$executeRaw(Prisma.sql`INSERT INTO "WalletTransaction" ("id","walletId","type","amount","balanceAfter","description","reference") VALUES (${transactionId},${walletId},'PURCHASE',${-price},${newBalance},${`شراء كورس: ${course.title}`},${`purchase_${purchaseId}`})`)
      await tx.$executeRaw(Prisma.sql`INSERT INTO "ContentPurchase" ("id","studentId","courseId","price","walletTransactionId") VALUES (${purchaseId},${user.student!.id},${courseId},${price},${transactionId})`)
      await tx.$executeRaw(Prisma.sql`INSERT INTO "CourseEnrollment" ("studentId","courseId") VALUES (${user.student!.id},${courseId}) ON CONFLICT ("studentId","courseId") DO NOTHING`)
      await tx.$executeRaw(Prisma.sql`INSERT INTO "Notification" ("id","userId","title","body") VALUES (${randomUUID()},${user.id},'تم شراء الكورس','تم خصم ${price} ج.م وفتح كورس ${course.title} على حسابك بشكل دائم.')`)
      return {already:false,balance:newBalance,title:course.title}
    })
    return NextResponse.json({success:true,...result,message:result.already?'الكورس مفتوح بالفعل على حسابك.':'تم شراء الكورس وفتح المحتوى بشكل دائم.'})
  }catch(e){ const message=e instanceof Error?e.message:'تعذر تنفيذ عملية الشراء'; return NextResponse.json({error:message},{status:400}) }
}
