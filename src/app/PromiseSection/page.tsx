import React from 'react';
import { Crown, Truck, Headphones } from 'lucide-react';

const OurPromise = () => {
  const promises = [
    {
      icon: <Crown className="w-10 h-10 transition-transform group-hover:scale-110 duration-500" />,
      title: "Unbeatable Quality",
      description: "Experience luxury without compromise with our commitment to impeccable quality in every product."
    },
    {
      icon: <Truck className="w-10 h-10 transition-transform group-hover:scale-110 duration-500" />,
      title: "Delivery To Your Door",
      description: "Experience the convenience of luxury with our seamless doorstep delivery service."
    },
    {
      icon: <Headphones className="w-10 h-10 transition-transform group-hover:scale-110 duration-500" />,
      title: "All The Help You Need",
      description: "From selection to customization, we're here to assist you every step of the way."
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-white">
      {/* High-End Section Heading */}
      <div className="text-center mb-20">
        <span className="text-pink-600 text-xs font-black uppercase tracking-[0.4em] mb-4 block">
          The Luxa Guarantee
        </span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 leading-none">
          Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-400">Promise</span>
        </h2>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-[1px] w-12 bg-slate-200" />
          <div className="h-1.5 w-1.5 rounded-full bg-pink-500" />
          <div className="h-[1px] w-12 bg-slate-200" />
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {promises.map((item, index) => (
          <div 
            key={index} 
            className="group relative p-10 flex flex-col items-center text-center transition-all duration-500 hover:bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-slate-100"
          >
            {/* Soft Glow Background Effect on Hover */}
            <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/[0.02] rounded-[2.5rem] transition-colors duration-500" />

            {/* Icon Wrapper - Professional Accent */}
            <div className="mb-8 p-6  rounded-3xl bg-slate-50 text-pink-600 shadow-sm transition-all duration-500 group-hover:bg-pink-600 group-hover:text-white group-hover:shadow-xl group-hover:shadow-pink-200 group-hover:-translate-y-2">
              {item.icon}
            </div>
            
            {/* Title - Bold & Sharp */}
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">
              {item.title}
            </h3>
            
            {/* Description - Optimized Leading */}
            <p className="text-slate-500 leading-relaxed font-medium text-sm md:text-base max-w-xs transition-colors group-hover:text-slate-600">
              {item.description}
            </p>

            {/* Subtle Interactive Element */}
            <div className="mt-6 h-1 w-0 bg-pink-500 rounded-full transition-all duration-500 group-hover:w-12" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPromise;