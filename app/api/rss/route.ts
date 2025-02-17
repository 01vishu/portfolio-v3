import RSS from 'rss'
import { client } from '~/sanity/lib/client'
import { seo } from '~/lib/seo'

export async function GET() {
  const feed = new RSS({
    title: seo.title,
    description: seo.description,
    site_url: seo.url.toString(),
    feed_url: `${seo.url}/rss`,
    language: 'en',
    image_url: `${seo.url}/opengraph-image.png`,
  })

  const posts = await client.fetch(`
    *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      title,
      excerpt,
      "slug": slug.current,
      publishedAt,
    }
  `)

  posts.forEach((post: any) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${seo.url}/blog/${post.slug}`,
      date: post.publishedAt,
      guid: post.slug,
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
