import { RGBAImage } from "./image";

let ImageLoader = function (mw) {
  this.maxEdge = mw || 640;
  this.result = undefined;

  // load an image with the specified canvas object
  this.loadImage = function (imgsrc, cvs) {
    let that = this;
    // create an Image object
    let img = new Image();
    img.onload = function () {
      let inImg = RGBAImage.fromImage(img, cvs);
      that.result = inImg.resize_longedge(that.maxEdge);
      that.result.render(cvs);
    //   $(document).trigger("imageloaded");
    };
    img.src = imgsrc;
  };
};

export { ImageLoader };
