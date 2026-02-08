import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './useCartStore';
import { supabase } from '@/lib/supabaseClient';

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
    (set) => ({
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
            await fetch('/api/orders', {
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
            const session = await supabase.auth.getSession()
            const token = session.data.session?.access_token || ''
            if (token) {
              await fetch('/api/user/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}` },
                body: JSON.stringify({ items }),
              })
            }
          } catch {}
        })()
      },
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),
    }),
    {
      name: 'order-storage',
    }
  )
);
