// app/auth/saml/login/route.ts
import { NextResponse } from "next/server";

export async function GET() {

  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const appId = process.env.AUTH_SAML_APP_ID;

  if (!tenantId) {
    return NextResponse.json(
      { error: "AZURE_AD_TENANT_ID is not configured" },
      { status: 500 }
    );
  }

  const samlRequestUrl =
    `https://login.microsoftonline.com/${tenantId}/saml2?appid=${appId}`;
    

  return NextResponse.redirect(samlRequestUrl);
}
