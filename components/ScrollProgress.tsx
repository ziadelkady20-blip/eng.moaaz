'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress(){
  const [progress,setProgress]=useState(0)
  useEffect(()=>{
    let frame=0
    const update=()=>{
      const root=document.documentElement
      const max=root.scrollHeight-root.clientHeight
      const value=max>0?(root.scrollTop/max)*100:0
      setProgress(Math.min(100,Math.max(0,value)))
      frame=0
    }
    const onScroll=()=>{if(!frame) frame=requestAnimationFrame(update)}
    update()
    window.addEventListener('scroll',onScroll,{passive:true})
    window.addEventListener('resize',onScroll)
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);if(frame)cancelAnimationFrame(frame)}
  },[])
  return <div className="scroll-progress" aria-hidden="true"><span style={{width:`${progress}%`}} /></div>
}
