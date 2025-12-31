// app/auth/saml/callback/route.ts
import passport from "passport";
import { initPassport } from "@/lib/saml";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const passport = initPassport();
  return new Promise<Response>((resolve, reject) => {
    passport.authenticate("saml", (err: any, user: any) => {
      if (err || !user) {
        resolve(Response.redirect("https://adfsentra.onrender.com/components/saml/dashboard"));
        return;
      }

      // At this point, SAML is VALIDATED
      resolve(Response.redirect("https://adfsentra.onrender.com/components/saml/dashboard"));
    })(req as any);
  });
}
