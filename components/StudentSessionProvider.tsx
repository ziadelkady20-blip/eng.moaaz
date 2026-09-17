'use client'

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'

type StudentUser = { id:string; name:string; role:string; phone?:string }
type SessionContext = { user:StudentUser|null; ready:boolean; refresh:()=>Promise<void>; logout:()=>Promise<void> }

const Ctx=createContext<SessionContext>({user:null,ready:false,refresh:async()=>{},logout:async()=>{}})

export default function StudentSessionProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<StudentUser|null>(null)
  const [ready,setReady]=useState(false)
  const router=useRouter()
  const pathname=usePathname()

  const load=async()=>{
    try{
      const cached=sessionStorage.getItem('eng-moaaz-student-session')
      if(cached){const parsed=JSON.parse(cached);if(parsed?.role==='STUDENT')setUser(parsed)}
    }catch{}
    try{
      const r=await fetch('/api/auth/me',{cache:'no-store'})
      if(!r.ok) throw new Error('UNAUTHORIZED')
      const d=await r.json()
      if(d?.user?.role!=='STUDENT') throw new Error('UNAUTHORIZED')
      setUser(d.user)
      try{sessionStorage.setItem('eng-moaaz-student-session',JSON.stringify(d.user))}catch{}
    }catch{
      setUser(null)
    }finally{setReady(true)}
  }

  useEffect(()=>{load()},[])

  useEffect(()=>{
    if(pathname?.startsWith('/student') && ready && !user) router.replace('/login')
  },[pathname,ready,user,router])

  const value=useMemo(()=>({
    user,ready,refresh:load,
    logout:async()=>{await fetch('/api/auth/logout',{method:'POST'});setUser(null);try{sessionStorage.removeItem('eng-moaaz-student-session')}catch{};router.replace('/login')}
  }),[user,ready,router])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStudentSession=()=>useContext(Ctx)
