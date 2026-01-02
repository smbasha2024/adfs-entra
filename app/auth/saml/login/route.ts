// app/auth/saml/login/route.ts
import { NextResponse } from "next/server";

import zlib from "zlib";
import { v4 as uuidv4 } from "uuid";

function buildSamlRequest() {
  const id = "_" + uuidv4();
  const issueInstant = new Date().toISOString();

  return `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="${id}" Version="2.0" IssueInstant="${issueInstant}" Destination="https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/saml2" AssertionConsumerServiceURL="https://adfsentra.onrender.com/auth/saml/callback"> <saml:Issuer>urn:adfsentra-saml</saml:Issuer> </samlp:AuthnRequest>`;
}

export async function GET() {

  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const appId = process.env.AUTH_SAML_APP_ID;

  const xml = buildSamlRequest();

  const deflated = zlib.deflateRawSync(xml);
  const base64 = deflated.toString("base64");
  const encoded = encodeURIComponent(base64);

  if (!tenantId) {
    return NextResponse.json(
      { error: "AZURE_AD_TENANT_ID is not configured" },
      { status: 500 }
    );
  }

  const samlRequestUrl =
    //`https://login.microsoftonline.com/${tenantId}/saml2?appid=${appId}`;
    //`https://myapps.microsoft.com/signin/${appId}?tenantId=${tenantId}`;
    `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/saml2` +
    `?SAMLRequest=${encoded}`;

  return NextResponse.redirect(samlRequestUrl);
}
