import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';
 

export interface Order {
  id: string;
  userId?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  paymentMethod: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => {
        set((state) => ({ orders: [order, ...state.orders] }))
        ;(async () => {
          try {
            const items = order.items.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
            }))
            const res = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                items,
                email: order.customer.email,
                paymentMethod: order.paymentMethod,
                total: order.total,
                customer: {
                  name: order.customer.name,
                  phone: order.customer.phone,
                  address: order.customer.address,
                  city: order.customer.city,
                },
              }),
            })
            if (res.ok) {
              try {
                const productIds = Array.from(new Set(order.items.map((i) => String(i.id))))
                if (typeof window !== 'undefined' && productIds.length > 0) {
                  window.dispatchEvent(new CustomEvent('order:confirmed', { detail: { productIds } }))
                }
              } catch {}
            }
           
          } catch {}
        })()
      },
      updateOrderStatus: (orderId, status) =>
        set((state) => {
          const updated = state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          )
          const target = updated.find((o) => o.id === orderId)
          if (target && (status === 'Confirmed' || status === 'Delivered')) {
            try {
              const productIds = Array.from(new Set((target.items || []).map((i) => String(i.id))))
              if (typeof window !== 'undefined' && productIds.length > 0) {
                window.dispatchEvent(new CustomEvent('order:confirmed', { detail: { productIds } }))
              }
            } catch {}
          }
          return { orders: updated }
        }),
    }),
    {
      name: 'order-storage',
    }
  )
);
