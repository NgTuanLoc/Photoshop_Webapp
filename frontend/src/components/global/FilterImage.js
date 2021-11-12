import React, { useState } from "react";
import SwiperCore, { EffectCoverflow, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";

import { DEFAULT_FILTER } from "../utils/function/defaultFilter";

SwiperCore.use([EffectCoverflow, Pagination]);

const Filterimage = ({ imgSrc }) => {
  const [defaultFilter, setDefaultFilter] = useState(DEFAULT_FILTER);
  const [selected, setSelected] = useState(0);

  const savePreview = async (filter) => {
    var canvas = await document.createElement("canvas");
    var ctx = await canvas.getContext("2d");
    var img = await document.getElementById("imageSetPreview");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.filter = filter.filter;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL("image/png");
    window.location.href = data;
    var a = document.createElement("a");
    a.href = data;
    a.download = "download.png";
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className="filer__image">
      <img
        className="filer__image-selected"
        style={DEFAULT_FILTER[selected]}
        src={imgSrc}
        alt=""
        id="imageSetPreview"
      />
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        loop={true}
        centeredSlides={true}
        slidesPerView={"3"}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 500,
          modifier: 1,
          slideShadows: true,
        }}
        className="filter__swiper"
      >
        {defaultFilter &&
          defaultFilter.map((filter, index) => {
            return (
              <SwiperSlide key={index} onClick={() => setSelected(index)}>
                <img style={filter} src={imgSrc} alt="" />
              </SwiperSlide>
            );
          })}
      </Swiper>
      <button
        className="filer__swiper-download"
        onClick={() => savePreview(DEFAULT_FILTER[selected])}
      >
        {" "}
        Download{" "}
      </button>
    </div>
  );
};

export default Filterimage;
