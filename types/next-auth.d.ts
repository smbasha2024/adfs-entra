// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Profile {
    //nameID?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    //roles?: string[];
    upn?: string;
    //samAccountName?: string;
    email?: string
    givenName?: string
    familyName?: string
    username?: string
  }

  interface Session {
    accessToken?: string
    idToken?: string
  }

  interface User extends DefaultUser {
      id?: string;
      //nameID?: string;
      firstName?: string;
      lastName?: string;
      //roles?: string[];
      upn?: string;
      //samAccountName?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    idToken?: string
    email?: string
    givenName?: string
    familyName?: string
    userName?: string
  }
}