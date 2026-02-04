import React from 'react';
import { Crown, Truck, Headphones } from 'lucide-react';

const OurPromise = () => {
  const promises = [
    {
      icon: <Crown className="w-8 h-8" strokeWidth={1.5} />,
      title: "Unbeatable Quality",
      description: "Experience luxury without compromise with our commitment to impeccable quality in every product."
    },
    {
      icon: <Truck className="w-8 h-8" strokeWidth={1.5} />,
      title: "Delivery To Your Door",
      description: "Experience the convenience of luxury with our seamless doorstep delivery service."
    },
    {
      icon: <Headphones className="w-8 h-8" strokeWidth={1.5} />,
      title: "All The Help You Need",
      description: "From selection to customization, we're here to assist you every step of the way."
    }
  ];

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section Heading */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-widest uppercase text-black">
          Our Promise
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
        {promises.map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            {/* Icon Wrapper */}
            <div className="mb-6 text-black">
              {item.icon}
            </div>
            
            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
              {item.title}
            </h3>
            
            {/* Description */}
            <p className="text-gray-600 leading-relaxed max-w-xs md:max-w-sm">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPromise;