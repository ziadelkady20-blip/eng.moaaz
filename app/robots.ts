import type { MetadataRoute } from 'next'
export default function robots():MetadataRoute.Robots{return{rules:{userAgent:'*',allow:'/',disallow:['/student/','/parent/','/teacher/','/admin/','/api/','/checkout/']},sitemap:'/sitemap.xml'}}
