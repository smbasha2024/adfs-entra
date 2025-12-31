// app/auth/saml/login/route.ts
import passport from "passport";
import { samlStrategy } from "@/lib/saml";

export const runtime = "nodejs";

passport.use(samlStrategy);

export async function GET(req: Request) {
  return new Promise<Response>((resolve, reject) => {
    passport.authenticate("saml", (err: any, user: any) => {
      if (err) {
        reject(err);
        return;
      }
      // Passport will handle redirect automatically
      resolve(new Response(null));
    })(req as any);
  });
}
