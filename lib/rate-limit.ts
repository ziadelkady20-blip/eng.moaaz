type Entry={count:number; reset:number}
const store=new Map<string,Entry>()
export function rateLimit(key:string,limit=8,windowMs=60_000){
  const now=Date.now(); const current=store.get(key)
  if(!current||current.reset<=now){store.set(key,{count:1,reset:now+windowMs});return {ok:true,remaining:limit-1}}
  current.count+=1
  return {ok:current.count<=limit,remaining:Math.max(0,limit-current.count),reset:current.reset}
}
