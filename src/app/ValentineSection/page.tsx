"use client";
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const ValentineSection = () => {
  // Data for the different categories
  const collections = [
    { 
      id: "valentine", 
      title: "Valentine Day", 
      image: "/assets/k2wtitnfsvysr7yuop8q.webp", // Replace with your image paths
      desc: "Embrace romance with our Valentine's Day collection. Find the perfect gift to captivate hearts." 
    },
    { 
      id: "birthday", 
      title: "Birthday", 
      image: "/assets/Gemini_Generated_Image_zk9mkzk9mkzk9mkz.png", 
      desc: "Celebrate another year of joy with our special birthday hampers designed to make them feel loved." 
    },
    { 
      id: "anniversary", 
      title: "Anniversary", 
      image: "/assets/istockphoto-1293366109-612x612.jpg", 
      desc: "Honor your journey together with elegant anniversary gifts that speak volumes of your love." 
    },
    { 
      id: "surprise", 
      title: "Surprise Box", 
      image: "/assets/dxw57hi0ldbzlhnicrma.webp", 
      desc: "Unbox happiness with our curated surprise boxes, filled with delightful treats for any occasion." 
    },
  ];

  // State to track the currently hovered item
  const [activeItem, setActiveItem] = useState(collections[0]);

  return (
    <section className="flex flex-col md:flex-row w-full min-h-[150px] overflow-hidden">
      
      {/* Left Side: Dynamic Image */}
      <div className="w-full md:w-1/2 relative h-[400px] md:h-auto overflow-hidden">
        {collections.map((item) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              activeItem.id === item.id ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        ))}
        {/* Decorative Track Badge (Optional) */}
    
      </div>

      {/* Right Side: Content Area */}
      <div className="w-full md:w-1/2 bg-[#FCE4EC] flex flex-col justify-center p-8 md:p-20">
        <ul className="space-y-4 mb-8">
          {collections.map((item) => (
            <li
              key={item.id}
              onMouseEnter={() => setActiveItem(item)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {/* Dot indicator */}
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeItem.id === item.id ? "bg-black scale-125" : "bg-gray-400 opacity-50"
              }`} />
              
              <h2 className={`text-2xl md:text-2xl font-bold transition-all duration-300 ${
                activeItem.id === item.id ? "text-black translate-x-2" : "text-gray-500 hover:text-black"
              }`}>
                {item.title}
              </h2>
            </li>
          ))}
        </ul>

        {/* Dynamic Description Area */}
        <div className="min-h-[80px]">
          <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-8 transition-opacity duration-500">
            {activeItem.desc}
          </p>
        </div>

        <button className="w-fit bg-black text-white px-8 py-4 flex items-center gap-3 group hover:bg-pink-600 transition-all duration-300">
          <span className="uppercase cursor-pointer text-xs font-bold tracking-widest text-white">Shop Collection</span>
          <ArrowRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-1 " />
        </button>
      </div>
    </section>
  );
};

export default ValentineSection;