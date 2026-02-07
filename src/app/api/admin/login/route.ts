import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('admin')
    .select('email,password')
    .eq('email', email)
    .single()

  let ok = false
  if (!error && data) {
    ok = await bcrypt.compare(password, data.password)
  } else {
    const envEmail = process.env.ADMIN_EMAIL
    const envPassword = process.env.ADMIN_PASSWORD
    if (envEmail && envPassword && email === envEmail && password === envPassword) {
      ok = true
    }
  }

  if (!ok) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true, email })
  res.cookies.set('admin_session', 'true', { httpOnly: true, path: '/admin' })
  res.cookies.set('admin_email', email, { path: '/' })
  return res
}
