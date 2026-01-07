import { NextResponse } from "next/server";

export async function GET() {
  const authorizeUrl =
    `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/oauth2/v2.0/authorize` +
    `?client_id=${process.env.AZURE_AD_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(
      "https://adfsentra.onrender.com/api/auth/callback/microsoft-entra-id"
    )}` +
    `&response_mode=query` +
    `&scope=openid email profile` +
    `&state=oidc`;

  return NextResponse.redirect(authorizeUrl);
}
