import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
    })
  ],
  // database: process.env.DB_URL,
  session: {
    jwt: true
  },
  jwt: {
    secret: 'ironman'
  },
  callbacks: {
    async signIn(_, __, profile) {
      if(profile.email === process.env.USER_ID && profile.verified_email === true) {
        return true;
      }
      return false;
    },
    async jwt(token, user) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session(session, token) {
      session.user.id = token.id
      return session
    }
  }
})
