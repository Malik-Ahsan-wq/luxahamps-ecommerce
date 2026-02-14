import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  description?: string;
  averageRating?: number;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  filters: {
    category: string | null;
    priceRange: [number, number] | null;
    color: string | null;
    size: string | null;
    inStock: boolean | null;
  };
  sortOption: 'price-asc' | 'price-desc' | 'newest' | null;
  
  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loadProducts: () => Promise<void>;
  
  setSearchQuery: (query: string) => void;
  setFilter: (key: keyof ProductState['filters'], value: any) => void;
  resetFilters: () => void;
  setSortOption: (option: ProductState['sortOption']) => void;
  
  // Internal helper to apply filters and sort
  applyFilters: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  filters: {
    category: null,
    priceRange: null,
    color: null,
    size: null,
    inStock: null,
  },
  sortOption: null,

  setProducts: (products) => {
    set({ products });
    get().applyFilters();
  },

  loadProducts: async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (!res.ok) return
      const products: Product[] = await res.json()
      set({ products })
      get().applyFilters()
    } catch {}
  },

  addProduct: async (product) => {
    try {
      const body = {
        title: product.name,
        description: product.description || '',
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.inStock ? 1 : 0,
      }
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to create product')
      const created: Product = await res.json()
      set((state) => ({ products: [created, ...state.products] }))
      get().applyFilters();
    } catch {}
  },

  updateProduct: async (updatedProduct) => {
    try {
      const body = {
        title: updatedProduct.name,
        description: updatedProduct.description || '',
        price: updatedProduct.price,
        image: updatedProduct.image,
        category: updatedProduct.category,
        stock: updatedProduct.inStock ? 1 : 0,
      }
      const res = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to update product')
      const saved: Product = await res.json()
      set((state) => ({
        products: state.products.map((p) => (p.id === saved.id ? saved : p)),
      }))
      get().applyFilters();
    } catch {}
  },

  deleteProduct: async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete product')
      set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      }))
      get().applyFilters();
    } catch {}
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().applyFilters();
  },
  
  resetFilters: () => {
      set({
          filters: {
              category: null,
              priceRange: null,
              color: null,
              size: null,
              inStock: null,
          },
          searchQuery: '',
          sortOption: null
      });
      get().applyFilters();
  },

  setSortOption: (option) => {
    set({ sortOption: option });
    get().applyFilters();
  },

  applyFilters: () => {
    const { products, searchQuery, filters, sortOption } = get();
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters.color) {
      result = result.filter((p) => p.colors.includes(filters.color!));
    }
    if (filters.size) {
      result = result.filter((p) => p.sizes.includes(filters.size!));
    }
    if (filters.inStock !== null) {
      result = result.filter((p) => p.inStock === filters.inStock);
    }

    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    set({ filteredProducts: result });
  },
}));
