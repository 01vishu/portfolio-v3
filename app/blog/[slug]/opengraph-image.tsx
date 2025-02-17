import { ImageResponse } from 'next/og'
import { client } from '~/sanity/lib/client'

export const runtime = 'edge'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      "author": author->name,
      publishedAt
    }
  `,
    { slug: params.slug }
  )

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom, #000212, #111)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          padding: '60px',
        }}
      >
        <h1
          style={{
            fontSize: '60px',
            color: 'white',
            marginBottom: '20px',
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#888',
          }}
        >
          <span style={{ fontSize: '24px' }}>{post.author}</span>
          <span style={{ fontSize: '24px' }}>•</span>
          <span style={{ fontSize: '24px' }}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
