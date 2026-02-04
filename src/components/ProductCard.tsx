import React from "react";
import Link from "next/link";
import { Heart, Search, Star } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/store/useProductStore";
import { useQuickViewStore } from "@/store/useQuickViewStore";

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
    <div className="group cursor-pointer relative">
      <Link href={`/product/${product.id}`} className="absolute inset-0 z-10" aria-label={`View ${product.name}`} />
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-sm bg-gray-100">
        
        {/* Badges */}
        <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
          {product.inStock ? (
            <>
              <span className="bg-pink-600 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase">
                {discount}
              </span>
              <span className="bg-blue-800 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase text-center">
                New
              </span>
            </>
          ) : (
            <span className="bg-gray-800 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase">
              Out of Stock
            </span>
          )}
        </div>

        {/* Action Icons (Desktop Only) */}
        <div className="absolute top-2 right-2 z-20 hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (openQuickView) {
                openQuickView({
                  id: product.id.toString(),
                  name: product.name,
                  price: product.price,
                  oldPrice: oldPrice,
                  image: product.image,
                  discount: discount
                });
              }
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
        {product.inStock && (
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
        )}
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
        
        {/* Star Rating */}
        <div className="flex text-gray-300 gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill="currentColor" />
          ))}
          <span className="text-[8px] md:text-[10px] text-gray-400 ml-1">(0)</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
