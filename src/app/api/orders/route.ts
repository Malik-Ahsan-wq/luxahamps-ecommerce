import { NextResponse } from 'next/server'
import { OrdersStore } from '@/lib/ordersStore'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, products, userEmail, email, paymentMethod, payment_method, total, customer, customer_name: cn, phone: ph, address: addr, city: ct } = body || {}

    const list = Array.isArray(items) && items.length > 0 ? items : (Array.isArray(products) ? products : [])
    if (!Array.isArray(list) || list.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }
    const emailVal = typeof userEmail === 'string' && userEmail.length > 0 ? userEmail : (typeof email === 'string' ? email : '')
    if (!emailVal) {
      return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 })
    }
    const pm = typeof paymentMethod === 'string' && paymentMethod.length > 0 ? paymentMethod : (typeof payment_method === 'string' ? payment_method : 'COD')

    const customer_name = (customer?.name ?? cn ?? null) as string | null
    const phone = (customer?.phone ?? ph ?? null) as string | null
    const address = (customer?.address ?? addr ?? null) as string | null
    const city = (customer?.city ?? ct ?? null) as string | null

    const rows = list.map((item: any) => ({
      user_email: emailVal,
      customer_name,
      phone,
      address,
      city,
      product_id: item.id,
      product_title: item.name,
      quantity: item.quantity ?? 1,
      price: item.price,
      total: item.price * (item.quantity ?? 1),
      payment_method: pm,
      payment_status: 'pending',
      order_status: 'Pending'
    }))

    const inserted = OrdersStore.add(rows)
    const orderTotal = typeof total === 'number' ? total : inserted.reduce((s, r) => s + (r.total || 0), 0)
    return NextResponse.json({ ok: true, count: inserted.length, total: orderTotal })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

