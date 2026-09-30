'use client'

import {useMemo} from 'react'

type SecureYoutubePlayerProps = {
  videoId: string
  title: string
  viewerName?: string
  viewerPhone?: string
}

function normalizeYoutubeId(value:string){
  const raw=(value||'').trim()
  if(!raw)return ''
  if(/^[A-Za-z0-9_-]{6,}$/.test(raw))return raw
  try{
    const url=new URL(raw)
    if(url.hostname.includes('youtu.be'))return url.pathname.split('/').filter(Boolean)[0]||''
    if(url.hostname.includes('youtube.com')){
      const queryId=url.searchParams.get('v')
      if(queryId)return queryId
      const parts=url.pathname.split('/').filter(Boolean)
      const embedIndex=parts.indexOf('embed')
      if(embedIndex>=0)return parts[embedIndex+1]||''
      const shortsIndex=parts.indexOf('shorts')
      if(shortsIndex>=0)return parts[shortsIndex+1]||''
    }
  }catch{}
  return raw
}

export default function SecureYoutubePlayer({videoId,title,viewerName,viewerPhone}:SecureYoutubePlayerProps){
  const normalizedId=useMemo(()=>normalizeYoutubeId(videoId),[videoId])
  const src=useMemo(()=>{
    const base='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(normalizedId)
    if(typeof window==='undefined') return base+'?enablejsapi=1&rel=0&playsinline=1'
    const params=new URLSearchParams({enablejsapi:'1',origin:window.location.origin,rel:'0',playsinline:'1'})
    return base+'?'+params.toString()
  },[normalizedId])

  if(!normalizedId)return <div className='grid aspect-video place-items-center bg-black text-sm font-bold text-white/60'>تعذر تحديد فيديو YouTube.</div>

  return <div className='space-y-3'>
    <div className='flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800'>
      <span>🔒 محتوى تعليمي مرخّص — يمنع إعادة توزيع الفيديو.</span>
      {(viewerName||viewerPhone)&&<span>مخصص لـ {viewerName||'الطالب'}{viewerPhone?' • '+viewerPhone:''}</span>}
    </div>
    <div className='aspect-video bg-black'>
      <iframe
        className='h-full w-full'
        src={src}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        referrerPolicy='strict-origin-when-cross-origin'
      />
    </div>
  </div>
}
