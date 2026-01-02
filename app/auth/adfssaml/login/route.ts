// app/auth/saml/login/route.ts
import { NextResponse } from "next/server";

import zlib from "zlib";
import { v4 as uuidv4 } from "uuid";

function buildSamlRequest() {
  const id = "_" + crypto.randomUUID();
  const issueInstant = new Date().toISOString();

  return `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="${id}" Version="2.0" IssueInstant="${issueInstant}" Destination="https://fs.ad.ricago.in/adfs/ls/" AssertionConsumerServiceURL="https://adfsentra.onrender.com/auth/adfssaml/callback" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"> <saml:Issuer>https://adfsentra.onrender.com/adfssaml/metadata</saml:Issuer> <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified" AllowCreate="true"/> </samlp:AuthnRequest>`;
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
    `https://fs.ad.ricago.in/adfs/ls/?SAMLRequest=${encoded}`;

  return NextResponse.redirect(samlRequestUrl);
}
