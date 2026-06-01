import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../styles/CardSlider.css";

function CardSlider({ media, onImageClick }) {
  const swiperRef = useRef(null);
  const hasMultiple = media.length > 1;

  return (
    <div className="cardSliderWrapper">
      {hasMultiple && (
        <button
          className="customSliderBtn customSliderBtnLeft"
          onClick={() => swiperRef.current?.swiper.slidePrev()}
        >
          ‹
        </button>
      )}

      <Swiper
        ref={swiperRef}
        modules={[Pagination]}
        pagination={false}
        className="cardSwiper"
        loop={hasMultiple}
        autoHeight={false}
      >
        {media.map((file, index) => {
          const url = `http://localhost:8070/${file}`;
          const isVideo = file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".avi");

          return (
            <SwiperSlide key={index} className="cardSwiperSlide">
              {isVideo ? (
                <video src={url} controls className="sliderMedia" />
              ) : (
                <img
                  src={url}
                  alt={`Media ${index}`}
                  className="sliderMedia"
                  onClick={() => onImageClick(url)}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>

      {hasMultiple && (
        <button
          className="customSliderBtn customSliderBtnRight"
          onClick={() => swiperRef.current?.swiper.slideNext()}
        >
          ›
        </button>
      )}
    </div>
  );
}

export default CardSlider;
