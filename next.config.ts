import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  reactStrictMode:true,
  poweredByHeader:false,
  images:{remotePatterns:[]},
  async headers(){return [{source:'/:path*',headers:[
    {key:'X-Content-Type-Options',value:'nosniff'},
    {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
    {key:'X-Frame-Options',value:'SAMEORIGIN'},
    {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
    {key:'Content-Security-Policy',value:"default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net; frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com; connect-src 'self' https://www.googleapis.com https://oauth2.googleapis.com https://www.google-analytics.com https://analytics.google.com https://www.facebook.com; font-src 'self' data: https:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"}
  ]}]}
}
export default nextConfig
