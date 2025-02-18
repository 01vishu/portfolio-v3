import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const id = searchParams.get('id')

  if (!type || !id) {
    return new Response('Missing type or id', { status: 400 })
  }

  // Enable Draft Mode
  draftMode().enable()

  // Redirect to the path based on the type
  redirect(`/${type === 'post' ? 'blog' : type}/${id}`)
}
