// app/api/auth/callback/microsoft-entra-id/route.ts
import { NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch"; // or global fetch if Node 18+
//import { getCodeVerifier } from "@/lib/utils/pkce"; // adjust path if needed

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }

    if (!process.env.AZURE_AD_CLIENT_ID || !process.env.AZURE_AD_CLIENT_SECRET || !process.env.AZURE_AD_TENANT_ID) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Read the PKCE verifier from cookie
    const code_verifier = req.cookies.get("pkce_verifier")?.value;

    if (!code_verifier) {
      return NextResponse.json({ error: "Missing PKCE code_verifier" }, { status: 400 });
    }

    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID,
        scope: "openid email profile",
        code,
        redirect_uri: "https://adfsentra.onrender.com/api/auth/callback/microsoft-entra-id",
        grant_type: "authorization_code",
        code_verifier, // <-- MUST include this
        client_secret: process.env.AZURE_AD_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const text = await tokenResponse.text();
      console.error("Token exchange failed:", text);
      return NextResponse.json({ error: "Token exchange failed", details: text }, { status: 500 });
    }

    const tokenData = (await tokenResponse.json()) as { id_token?: string; access_token?: string };
    const idToken = tokenData.id_token;

    if (!idToken) {
      return NextResponse.json({ error: "No ID token received" }, { status: 500 });
    }

    // 2. Optionally verify ID token here (skipped for simplicity)
    // You could use `jsonwebtoken` to decode & verify
    // import jwt from 'jsonwebtoken';
    // const payload = jwt.verify(idToken, PUBLIC_KEY, { algorithms: ["RS256"] });

    // 3. Create your own session token
    const jwt = require("jsonwebtoken");
    const sessionToken = jwt.sign(
      {
        idToken,
        sub: "user-" + Date.now(), // replace with actual subject from ID token
      },
      process.env.APP_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Redirect user to dashboard with session cookie
    const res = NextResponse.redirect(
      new URL("https://adfsentra.onrender.com/components/oidcsaml/dashboard", req.url),
      303
    );

    res.cookies.set("oidc-session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      domain: "adfsentra.onrender.com",
      maxAge: 60 * 60, // 1 hour
    });

    // 6️⃣ Delete PKCE verifier cookie
    //res.cookies.delete("pkce_verifier", {"path": "/api/auth/callback/microsoft-entra-id","domain": "adfsentra.onrender.com",});

    return res;
  } catch (err) {
    console.error("OIDC callback failure:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}