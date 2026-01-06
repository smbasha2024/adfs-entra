// app/auth/saml/login/route.ts
import { NextResponse } from "next/server";

import zlib from "zlib";
import { v4 as uuidv4 } from "uuid";

function buildSamlRequest() {
  const id = "_" + uuidv4();
  const issueInstant = new Date().toISOString();

  return `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="${id}" Version="2.0" IssueInstant="${issueInstant}" Destination="https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/saml2" AssertionConsumerServiceURL="https://adfsentra.onrender.com/auth/saml/callback" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"> <saml:Issuer>urn:federation:MicrosoftOnline</saml:Issuer> <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/> </samlp:AuthnRequest>`;
  //basha@ad.ricago.in</saml:NameID>
}

export async function GET() {

  const tenantId = process.env.AZURE_AD_TENANT_ID;
  const appId = process.env.AUTH_SAML_APP_ID!;

  const xml = buildSamlRequest();
  console.log(xml);

  const encoded = Buffer.from(xml, "utf-8").toString("base64");

  if (!tenantId) {
    return NextResponse.json(
      { error: "AZURE_AD_TENANT_ID is not configured" },
      { status: 500 }
    );
  }

  const html = `
<!DOCTYPE html>
<html>
  <body onload="document.forms[0].submit()">
    <form method="POST" action="https://login.microsoftonline.com/${tenantId}/saml2">
      <input type="hidden" name="SAMLRequest" value="${encoded}" />
      <input type="hidden" name="RelayState" value="nextjs" />
    </form>
  </body>
</html>`;

  //console.log(html);
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}
