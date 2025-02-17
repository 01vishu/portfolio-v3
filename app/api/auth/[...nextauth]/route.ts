import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow specific admin email
      return user.email === ADMIN_EMAIL
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = session.user.email === ADMIN_EMAIL
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
})
