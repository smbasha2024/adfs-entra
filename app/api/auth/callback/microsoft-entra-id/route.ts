import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
  }

  // Exchange code for tokens here
  // Validate ID token
  // Create session

  return NextResponse.redirect(
    new URL("https://adfsentra.onrender.com/components/oidcsaml/dashboard", req.url),
    303
  );
}
