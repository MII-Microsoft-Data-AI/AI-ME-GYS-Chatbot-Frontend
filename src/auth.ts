import NextAuth, { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

export interface AuthResponse {
  code: number
  source: string
  message: string
  data: Data
  expired_at: string
}

export interface Data {
  user: User
}

export interface User {
  users_id: string
  users_name: string
  users_email: string
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "token",
      name: "Token Authentication",
      credentials: {
        accessToken: { label: "Access Token", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) {
          return null
        }

        try {
          // Call the backend /auth endpoint
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              access_token: credentials.accessToken,
            })
          })

          if (response.ok) {
            const resData = await response.json() as AuthResponse
            return {
              id: resData.data.user.users_id,
              email: resData.data.user.users_email,
              name: resData.data.user.users_name,
            }
          } else {
            console.error('Authentication failed:', response.status, response.statusText)
            return null
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token
        token.userId = user.id
        token.provider = account.provider
      }
      
      // Add custom fields to JWT
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
      }
      
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token && session.user) {
        session.user.id = token.userId as string || token.id as string
        if (token.email) session.user.email = token.email as string
        if (token.name) session.user.name = token.name as string
        if (token.image) session.user.image = token.image as string
        // Custom session properties handled by our extended types
        session.accessToken = token.accessToken as string
        session.provider = token.provider as string
      }
      
      return session
    },
  },
}

export default NextAuth(authOptions)

// Helper function to get session server-side
export const getAuthSession = () => getServerSession(authOptions)
