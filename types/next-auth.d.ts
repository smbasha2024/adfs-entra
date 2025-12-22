// types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
    nameID?: string;
    upn?: string;
    samAccountName?: string;
  }

  interface Profile {
    nameID?: string;
    id?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
    upn?: string;
    samAccountName?: string;
  }

  interface Session {
    user: {
      id?: string;
      firstName?: string;
      lastName?: string;
      roles?: string[];
      upn?: string;
      samAccountName?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
    upn?: string;
    samAccountName?: string;
  }
}