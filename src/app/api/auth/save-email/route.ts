import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { id, email } = await req.json()
    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }
    if (typeof email !== 'string' || email.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
    if (!url || !serviceKey) {
      return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 })
    }

    const supabase = createClient(url, serviceKey)
    const { error } = await supabase
      .from('profiles')
      .upsert({ id, email }, { onConflict: 'id' })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
