import { RGBAImage } from "./image";
import { filters } from "./filters";

export const transformImage = (image, value, type) => {
  //   let maxEdge = 640;
  let convertedValue = parseFloat(value);
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  let inImg = RGBAImage.fromImage(image, canvas);
  //   let temp;
  switch (type) {
    case "brightness":
      inImg = filters.brightness(inImg, convertedValue);
      // console.log(filters.test(test, convertedValue));
      // imgData = filters.invert(imgData);
      break;

    default:
      console.log("Invalid Filters");
      break;
  }
  console.log(inImg);
  inImg.render(canvas);
  //   let result = inImg.resize_longedge();

  const base64Image = canvas.toDataURL("image/jpeg");

  return base64Image;
};
