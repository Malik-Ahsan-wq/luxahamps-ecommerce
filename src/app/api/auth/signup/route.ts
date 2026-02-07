import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  const { email, password, username } = await req.json()
  if (!email || !password || !username) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existing = await supabaseAdmin.auth.admin.getUserByEmail(email)
  if (existing.data?.user) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
  }

  const created = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username }
  })

  if (created.error) {
    return NextResponse.json({ error: created.error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
