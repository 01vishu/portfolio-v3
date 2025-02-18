import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    jwt({ token, profile, account }) {
      if (profile && account) {
        token.provider = account.provider
      }
      return token
    },
    session({ session, token }) {
      if (session.user && typeof token.provider === 'string') {
        session.user.provider = token.provider
        session.user.isAdmin = session.user.email === ADMIN_EMAIL
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
})
