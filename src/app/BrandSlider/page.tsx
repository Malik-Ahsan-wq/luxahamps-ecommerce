
"use client";
import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

const BrandSlider = () => {

     const brands = useMemo(() => [
    "ROLEX", "GUCCI", "PRADA", "DIOR", "CHANEL", 
    "HERMÈS", "ZARA", "ADIDAS", "NIKE"
  ], []);
  return (
  <div className="mt-16 md:mt-20 lg:mt-24 border-t border-b border-gray-300 bg-white py-6 md:py-8">
        <Swiper
          modules={[Autoplay]}
          slidesPerView="auto"
          spaceBetween={40}
          loop={true}
          speed={8000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={false}
          breakpoints={{
            320: { spaceBetween: 30 },
            640: { spaceBetween: 50 },
            1024: { spaceBetween: 80 },
          }}
          className="brand-swiper"
        >
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <SwiperSlide 
              key={`${brand}-${index}`} 
              className="!w-auto"
            >
              <span 
                className="brand-text text-black font-bold text-base md:text-lg lg:text-xl tracking-[0.25em] uppercase cursor-default inline-block px-4"
              >
                {brand}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
  )
}

export default BrandSlider;