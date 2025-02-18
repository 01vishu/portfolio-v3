export const personalConfig = {
  name: 'Vishu',
  username: 'vishucodes',
  avatar: '/avatar.jpg',
  role: 'Full Stack Developer',
  bio: 'Building modern web applications with a focus on user experience and performance.',
  email: 'hello@vishucodes.com',
  siteUrl: 'https://vishucodes.com',
  location: 'India',
  company: 'Freelance',

  social: {
    twitter: 'https://twitter.com/vishucodes',
    github: 'https://github.com/01vishu',
    linkedin: 'https://linkedin.com/in/vishucodes',
  },

  seo: {
    title: 'Vishu - Full Stack Developer',
    description:
      'Full Stack Developer specializing in modern web applications with Next.js, React, and TypeScript.',
    keywords: [
      'Vishu',
      'Full Stack Developer',
      'Web Developer',
      'React Developer',
      'Next.js Developer',
      'TypeScript Developer',
      'Frontend Developer',
      'Backend Developer',
    ],
  },

  projects: [
    {
      name: 'Portfolio V3',
      description:
        'My personal website built with Next.js 14, TypeScript, and Tailwind CSS.',
      url: 'https://github.com/01vishu/portfolio-v3',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    },
    // Add more projects here
  ],
} as const
