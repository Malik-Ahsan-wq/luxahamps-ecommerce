import { NextResponse } from 'next/server'
import { OrdersStore } from '@/lib/ordersStore'

export async function GET() {
  const data = OrdersStore.list()
  return NextResponse.json(data)
}

export async function PATCH(req: Request) {
  const { id, order_status } = await req.json()
  if (!id || !order_status) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  OrdersStore.updateStatus(id, order_status)
  return NextResponse.json({ ok: true })
}
