import { NextResponse } from 'next/server'
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { db } from '@/lib/db'
import { requireRole } from '@/lib/auth'

const MAX_PDF_SIZE = 20 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody
    const actor = await requireRole(['ADMIN', 'STUDENT'])

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload || '{}') as { purpose?: string }
        const purpose = payload.purpose

        if (purpose !== 'ASSIGNMENT' && purpose !== 'SUBMISSION') {
          throw new Error('نوع رفع الملف غير صالح')
        }
        if (purpose === 'ASSIGNMENT' && actor.role !== 'ADMIN') {
          throw new Error('غير مصرح')
        }
        if (purpose === 'SUBMISSION' && actor.role !== 'STUDENT') {
          throw new Error('غير مصرح')
        }

        const expectedPrefix = purpose === 'ASSIGNMENT'
          ? 'assignments/source/'
          : 'assignments/submissions/'
        if (!pathname.startsWith(expectedPrefix) || !pathname.toLowerCase().endsWith('.pdf')) {
          throw new Error('مسار الملف غير صالح')
        }

        return {
          access: 'private',
          addRandomSuffix: true,
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: MAX_PDF_SIZE,
          tokenPayload: JSON.stringify({
            ownerId: actor.id,
            purpose,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload || '{}') as { ownerId?: string; purpose?: string }
        if (!payload.ownerId || !payload.purpose) throw new Error('بيانات رفع الملف غير مكتملة')

        await db.uploadedFile.create({
          data: {
            ownerId: payload.ownerId,
            mimeType: blob.contentType || 'application/pdf',
            size: 0,
            storageKey: blob.pathname,
            url: blob.url,
          },
        })
      },
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('BLOB_UPLOAD_ERROR', error)
    return NextResponse.json({ error: 'تعذر تجهيز رفع الملف' }, { status: 400 })
  }
}
