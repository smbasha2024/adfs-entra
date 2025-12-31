import {
  Strategy as SamlStrategy,
  Profile,
  VerifyWithoutRequest,
} from "passport-saml";

import passport from "passport";

let initialized = false;

export function initPassport() {
  if (initialized) return passport;

  passport.use("saml", samlStrategy);
  initialized = true;

  return passport;
}

const verify: VerifyWithoutRequest = (
  profile: Profile | null | undefined,
  done
) => {
  if (!profile) {
    return done(null, undefined);
  }

  // Normalize Profile → plain object
  const user: Record<string, unknown> = {
    nameID: profile.nameID,
    email: profile["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
    displayName: profile.displayName,
    issuer: profile.issuer,
    sessionIndex: profile.sessionIndex,
  };

  done(null, user);
};

export const samlStrategy = new SamlStrategy(
  {
    entryPoint:"https://login.microsoftonline.com/4f275734-822b-40d5-8380-42d3d149ee7e/saml2",
    issuer: "https://adfsentra.onrender.com/saml/metadata",
    callbackUrl: "https://adfsentra.onrender.com/auth/saml/callback",
    cert: process.env.AZURE_SAML_CERT!,
    passReqToCallback: false,
    //session: false,
  },
  verify
);
