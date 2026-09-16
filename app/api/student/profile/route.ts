import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'
import {z} from 'zod'

const schema=z.object({name:z.string().trim().min(2).max(80),guardianPhone:z.string().trim().max(20).optional()})

export async function GET(){
  try{
    const user=await requireRole(['STUDENT'])
    const fresh=await db.user.findUnique({where:{id:user.id},include:{student:{include:{grade:true,school:true,governorate:true}}}})
    return NextResponse.json({user:{id:fresh?.id,name:fresh?.name,phone:fresh?.phone,role:fresh?.role},student:fresh?.student})
  }catch(e){
    console.error('STUDENT_PROFILE_GET_ERROR',e)
    return NextResponse.json({error:'غير مصرح'},{status:401})
  }
}

export async function PATCH(req:Request){
  try{
    const user=await requireRole(['STUDENT'])
    if(!user.student)return NextResponse.json({error:'الحساب غير مكتمل'},{status:400})
    const body=schema.parse(await req.json())
    const updated=await db.$transaction([
      db.user.update({where:{id:user.id},data:{name:body.name}}),
      db.student.update({where:{id:user.student.id},data:{guardianPhone:body.guardianPhone||null}}),
    ])
    return NextResponse.json({ok:true,user:updated[0]})
  }catch(e){
    if(e instanceof z.ZodError)return NextResponse.json({error:'البيانات غير صحيحة'},{status:400})
    console.error('STUDENT_PROFILE_PATCH_ERROR',e)
    return NextResponse.json({error:'تعذر حفظ الملف الشخصي'},{status:500})
  }
}
