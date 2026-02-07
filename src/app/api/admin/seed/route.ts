import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  let email: string | undefined
  let password: string | undefined
  try {
    const body = await req.json()
    email = body?.email
    password = body?.password
  } catch {
    // ignore JSON parse errors; fall back to env
  }

  email = email || process.env.ADMIN_EMAIL
  password = password || process.env.ADMIN_PASSWORD

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
  }

  const hashed = await bcrypt.hash(password, 10)

  const { data: existing, error: findErr } = await supabaseAdmin
    .from('admin')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (findErr) {
    return NextResponse.json({ error: findErr.message }, { status: 500 })
  }

  if (existing) {
    const { error: updErr } = await supabaseAdmin
      .from('admin')
      .update({ password: hashed })
      .eq('email', email)
    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, action: 'updated', email })
  }

  const { error: insErr } = await supabaseAdmin
    .from('admin')
    .insert({ email, password: hashed })

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, action: 'inserted', email })
}
