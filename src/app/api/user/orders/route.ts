import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createUserClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  })
}

export async function GET(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
  if (!token) return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })
  const supabase = createUserClient(token)
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr || !userData?.user?.id) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
  const userId = userData.user.id
  const { data, error } = await supabase
    .from('orders')
    .select('id,user_id,full_name,email,phone,address,product_name,product_id,quantity,price,status,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(Array.isArray(data) ? data : [])
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
    if (!token) return NextResponse.json({ error: 'Missing auth token' }, { status: 401 })
    const supabase = createUserClient(token)

    const { data: userData, error: userErr } = await supabase.auth.getUser()
    if (userErr || !userData?.user?.id || !userData?.user?.email) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }
    const userId = userData.user.id
    const userEmail = userData.user.email

    const body = await req.json()
    const { items } = body || {}
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    // Fetch profile info for user
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('full_name,phone,address')
      .eq('id', userId)
      .maybeSingle()
    if (profErr) {
      return NextResponse.json({ error: profErr.message }, { status: 400 })
    }

    const rows = items.map((item: any) => ({
      user_id: userId,
      full_name: profile?.full_name ?? null,
      email: userEmail,
      phone: profile?.phone ?? null,
      address: profile?.address ?? null,
      product_name: item.name,
      product_id: item.id ?? null,
      quantity: typeof item.quantity === 'number' ? item.quantity : 1,
      price: item.price,
      status: 'pending'
    }))

    const { data: inserted, error } = await supabase
      .from('orders')
      .insert(rows)
      .select('id')
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, count: Array.isArray(inserted) ? inserted.length : 0 })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
