import React from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/store/useProductStore";
import { useQuickViewStore } from "@/store/useQuickViewStore";
import RatingStars from "./RatingStars";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Safe check for useQuickViewStore if it might not exist or be different
  const openQuickView = useQuickViewStore ? useQuickViewStore((state) => state.openQuickView) : () => {};

  // Mock data for missing fields to match the design
  const oldPrice = Math.round(product.price * 1.25); // Mock 25% more
  const discount = "25% OFF";

  return (
 <div className="group relative flex flex-col bg-white">
  {/* Primary Clickable Area */}
  <Link 
    href={`/product/${product.id}`} 
    className="absolute inset-0 z-10" 
    aria-label={`View ${product.name}`} 
  />
  
  {/* Media Section: Editorial 3:4 or Square Ratio */}
  <div className="relative aspect-[3/4] overflow-hidden bg-[#F9F9F9]">
    
    {/* Sophisticated Minimalist Badges */}
    <div className="absolute top-0 left-0 z-20 flex flex-col">
      {product.inStock ? (
        <>
          <span className="bg-black text-white text-[8px] tracking-[0.2em] px-3 py-1.5 font-bold uppercase">
            {discount}
          </span>
          <span className="bg-white text-black text-[8px] tracking-[0.2em] px-3 py-1.5 font-bold uppercase border-b border-gray-100">
            New Arrival
          </span>
        </>
      ) : (
        <span className="bg-gray-100 text-gray-500 text-[8px] tracking-[0.2em] px-3 py-1.5 font-bold uppercase">
          Sold Out
        </span>
      )}
    </div>

    {/* Luxury Quick Actions: Minimalist Circles */}
    <div className="absolute top-4 right-4 z-30 hidden md:flex flex-col gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openQuickView?.({ ...product, oldPrice, discount });
        }}
        className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md border border-gray-100 text-black hover:bg-black hover:text-white transition-all duration-300 rounded-full shadow-sm"
      >
        <Search size={16} strokeWidth={1.2} />
      </button>
      <button className="w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md border border-gray-100 text-black hover:bg-black hover:text-white transition-all duration-300 rounded-full shadow-sm">
        <Heart size={16} strokeWidth={1.2} />
      </button>
    </div>

    {/* Cinematic Image Scaling */}
    <img
      src={product.image}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 1, 0.3, 1) group-hover:scale-110"
    />

    {/* High-Contrast Purchase Action */}
    {product.inStock && (
      <div className="absolute bottom-0 left-0 w-full z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <AddToCartButton 
          product={product}
          className="w-full bg-black text-white py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1a1a1a] transition-all"
        />
      </div>
    )}
  </div>

  {/* Content Section: Refined Alignment & Spacing */}
  <div className="flex flex-col items-center text-center pt-6 pb-4">
    {/* Category Label (Adds Luxury Structure) */}
    <span className="text-[9px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-medium">
      {product.category || "Essential Collection"}
    </span>
    
    <h3 className="text-[13px] md:text-sm font-light text-gray-900 uppercase tracking-[0.1em] mb-3 px-2 line-clamp-1">
      {product.name}
    </h3>
    
    <div className="flex items-center gap-3">
      <span className="text-gray-400 line-through text-[11px] font-light italic">
        ₹{oldPrice}
      </span>
      <span className="text-black font-bold text-sm md:text-base tracking-tighter">
        ₹{product.price}
      </span>
    </div>
    
    {/* Discrete Rating */}
    <div className="flex items-center mt-3 opacity-60">
      <RatingStars value={product.averageRating || 0} readonly size={12} />
      <span className="text-[9px] text-gray-500 font-light ml-2 tracking-widest">
        ({(product.averageRating ?? 0).toFixed(1)})
      </span>
    </div>
  </div>
</div>
  );
};

export default ProductCard;
