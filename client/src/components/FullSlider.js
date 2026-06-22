import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "../styles/FullSlider.css";

function FullSlider({ media }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const hasMultiple = media.length > 1;

  const handleImageClick = (url) => {
    setZoomedImage(url);
  };

  const closeZoom = () => {
    setZoomedImage(null);
  };

  return (
    <>
      <div className="fullSliderWrapper">
        <div className="mainSliderContainer">
          {hasMultiple && (
            <button
              className="customSliderBtn customSliderBtnLeft"
              onClick={() => mainSwiperRef.current?.swiper.slidePrev()}
            >
              ‹
            </button>
          )}

          <Swiper
            ref={mainSwiperRef}
            modules={[FreeMode, Thumbs]}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            className="mainSlider"
            loop={hasMultiple}
          >
            {media.map((file, index) => {
              const url = `https://oltinnisbat.onrender.com/${file}`;
              const isVideo = file.endsWith(".mp4") || file.endsWith(".mov") || file.endsWith(".avi");

              return (
                <SwiperSlide key={index} className="mainSwiperSlide">
                  {isVideo ? (
                    <video src={url} controls className="fullSliderMedia" />
                  ) : (
                    <img
                      src={url}
                      alt={`Full Media ${index}`}
                      className="fullSliderMedia"
                      onClick={() => handleImageClick(url)}
                    />
                  )}
                </SwiperSlide>
              );
            })}
          </Swiper>

          {hasMultiple && (
            <button
              className="customSliderBtn customSliderBtnRight"
              onClick={() => mainSwiperRef.current?.swiper.slideNext()}
            >
              ›
            </button>
          )}
        </div>

        {hasMultiple && (
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            spaceBetween={10}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            className="thumbsSlider"
          >
            {media.map((file, index) => (
              <SwiperSlide key={index} className="thumbSwiperSlide">
                <img
                  src={`https://oltinnisbat.onrender.com/${file}`}
                  alt={`Thumb ${index}`}
                  className="thumbImage"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div className="zoomOverlay" onClick={closeZoom}>
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="zoomedImage"
            onClick={closeZoom}
          />
        </div>
      )}
    </>
  );
}

export default FullSlider;
