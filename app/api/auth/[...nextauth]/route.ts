// File: app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth';
import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

import type { JWT } from "next-auth/jwt"
import type { Account, Session, User } from "next-auth"

export const authOptions = {
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: "https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0"
    }),
  ],
  callbacks: {
    async jwt({
        token,
        account,
        user,
    }: {
        token: JWT
        account?: Account | null
        user?: User
    }) {
        if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
        }
        return token
    },

    async session({
        session,
        token,
    }: {
        session: Session
        token: JWT
    }) {
        // You can add custom properties to Session type if needed
        (session as any).accessToken = token.accessToken as string
        (session as any).idToken = token.idToken as string
        return session
    },
    },
}

const handler = NextAuth(authOptions)

export const { GET, POST } = handlers;