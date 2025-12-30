import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const samlResponse = formData.get("SAMLResponse");
  if (!samlResponse) {
    return NextResponse.json(
      { error: "Missing SAMLResponse" },
      { status: 400 }
    );
  }

  // 1. Decode Base64 → XML
  const xml = Buffer.from(samlResponse.toString(), "base64").toString("utf-8");

  // 2. Parse XML
  const parsed = await parseStringPromise(xml, { explicitArray: false });

  // 3. Navigate to Assertion
  const assertion =
    parsed["samlp:Response"]["saml:Assertion"];

  const attributes =
    assertion["saml:AttributeStatement"]["saml:Attribute"];

  // 4. Helper to extract claim
  const getClaim = (uri: string) => {
    const attr = attributes.find(
      (a: any) => a.$.Name === uri
    );
    return attr?.["saml:AttributeValue"];
  };

  // 5. Extract standard claims
  const email =
    getClaim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress");

  const upn =
    getClaim("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn");

  if (!upn && !email) {
    return NextResponse.json(
      { error: "No usable identity claim found" },
      { status: 401 }
    );
  }

  // 6. Create app session (JWT example)
  const token = jwt.sign(
    {
      sub: upn || email,
      email,
    },
    process.env.APP_SECRET!,
    { expiresIn: "1h" }
  );

  // 7. Set secure session cookie
  const response = NextResponse.redirect(
    "https://adfsentra.onrender.com/dashboard"
  );

  response.cookies.set("saml-session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
