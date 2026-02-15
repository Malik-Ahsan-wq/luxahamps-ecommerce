'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Star, 
  RefreshCcw,
  ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// --- Types ---
interface Stats {
  totalOrders: number
  newOrders: number
  revenue: number
  totalProducts: number
}

// --- Sub-components for better readability ---
const StatCard = ({ title, value, icon: Icon, color, bgColor, link, loading }: any) => (
  <Link href={link}>
    <Card className="group hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer overflow-hidden border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-md ${bgColor} transition-transform group-hover:scale-110`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24 mt-1" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </CardContent>
    </Card>
  </Link>
)

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    newOrders: 0,
    revenue: 0,
    totalProducts: 0
  })

  const loadStats = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setIsRefreshing(true)

    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ])
      
      if (!ordersRes.ok || !productsRes.ok) throw new Error('Failed to fetch data')

      const orders = await ordersRes.json()
      const products = await productsRes.json()
      
      setStats({
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        newOrders: Array.isArray(orders) ? orders.filter((o: any) => o.order_status === 'new').length : 0,
        revenue: Array.isArray(orders) ? orders.reduce((s: number, o: any) => s + (o.total || 0), 0) : 0,
        totalProducts: Array.isArray(products) ? products.length : 0
      })
    } catch (error) {
      console.error('Dashboard Error:', error)
      // In a real app, trigger a Toast notification here
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.replace('/admin')
      return
    }
    loadStats()
  }, [router, loadStats])

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 p-2">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Store Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance metrics for your shop.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => loadStats(true)} 
          disabled={isRefreshing}
          className="w-fit"
        >
          <RefreshCcw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Analytics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Revenue" 
          value={`$${stats.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={DollarSign} color="text-emerald-600" bgColor="bg-emerald-50"
          link="/admin/orders" loading={loading}
        />
        <StatCard 
          title="Total Orders" value={stats.totalOrders}
          icon={ShoppingCart} color="text-indigo-600" bgColor="bg-indigo-50"
          link="/admin/orders" loading={loading}
        />
        <StatCard 
          title="Incoming Orders" value={stats.newOrders}
          icon={TrendingUp} color="text-amber-600" bgColor="bg-amber-50"
          link="/admin/orders" loading={loading}
        />
        <StatCard 
          title="Inventory" value={stats.totalProducts}
          icon={Package} color="text-rose-600" bgColor="bg-rose-50"
          link="/admin/products" loading={loading}
        />
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
           <h2 className="text-xl font-bold text-slate-800">Operational Links</h2>
           <div className="flex flex-col gap-3">
              {[
                { title: 'Inventory Control', href: '/admin/products', icon: Package, desc: 'Stock & pricing' },
                { title: 'Order Fulfillment', href: '/admin/orders', icon: ShoppingCart, desc: 'Shipping & updates' },
                { title: 'Social Proof', href: '/admin/ratings', icon: Star, desc: 'Review management' }
              ].map((link) => (
                <Link key={link.title} href={link.href} className="group">
                  <div className="flex items-center p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    <div className="p-3 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
                      <link.icon className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-bold text-slate-900 leading-none">{link.title}</p>
                      <p className="text-xs text-slate-500 mt-1">{link.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
           </div>
        </div>

        {/* Placeholder for Data Visualization */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Recent Performance</CardTitle>
            <CardDescription>A summary of your store's activity over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-lg m-6">
            <p className="text-sm text-slate-400 italic">Chart visualization component (e.g., Recharts) would render here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}