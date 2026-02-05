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
    name: "THE PRODUCT IS FOR YOUR GIRL",
    price: 977,
    category: "Gifts",
    image: "/assets/k2wtitnfsvysr7yuop8q.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "A perfect gift for her."
  },
  {
    id: '2',
    name: "PREMIUM GIFT HAMPER",
    price: 1200,
    category: "Hampers",
    image: "/assets/enginnering.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "Premium gift hamper for special occasions."
  },
  {
    id: '3',
    name: "A GIFT FOR MY BEST FRIEND",
    price: 1140,
    category: "Gifts",
    image: "/assets/fbesblw7qukemk1no2o5.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "Show your appreciation to your best friend."
  },
  {
    id: '4',
    name: "GOURMET WELLNESS DELIGHT",
    price: 950,
    category: "Wellness",
    image: "/assets/k2wtitnfsvysr7yuop8q.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "Wellness delight for a healthy lifestyle."
  },
  {
    id: '5',
    name: "THE PRODUCT IS FOR YOUR GIRL (Bundle)",
    price: 977,
    category: "Gifts",
    image: "/assets/k2wtitnfsvysr7yuop8q.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "A perfect gift for her."
  },
  {
    id: '6',
    name: "PREMIUM GIFT HAMPER (Deluxe)",
    price: 1200,
    category: "Hampers",
    image: "/assets/enginnering.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "Premium gift hamper for special occasions."
  },
  {
    id: '7',
    name: "A GIFT FOR MY BEST FRIEND (Special)",
    price: 1140,
    category: "Gifts",
    image: "/assets/fbesblw7qukemk1no2o5.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "Show your appreciation to your best friend."
  },
  {
    id: '8',
    name: "GOURMET WELLNESS DELIGHT (Premium)",
    price: 950,
    category: "Wellness",
    image: "/assets/k2wtitnfsvysr7yuop8q.webp",
    colors: [],
    sizes: [],
    inStock: true,
    description: "Wellness delight for a healthy lifestyle."
  }
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
      name: 'product-storage-v2',
    }
  )
);
