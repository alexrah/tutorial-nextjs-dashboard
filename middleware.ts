import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from "@/auth.config";

export default async function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Rewrite /wp-admin routes to /admin
  if (url.pathname.startsWith('/wp-admin')) {
    const rewrittenUrl = url.pathname.replace('/wp-admin', '/admin');
    return NextResponse.rewrite(new URL(rewrittenUrl, url.origin));
  }

  // check authentication for /dashboard & /login routes
  if (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/login')) {
    // @ts-ignore
    return NextAuth(authConfig).auth(request);
  }

  // All other routes are accessible without authentication
  return NextResponse.next();
}