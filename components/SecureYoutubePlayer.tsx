'use client'

import {useMemo} from 'react'

type SecureYoutubePlayerProps = {
  videoId: string
  title: string
  viewerName?: string
  viewerPhone?: string
}

export default function SecureYoutubePlayer({videoId,title,viewerName,viewerPhone}:SecureYoutubePlayerProps){
  const src=useMemo(()=>{
    const base='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(videoId)
    if(typeof window==='undefined') return base+'?enablejsapi=1&rel=0&playsinline=1'
    const params=new URLSearchParams({enablejsapi:'1',origin:window.location.origin,rel:'0',playsinline:'1'})
    return base+'?'+params.toString()
  },[videoId])

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