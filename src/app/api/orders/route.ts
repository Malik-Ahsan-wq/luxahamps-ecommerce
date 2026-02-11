import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, products, userEmail, email, paymentMethod, payment_method, total, customer, customer_name: cn } = body || {}

    const list = Array.isArray(items) && items.length > 0 ? items : (Array.isArray(products) ? products : [])
    if (!Array.isArray(list) || list.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }
    const emailVal = typeof userEmail === 'string' && userEmail.length > 0 ? userEmail : (typeof email === 'string' ? email : '')
    if (!emailVal) {
      return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 })
    }
    const customer_name = (customer?.name ?? cn ?? null) as string | null
    const pm = typeof paymentMethod === 'string' && paymentMethod.length > 0 ? paymentMethod : (typeof payment_method === 'string' ? payment_method : 'COD')

    // Ensure user exists in users table
    let userId: string | null = null
    {
      const { data: existing, error: findErr } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', emailVal)
        .maybeSingle()
      if (existing?.id) {
        userId = existing.id as string
        await supabaseAdmin.from('users').update({ full_name: customer_name, updated_at: new Date().toISOString() }).eq('id', userId)
      } else {
        const { data: insertedUser, error: insErr } = await supabaseAdmin
          .from('users')
          .insert({ email: emailVal, full_name: customer_name })
          .select('id')
          .single()
        if (insErr) return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
        userId = insertedUser.id as string
      }
    }

    // Build orders rows per requested schema
    const rows = list.map((item: any) => {
      const qty = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 1
      const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0
      return {
        user_id: userId,
        product_id: item.id,
        quantity: qty,
        total: price * qty,
      }
    })

    const { data: inserted, error: insertErr } = await supabaseAdmin.from('orders').insert(rows)
    if (insertErr) {
      return NextResponse.json({ error: 'Failed to save orders' }, { status: 500 })
    }

    const orderTotal = typeof total === 'number'
      ? total
      : rows.reduce((s, r) => s + (r.total || 0), 0)
    return NextResponse.json({ ok: true, count: rows.length, total: orderTotal })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

