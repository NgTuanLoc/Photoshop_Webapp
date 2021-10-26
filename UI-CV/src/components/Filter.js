import React, { useEffect, useState } from "react";
import ReactCrop from "react-image-crop";
import TuneIcon from "@mui/icons-material/Tune";
import FilterIcon from "@mui/icons-material/Filter";
import CropIcon from "@mui/icons-material/Crop";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import FlipIcon from "@mui/icons-material/Flip";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import testImg from "../images/logo.png";
import { isOpenModal } from "../redux/actions/ModalAction";
import { useDispatch, useSelector } from "react-redux";
import { getCroppedImg } from "../utils/CropImg";
import { setImageAction } from "../redux/actions/ImageHandlingAction";
import { transformImage } from "../utils/TransformImg";

import "react-image-crop/dist/ReactCrop.css";

const Filter = () => {
  const isDark = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();
  const styleDarkmode = {
    backgroundColor: isDark ? "rgb(33,34,35)" : "rgb(255,251,245)",
    color: isDark ? "rgb(195,198,202)" : "",
  };

  const [imgSrc, setImgSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [handlingImg, setHandlingImg] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    aspect: 0 / 0,
  });
  const [rotate, setRotate] = useState(0);

  const [value, setValue] = useState(1);

  const styleRotate = {
    transform: `rotate(${rotate}deg)`,
  };
  const handleChangeFile = (e) => {
    setImgSrc(URL.createObjectURL(e.target.files[0]));
  };
  // useEffect(() => {
  //   if (image) {
  //     const croppedImg = getCroppedImg(image, crop, rotate);

  //     setHandlingImg(croppedImg);
  //     dispatch(setImageAction(handlingImg));
  //   }
  // }, [crop, rotate, image, handlingImg, dispatch]);

  useEffect(() => {
    if (image) {
      const newImage = transformImage(image, value, "brightness");
      setHandlingImg(newImage);
      dispatch(setImageAction(handlingImg));
      setImgSrc(newImage);
    }
  }, [value, image, dispatch, handlingImg]);

  const rotateLeft = () => {
    var newRotate = rotate - 90;
    if (newRotate < -360) {
      newRotate = newRotate + 360;
      setRotate(newRotate);
    } else {
      setRotate(newRotate);
    }
  };

  return (
    <div className="filter" style={styleDarkmode}>
      <div className="filter__state">
        <div className="filter__state-upload">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleChangeFile}
          />
          <label htmlFor="file" className="filter-file__upload">
            <InsertPhotoIcon className="filter-file__icon" />
            <span>Select Image</span>
          </label>
        </div>
        <div
          className="filter__state-confirm"
          onClick={() => dispatch(isOpenModal(true))}
        >
          Preview
        </div>
      </div>
      <div className="filter__handle-image">
        <ul className="filter__handle-list">
          <li className="filter__handle-item">
            <CropIcon />
            <br />
            <span>Crop</span>
          </li>
          <li className="filter__handle-item">
            <TuneIcon />
            <br />
            <span>Bright</span>
          </li>
          <li className="filter__handle-item">
            <FilterIcon />
            <br />
            <span>Filter</span>
          </li>
        </ul>
        <div className="filter__handle-rotate">
          <ul className="filter__rotate-list">
            <li className="filter__rotate-item">
              <Rotate90DegreesCcwIcon />
              <div onClick={rotateLeft}>Rotate left</div>
            </li>
            <li className="filter__rotate-item">
              <FlipIcon />
              <div>Flip horizontal</div>
            </li>
            <li className="filter__rotate-item">
              <DashboardIcon />
              <div>Crop Shape</div>
            </li>
          </ul>
          <div className="filter__image-handling" style={styleRotate}>
            <ReactCrop
              src={imgSrc ? imgSrc : testImg}
              onImageLoaded={setImage}
              crop={crop}
              onChange={setCrop}
              rotate={rotate}
            />
          </div>

          <div className="filter__rotate-control">
            <input
              className="input__range"
              type="range"
              style={{ width: "404px" }}
              min={-180}
              max={180}
              value={rotate}
              onChange={(e) => setRotate(e.target.value)}
            />
            <div>{rotate}</div>
          </div>

          <div className="filter__rotate-control">
            <input
              className="input__range"
              type="range"
              style={{ width: "404px" }}
              min={-20}
              max={20}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <div>{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
