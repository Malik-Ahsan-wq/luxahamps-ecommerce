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

    let userId: string | null = null
    {
      const { data: existing } = await supabaseAdmin
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

    const computedTotal = list.reduce((sum: number, item: any) => {
      const qty = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity) || 1
      const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0
      return sum + price * qty
    }, 0)
    const totalAmount = typeof total === 'number' ? total : computedTotal
    const shipping_address = [
      customer_name || '',
      customer?.phone || '',
      customer?.address || '',
      customer?.city || ''
    ].filter(Boolean).join(', ')

    const { error: insertErr } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        total_amount: totalAmount,
        payment_method: pm,
        shipping_address,
      })
    if (insertErr) {
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    return NextResponse.json({ ok: true, total: totalAmount })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

