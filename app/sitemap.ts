import { MetadataRoute } from 'next'
import { client } from '~/sanity/lib/client'
import { seo } from '~/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all blog posts
  const posts = await client.fetch(`
    *[_type == "post" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      publishedAt,
      _updatedAt,
      title,
      excerpt,
      "categories": categories[]->title,
      "tags": tags[]->title
    }
  `)

  // Create blog post entries
  const blogEntries = posts.map((post: any) => ({
    url: `${seo.url}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Static pages
  const staticPages = [
    {
      url: seo.url.toString(),
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${seo.url}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${seo.url}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${seo.url}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  return [...staticPages, ...blogEntries]
}

export const runtime = 'edge'
export const revalidate = 60
