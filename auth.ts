import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      provider?: string
      isAdmin: boolean
    } & DefaultSession['user']
  }

  interface Profile {
    provider?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string
  }
}
