import {NextResponse} from 'next/server'
import {db} from '@/lib/db'
import {requireRole} from '@/lib/auth'
import {z} from 'zod'
import {google} from 'googleapis'
import {getYoutubeOAuthClient} from '@/lib/youtube'
import {decryptSecretOrPlain} from '@/lib/secretbox'

function extractYoutubeId(input:string){
  try{
    const u=new URL(input.trim())
    const host=u.hostname.toLowerCase().replace(/^www\./,'')
    let id:string|null=null
    if(host==='youtu.be') id=u.pathname.split('/').filter(Boolean)[0]||null
    else if(['youtube.com','m.youtube.com','music.youtube.com'].includes(host)){
      if(u.pathname==='/watch') id=u.searchParams.get('v')
      else {const parts=u.pathname.split('/').filter(Boolean); if(['shorts','embed','live','v'].includes(parts[0]||'')) id=parts[1]||null}
    }
    return id&&/^[A-Za-z0-9_-]{11}$/.test(id)?id:null
  }catch{return null}
}

const schema=z.object({lessonId:z.string().min(1),youtubeUrl:z.string().url(),durationSec:z.coerce.number().int().min(0).optional()})

export async function POST(req:Request){
  try{
    const admin=await requireRole(['ADMIN'])
    const data=schema.parse(await req.json())
    const id=extractYoutubeId(data.youtubeUrl)
    if(!id)return NextResponse.json({error:'رابط YouTube غير صالح. استخدم رابط فيديو مباشر مثل youtube.com/watch أو youtu.be أو Shorts.'},{status:400})
    const lesson=await db.lesson.findUnique({where:{id:data.lessonId},select:{id:true,videoId:true}})
    if(!lesson)return NextResponse.json({error:'الدرس غير موجود'},{status:404})
    const connection=await db.youtubeConnection.findUnique({where:{userId:admin.id}})
    if(!connection)return NextResponse.json({error:'اربط قناة YouTube أولًا من الإعدادات حتى نتحقق من قابلية تشغيل الفيديو.'},{status:400})
    const client=getYoutubeOAuthClient()
    client.setCredentials({refresh_token:decryptSecretOrPlain(connection.refreshToken)})
    const youtube=google.youtube({version:'v3',auth:client})
    const check=await youtube.videos.list({part:['status'],id:[id]})
    const remote=check.data.items?.[0]
    if(!remote)return NextResponse.json({error:'فيديو YouTube غير موجود أو غير متاح.'},{status:404})
    if(remote.status?.embeddable===false)return NextResponse.json({error:'الفيديو لا يسمح بالتضمين. فعّل Allow embedding من إعدادات الفيديو في YouTube.'},{status:400})
    if(remote.status?.privacyStatus==='private')return NextResponse.json({error:'الفيديو Private ولن يعمل للطلاب داخل المشغل المضمّن. استخدم Unlisted.'},{status:400})
    const normalizedUrl=`https://www.youtube.com/watch?v=${id}`
    const video=lesson.videoId
      ? await db.video.update({where:{id:lesson.videoId},data:{provider:'YOUTUBE',providerAssetId:id,youtubeUrl:normalizedUrl,durationSec:data.durationSec}})
      : await db.video.create({data:{provider:'YOUTUBE',providerAssetId:id,youtubeUrl:normalizedUrl,durationSec:data.durationSec}})
    if(!lesson.videoId) await db.lesson.update({where:{id:lesson.id},data:{videoId:video.id}})
    return NextResponse.json({video,privacyStatus:remote.status?.privacyStatus||null},{status:201})
  }catch(e){
    console.error('ADMIN_YOUTUBE_LINK_ERROR',e)
    return NextResponse.json({error:'تعذر ربط فيديو YouTube بالدرس'},{status:400})
  }
}
