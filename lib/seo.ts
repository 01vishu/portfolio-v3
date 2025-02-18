import { personalConfig } from '~/config/personal'

export const seo = {
  title: personalConfig.seo.title,
  description: personalConfig.seo.description,
  url: new URL(personalConfig.siteUrl),
  siteName: personalConfig.name,
  locale: 'en_US',
  type: 'website',
  keywords: personalConfig.seo.keywords,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: personalConfig.seo.title,
    description: personalConfig.seo.description,
    creator: '@vishucodes',
    card: 'summary_large_image',
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
} as const

export type SeoConfig = typeof seo
