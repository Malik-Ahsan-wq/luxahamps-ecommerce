import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
  if (!token) return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  const supabase = createClient(supabaseUrl, serviceKey)
  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userData?.user?.id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const userId = userData.user.id

  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,full_name,phone,address,profile_image')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data || null)
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
    if (!token) return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })
    const body = await req.json()
    const { id, email, full_name, phone, address, profile_image } = body || {}
    if (typeof id !== 'string' || typeof email !== 'string') {
      return NextResponse.json({ error: 'Invalid id/email' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    const supabase = createClient(supabaseUrl, serviceKey)
    const { data: userData, error: userErr } = await supabase.auth.getUser(token)
    if (userErr || userData?.user?.id !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { id, email, full_name: full_name ?? null, phone: phone ?? null, address: address ?? null, profile_image: profile_image ?? null },
        { onConflict: 'id' }
      )
      .select('id,email,full_name,phone,address,profile_image')
      .maybeSingle()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
