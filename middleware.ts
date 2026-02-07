import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  if (path.startsWith('/user')) {
    if (!session) {
      const url = req.nextUrl.clone()
      url.pathname = '/auth/user-login'
      return NextResponse.redirect(url)
    }
  }

  if (path.startsWith('/admin')) {
    const adminSession = req.cookies.get('admin_session')
    if (!adminSession) {
      const url = req.nextUrl.clone()
      url.pathname = '/auth/admin-login'
      return NextResponse.redirect(url)
    }
  }

  return res
}

export const config = {
  matcher: ['/user/:path*', '/admin/:path*']
}
