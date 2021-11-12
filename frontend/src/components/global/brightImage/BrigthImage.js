import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Slider from "./Slider";
import SidebarItem from "./SidebarItem";
import { typeFilter } from "../../utils/function/TypeFilter";
import { setImageAction } from "../../../redux/actions/ImageHandlingAction";

const Brigthimage = ({ imgSrc }) => {
  const imageHandling = useSelector((state) => state.imageHandling);
  const dispatch = useDispatch();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [options, setOptions] = useState(typeFilter);
  const selectedOption = options[selectedOptionIndex];

  const handleSliderChange = ({ target }) => {
    setOptions((prevOptions) => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option;
        return { ...option, value: target.value };
      });
    });
  };

  const getImageStyle = () => {
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });

    return { filter: filters.join(" ") };
  };

  const save = async () => {
    var canvas = await document.createElement("canvas");
    var ctx = await canvas.getContext("2d");
    const filters = options.map((option) => {
      return `${option.property}(${option.value}${option.unit})`;
    });
    var img = await document.getElementById("dataimage");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.filter = `${filters.join(" ")}`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    var data = canvas.toDataURL("image/png");
    dispatch(setImageAction(data));
  };

  return (
    <div className="bright__image">
      <div className="bright__image-lists">
        {options.map((option, index) => {
          return (
            <SidebarItem
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              handleClick={() => setSelectedOptionIndex(index)}
            />
          );
        })}
      </div>
      {imageHandling ? (
        <img
          id="dataimage"
          className="bright__image-handing"
          src={imageHandling}
          alt=""
        />
      ) : (
        <img
          id="dataimage"
          className="bright__image-handing"
          src={imgSrc}
          alt=""
          style={getImageStyle()}
        />
      )}
      <Slider
        min={selectedOption.range.min}
        max={selectedOption.range.max}
        value={selectedOption.value}
        handleChange={handleSliderChange}
      />
      <button className="bright__image-save" onClick={save}>
        Save
      </button>
    </div>
  );
};

export default Brigthimage;
