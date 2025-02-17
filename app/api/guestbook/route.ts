import { auth } from '~/app/api/auth/[...nextauth]/route'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { type GuestbookDto, GuestbookHashids } from '~/db/dto/guestbook.dto'
import { fetchGuestbookMessages } from '~/db/queries/guestbook'
import { guestbook } from '~/db/schema'
import NewGuestbookEmail from '~/emails/NewGuestbook'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { resend } from '~/lib/mail'
import { ratelimit } from '~/lib/redis'

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ''}`
}

export async function GET(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(getKey(req.ip ?? ''))
    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
      })
    }

    return NextResponse.json(await fetchGuestbookMessages())
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

const SignGuestbookSchema = z.object({
  message: z.string().min(1).max(600),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(session.user.email!))
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  try {
    const data = await req.json()
    const { message } = SignGuestbookSchema.parse(data)

    const guestbookData = {
      userId: session.user.email!, // Using email as userId since it's unique
      message,
      userInfo: {
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ')[1] || '',
        imageUrl: session.user.image || '',
      },
    }

    if (env.NODE_ENV === 'production' && env.SITE_NOTIFICATION_EMAIL_TO) {
      await resend.emails.send({
        from: emailConfig.from,
        to: env.SITE_NOTIFICATION_EMAIL_TO,
        subject: '👋 New Guestbook Message',
        react: NewGuestbookEmail({
          link: url(`/guestbook`).href,
          userFirstName: guestbookData.userInfo.firstName,
          userLastName: guestbookData.userInfo.lastName,
          userImageUrl: guestbookData.userInfo.imageUrl,
          commentContent: message,
        }),
      })
    }

    const [newGuestbook] = await db
      .insert(guestbook)
      .values(guestbookData)
      .returning({
        newId: guestbook.id,
      })

    return NextResponse.json(
      {
        ...guestbookData,
        id: GuestbookHashids.encode(newGuestbook.newId),
        createdAt: new Date(),
      } satisfies GuestbookDto,
      {
        status: 201,
      }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}
