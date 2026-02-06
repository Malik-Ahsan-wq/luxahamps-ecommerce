import React from 'react';
import Link from 'next/link';
import { ArrowRight, Link as LinkIcon } from 'lucide-react';


const HappinessSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      
      {/* Left Content Side */}
      <div className="flex-1 space-y-6 text-center md:text-left">
        <h4 className="text-gray-600 font-bold text-xs md:text-sm tracking-[0.2em] uppercase">
          Give a gift that makes faces smile
        </h4>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-black leading-tight">
          Gift Happiness, Spread Joy
        </h1>
        
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-xl">
          Make every occasion memorable with Luxahamp's curated hampers that bring smiles to faces. 
          From luxurious treats to thoughtful gifts, our hampers are sure to delight your loved ones.
        </p>

       <div className="pt-4 flex justify-center md:justify-start">
  <Link 
    href="/products" 
    className="bg-black text-white px-8 py-4 flex items-center gap-3 group hover:bg-pink-600 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-pink-500/20"
  >
    <span className="uppercase text-xs font-bold tracking-widest">
      Shop Gifts Hamper
    </span>
    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
  </Link>
</div>
        
     
      </div>

      {/* Right Image Collage Side */}
      <div className="flex-1 relative w-full h-[400px] md:h-[550px]">
        {/* Top Left Image */}
        <div className="absolute top-0 left-0 w-1/2 h-[50%] z-10 p-2">
          <img 
            src="/assets/Gemini_Generated_Image_f9pp0vf9pp0vf9pp.png" 
            className="w-full h-full object-cover rounded-2xl shadow-lg"
            alt="Gifting"
          />
        </div>

        {/* Center/Main Image (Overlapping) */}
        <div className="absolute top-[20%] right-[10%] w-[55%] h-[65%] z-20 p-2">
          <img 
            src="/assets/Gemini_Generated_Image_zk9mkzk9mkzk9mkz.png" 
            className="w-full h-full object-cover rounded-2xl shadow-2xl ring-4 ring-white"
            alt="Smiles"
          />
        </div>

        {/* Bottom Left Image */}
        <div className="absolute bottom-0 left-[15%] w-[35%] h-[40%] z-30 p-2">
          <img 
            src="/assets/fbesblw7qukemk1no2o5.webp" 
            className="w-full h-full object-cover rounded-2xl shadow-lg"
            alt="Hamper"
          />
        </div>

        {/* Far Right Image (Partial) */}
        <div className="absolute top-[10%] -right-10 w-1/3 h-[45%] z-0 p-2 opacity-80">
          <img 
            src="/assets/k2wtitnfsvysr7yuop8q.webp" 
            className="w-full h-full object-cover rounded-2xl shadow-sm"
            alt="Joy"
          />
        </div>
      </div>

    </section>
  );
};

export default HappinessSection;