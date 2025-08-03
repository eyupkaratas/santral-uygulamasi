import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { DecodedToken } from "./types/decoded-token";

const publicRoutes = ["/anasayfa"];
const adminRoutes = ["/personeller"];
const operatorRoutes = ["/numara-kaydi", "/kargo-girisi"];

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

function redirect(request: NextRequest, to: string) {
  const url = new URL(to, request.url);
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  if (!token) return redirect(request, "/anasayfa");

  let decodedToken: DecodedToken;
  try {
    const { payload } = await jwtVerify(token, jwtSecret);
    decodedToken = payload as DecodedToken;
  } catch {
    return redirect(request, "/anasayfa");
  }
  const userRole = decodedToken.rol;

  if (
    operatorRoutes.some((route) => pathname.startsWith(route)) &&
    !["Operator", "Admin"].includes(userRole) //
  ) {
    return redirect(request, "/profil");
  }

  if (
    adminRoutes.some((route) => pathname.startsWith(route)) &&
    decodedToken.rol !== "Admin" //
  ) {
    return redirect(request, "/profil");
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
};
