"use client";
import React, { useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const VoicePage = () => {
  // Memoize reviews data
  const reviews = useMemo(() => [
    { 
      id: 1, 
      img: "/assets/dxw57hi0ldbzlhnicrma.webp", 
      name: "Wesley Barker", 
      text: "Fast delivery and premium packaging. Will definitely buy again.",
      rating: 5
    },
    { 
      id: 2, 
      img: "/assets/Hc869a243ea6e44ea9d83a7c9bdfd11be9.avif", 
      name: "Jane Doe", 
      text: "Incredible service and attention to detail!",
      rating: 5
    },
    { 
      id: 3, 
      img: "/assets/kbuhajqunbgk3ubwtney.webp", 
      name: "Basit", 
      text: "Fast delivery and premium packaging. Will definitely buy again.I Create This Website And its super fast",
      rating: 3
    },
    { 
      id: 4, 
      img: "/assets/dxw57hi0ldbzlhnicrma.webp", 
      name: "Michael Chen", 
      text: "Outstanding quality and customer support. Highly recommended!",
      rating: 5
    },
    { 
      id: 5, 
      img: "/assets/Hc869a243ea6e44ea9d83a7c9bdfd11be9.avif", 
      name: "Malik Ahsan", 
      text: "Professional service from start to finish. Five stars!",
      rating: 5
    },
    { 
      id: 6, 
      img: "/assets/kbuhajqunbgk3ubwtney.webp", 
      name: "Malik Haroon Ahmed", 
      text: "Best shopping experience I've had online. Will be back!",
      rating: 4
    },
    { 
      id: 7, 
      img: "/assets/dxw57hi0ldbzlhnicrma.webp", 
      name: "Rana Haroon Khan", 
      text: "Exceeded all expectations. Truly remarkable service!",
      rating: 5
    },
  ], []);

 

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <style jsx global>{`
        /* Navigation Buttons */
        .testimonial-swiper .swiper-button-next,
        .testimonial-swiper .swiper-button-prev {
          color: #000;
          width: 25px;
          height: 25px;
          background: transparent;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .testimonial-swiper .swiper-button-next:after,
        .testimonial-swiper .swiper-button-prev:after {
          font-size: 28px;
          font-weight: bold;
        }

        .testimonial-swiper .swiper-button-next:hover,
        .testimonial-swiper .swiper-button-prev:hover {
          transform: scale(1.2);
        }

        /* Hide navigation on mobile */
        @media (max-width: 768px) {
          .testimonial-swiper .swiper-button-next,
          .testimonial-swiper .swiper-button-prev {
            display: none !important;
          }
        }

        /* Swiper Slide Transitions */
        .testimonial-swiper .swiper-slide {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0.5;
          transform: scale(0.85);
        }

        .testimonial-swiper .swiper-slide-active {
          opacity: 1;
          transform: scale(1);
        }

        /* Ensure smooth scaling */
        .testimonial-swiper .swiper-wrapper {
          align-items: center;
        }

        /* Star styling */
        .star-filled {
          color: #fbbf24;
        }

        .star-empty {
          color: #e5e7eb;
        }

        /* Smooth image transitions */
        .testimonial-image {
          transition: transform 0.3s ease;
        }

        .testimonial-image:hover {
          transform: scale(1.05);
        }

        /* Brand Slider */
        .brand-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
        }

        .brand-swiper {
          user-select: none;
        }

        .brand-text {
          transition: opacity 0.3s ease;
        }

        .brand-text:hover {
          opacity: 0.7;
        }
      `}</style>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-10 md:mb-14 lg:mb-16 tracking-[0.2em] uppercase">
          VOICES OF PRAISE
        </h2>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1.2}
          centeredSlides={true}
          loop={true}
          navigation={true}
          grabCursor={true}
          autoplay={{ 
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          speed={600}
          breakpoints={{
            480: { 
              slidesPerView: 1.5,
              spaceBetween: 20
            },
            640: { 
              slidesPerView: 2.2,
              spaceBetween: 25
            },
            768: { 
              slidesPerView: 2.5,
              spaceBetween: 30
            },
            1024: { 
              slidesPerView: 3.5,
              spaceBetween: 35
            },
            1280: { 
              slidesPerView: 4.2,
              spaceBetween: 40
            },
            1536: { 
              slidesPerView: 5,
              spaceBetween: 45
            },
          }}
          className="testimonial-swiper !pb-4 md:!pb-6"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="flex flex-col items-center">
                {/* Image with rounded corners */}
                <div className="w-full aspect-square max-w-[280px] md:max-w-[200px] rounded-[28px] md:rounded-[36px] overflow-hidden shadow-lg mb-6 md:mb-8 bg-gray-100">
                  <img 
                    src={review.img} 
                    alt={`${review.name}'s testimonial`}
                    className="testimonial-image w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center gap-1 text-2xl md:text-3xl mb-4 md:mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={i < review.rating ? 'star-filled' : 'star-empty'}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-sm md:text-base text-gray-700 text-center max-w-sm mx-auto mb-4 md:mb-5 px-4 leading-relaxed">
                  {review.text}
                </p>

                {/* Author Name */}
                <h3 className="text-lg md:text-xl font-bold italic text-gray-900">
                  {review.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Brand Slider Section */}
     
    </section>
  );
};

export default VoicePage;