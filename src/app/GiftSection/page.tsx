"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  { id: 1, title: "Mens Shoes", img: "/assets/oconumzbo7ile3hyihzv.webp" },
  { id: 2, title: "Womens Bags", img: "/assets/mxnsu9swnm1damllxasr.webp" },
  { id: 3, title: "asa", img: "/assets/dxw57hi0ldbzlhnicrma.webp" },
  { id: 4, title: "Gifts Under ₹799", img: "/assets/kbuhajqunbgk3ubwtney.webp" },
  { id: 5, title: "WoMen", img: "/assets/mxnsu9swnm1damllxasr.webp" },
  { id: 6, title: "CORPORATE GIFTING", img: "/assets/mxnsu9swnm1damllxasr.webp" },
];

const infiniteCategories = [...categories, ...categories];

const GiftSlider = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="py-20 bg-white overflow-hidden">
    <div className="text-center mb-16 px-4">
  {/* Eyebrow Heading - Luxury Brand Standard */}
  <span className="text-pink-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block animate-fade-in">
    Our Collections
  </span>

  {/* Main Heading - High Contrast & Tight Kerning */}
  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 leading-none">
    Gifts by <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-400">Category</span>
  </h2>

  {/* Decorative Divider - High Scalable UI element */}
  <div className="flex items-center justify-center gap-4 mt-6">
    <div className="h-[1px] w-12 bg-slate-200" />
    <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
    <div className="h-[1px] w-12 bg-slate-200" />
  </div>

  {/* Description - Balanced Max-Width for Readability */}
  <p className="text-slate-500 mt-6 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
    Explore our curated gift categories for effortless gifting tailored to every taste, 
    designed to make every occasion unforgettable.
  </p>
</div>

      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex space-x-3 min-w-full"
          // This logic stops the animation at the current frame instead of resetting to 0
          animate={isPaused ? {} : { x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 5,
              ease: "linear",
            },
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {infiniteCategories.map((item, index) => (
            <div key={index} className="flex-shrink-0 flex flex-col items-center w-64">
              <div className="relative w-50 h-55 rounded-2xl overflow-hidden cursor-pointer group/card">
                <div className="absolute inset-0 bg-black translate-y-full group-hover/card:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
                <img
                  src={item.img}
                  alt={item.title}
                  className="relative z-10 mx-auto w-50 h-50 object-cover rounded-2xl transition-transform duration-500 group-hover/card:scale-95"
                />
              </div>
              <p className="mt-4 font-semibold text-gray-800 hover:text-white uppercase text-sm tracking-wide">
                {item.title}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GiftSlider;