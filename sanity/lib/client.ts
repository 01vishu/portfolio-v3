import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  perspective: 'published',
  stega: {
    enabled: false,
    studioUrl: '/studio',
  },
  token: process.env.SANITY_API_TOKEN,
  ignoreBrowserTokenWarning: true,
  withCredentials: true,
})
