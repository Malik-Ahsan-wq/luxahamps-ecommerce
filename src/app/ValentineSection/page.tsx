"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const ValentineSection = () => {
  const collections = [
    { 
      id: "valentine", 
      title: "Valentine Day", 
      image: "/assets/k2wtitnfsvysr7yuop8q.webp", 
      desc: "Embrace romance with our Valentine's Day collection. Find the perfect gift to captivate hearts with timeless elegance." 
    },
    { 
      id: "birthday", 
      title: "Birthday", 
      image: "/assets/Gemini_Generated_Image_zk9mkzk9mkzk9mkz.png", 
      desc: "Celebrate another year of joy with our special birthday hampers designed to make them feel truly extraordinary." 
    },
    { 
      id: "anniversary", 
      title: "Anniversary", 
      image: "/assets/istockphoto-1293366109-612x612.jpg", 
      desc: "Honor your journey together with elegant anniversary gifts that speak volumes of your shared love and legacy." 
    },
    { 
      id: "surprise", 
      title: "Surprise Box", 
      image: "/assets/dxw57hi0ldbzlhnicrma.webp", 
      desc: "Unbox pure happiness with our curated surprise boxes, filled with delightful treasures for life's spontaneous moments." 
    },
  ];

  const [activeItem, setActiveItem] = useState(collections[0]);

  return (
    <section className="flex flex-col md:flex-row w-full min-h-[600px] lg:min-h-[700px] overflow-hidden bg-white">
      
      {/* Left Side: Cinematic Image Display */}
      <div className="w-full md:w-1/2 relative h-[500px] md:h-auto overflow-hidden">
        {collections.map((item) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-out ${
              activeItem.id === item.id 
                ? "opacity-100 scale-110 rotate-1" 
                : "opacity-0 scale-100 rotate-0"
            }`}
          />
        ))}
        {/* Subtle Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Right Side: High-End Content Navigation */}
      <div className="w-full md:w-1/2 bg-[#fffafa] flex flex-col justify-center p-8 md:p-16 lg:p-24 relative">
        
        {/* Eyebrow Label */}
        <span className="text-pink-600 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-10 block">
          Curated Occasions
        </span>

        <nav className="space-y-6 mb-12">
          {collections.map((item) => {
            const isActive = activeItem.id === item.id;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveItem(item)}
                className="relative cursor-pointer group py-2"
              >
                <div className="flex items-center gap-6">
                  {/* Luxury Animated Underline/Bar */}
                  <div className={`h-[2px] transition-all duration-500 bg-pink-500 ${
                    isActive ? "w-12" : "w-0 group-hover:w-6"
                  }`} />
                  
                  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter transition-all duration-500 ${
                    isActive ? "text-slate-900 translate-x-2" : "text-slate-300 hover:text-slate-400"
                  }`}>
                    {item.title}
                  </h2>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Description Box with Entry Animation Effect */}
        <div className="min-h-[10px] max-w-md border-l-2 border-pink-100 pl-6 py-2 mb-10">
          <p className="text-slate-600 text-sm md:text-base leading-relaxed animate-in fade-in slide-in-from-left-4 duration-700">
            {activeItem.desc}
          </p>
        </div>

        <Link href="/products" className="w-fit">
          <button className="group relative bg-black text-white px-10 py-5 flex items-center gap-4 transition-all duration-300 rounded-full hover:bg-pink-600 hover:shadow-2xl hover:shadow-pink-500/30 active:scale-95">
            <span className="uppercase text-[10px] font-black tracking-[0.2em]">
              Explore {activeItem.id} Collection
            </span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
          </button>
        </Link>

        {/* Decorative corner accent */}
        <div className="absolute bottom-10 right-10 opacity-5 hidden lg:block">
            <h1 className="text-9xl font-black uppercase tracking-tighter leading-none select-none">Luxa</h1>
        </div>
      </div>
    </section>
  );
};

export default ValentineSection;