import { client } from '~/sanity/lib/client'
import { seo } from '~/lib/seo'

export async function GET() {
  const posts = await client.fetch(`
    *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      title,
      excerpt,
      "slug": slug.current,
      publishedAt,
      _updatedAt,
      "categories": categories[]->title,
      "tags": tags[]->title,
      "author": author->name
    }
  `)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${posts
        .filter((post: any) => {
          // Only include posts from last 2 days for news
          const twoDaysAgo = new Date()
          twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
          return new Date(post.publishedAt) > twoDaysAgo
        })
        .map(
          (post: any) => `
        <url>
          <loc>${seo.url}/blog/${post.slug}</loc>
          <news:news>
            <news:publication>
              <news:name>${seo.title}</news:name>
              <news:language>en</news:language>
            </news:publication>
            <news:publication_date>${new Date(post.publishedAt).toISOString()}</news:publication_date>
            <news:title>${post.title}</news:title>
            <news:keywords>${[...post.categories, ...post.tags].join(',')}</news:keywords>
          </news:news>
        </url>
      `
        )
        .join('')}
    </urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
