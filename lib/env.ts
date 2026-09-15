const required = ['DATABASE_URL','AUTH_SECRET','PAYMENT_WEBHOOK_SECRET','TOKEN_ENCRYPTION_KEY'] as const

export function assertProductionEnv(){
  if(process.env.NODE_ENV !== 'production') return
  if(process.env.NEXT_PHASE === 'phase-production-build') return

  const missing = required.filter(k => !process.env[k])
  if(missing.length) throw new Error(`Missing production environment variables: ${missing.join(', ')}`)
}
