'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    try {
      const session = typeof window !== 'undefined' ? localStorage.getItem('admin_session') : null
      if (!session) {
        router.replace('/admin')
        return
      }
    } catch {}
    load()
  }, [router])

  const load = async () => {
    const res = await fetch('/api/admin/orders', { cache: 'no-store' })
    const data = await res.json()
    setOrders(Array.isArray(data) ? data : [])
  }

  const updateStatus = async (id: string, status: string) => {
    setLoading(true)
    await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, order_status: status })
    })
    setLoading(false)
    load()
  }

  const onLogout = () => {
    try {
      localStorage.removeItem('admin_session')
    } catch {}
    router.replace('/admin')
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader><CardTitle>Total Orders</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{orders.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>New</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{orders.filter(o => o.order_status === 'new').length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">{orders.reduce((s, o) => s + (o.total || 0), 0)}</div></CardContent>
        </Card>
      </div>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="border rounded p-4">
            <div className="font-semibold">{o.product_title}</div>
            <div>Qty: {o.quantity}</div>
            <div>Total: {o.total}</div>
            <div>User: {o.user_email}</div>
            <div>Status: {o.order_status}</div>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" onClick={() => updateStatus(o.id, 'confirmed')} disabled={loading}>Confirm</Button>
              <Button variant="outline" onClick={() => updateStatus(o.id, 'shipped')} disabled={loading}>Ship</Button>
              <Button variant="outline" onClick={() => updateStatus(o.id, 'delivered')} disabled={loading}>Deliver</Button>
              <Button variant="destructive" onClick={() => updateStatus(o.id, 'cancelled')} disabled={loading}>Cancel</Button>
            </div>
          </div>
        ))}
        {orders.length === 0 && <div>No orders found.</div>}
      </div>
    </div>
  )
}
