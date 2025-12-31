// app/auth/saml/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    console.log("################# Reached to callback ################");
    const formData = await req.formData();
    const samlResponse = formData.get("SAMLResponse");

    if (!samlResponse || typeof samlResponse !== "string") {
      return NextResponse.json(
        { error: "Missing SAMLResponse" },
        { status: 400 }
      );
    }

    if (!process.env.APP_SECRET) {
      console.error("APP_SECRET not configured");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    /* 1. Decode Base64 */
    const xml = Buffer.from(samlResponse, "base64").toString("utf-8");

    /* 2. Parse XML safely */
    const parsed = await parseStringPromise(xml, {
      explicitArray: false,
      tagNameProcessors: [],
    });

    const response =  parsed?.["samlp:Response"] || parsed?.["Response"];
    const assertion = response?.["saml:Assertion"] || response?.["Assertion"];

    //console.log("Parsed SAML Response:", JSON.stringify(response, null, 2));

    if (!assertion) {
      // Encrypted assertion detected
      if (response?.["saml:EncryptedAssertion"]) {
        return NextResponse.json(
          {
            error:
              "Encrypted SAML assertion received. Disable assertion encryption or implement decryption.",
              response: response || null,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: "SAML Assertion not found in response", response: response || null,},
        { status: 401 }
      );
    }


    const attributeStatement = assertion?.["saml:AttributeStatement"] || assertion?.["AttributeStatement"];

    if (!attributeStatement) {
      return NextResponse.json(
        { error: "Missing AttributeStatement in SAML assertion", response: response || null, },
        { status: 401 }
      );
    }

    /* 3. Normalize attributes */
    let attributes = attributeStatement["saml:Attribute"] || attributeStatement["Attribute"];

    if (!attributes) {
      return NextResponse.json(
        { error: "No SAML attributes found", rawAttributeStatement: attributeStatement },
        { status: 401 }
      );
    }

    // Ensure attributes is always an array
    if (!Array.isArray(attributes)) {
      attributes = [attributes];
    }

    const getClaim = (uri: string) => {
      if (!attributes) return null;

      // Normalize single attribute to array
      const attrsArray = Array.isArray(attributes) ? attributes : [attributes];

      const attr = attrsArray.find((a: any) => a?.$?.Name === uri);
      if (!attr) return null;

      // Check multiple possible locations for the value
      return attr["saml:AttributeValue"] || attr["AttributeValue"] || attr._ || null;
    };

    /* 4. Extract identity */
    const email = getClaim(
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
    );

    const upn = getClaim(
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    );

    const subject = upn || email;

    if (!subject) {
      return NextResponse.json(
        { error: "No usable identity claim found" , upn: upn || null, email: email|| null,  response: response || null,},
        { status: 401 }
      );
    }

    /* 5. Issue application session */
    const token = jwt.sign(
      {
        sub: subject,
        email,
      },
      process.env.APP_SECRET,
      { expiresIn: "1h" }
    );

    //const url = new URL("/dashboard", req.url);
    //const res = NextResponse.redirect(url);
    const res = NextResponse.redirect(
      new URL("https://adfsentra.onrender.com/components/adfssaml/dashboard", req.url),
      303
    );

    res.cookies.set("saml-session", token, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === "production", // true only in prod HTTPS
      sameSite: "lax",
      path: "/",
      domain: "adfsentra.onrender.com", // CRITICAL
      maxAge: 60 * 60, // 1 hour
    });

    return res;
    
  } catch (err) {
    console.error("SAML callback failure:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
