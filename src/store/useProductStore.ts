import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  
  setSearchQuery: (query: string) => void;
  setFilter: (key: keyof ProductState['filters'], value: any) => void;
  resetFilters: () => void;
  setSortOption: (option: ProductState['sortOption']) => void;
  
  // Internal helper to apply filters and sort
  applyFilters: () => void;
}

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Classic White T-Shirt',
    price: 29.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
    colors: ['White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    description: 'A comfortable classic cotton t-shirt.',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    price: 89.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&auto=format&fit=crop&q=60',
    colors: ['Blue'],
    sizes: ['M', 'L', 'XL'],
    inStock: true,
    description: 'Stylish denim jacket for all seasons.',
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 119.99,
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    colors: ['Red', 'Black'],
    sizes: ['8', '9', '10', '11'],
    inStock: true,
    description: 'High-performance running shoes.',
  },
  {
    id: '4',
    name: 'Leather Wallet',
    price: 49.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1627123424574-181ce5171c98?w=500&auto=format&fit=crop&q=60',
    colors: ['Brown', 'Black'],
    sizes: ['One Size'],
    inStock: true,
    description: 'Genuine leather wallet.',
  },
  {
    id: '5',
    name: 'Summer Dress',
    price: 59.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500&auto=format&fit=crop&q=60',
    colors: ['Yellow', 'Pink'],
    sizes: ['XS', 'S', 'M'],
    inStock: false,
    description: 'Light and breezy summer dress.',
  },
    {
    id: '6',
    name: 'Smart Watch',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    colors: ['Black', 'Silver'],
    sizes: ['One Size'],
    inStock: true,
    description: 'Track your fitness and stay connected.',
  },
];

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      filteredProducts: initialProducts,
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

      addProduct: (product) => {
        set((state) => {
          const newProducts = [...state.products, product];
          return { products: newProducts };
        });
        get().applyFilters();
      },

      updateProduct: (updatedProduct) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
        }));
        get().applyFilters();
      },

      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
        get().applyFilters();
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

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          result = result.filter((p) => p.name.toLowerCase().includes(query));
        }

        // Filters
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
        // Price Range filter could be added here if needed

        // Sorting
        if (sortOption === 'price-asc') {
          result.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
          result.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'newest') {
           // Assuming higher ID is newer for simulation, or we could add a date field
           result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        }

        set({ filteredProducts: result });
      },
    }),
    {
      name: 'product-storage',
    }
  )
);
