import {google} from 'googleapis'

export function getYoutubeOAuthClient(){
  const clientId=process.env.GOOGLE_YOUTUBE_CLIENT_ID
  const clientSecret=process.env.GOOGLE_YOUTUBE_CLIENT_SECRET
  const redirectUri=process.env.GOOGLE_YOUTUBE_REDIRECT_URI
  if(!clientId||!clientSecret||!redirectUri) throw new Error('YOUTUBE_ENV_MISSING')
  return new google.auth.OAuth2(clientId,clientSecret,redirectUri)
}

export const youtubeScopes=['https://www.googleapis.com/auth/youtube.upload','https://www.googleapis.com/auth/youtube.readonly']
