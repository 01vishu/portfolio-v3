import { seo } from '~/lib/seo'

export const personalConfig = {
  // Basic Info
  name: 'Vishu Codes',
  fullName: 'Vishu Verma', // TODO: Need your full name
  role: 'Software Developer & Designer',
  email: 'your.email@gmail.com', // TODO: Need your email

  // Site Configuration
  siteUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://vishucodes.com'
      : 'http://localhost:3000',

  // SEO & Meta
  seo: {
    title: 'Vishu Codes | Software Developer & Designer',
    description:
      'I am a passionate software developer and designer, focused on creating impactful digital experiences. My portfolio showcases my work in web development, design, and creative solutions.',

    keywords: [
      'software development',
      'web design',
      'frontend development',
      'backend development',
      'full-stack developer',
      // TODO: Add your specific skills/technologies
    ],
    openGraph: {
      siteName: 'Vishu Codes',
      locale: 'en_US',
    },
  },

  // Social Media
  social: {
    twitter: '@vishucodes',
    github: '01vishuv',
    linkedin: 'vishucodes',
    instagram: 'vishucodes',
    youtube: 'vishucodes',
    // Add other social media
  },

  // Professional Details
  professional: {
    skills: [
      // TODO: Add your key skills
    ],
    experience: [
      // TODO: Add your experience
    ],
    education: [
      // TODO: Add your education
    ],
  },

  // Contact & Business
  contact: {
    email: {
      business: 'portfolio@vishucodes.com',
      notifications: 'your.email@gmail.com', // TODO: Need your notification email
    },
    location: 'TODO: Your location (optional)',
  },

  // Theme & Branding
  branding: {
    colors: {
      primary: '#000212',
      secondary: '#fafafa',
    },
    fonts: {
      primary: 'var(--font-sans)',
    },
  },
} as const

// Type-safe config access
export type PersonalConfig = typeof personalConfig

// Helper to access config values with type safety
export function getConfig<T extends keyof PersonalConfig>(
  key: T
): PersonalConfig[T] {
  return personalConfig[key]
}

// Commonly used config combinations
export const seoConfig = {
  default: {
    title: personalConfig.seo.title,
    description: personalConfig.seo.description,
    keywords: personalConfig.seo.keywords.join(', '),
    openGraph: {
      title: {
        default: seo.title,
        template: '%s | Vishu Codes',
      },
      description: seo.description,
      siteName: 'Vishu Codes',
      locale: 'en_US',
      type: 'website',
      url: 'https://vishucodes',
    },
    twitter: {
      site: '@vishucodes',
      creator: '@vishucodes',
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  },
  // Helper for page-specific SEO
  withPage: (pageTitle: string, pageDescription?: string) => ({
    ...seoConfig.default,
    title: {
      template: `%s | ${personalConfig.name}`,
      default: pageTitle,
    },
    description: pageDescription || seoConfig.default.description,
    openGraph: {
      ...seoConfig.default.openGraph,
      title: pageTitle,
      description: pageDescription || seoConfig.default.description,
    },
  }),
}
