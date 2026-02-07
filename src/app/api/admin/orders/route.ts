import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const { id, order_status } = await req.json()
  if (!id || !order_status) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const { error } = await supabaseAdmin
    .from('orders')
    .update({ order_status })
    .eq('id', id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
