"use client";
import React, { useState, useEffect } from "react";
import { ChevronRightIcon } from "lucide-react";
const slides = [
  {
    image: "/assets/customization.webp",
    shortTitle: "Your Style",
    title: "Customize Your Style Easily",
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
    <div className="w-full relative h-screen overflow-hidden">
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
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-start p-6 md:p-20">
              {/* Short Heading */}
              <h3 className="text-xl md:text-2xl text-white font-semibold mb-2">
                {slide.shortTitle}
              </h3>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                {slide.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-white max-w-xl mb-6">
                {slide.description}
              </p>

              {/* Book Now Button */}
              <button className="flex cursor-pointer items-center text-white font-medium gap-2 hover:text-pink-500 transition">
                Book Now
                <ChevronRightIcon className="w-5 h-5" />
              </button>
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
