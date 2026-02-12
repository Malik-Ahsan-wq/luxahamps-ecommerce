"use client";

import React, { useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { useQuickViewStore } from '@/store/useQuickViewStore';
import { useProductStore } from '@/store/useProductStore';
import Link from 'next/link';
import Image from 'next/image';

const ProductSection = () => {
  const { products, loadProducts } = useProductStore();
  const openQuickView = useQuickViewStore((state) => state.openQuickView);
  useEffect(() => { loadProducts() }, [loadProducts])

  // Take only first 8 products
  const displayProducts = products.slice(0, 12);

  return (
<section className="bg-[#FCFCFC] font-sans text-[#1A1A1A]">
  <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-12 py-12 md:py-24">
    
    {/* Editorial Header */}
    <header className="flex flex-col md:flex-row items-baseline justify-between mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-8">
      <div className="space-y-1">
        <h2 className="text-2xl  md:text-4xl font-light tracking-tighter lg:text-5xl">
          Curated <span className="italic font-serif text-pink-400">Selection</span>
        </h2>
      
      </div>
      <Link 
        href="/products" 
        className="group mt-4 md:mt-0 flex items-center gap-4 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] transition-all"
      >
        <span className="border-b border-black pb-1">Explore the Catalog</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </header>

    {/* Luxury Product Grid - UPDATED: grid-cols-2 for mobile */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-8 gap-y-10 md:gap-y-16">
      {displayProducts.map((product) => {
        const oldPrice = Math.round(product.price * 1.35);
        const discountPercentage = "35%";

        return (
          <div key={product.id} className="group relative flex flex-col">
            
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-white shadow-sm ring-1 ring-gray-100/50">
              
              {/* Invisible Click Layer */}
              <Link 
                href={`/product/${product.id}`} 
                className="absolute inset-0 z-10 cursor-pointer" 
              />
              
              {/* Sophisticated Labels */}
              <div className="absolute top-0 left-0 z-20">
                <div className="bg-black text-white text-[7px] md:text-[9px] px-2 md:px-3 py-1 md:py-1.5 font-bold uppercase tracking-widest">
                  Save {discountPercentage}
                </div>
              </div>

              {/* Ultra-Clean Action Bar (Hidden on Mobile, Hover on Desktop) */}
              <div className="absolute top-4 right-4 z-30 hidden md:flex flex-col gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView({ ...product }); }}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-black hover:bg-black hover:text-white transition-all duration-300"
                >
                  <Search size={16} strokeWidth={1} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-black hover:bg-black hover:text-white transition-all duration-300">
                  <Heart size={16} strokeWidth={1} />
                </button>
              </div>

              {/* Cinematic Image Zoom */}
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.25, 1, 0.5, 1)] group-hover:scale-110"
              />

              {/* Minimalist Slide-up - Ghost Style (Desktop Only) */}
              <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-in-out hidden md:block">
                <AddToCartButton 
                  product={{ ...product }}
                  className="w-full bg-white/95 backdrop-blur-md text-black py-5 text-[10px] font-bold uppercase tracking-[0.3em] border-t border-gray-100 hover:bg-black hover:text-white transition-all"
                />
              </div>
            </div>

            {/* Typography Section */}
            <div className="mt-4 md:mt-6 flex flex-col items-center">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1 md:mb-2">
                {product.category || "Essential"}
              </span>
              <h3 className="text-[12px] md:text-[15px] font-medium tracking-tight text-gray-900 mb-1 md:mb-2 text-center line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2 md:gap-4">
                <span className="text-[10px] md:text-[13px] text-gray-400 line-through font-light italic">₹{oldPrice}</span>
                <span className="text-[12px] md:text-[15px] text-black font-semibold tracking-tighter">₹{product.price}</span>
              </div>
              
              {/* Mobile Add to Cart (Visible only on mobile because hover is for desktop) */}
              <div className="mt-3 w-full md:hidden">
                <AddToCartButton 
                   product={{ ...product }}
                   className="w-full bg-black text-white py-2 text-[9px] font-bold uppercase tracking-widest"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</section>
    
  );
};

export default ProductSection;
