import React from "react";

const Slider = ({ min, max, value, handleChange }) => {
  return (
    <div className="slider-container">
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
      />
      <div className="slider-container-value">{value} </div>
    </div>
  );
};

export default Slider;
