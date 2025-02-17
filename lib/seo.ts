import { personalConfig } from '~/config/personal.config'

export const seo = {
  title: personalConfig.seo.title,
  description: personalConfig.seo.description,
  url: new URL(personalConfig.siteUrl),
} as const
