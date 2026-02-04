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

// Double the array to create a seamless infinite loop
const infiniteCategories = [...categories, ...categories];

const GiftSlider = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold uppercase tracking-tight">Gifts by Category</h2>
        <p className="text-gray-500 mt-2">Explore our curated gift categories for effortless gifting tailored to every taste.</p>
      </div>

      {/* Slider Container */}
      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex space-x-3 min-w-full"
          animate={{ x: isPaused ? 0 : ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 5, // Adjust speed here
              ease: "linear",
            },
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {infiniteCategories.map((item, index) => (
            <div key={index} className="flex-shrink-0 flex flex-col items-center w-64">
              {/* Image Card with Hover Effect */}
              <div className="relative w-50 h-55 rounded-2xl overflow-hidden cursor-pointer group/card">
                
                {/* Black Background Animation */}
                <div className="absolute inset-0 bg-black translate-y-full group-hover/card:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
                
                {/* The Image */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="relative z-10 mx-auto w-50 h-50 object-cover rounded-2xl transition-transform duration-500 group-hover/card:scale-95"
                />
               
              </div>
                <p className="mt-4  font-semibold text-gray-800 hover:text-white uppercase text-sm tracking-wide">
                {item.title}
              </p>

              {/* Title */}
             
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default GiftSlider;