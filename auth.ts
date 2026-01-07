import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,

  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`
      //tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.email =
          (profile as any).email ??
          (profile as any).preferred_username ??
          (profile as any).upn;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.email = token.email as string;
      return session;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/components/oidcsaml/dashboard`;
    },
  },
});
