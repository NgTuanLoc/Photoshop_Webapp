import { clamp } from "./colorutils";

let filters = {
  grayscale: function (src) {
    return src.map(function (data, idx) {
      let lev = Math.round(
        data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
      );
      data[idx] = data[idx + 1] = data[idx + 2] = lev;
      return data;
    });
  },
  invert: function (src) {
    return src.map(function (data, idx) {
      data[idx] = 255 - data[idx];
      ++idx;
      data[idx] = 255 - data[idx];
      ++idx;
      data[idx] = 255 - data[idx];
      return data;
    });
  },
  brightness: function (src, val) {
    let clp = clamp;
    return src.map(function (data, idx) {
      data[idx] = clp(data[idx] + val, 0, 255);
      ++idx;
      data[idx] = clp(data[idx] + val, 0, 255);
      ++idx;
      data[idx] = clp(data[idx] + val, 0, 255);
      return data;
    });
  },
  contrast: function (src, val) {
    let factor = (val + 255) / (255.01 - val);
    let clp = clamp;
    return src.map(function (data, idx) {
      data[idx] = clp(factor * (data[idx] - 128) + 128, 0, 255);
      ++idx;
      data[idx] = clp(factor * (data[idx] - 128) + 128, 0, 255);
      ++idx;
      data[idx] = clp(factor * (data[idx] - 128) + 128, 0, 255);
      return data;
    });
  },
};

export { filters };
