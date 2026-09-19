'use client'
import AdminShell from '@/components/AdminShell'
import {useEffect,useMemo,useState} from 'react'
import {BookOpen,CheckCircle2,ChevronDown,ClipboardCheck,Image as ImageIcon,Layers3,Link2,PlayCircle,Plus,RefreshCw,Trash2,Upload,Video,CalendarDays,LockKeyhole} from 'lucide-react'

const input='w-full rounded-2xl border border-[#e6e1ee] bg-[#fcfbfe] px-4 py-3.5 text-sm font-semibold outline-none transition focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary-soft)]'
const primary='inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(109,47,163,0.22)] transition hover:-translate-y-0.5 hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-50'
const secondary='inline-flex items-center justify-center gap-2 rounded-2xl border border-[#e5dfed] bg-white px-5 py-3.5 text-sm font-black text-[var(--ink)] transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] disabled:cursor-not-allowed disabled:opacity-50'
const panel='rounded-3xl border border-[var(--line)] bg-white shadow-[0_12px_40px_rgba(36,33,58,0.06)]'

function nextWeekLocal(){
  const d=new Date(Date.now()+7*24*60*60*1000)
  const pad=(n:number)=>String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminCourses(){
 const [data,setData]=useState<any>({courses:[]})
 const [meta,setMeta]=useState<any>({grades:[],lessons:[]})
 const [form,setForm]=useState<any>({title:'',description:'',coverUrl:'',price:0,gradeId:'',published:true})
 const [editing,setEditing]=useState<any>(null)
 const [editingModule,setEditingModule]=useState<any>(null)
 const [editingLesson,setEditingLesson]=useState<any>(null)
 const [assignmentForm,setAssignmentForm]=useState<any>({lessonId:'',title:'',description:'',dueAt:nextWeekLocal()})
 const [editingAssignment,setEditingAssignment]=useState<any>(null)
 const [video,setVideo]=useState({lessonId:'',youtubeUrl:''})
 const [upload,setUpload]=useState({lessonId:'',title:'',description:'',privacy:'unlisted'})
 const [file,setFile]=useState<File|null>(null)
 const [uploading,setUploading]=useState(false)
 const [message,setMessage]=useState('')
 const [error,setError]=useState('')
 const [moduleForm,setModuleForm]=useState({courseId:'',title:''})
 const [lessonForm,setLessonForm]=useState({moduleId:'',title:''})
 const [busy,setBusy]=useState(false)
 const [openCourse,setOpenCourse]=useState<string|null>(null)

 const load=async()=>{
  setError('')
  try{
   const [a,b]=await Promise.all([fetch('/api/admin/courses',{cache:'no-store'}),fetch('/api/admin/meta',{cache:'no-store'})])
   const ad=await a.json();const md=await b.json()
   if(!a.ok)throw Error(ad.error);if(!b.ok)throw Error(md.error)
   setData(ad);setMeta({grades:md.grades||[],lessons:md.lessons||[]})
  }catch(e:any){setError(e.message||'تعذر تحميل المحتوى')}
 }
 useEffect(()=>{load()},[])
 const courses=data.courses||[]
 const gradeOptions=useMemo(()=>meta.grades||[],[meta.grades])
 const selectedCourse=useMemo(()=>courses.find((c:any)=>c.id===moduleForm.courseId),[courses,moduleForm.courseId])
 const modules=selectedCourse?.modules||[]
 const selectedModule=useMemo(()=>modules.find((m:any)=>m.id===lessonForm.moduleId),[modules,lessonForm.moduleId])
 const lessonOptions=meta.lessons||[]

 async function createCourse(e:any){
  e.preventDefault();setError('');setMessage('')
  const r=await fetch('/api/admin/courses',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
  const d=await r.json();if(!r.ok)return setError(d.error)
  setForm({title:'',description:'',coverUrl:'',price:0,gradeId:'',published:true});setMessage('تم إنشاء الكورس بنجاح');await load()
 }
 async function saveCourseEdit(e:any){
  e.preventDefault();setBusy(true);setError('');setMessage('')
  try{
   const r=await fetch('/api/admin/courses',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:editing.id,title:editing.title,description:editing.description||'',coverUrl:editing.coverUrl||'',price:editing.price,gradeId:editing.gradeId,published:editing.published})})
   const d=await r.json();if(!r.ok)throw Error(d.error)
   setMessage('تم تعديل الكورس بنجاح');setEditing(null);await load()
  }catch(e:any){setError(e.message||'تعذر تعديل الكورس')}finally{setBusy(false)}
 }
 async function editItem(url:string,body:any,kind:string){
  setBusy(true);setError('');setMessage('')
  try{
   const r=await fetch(url,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
   const d=await r.json();if(!r.ok)throw Error(d.error)
   setMessage('تم تعديل '+kind+' بنجاح');setEditingModule(null);setEditingLesson(null);await load()
  }catch(e:any){setError(e.message||('تعذر تعديل '+kind))}finally{setBusy(false)}
 }
 async function createModule(e:any){
  e.preventDefault();setBusy(true);setError('');setMessage('')
  try{const r=await fetch('/api/admin/modules',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(moduleForm)});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage('تمت إضافة الوحدة بنجاح');setModuleForm({...moduleForm,title:''});await load()}catch(e:any){setError(e.message)}finally{setBusy(false)}
 }
 async function createLesson(e:any){
  e.preventDefault();setBusy(true);setError('');setMessage('')
  try{const r=await fetch('/api/admin/lessons',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lessonForm)});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage('تمت إضافة الدرس بنجاح');setLessonForm({...lessonForm,title:''});await load()}catch(e:any){setError(e.message)}finally{setBusy(false)}
 }
 async function saveAssignment(e:any){
  e.preventDefault();setBusy(true);setError('');setMessage('')
  try{
   const url=editingAssignment?'/api/admin/assignments/'+editingAssignment.id:'/api/admin/assignments'
   const method=editingAssignment?'PATCH':'POST'
   const r=await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(assignmentForm)})
   const d=await r.json();if(!r.ok)throw Error(d.error)
   setMessage(editingAssignment?'تم تعديل الواجب بنجاح':'تمت إضافة الواجب بنجاح')
   setEditingAssignment(null);setAssignmentForm({lessonId:assignmentForm.lessonId,title:'',description:'',dueAt:nextWeekLocal()});await load()
  }catch(e:any){setError(e.message||'تعذر حفظ الواجب')}finally{setBusy(false)}
 }
 function startAssignment(lessonId:string,a?:any){
  if(a){
   setEditingAssignment(a)
   setAssignmentForm({lessonId:a.lessonId||lessonId,title:a.title,description:a.description||'',dueAt:new Date(a.dueAt).toISOString().slice(0,16)})
  }else{
   setEditingAssignment(null)
   setAssignmentForm({lessonId,title:'',description:'',dueAt:nextWeekLocal()})
  }
  setTimeout(()=>document.getElementById('assignment-manager')?.scrollIntoView({behavior:'smooth',block:'center'}),30)
 }
 async function deleteAssignment(id:string){
  if(!confirm('هل أنت متأكد من حذف الواجب؟ سيتم حذف تسليمات الطلاب المرتبطة به أيضًا.'))return
  setBusy(true);setError('');setMessage('')
  try{const r=await fetch('/api/admin/assignments/'+id,{method:'DELETE'});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage('تم حذف الواجب');await load()}catch(e:any){setError(e.message||'تعذر حذف الواجب')}finally{setBusy(false)}
 }
 async function addVideo(e:any){
  e.preventDefault();setError('');setMessage('')
  const r=await fetch('/api/admin/videos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(video)})
  const d=await r.json();if(!r.ok)return setError(d.error)
  setMessage('تم ربط فيديو YouTube بالدرس');setVideo({lessonId:'',youtubeUrl:''});load()
 }
 async function deleteVideo(lessonId:string){
  if(!confirm('هل تريد فك الفيديو من هذا الدرس؟ لن يتم حذف الفيديو من YouTube.'))return
  setBusy(true);setError('');setMessage('')
  try{const r=await fetch('/api/admin/videos',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({lessonId})});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage('تم فك الفيديو من الدرس');await load()}catch(e:any){setError(e.message||'تعذر فك الفيديو')}finally{setBusy(false)}
 }
 async function deleteItem(url:string,label:string){
  if(!confirm('هل أنت متأكد من حذف '+label+'؟ لا يمكن التراجع عن الحذف.'))return
  setBusy(true);setError('');setMessage('')
  try{const r=await fetch(url,{method:'DELETE'});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage('تم حذف '+label+' بنجاح');if(label==='الكورس')setOpenCourse(null);await load()}catch(e:any){setError(e.message||('تعذر حذف '+label))}finally{setBusy(false)}
 }
 async function uploadVideo(e:any){
  e.preventDefault();setError('');setMessage('');if(!file)return setError('اختر ملف الفيديو');setUploading(true)
  const fd=new FormData();fd.append('lessonId',upload.lessonId);fd.append('title',upload.title);fd.append('description',upload.description);fd.append('privacy',upload.privacy);fd.append('file',file)
  try{const r=await fetch('/api/admin/youtube/upload',{method:'POST',body:fd});const d=await r.json();if(!r.ok)throw Error(d.error);setMessage('تم رفع الفيديو إلى YouTube وربطه بالدرس');setFile(null);setUpload({lessonId:'',title:'',description:'',privacy:'unlisted'});load()}catch(e:any){setError(e.message)}finally{setUploading(false)}
 }

 return <AdminShell><div className="space-y-6 pb-10">
  <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#4d1f78_0%,#6d2fa3_55%,#8d54bd_100%)] p-7 text-white shadow-[0_18px_45px_rgba(109,47,163,0.2)] md:p-8">
   <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl"/>
   <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    <div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold"><BookOpen size={15}/> إدارة المحتوى التعليمي</div><h1 className="text-3xl font-black tracking-tight md:text-4xl">الكورسات والمحتوى</h1><p className="mt-2 max-w-2xl text-sm font-medium leading-7 text-white/80">ابنِ الكورس من الوحدة للدرس والواجب والفيديو، وحدد ترتيب التعلم للطلاب من مكان واحد.</p></div>
    <button onClick={load} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3.5 text-sm font-black text-white ring-1 ring-white/20 transition hover:bg-white/20"><RefreshCw size={17}/> تحديث المحتوى</button>
   </div>
  </section>
  {message&&<div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-bold text-green-700"><CheckCircle2 size={19}/>{message}</div>}
  {error&&<div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">⚠️ {error}</div>}

  {editingModule&&<section className={panel+' p-5'}><div className="flex items-center justify-between"><h3 className="font-black">تعديل الوحدة</h3><button type="button" onClick={()=>setEditingModule(null)} className="rounded-xl bg-[#f6f3f9] px-3 py-2 text-xs font-black">إلغاء</button></div><div className="mt-4 flex gap-2"><input className={input} value={editingModule.title} onChange={e=>setEditingModule({...editingModule,title:e.target.value})}/><button type="button" disabled={busy} onClick={()=>editItem('/api/admin/modules/'+editingModule.id,{title:editingModule.title},'الوحدة')} className={primary}>حفظ</button></div></section>}
  {editingLesson&&<section className={panel+' p-5'}><div className="flex items-center justify-between"><h3 className="font-black">تعديل الدرس</h3><button type="button" onClick={()=>setEditingLesson(null)} className="rounded-xl bg-[#f6f3f9] px-3 py-2 text-xs font-black">إلغاء</button></div><div className="mt-4 flex gap-2"><input className={input} value={editingLesson.title} onChange={e=>setEditingLesson({...editingLesson,title:e.target.value})}/><button type="button" disabled={busy} onClick={()=>editItem('/api/admin/lessons/'+editingLesson.id,{title:editingLesson.title},'الدرس')} className={primary}>حفظ</button></div></section>}

  {editing&&<section className={panel+' p-6'}><div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black">تعديل الكورس</h2><p className="mt-1 text-sm font-bold text-[var(--muted)]">عدّل البيانات والغلاف والصف وحالة النشر.</p></div><button type="button" onClick={()=>setEditing(null)} className="rounded-xl bg-[#f6f3f9] px-4 py-2 text-sm font-black">إلغاء</button></div>
   <form onSubmit={saveCourseEdit} className="grid gap-3 md:grid-cols-2"><input className={input} value={editing.title} onChange={e=>setEditing({...editing,title:e.target.value})} placeholder="اسم الكورس" required/><input className={input} type="number" min="0" value={editing.price} onChange={e=>setEditing({...editing,price:e.target.value})} placeholder="السعر"/><textarea className={input} value={editing.description||''} onChange={e=>setEditing({...editing,description:e.target.value})} placeholder="الوصف"/><div className="md:col-span-2 rounded-2xl border border-[#e9e1f0] bg-[#faf8fc] p-4"><div className="mb-3 flex items-center gap-2 text-sm font-black"><ImageIcon size={17} className="text-[var(--primary)]"/> غلاف الكورس</div><div className="grid gap-3 md:grid-cols-[1fr_180px] md:items-center"><input className={input} type="url" value={editing.coverUrl||''} onChange={e=>setEditing({...editing,coverUrl:e.target.value})} placeholder="رابط صورة الغلاف"/>{editing.coverUrl?<img src={editing.coverUrl} alt="" className="h-28 w-full rounded-2xl border border-[#e6dced] object-cover"/>:<div className="grid h-28 place-items-center rounded-2xl border border-dashed border-[#d8cce1] text-xs font-bold text-[var(--muted)]">معاينة الغلاف</div>}</div></div><select className={input} value={editing.gradeId} onChange={e=>setEditing({...editing,gradeId:e.target.value})}>{gradeOptions.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}</select><label className="flex items-center gap-3 rounded-2xl bg-[#faf8fc] p-4 text-sm font-black"><input type="checkbox" checked={!!editing.published} onChange={e=>setEditing({...editing,published:e.target.checked})}/> الكورس منشور</label><button disabled={busy} className={primary+' md:col-span-2'}>{busy?'جاري الحفظ...':'حفظ التعديلات'}</button></form>
  </section>}

  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
   {[['الكورسات',courses.length],['الوحدات',courses.reduce((n:any,c:any)=>n+(c.modules?.length||0),0)],['الدروس',courses.reduce((n:any,c:any)=>n+(c.modules||[]).reduce((x:any,m:any)=>x+(m.lessons?.length||0),0),0)],['الواجبات',courses.reduce((n:any,c:any)=>n+(c.modules||[]).reduce((x:any,m:any)=>x+(m.lessons||[]).reduce((y:any,l:any)=>y+(l.assignments?.length||0),0),0),0)]].map(([label,value])=><div key={String(label)} className="rounded-2xl border border-[var(--line)] bg-white p-5 shadow-[0_8px_25px_rgba(36,33,58,0.04)]"><div className="text-xs font-black text-[var(--muted)]">{label}</div><div className="mt-2 text-3xl font-black text-[var(--primary)]">{value}</div></div>)}
  </section>

  <section className="grid gap-5 lg:grid-cols-2">
   <form onSubmit={createCourse} className={panel+' p-6'}><div className="mb-5 flex items-start gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Plus size={23}/></div><div><h2 className="text-xl font-black">إضافة كورس جديد</h2><p className="mt-1 text-sm font-medium leading-6 text-[var(--muted)]">أنشئ الكورس وحدد الصف والسعر والغلاف.</p></div></div><div className="space-y-4"><input className={input} placeholder="اسم الكورس" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/><textarea className={input+' min-h-[105px] resize-none'} placeholder="وصف مختصر للكورس" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/><input className={input} type="url" placeholder="رابط صورة الغلاف (اختياري)" value={form.coverUrl} onChange={e=>setForm({...form,coverUrl:e.target.value})}/><div className="grid gap-4 sm:grid-cols-2"><input type="number" min="0" className={input} value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="السعر بالجنيه"/><select className={input} value={form.gradeId} onChange={e=>setForm({...form,gradeId:e.target.value})} required><option value="">اختر الصف</option>{gradeOptions.map((g:any)=><option key={g.id} value={g.id}>{g.name}</option>)}</select></div><button className={primary+' w-full'}><Plus size={18}/> إنشاء الكورس</button></div></form>
   <div className={panel+' p-6'}><div className="mb-5 flex items-start gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Layers3 size={23}/></div><div><h2 className="text-xl font-black">بناء محتوى الكورس</h2><p className="mt-1 text-sm font-medium leading-6 text-[var(--muted)]">أضف الوحدات ثم الدروس بالترتيب.</p></div></div><div className="space-y-4"><form onSubmit={createModule} className="rounded-2xl bg-[#faf8fc] p-4"><label className="mb-2 block text-xs font-black text-[var(--muted)]">الكورس</label><select className={input} value={moduleForm.courseId} onChange={e=>{setModuleForm({...moduleForm,courseId:e.target.value});setLessonForm({moduleId:'',title:''})}} required><option value="">اختر الكورس</option>{courses.map((c:any)=><option key={c.id} value={c.id}>{c.title}</option>)}</select><div className="mt-3 flex gap-2"><input className={input} placeholder="اسم الوحدة — مثال: Unit 1" value={moduleForm.title} onChange={e=>setModuleForm({...moduleForm,title:e.target.value})} required/><button disabled={busy} className={primary}><Plus size={17}/> إضافة</button></div></form><form onSubmit={createLesson} className="rounded-2xl bg-[#faf8fc] p-4"><label className="mb-2 block text-xs font-black text-[var(--muted)]">الوحدة</label><select className={input} value={lessonForm.moduleId} onChange={e=>setLessonForm({...lessonForm,moduleId:e.target.value})} required disabled={!moduleForm.courseId}><option value="">اختر الوحدة</option>{modules.map((m:any)=><option key={m.id} value={m.id}>{m.order}. {m.title}</option>)}</select><div className="mt-3 flex gap-2"><input className={input} placeholder="اسم الدرس" value={lessonForm.title} onChange={e=>setLessonForm({...lessonForm,title:e.target.value})} required/><button disabled={busy||!selectedModule} className={primary}><Plus size={17}/> إضافة</button></div></form></div></div>
  </section>

  <section id="assignment-manager" className={panel+' overflow-hidden'}>
   <div className="border-b border-[var(--line)] bg-[linear-gradient(135deg,#fff,#faf5fe)] p-6 md:p-7"><div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><ClipboardCheck size={23}/></div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-black">{editingAssignment?'تعديل الواجب':'إضافة واجب للدرس'}</h2><span className="rounded-full bg-[#efe4f7] px-3 py-1 text-[11px] font-black text-[var(--primary)]">يُقفل الدرس التالي حتى يتم الحل</span></div><p className="mt-1 text-sm font-medium leading-7 text-[var(--muted)]">اربط الواجب بدرس محدد. عند وجود واجب للدرس، لن يفتح الطالب الدرس التالي إلا بعد تسليم الواجب.</p></div></div></div>
   <form onSubmit={saveAssignment} className="grid gap-4 p-6 md:grid-cols-2 md:p-7"><select className={input} value={assignmentForm.lessonId} onChange={e=>setAssignmentForm({...assignmentForm,lessonId:e.target.value})} required><option value="">اختر الدرس</option>{lessonOptions.map((l:any)=><option key={l.id} value={l.id}>{l.title} — {l.module?.course?.title}</option>)}</select><input className={input} value={assignmentForm.title} onChange={e=>setAssignmentForm({...assignmentForm,title:e.target.value})} placeholder="عنوان الواجب — مثال: واجب المحاضرة الأولى" required/><textarea className={input+' min-h-[120px] resize-none md:col-span-2'} value={assignmentForm.description} onChange={e=>setAssignmentForm({...assignmentForm,description:e.target.value})} placeholder="اكتب المطلوب من الطالب بالتفصيل..."/><div><label className="mb-2 flex items-center gap-2 text-xs font-black text-[var(--muted)]"><CalendarDays size={15}/> موعد التسليم</label><input className={input} type="datetime-local" value={assignmentForm.dueAt} onChange={e=>setAssignmentForm({...assignmentForm,dueAt:e.target.value})} required/></div><div className="flex items-end gap-2"><button disabled={busy} className={primary+' flex-1'}><ClipboardCheck size={17}/>{busy?'جاري الحفظ...':editingAssignment?'حفظ تعديل الواجب':'إضافة الواجب'}</button>{editingAssignment&&<button type="button" onClick={()=>{setEditingAssignment(null);setAssignmentForm({lessonId:'',title:'',description:'',dueAt:nextWeekLocal()})}} className={secondary}>إلغاء</button>}</div></form>
  </section>

  <section className={panel+' overflow-hidden'}>
   <div className="flex flex-col gap-3 border-b border-[var(--line)] p-6 md:flex-row md:items-center md:justify-between md:p-7"><div><h2 className="text-xl font-black">محتوى الكورسات</h2><p className="mt-1 text-sm font-medium text-[var(--muted)]">كل درس يظهر تحته الفيديو والواجبات المرتبطة به.</p></div><div className="rounded-full bg-[var(--primary-soft)] px-4 py-2 text-sm font-black text-[var(--primary)]">{courses.length} كورسات</div></div>
   <div className="divide-y divide-[var(--line)]">{courses.length?courses.map((c:any)=><div key={c.id}>
    <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:p-6"><button type="button" onClick={()=>setOpenCourse(openCourse===c.id?null:c.id)} className="flex min-w-0 flex-1 items-center gap-4 text-right"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><BookOpen size={21}/></div><div className="min-w-0"><div className="truncate text-base font-black md:text-lg">{c.title}</div><div className="mt-1 text-xs font-bold text-[var(--muted)]">{c.grade?.name||'بدون صف'} · {c.modules?.length||0} وحدات · {c._count?.enrollments||0} مشترك</div></div><ChevronDown size={20} className={'mr-auto transition '+(openCourse===c.id?'rotate-180':'')}/></button><div className="flex items-center gap-2"><button type="button" onClick={()=>setEditing({...c})} className="rounded-xl border border-[#e5dfed] bg-white px-3 py-2 text-xs font-black text-[var(--primary)] hover:bg-[var(--primary-soft)]">تعديل</button><span className="rounded-full bg-[#f6f3f9] px-3 py-1.5 text-xs font-black">{c.price} ج.م</span></div></div>
    {openCourse===c.id&&<div className="bg-[#fcfbfe] px-5 pb-6 md:px-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eadff2] bg-white p-3.5"><div><div className="text-sm font-black">إدارة الكورس</div><div className="mt-1 text-xs font-bold text-[var(--muted)]">إضافة وتعديل وحذف الوحدات والدروس والواجبات.</div></div><button type="button" disabled={busy} onClick={()=>deleteItem('/api/admin/courses/'+c.id,'الكورس')} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700"><Trash2 size={15}/> حذف الكورس</button></div>
     {c.modules?.length?<div className="space-y-3">{c.modules.map((m:any)=><div key={m.id} className="rounded-2xl border border-[#e9e3ef] bg-white p-4"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary-soft)] text-xs font-black text-[var(--primary)]">{m.order}</span><span className="font-black">{m.title}</span><span className="mr-auto text-xs font-bold text-[var(--muted)]">{m.lessons?.length||0} دروس</span><button type="button" onClick={()=>setEditingModule({...m})} className="rounded-xl border border-[#e5dfed] px-3 py-2 text-[11px] font-black text-[var(--primary)]">تعديل</button><button type="button" disabled={busy} onClick={()=>deleteItem('/api/admin/modules/'+m.id,'الوحدة')} className="inline-flex items-center gap-1 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-black text-red-700"><Trash2 size={14}/> حذف</button></div>
      {m.lessons?.length?<div className="mt-3 space-y-2">{m.lessons.map((l:any)=><div key={l.id} className="rounded-2xl border border-[#eee9f2] bg-[#faf9fc] p-3.5"><div className="flex flex-wrap items-center gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[var(--primary)] shadow-sm"><PlayCircle size={17}/></div><div className="min-w-0"><div className="text-sm font-black">{l.order}. {l.title}</div><div className="mt-1 text-[11px] font-bold text-[var(--muted)]">{l.video?'فيديو مرتبط':'بدون فيديو'} · {l.assignments?.length||0} واجبات</div></div><div className="mr-auto flex flex-wrap items-center gap-2"><button type="button" onClick={()=>startAssignment(l.id)} className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-3 py-2 text-[11px] font-black text-white"><ClipboardCheck size={14}/> إضافة واجب</button><button type="button" onClick={()=>setEditingLesson({...l})} className="rounded-xl border border-[#e5dfed] bg-white px-3 py-2 text-[11px] font-black text-[var(--primary)]">تعديل</button>{l.video&&<button type="button" disabled={busy} onClick={()=>deleteVideo(l.id)} className="rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-[11px] font-black text-orange-700">فك الفيديو</button>}<button type="button" disabled={busy} onClick={()=>deleteItem('/api/admin/lessons/'+l.id,'الدرس')} className="inline-flex items-center gap-1 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-black text-red-700"><Trash2 size={13}/> حذف</button></div></div>
       {l.assignments?.length>0&&<div className="mt-3 space-y-2 border-t border-[#ebe5ef] pt-3">{l.assignments.map((a:any)=><div key={a.id} className="flex flex-col gap-3 rounded-xl border border-[#e8ddf0] bg-white p-3 md:flex-row md:items-center"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f3eafa] text-[var(--primary)]"><ClipboardCheck size={16}/></div><div className="min-w-0 flex-1"><div className="text-sm font-black">{a.title}</div><div className="mt-1 text-[11px] font-bold text-[var(--muted)]">التسليم: {new Date(a.dueAt).toLocaleString('ar-EG')} · هذا الواجب يفتح الدرس التالي بعد تسليمه</div></div><div className="flex gap-2"><button type="button" onClick={()=>startAssignment(l.id,a)} className="rounded-lg border border-[#e5dfed] px-3 py-2 text-[11px] font-black text-[var(--primary)]">تعديل</button><button type="button" disabled={busy} onClick={()=>deleteAssignment(a.id)} className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-[11px] font-black text-red-700">حذف</button></div></div>)}</div>}</div>)}</div>:<p className="mt-3 text-xs font-bold text-[var(--muted)]">لا توجد دروس داخل هذه الوحدة بعد.</p>}</div>)}</div>:<div className="rounded-2xl border border-dashed border-[#dcd4e5] p-8 text-center text-sm font-bold text-[var(--muted)]">لا توجد وحدات داخل الكورس بعد.</div>}
    </div>}
   </div>):<div className="p-12 text-center"><BookOpen className="mx-auto mb-3 text-[#c7bfd0]" size={32}/><p className="font-black">لا توجد كورسات بعد</p></div>}</div>
  </section>

  <section className="grid gap-5 lg:grid-cols-2">
   <form onSubmit={addVideo} className={panel+' p-6'}><div className="mb-5 flex items-start gap-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Link2 size={21}/></div><div><h2 className="text-lg font-black">ربط فيديو موجود</h2><p className="mt-1 text-xs font-medium leading-6 text-[var(--muted)]">اربط فيديو YouTube بالدرس.</p></div></div><div className="space-y-3"><select className={input} value={video.lessonId} onChange={e=>setVideo({...video,lessonId:e.target.value})} required><option value="">اختر الدرس</option>{lessonOptions.map((l:any)=><option key={l.id} value={l.id}>{l.title} — {l.module?.course?.title}</option>)}</select><input className={input} type="url" placeholder="https://www.youtube.com/watch?v=..." value={video.youtubeUrl} onChange={e=>setVideo({...video,youtubeUrl:e.target.value})} required/><button className={secondary+' w-full'}><Link2 size={17}/> حفظ وربط الفيديو</button></div></form>
   <form onSubmit={uploadVideo} className={panel+' p-6'}><div className="mb-5 flex items-start gap-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]"><Upload size={21}/></div><div><h2 className="text-lg font-black">رفع فيديو إلى YouTube</h2><p className="mt-1 text-xs font-medium text-[var(--muted)]">ارفع الملف واربطه بالدرس.</p></div></div><div className="space-y-3"><select className={input} value={upload.lessonId} onChange={e=>setUpload({...upload,lessonId:e.target.value})} required><option value="">اختر الدرس</option>{lessonOptions.map((l:any)=><option key={l.id} value={l.id}>{l.title} — {l.module?.course?.title}</option>)}</select><input className={input} placeholder="عنوان الفيديو" value={upload.title} onChange={e=>setUpload({...upload,title:e.target.value})} required/><textarea className={input+' min-h-[90px] resize-none'} placeholder="وصف الفيديو" value={upload.description} onChange={e=>setUpload({...upload,description:e.target.value})}/><select className={input} value={upload.privacy} onChange={e=>setUpload({...upload,privacy:e.target.value})}><option value="unlisted">Unlisted</option><option value="private">Private</option><option value="public">Public</option></select><label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#d9d0e1] bg-[#fcfbfe] p-4 text-sm font-bold"><Video size={18} className="text-[var(--primary)]"/><span className="flex-1 truncate">{file?.name||'اختر ملف الفيديو'}</span><input type="file" accept="video/*" className="hidden" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><button disabled={uploading} className={primary+' w-full'}>{uploading?'جاري الرفع...':<><Upload size={17}/> رفع وربط الفيديو</>}</button></div></form>
  </section>
 </div></AdminShell>
}
