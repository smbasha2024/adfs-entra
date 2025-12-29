// auth.ts
import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import type { Profile } from "next-auth";

/**
 * Extended profile type for Microsoft Entra ID (OIDC)
 */
interface EntraProfile extends Profile {
  //sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  //roles?: string[];
  //oid?: string;

  given_name?: string;
  family_name?: string;
  upn?: string;
}

/**
 * Validate required environment variables
 */
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required");
}

if (!process.env.AZURE_AD_CLIENT_ID) {
  throw new Error("AZURE_AD_CLIENT_ID is required");
}

if (!process.env.AZURE_AD_CLIENT_SECRET) {
  throw new Error("AZURE_AD_CLIENT_SECRET is required");
}

if (!process.env.AZURE_AD_TENANT_ID) {
  throw new Error("AZURE_AD_TENANT_ID is required");
}

/**
 * NextAuth configuration
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      issuer: process.env.AUTH_ISSUER,
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      checks: ["pkce", "state"],
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,
  // Required for production hosting behind a proxy
  trustHost: true,
  // Enable to see detailed logs
  //debug: true,

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    /**
     * JWT callback
     */
    async jwt({ token, account, profile }) {
      console.log("########################### BASHA ###########################", token,account, profile)
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }

      if (profile) {
        const entraProfile = profile as EntraProfile;

        //token.id = entraProfile.sub;
        token.email = entraProfile.email;
        token.userName = entraProfile.preferred_username;
        //token.roles = entraProfile.roles ?? [];
        //token.oid = entraProfile.oid;

        token.givenName = entraProfile.given_name
        token.familyName = entraProfile.family_name
        token.id = entraProfile.upn
      }

      return token;
    },

    /**
     * Session callback
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        //session.user.roles = token.roles as string[];
        //session.user.oid = token.oid as string;
      }

      return session;
    },

    /**
     * Redirect after sign-in
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login/error",
  },

  debug: process.env.NODE_ENV === "development",
});
