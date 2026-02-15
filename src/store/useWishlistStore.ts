import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
}

interface WishlistStore {
  items: WishlistItem[]
  addToWishlist: (item: WishlistItem) => void
  removeFromWishlist: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  getWishlistCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (item) => {
        const exists = get().items.find(i => i.id === item.id)
        if (!exists) {
          set({ items: [...get().items, item] })
        }
      },
      
      removeFromWishlist: (id) => {
        set({ items: get().items.filter(i => i.id !== id) })
      },
      
      isInWishlist: (id) => {
        return get().items.some(i => i.id === id)
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      getWishlistCount: () => {
        return get().items.length
      }
    }),
    {
      name: 'wishlist-storage'
    }
  )
)
