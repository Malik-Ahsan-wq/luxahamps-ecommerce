'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UserDashboardPage() {
  const [email, setEmail] = useState<string | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [productId, setProductId] = useState('')
  const [title, setTitle] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setEmail(user?.email ?? null)
      if (user?.email) {
        const { data } = await supabase.from('orders').select('*').eq('user_email', user.email).order('created_at', { ascending: false })
        setOrders(data ?? [])
      }
    }
    load()
  }, [])

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!email) {
      setLoading(false)
      setError('Not authenticated')
      return
    }
    const total = quantity * price
    const { error } = await supabase.from('orders').insert({
      user_email: email,
      product_id: productId,
      product_title: title,
      quantity,
      price,
      total,
      payment_method: 'COD',
      payment_status: 'pending',
      order_status: 'new'
    })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    const { data } = await supabase.from('orders').select('*').eq('user_email', email).order('created_at', { ascending: false })
    setOrders(data ?? [])
    setProductId('')
    setTitle('')
    setQuantity(1)
    setPrice(0)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Place COD Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={placeOrder} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Product ID</Label>
              <Input value={productId} onChange={(e) => setProductId(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Product Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || '1'))} required />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value || '0'))} required />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</Button>
              {error && <span className="ml-3 text-red-600 text-sm">{error}</span>}
            </div>
          </form>
        </CardContent>
      </Card>
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
      <div className="grid gap-4">
        {orders.map((o) => (
          <div key={o.id} className="border rounded p-4">
            <div className="font-semibold">{o.product_title}</div>
            <div>Qty: {o.quantity}</div>
            <div>Total: {o.total}</div>
            <div>Status: {o.order_status}</div>
          </div>
        ))}
        {orders.length === 0 && <div>No orders yet.</div>}
      </div>
    </div>
  )
}
