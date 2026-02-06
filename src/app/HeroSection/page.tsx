"use client";
import React, { useState, useEffect } from "react";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
const slides = [
  {
    image: "/assets/customization.webp",
    shortTitle: "Your Style",
    title: "Customize Your Style",
    description: "Create your own unique designs easily and quickly and this is the best color and thingiking about you.",
  },
  {
    image: "/assets/istockphoto-1293366109-612x612.jpg",
    shortTitle: "Freedom",
    title: "Design with Freedom",
    description: "Choose colors, shapes, and text for your perfect product and we can provide things when you want perfect ok.",
  },
  {
    image: "/assets/customization.webp",
    shortTitle: "Simple",
    title: "Fast & Simple Editor",
    description: "Our editor is user-friendly and intuitive for everyone. you can create stunning designs in minutes.",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length); // Loop forward only
    }, 3000);
    return () => clearInterval(interval);
  }, [length]);

  return (
    <div className="w-full relative  overflow-hidden">
      {/* Slider container */}
      <div
        className="flex w-full h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-150 flex-shrink-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />

            {/* Overlay Text */}
         <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center items-start p-6 md:p-20">
  {/* Short Heading - Cleaned up spacing and added tracking */}
  <h3 className="text-sm md:text-base text-pink-500 font-black uppercase tracking-[0.3em] mb-4 drop-shadow-md">
    {slide.shortTitle}
  </h3>

  {/* Main Heading - The "Ultra Professional" look */}
  <h1 className="text-5xl md:text-2xl lg:text-7xl font-black tracking-tighter leading-[0.95] pb-3">
    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-100 to-pink-500 drop-shadow-xl">
      {slide.title}
    </span>
  </h1>

  {/* Description - Improved line height and color for readability */}
  <p className="text-base md:text-lg text-slate-200 max-w-lg mb-8 leading-relaxed font-medium">
    {slide.description}
  </p>

  {/* Book Now Button - Now with mt-10 as requested */}
  <div className="mt-10">
    <Link href="/products">
    <button className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-widest text-black shadow-2xl transition-all duration-300 hover:bg-pink-600 hover:text-white hover:shadow-pink-500/40 active:scale-95">
      <span className="relative z-10">Sop Now</span>
      <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1.5 relative z-10" />
    </button>
    </Link>
  </div>
</div>
          </div>
        ))}
      </div>

      {/* Bar Navigation */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full cursor-pointer transition-all duration-500 ${
              idx === current ? "w-8 bg-pink-600" : "w-4 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
