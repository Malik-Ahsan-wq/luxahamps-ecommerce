"use client";

import React from 'react';
import { Heart, Search } from 'lucide-react';
import AddToCartButton from '@/components/AddToCartButton';
import { useQuickViewStore } from '@/store/useQuickViewStore';
import { useProductStore } from '@/store/useProductStore';
import Link from 'next/link';

const ProductSection = () => {
  const { products } = useProductStore();
  const openQuickView = useQuickViewStore((state) => state.openQuickView);

  // Take only first 8 products
  const displayProducts = products.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-12">
      {/* Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {displayProducts.map((product) => {
          // Calculate mock old price and discount since they aren't in the store
          const oldPrice = Math.round(product.price * 1.35); 
          const discount = "35% OFF";

          return (
            <div key={product.id} className="group cursor-pointer relative">
              <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
              
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden rounded-sm bg-gray-100">
                
                {/* Badges */}
                <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
                  <span className="bg-pink-600 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase">
                    {discount}
                  </span>
                  <span className="bg-blue-800 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase text-center">
                    New
                  </span>
                </div>

                {/* Action Icons (Desktop Only) */}
                <div className="absolute top-2 right-2 z-20 hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openQuickView({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        oldPrice: oldPrice,
                        image: product.image,
                        discount: discount
                      });
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition-colors relative z-30"
                  >
                    <Search size={14} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition-colors relative z-30">
                    <Heart size={14} />
                  </button>
                </div>

                {/* Main Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />

                {/* Add to Cart Button */}
                {/* Added: translate-y-0 for mobile (always visible) and md:translate-y-full (hidden on desktop until hover) */}
                <div className="absolute bottom-0 left-0 w-full translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                  <div className="relative z-30">
                    <AddToCartButton 
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image
                      }}
                      className="w-full rounded-none bg-black/80 md:bg-black py-2 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-pink-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-3 flex flex-col items-start gap-1 px-1">
                <h3 className="text-[10px] md:text-xs font-bold text-gray-800 uppercase line-clamp-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-pink-600 font-bold text-sm md:text-base">₹{product.price}</span>
                  <span className="text-gray-400 line-through text-[10px] md:text-sm">₹{oldPrice}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSection;
