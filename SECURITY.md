# Security Notes

- Passwords are hashed with Node `scrypt`.
- Sessions are HTTP-only, signed cookies.
- Server-side role checks protect privileged APIs.
- Payment webhooks require HMAC signatures and idempotent event IDs.
- YouTube refresh tokens are encrypted at rest with AES-256-GCM.
- Production secrets are required rather than silently generated.
- Security headers and a restrictive CSP are configured in `next.config.ts`.

Before public launch, perform external penetration testing, dependency vulnerability scanning, database backup/restore testing, and load testing. Do not treat static checks as a substitute for those tests.
