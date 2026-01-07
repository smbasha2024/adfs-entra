// utils/pkce.ts
import crypto from "crypto";

export function base64URLEncode(buffer: Buffer) {
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function sha256(buffer: string) {
  return crypto.createHash("sha256").update(buffer).digest();
}

export function generatePKCE() {
  const code_verifier = base64URLEncode(crypto.randomBytes(32));
  const code_challenge = base64URLEncode(sha256(code_verifier));
  return { code_verifier, code_challenge };
}
