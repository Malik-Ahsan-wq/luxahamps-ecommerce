import { cookies, headers } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function getServerSupabase() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        const all = cookieStore.getAll()
        return all.map((c: any) => ({ name: c.name, value: c.value }))
      },
      setAll(cookiesToSet: any[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }: any) => {
            cookieStore.set({ name, value, ...options } as any)
          })
        } catch {}
      },
    },
    headers: {
      get(key: string) {
        return (headerStore as any).get(key) ?? undefined
      },
    },
  })
}
