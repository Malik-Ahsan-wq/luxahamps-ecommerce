import React from 'react';
import { Heart, Search, Star } from 'lucide-react';

const products = [
  { id: 1, name: "THE PRODUCT IS FOR YOUR GIRL", price: 977, oldPrice: 1500, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "35% OFF" },
  { id: 2, name: "PREMIUM GIFT HAMPER", price: 1200, oldPrice: 1500, img: "/assets/enginnering.webp", discount: "20% OFF" },
  { id: 3, name: "A GIFT FOR MY BEST FRIEND", price: 1140, oldPrice: 1450, img: "/assets/fbesblw7qukemk1no2o5.webp", discount: "21% OFF" },
  { id: 4, name: "GOURMET WELLNESS DELIGHT", price: 950, oldPrice: 1200, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "20% OFF" },
  { id: 5, name: "THE PRODUCT IS FOR YOUR GIRL", price: 977, oldPrice: 1500, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "35% OFF" },
  { id: 6, name: "PREMIUM GIFT HAMPER", price: 1200, oldPrice: 1500, img: "/assets/enginnering.webp", discount: "20% OFF" },
  { id: 7, name: "A GIFT FOR MY BEST FRIEND", price: 1140, oldPrice: 1450, img: "/assets/fbesblw7qukemk1no2o5.webp", discount: "21% OFF" },
  { id: 8, name: "GOURMET WELLNESS DELIGHT", price: 950, oldPrice: 1200, img: "/assets/k2wtitnfsvysr7yuop8q.webp", discount: "20% OFF" },
];

const ProductSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-2 md:px-4 py-12">
      {/* Grid: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden rounded-sm bg-gray-100">
              
              {/* Badges */}
              <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
                <span className="bg-pink-600 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase">
                  {product.discount}
                </span>
                <span className="bg-blue-800 text-white text-[8px] md:text-[10px] px-1.5 md:px-2 py-0.5 font-bold uppercase text-center">
                  New
                </span>
              </div>

              {/* Action Icons (Desktop Only) */}
              <div className="absolute top-2 right-2 z-20 hidden md:flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition-colors">
                  <Search size={14} />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white transition-colors">
                  <Heart size={14} />
                </button>
              </div>

              {/* Main Product Image */}
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              />

              {/* Add to Cart Button */}
              {/* Added: translate-y-0 for mobile (always visible) and md:translate-y-full (hidden on desktop until hover) */}
              <div className="absolute bottom-0 left-0 w-full translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                <button className="w-full bg-black/80 md:bg-black text-white py-2 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-widest hover:bg-pink-600 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-3 flex flex-col items-start gap-1 px-1">
              <h3 className="text-[10px] md:text-xs font-bold text-gray-800 uppercase line-clamp-1">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-pink-600 font-bold text-sm md:text-base">₹{product.price}</span>
                <span className="text-gray-400 line-through text-[10px] md:text-sm">₹{product.oldPrice}</span>
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
        ))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-12">
        <button className="bg-black text-white px-8 md:px-10 py-3 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-pink-600 transition-all cursor-pointer">
          View All
        </button>
      </div>
    </div>
  );
};

export default ProductSection;