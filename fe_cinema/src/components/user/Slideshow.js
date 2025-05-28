import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "./style.css";
const images = [
  "/quynhaptrang_poster.jpg",
  "/nhagiatien_poster.jpg",
  "/nutu_poster.jpg",
];

export const Slideshow = () => {
  return (
    <div>
      <div
        className="slideshow-wrapper"
        style={{ backgroundImage: "url('/bg_c_bricks.png')" }}
      >
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          className="swiper-custom"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index} className="swiper-slide-custom">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="slide-image"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Slideshow;
