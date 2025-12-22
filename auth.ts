// auth.ts - Updated with type-safe code
import NextAuth from "next-auth";
import BoxyHQSAMLProvider from "next-auth/providers/boxyhq-saml";
import type { Profile } from "next-auth";

// Define extended profile type
interface SamlProfile extends Profile {
  nameID?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  upn?: string;
  samAccountName?: string;
}

// Validate required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required");
}

if (!process.env.AUTH_ISSUER) {
  console.warn("⚠️ AUTH_ISSUER environment variable is not set");
}

// Build provider configuration
const providerConfig: any = {
  issuer: process.env.AUTH_ISSUER || "http://localhost:3000",
  clientId: "dummy",
  clientSecret: "dummy",
  authorization: { params: { scope: "" } },
  checks: ["pkce", "state"],
  name: "Company SSO",
  id: "boxyhq-saml",
};

// Use metadata URL if provided, otherwise use direct configuration
if (process.env.IDP_METADATA_URL) {
  providerConfig.idpMetadataUrl = process.env.IDP_METADATA_URL;
  console.log("📡 Using IdP metadata URL for configuration");
} else if (process.env.SAML_ENTRY_POINT && process.env.SAML_CERT) {
  providerConfig.entryPoint = process.env.SAML_ENTRY_POINT;
  providerConfig.cert = process.env.SAML_CERT;
  console.log("⚙️ Using manual SAML configuration");
} else {
  console.warn("⚠️ No IdP metadata URL or manual SAML configuration found");
  console.warn("   Please set either IDP_METADATA_URL or SAML_ENTRY_POINT + SAML_CERT");
}

// Configure profile mapping for ADFS/IdP claims
providerConfig.profile = (profile: any) => {
  console.log("📋 SAML Profile received:", JSON.stringify(profile, null, 2));
  
  return {
    id: profile.nameID || profile.nameIDFormat || profile.email || `saml-${Date.now()}`,
    email: profile.email || 
           profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
           profile['User.email'] ||
           'user@example.com',
    name: profile.name || 
          profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
          profile['DisplayName'] ||
          'SAML User',
    firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] || profile.given_name,
    lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] || profile.family_name,
    roles: Array.isArray(profile.roles) ? profile.roles : 
          (profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ? 
            [profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']] : 
            []),
    nameID: profile.nameID,
    upn: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn'] || profile.upn,
    samAccountName: profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname'] || profile.samAccountName,
  };
};

// Create NextAuth configuration
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    BoxyHQSAMLProvider(providerConfig),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      console.log("🔐 JWT Callback:", { tokenId: token.sub, profileEmail: profile?.email });
      
      // Add SAML profile data to token with type safety
      const samlProfile = profile as SamlProfile;
      
      if (samlProfile) {
        token.id = samlProfile.nameID || samlProfile.id || user?.id;
        token.email = samlProfile.email || user?.email;
        token.name = samlProfile.name || user?.name;
        token.firstName = samlProfile.firstName;
        token.lastName = samlProfile.lastName;
        token.roles = samlProfile.roles || [];
        token.upn = samlProfile.upn;
        token.samAccountName = samlProfile.samAccountName;
      } else if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.roles = user.roles;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("💼 Session Callback:", { sessionEmail: session.user?.email });
      
      // Add token data to session with type safety
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.roles = token.roles as string[];
        session.user.upn = token.upn as string;
        session.user.samAccountName = token.samAccountName as string;
      }
      
      return session;
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login/error',
  },
  debug: process.env.NODE_ENV === 'development',
});