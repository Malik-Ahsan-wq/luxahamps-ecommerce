type OrderRow = {
  id: string
  user_email: string
  customer_name: string | null
  phone: string | null
  address: string | null
  city: string | null
  product_id: string
  product_title: string
  quantity: number
  price: number
  total: number
  payment_method: string
  payment_status: string
  order_status: string
  created_at: string
}

const orders: OrderRow[] = []
const usersOrders: OrderRow[] = []

export const OrdersStore = {
  add(rows: Omit<OrderRow, 'id' | 'created_at'>[]) {
    const now = new Date().toISOString()
    const withIds = rows.map((r) => ({
      ...r,
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      created_at: now
    }))
    orders.push(...withIds)
    usersOrders.push(...withIds)
    return withIds
  },
  list() {
    return orders.slice()
  },
  updateStatus(id: string, status: string) {
    const upd = (arr: OrderRow[]) => {
      const i = arr.findIndex((o) => o.id === id)
      if (i >= 0) arr[i].order_status = status
    }
    upd(orders)
    upd(usersOrders)
  }
}
