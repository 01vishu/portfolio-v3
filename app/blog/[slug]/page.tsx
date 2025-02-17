import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { client } from '~/sanity/lib/client'
import { seo } from '~/lib/seo'

async function getPost(slug: string) {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      excerpt,
      content,
      publishedAt,
      _updatedAt,
      "slug": slug.current,
      "estimatedReadingTime": round(length(pt::text(content)) / 5 / 180),
      "categories": categories[]->title,
      "tags": tags[]->title,
      "author": {
        "name": author->name,
        "image": author->image,
        "bio": author->bio
      }
    }
  `,
    { slug }
  )
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      authors: [post.author.name],
      tags: [...post.categories, ...post.tags],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  // JSON-LD Schema for Blog Post
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: seo.url.toString(),
    },
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    image: `${seo.url}/blog/${params.slug}/opengraph-image`,
    url: `${seo.url}/blog/${params.slug}`,
    keywords: [...post.categories, ...post.tags].join(', '),
    wordCount: post.estimatedReadingTime * 180,
    articleBody: post.content,
    publisher: {
      '@type': 'Organization',
      name: seo.title,
      url: seo.url.toString(),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Your existing blog post JSX */}
    </>
  )
}
