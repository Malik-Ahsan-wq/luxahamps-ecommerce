"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const VoicePage = () => {
  const reviews = [
    { id: 1, img: "/assets/dxw57hi0ldbzlhnicrma.webp", name: "Wesley Barker", text: "Fast delivery and premium packaging. Will definitely buy again." },
    { id: 2, img: "/assets/Hc869a243ea6e44ea9d83a7c9bdfd11be9.avif", name: "Jane Doe", text: "Incredible service and attention to detail!" },
    { id: 3, img: "/assets/kbuhajqunbgk3ubwtney.webp", name: "Alex Smith", text: "The website is super fast and easy to use." },
    { id: 4, img: "/assets/dxw57hi0ldbzlhnicrma.webp", name: "Wesley Barker", text: "Fast delivery and premium packaging. Will definitely buy again." },
    { id: 5, img: "/assets/Hc869a243ea6e44ea9d83a7c9bdfd11be9.avif", name: "Jane Doe", text: "Incredible service and attention to detail!" },
    { id: 6, img: "/assets/kbuhajqunbgk3ubwtney.webp", name: "Alex Smith", text: "The website is super fast and easy to use." },
    { id: 7, img: "/assets/dxw57hi0ldbzlhnicrma.webp", name: "Wesley Barker", text: "Fast delivery and premium packaging. Will definitely buy again." },
  ];

  const brands = [
    "ROLEX", "GUCCI", "PRADA", "DIOR", "CHANEL", "HERMÈS", "ZARA", "ADIDAS", "NIKE"
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <style jsx global>{`
        @media (max-width: 768px) {
          .swiper-button-next, .swiper-button-prev { display: none !important; }
        }
        .swiper-button-next, .swiper-button-prev { color: black; transform: scale(0.7); }
        
        /* Smooth Linear Motion for Brands */
        .brand-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>

      {/* --- Testimonial Section --- */}
      <div className="container py-10 mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-widest uppercase">
          Voices of Praise
        </h2>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          navigation={true}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 40 },
            1024: { slidesPerView: 5, spaceBetween: 50 },
          }}
          className="testimonial-swiper !pb-10"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="flex flex-col items-center">
              {({ isActive }) => (
                <div className={`transition-all duration-500 flex flex-col items-center ${isActive ? 'scale-105 opacity-100' : 'scale-90 opacity-40'}`}>
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-lg mb-6 mt-10">
                    <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                  </div>
                  <div className={`text-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    <div className="flex justify-center text-yellow-400 text-xl mb-4">★★★★★</div>
                    <p className="max-w-md mx-auto text-gray-700 italic mb-4 px-1">"{review.text}"</p>
                    <h3 className="text-xl mb-10 font-bold italic border-b-2 border-black inline-block pb-1">{review.name}</h3>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* --- Continuous Brand Slider --- */}
      <div className="border-t border-b border-black py-6 mt-10">
        <Swiper
          modules={[Autoplay, FreeMode]}
          slidesPerView={2}
          spaceBetween={30}
          loop={true}
          freeMode={true}
          speed={5000} // Speed of the transition (higher = slower/smoother)
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 4 },
            1024: { slidesPerView: 6 },
          }}
          className="brand-swiper"
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center">
              <span className="text-black font-bold text-lg md:text-xl tracking-widest uppercase hover:text-black transition-colors cursor-default">
                {brand}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default VoicePage;