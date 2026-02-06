"use client";
import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles in your global CSS or here if your setup allows:
// import 'swiper/css';

const BrandSlider = () => {
  const brands = useMemo(() => [
    "ROLEX", "GUCCI", "PRADA", "DIOR", "CHANEL", 
    "HERMÈS", "ZARA", "ADIDAS", "NIKE"
  ], []);

  const loopEnabled = brands.length > 3;
  return (
    <div className="relative mt-16 md:mt-24 py-10 bg-white">
      {/* Visual Accents: Top and Bottom Decorative Lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Side Masks: Creates a professional "fade" on the edges */}
      <div className="absolute inset-y-0 left-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />

      <Swiper
        modules={[Autoplay]}
        slidesPerView="auto"
        centeredSlides={true}
        spaceBetween={60}
        loop={loopEnabled}
        watchOverflow={true}
        speed={10000} // Ultra slow for luxury feel
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        className="brand-swiper !ease-linear"
        breakpoints={{
          320: { spaceBetween: 40 },
          640: { spaceBetween: 80 },
          1024: { spaceBetween: 120 },
        }}
      >
        {[...brands, ...brands].map((brand, index) => (
          <SwiperSlide 
            key={`${brand}-${index}`} 
            className="!w-auto !flex items-center"
          >
            <div className="group flex items-center gap-4">
              {/* Luxury Dot Separator */}
              <div className="w-1.5 h-1.5 rounded-full bg-pink-500 opacity-20" />
              
              <span 
                className="text-slate-900 font-black text-lg md:text-2xl tracking-[0.3em] uppercase transition-all duration-500 hover:text-pink-600 hover:scale-110"
              >
                {brand}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BrandSlider;
