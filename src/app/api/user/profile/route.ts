import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 })
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  const supabase = createClient(supabaseUrl, serviceKey)
  const { data, error } = await supabase.from('profiles').select('*').eq('email', email).maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data || null)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, about, avatar_url } = body || {}
    if (typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const supabase = createClient(supabaseUrl, serviceKey)
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ email, name: name ?? null, about: about ?? null, avatar_url: avatar_url ?? null }, { onConflict: 'email' })
      .select()
      .maybeSingle()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
