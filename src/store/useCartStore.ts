import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string

  // Optional gift bundle properties
  isGift?: boolean;
  giftItems?: { product: Product; quantity: number }[];
  giftMessage?: string;
  recipientName?: string;
  occasion?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  isOpen: boolean;
  cart: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      cart: [],
      
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addToCart: (product) => {
        set((state) => {
          // If it's a gift bundle, always add as a new item (don't merge)
          if (product.isGift) {
             return {
              isOpen: true,
              cart: [...state.cart, { ...product, quantity: 1 }],
            };
          }

          const existingItem = state.cart.find((item) => item.id === product.id && !item.isGift);
          
          if (existingItem) {
            // If item exists, increase quantity
            return {
              isOpen: true, // Automatically open cart
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // If item doesn't exist, add new item
            return {
              isOpen: true, // Automatically open cart
              cart: [...state.cart, { ...product, quantity: 1 }],
            };
          }
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return; // Prevent quantity less than 1 (use remove instead)
        
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // name of the item in the storage (must be unique)
      // By default uses localStorage
    }
  )
);
