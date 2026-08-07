import { NextResponse, type NextRequest } from "next/server";

/**
 * Gate on /admin and /api/admin.
 *
 * HTTP Basic, deliberately. It is the right amount of auth for two or three
 * people reading their own enquiries, it needs no session table, no cookie, no
 * login form and no dependency, and it can be replaced wholesale when Phase 2
 * brings a real admin_sessions table. What it must not be is absent: the lead
 * inbox contains customers' names, phone numbers and artwork.
 *
 * Middleware runs on the Edge runtime, so `node:crypto` and therefore
 * `timingSafeEqual` are unavailable. The password is compared as a SHA-256
 * digest via Web Crypto instead. Comparing digests rather than plaintext means
 * the comparison is over two fixed-length 32-byte values, so it cannot leak the
 * password's length, and an early exit leaks only which digest byte differed —
 * which tells an attacker nothing usable about the input that produced it.
 */

const REALM = 'Basic realm="Dfus Reuven admin", charset="UTF-8"';

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": REALM },
  });
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const passwordSha256 = process.env.ADMIN_PASSWORD_SHA256?.toLowerCase();

  /* Unconfigured means closed, never open. Defaulting to open would mean a
     forgotten env var silently publishes every customer's phone number, and
     the failure would be invisible — the pages would simply work. */
  if (!user || !passwordSha256) {
    console.error("[admin] ADMIN_USER / ADMIN_PASSWORD_SHA256 are not set; refusing all access");
    return new NextResponse("Admin is not configured", { status: 503 });
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return unauthorized();

  let decoded: string;
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) return unauthorized();

  const presentedUser = decoded.slice(0, separator);
  const presentedPassword = decoded.slice(separator + 1);

  const [userOk, passwordOk] = await Promise.all([
    sha256Hex(presentedUser).then((hash) => sha256Hex(user).then((expected) => equals(hash, expected))),
    sha256Hex(presentedPassword).then((hash) => equals(hash, passwordSha256)),
  ]);

  if (!userOk || !passwordOk) return unauthorized();

  return NextResponse.next();
}

/**
 * Narrow on purpose. Without a matcher every one of the ~30 static pages would
 * take an Edge hop it has no use for.
 */
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
