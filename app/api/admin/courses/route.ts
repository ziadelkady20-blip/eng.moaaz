import {NextResponse} from 'next/server'; import {db} from '@/lib/db'; import {requireRole} from '@/lib/auth'; import {z} from 'zod'
const schema=z.object({title:z.string().trim().min(2),description:z.string().optional(),coverUrl:z.string().url().optional().or(z.literal('')),price:z.coerce.number().min(0),gradeId:z.string(),published:z.boolean().optional()})
export async function GET(){try{await requireRole(['ADMIN']); const courses=await db.course.findMany({include:{grade:true,subject:true,teacher:{include:{user:true}},modules:{include:{lessons:{include:{video:true}}},orderBy:{order:'asc'}},_count:{select:{enrollments:true,orders:true}}},orderBy:{createdAt:'desc'}}); return NextResponse.json({courses})}catch{return NextResponse.json({error:'غير مصرح'},{status:401})}}
export async function POST(req:Request){try{await requireRole(['ADMIN']); const data=schema.parse(await req.json()); const [subject,teacher]=await Promise.all([db.subject.findFirst({orderBy:{name:'asc'}}),db.teacher.findFirst({orderBy:{user:{name:'asc'}}})]); if(!subject||!teacher)return NextResponse.json({error:'لا توجد مادة أو مدرس مضبوطين للمنصة'},{status:400}); const course=await db.course.create({data:{title:data.title,description:data.description||null,price:data.price,gradeId:data.gradeId,published:data.published??false,subjectId:subject.id,teacherId:teacher.id}}); if(data.coverUrl!==undefined){await db.$executeRaw(Prisma.sql`UPDATE "Course" SET "coverUrl"=${data.coverUrl||null} WHERE "id"=${course.id}`)} return NextResponse.json({course},{status:201})}catch(e){return NextResponse.json({error:e instanceof z.ZodError?'بيانات الكورس غير مكتملة':'تعذر إنشاء الكورس'},{status:400})}}

// Keep course creation aligned with the single-subject, single-teacher platform setup.
export async function PATCH(req:Request){
  try{
    await requireRole(['ADMIN'])
    const body=await req.json()
    const id=typeof body?.id==='string'?body.id:''
    if(!id) return NextResponse.json({error:'الكورس غير محدد'},{status:400})
    const data=schema.partial().parse(body)
    const existing=await db.course.findUnique({where:{id}})
    if(!existing) return NextResponse.json({error:'الكورس غير موجود'},{status:404})
    const course=await db.course.update({where:{id},data:{title:data.title,description:data.description,price:data.price,gradeId:data.gradeId,published:data.published}}); if(data.coverUrl!==undefined){await db.$executeRaw(Prisma.sql`UPDATE "Course" SET "coverUrl"=${data.coverUrl||null} WHERE "id"=${id}`)}
    return NextResponse.json({course})
  }catch(e){
    return NextResponse.json({error:e instanceof z.ZodError?'بيانات التعديل غير صحيحة':'تعذر تعديل الكورس'},{status:400})
  }
}
