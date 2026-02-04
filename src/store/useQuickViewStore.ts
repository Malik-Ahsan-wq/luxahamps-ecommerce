import { create } from 'zustand';

export interface Product {
  id: string | number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  discount?: string;
  description?: string; // Optional for now
  category?: string;
  stock?: number;
}

interface QuickViewState {
  isOpen: boolean;
  selectedProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewState>((set) => ({
  isOpen: false,
  selectedProduct: null,
  openQuickView: (product) => set({ isOpen: true, selectedProduct: product }),
  closeQuickView: () => set({ isOpen: false, selectedProduct: null }),
}));
