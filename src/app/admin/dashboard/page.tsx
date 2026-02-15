'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingCart, DollarSign, TrendingUp, Star } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalOrders: number
  newOrders: number
  revenue: number
  totalProducts: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    newOrders: 0,
    revenue: 0,
    totalProducts: 0
  })

  useEffect(() => {
    const session = localStorage.getItem('admin_session')
    if (!session) {
      router.replace('/admin')
      return
    }
    loadStats()
  }, [router])

  const loadStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/admin/orders', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ])
      
      const orders = await ordersRes.json()
      const products = await productsRes.json()
      
      setStats({
        totalOrders: Array.isArray(orders) ? orders.length : 0,
        newOrders: Array.isArray(orders) ? orders.filter((o: any) => o.order_status === 'new').length : 0,
        revenue: Array.isArray(orders) ? orders.reduce((s: number, o: any) => s + (o.total || 0), 0) : 0,
        totalProducts: Array.isArray(products) ? products.length : 0
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/admin/orders'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/orders'
    },
    {
      title: 'New Orders',
      value: stats.newOrders,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/products'
    }
  ]

  const quickLinks = [
    { title: 'Manage Products', href: '/admin/products', icon: Package, description: 'Add, edit, or remove products' },
    { title: 'View Orders', href: '/admin/orders', icon: ShoppingCart, description: 'Process and manage orders' },
    { title: 'Customer Reviews', href: '/admin/ratings', icon: Star, description: 'View product ratings' }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back! Here's your store overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <link.icon className="h-5 w-5 text-slate-600" />
                    </div>
                    <CardTitle className="text-base">{link.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}