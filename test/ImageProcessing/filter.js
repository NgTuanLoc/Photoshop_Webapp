let filters = {
  grayscale: function (src) {
    return src.map(function (data, idx) {
      let lev = Math.round(
        data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
      );
      data[idx] = data[idx + 1] = data[idx + 2] = lev;
    });
  },
  invert: function (src) {
    return src.map(function (data, idx) {
      data[idx] = 255 - data[idx];
      ++idx;
      data[idx] = 255 - data[idx];
      ++idx;
      data[idx] = 255 - data[idx];
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
    });
  },

  histogram: function (src) {
    // histogram equalization, blended with original image
    // amount is between 0 and 1
    let h = src.h,
      w = src.w;

    // grayscale image
    let gimg = filters.grayscale(src);

    // build histogram (pdf)
    let hist = histogram(gimg, 0, 0, w, h);

    // compute cdf
    let cdf = buildcdf(hist);
    let cumuhist = normalizecdf(cdf, 255);

    let round = Math.round;
    let clp = clamp;

    // equalize
    return src.map(function (data, idx) {
      let lev = gimg.data[idx];
      let cI = cumuhist[lev];
      let ratio = cI / lev;
      data[idx] = clp(round(data[idx] * ratio), 0, 255);
      ++idx;
      data[idx] = clp(round(data[idx] * ratio), 0, 255);
      ++idx;
      data[idx] = clp(round(data[idx] * ratio), 0, 255);
    });
  },
  ahe: function (src) {
    // find a good window size
    let h = src.h,
      w = src.w;

    // tile size
    let tilesize = [64, 64];

    // number of bins
    let num_bins = 256;

    // number of tiles in x and y direction
    let xtiles = Math.ceil(w / tilesize[0]);
    let ytiles = Math.ceil(h / tilesize[1]);

    let cdfs = new Array(ytiles);
    for (let i = 0; i < ytiles; i++) cdfs[i] = new Array(xtiles);

    let inv_tile_size = [1.0 / tilesize[0], 1.0 / tilesize[1]];

    let binWidth = 256 / num_bins;

    let gimg = filters.grayscale(src);

    // create histograms
    for (let i = 0; i < ytiles; i++) {
      let y0 = i * tilesize[1];
      let y1 = Math.min(y0 + tilesize[1], h);
      for (let j = 0; j < xtiles; j++) {
        let x0 = j * tilesize[0];
        let x1 = Math.min(x0 + tilesize[0], w);
        let hist = histogram(gimg, x0, y0, x1, y1, num_bins);

        let cdf = buildcdf(hist);
        cdf = normalizecdf(cdf, 255);

        cdfs[i][j] = cdf;
      }
    }

    let dst = new RGBAImage(w, h);
    let srcdata = src.data;

    for (let y = 0, idx = 0; y < h; ++y) {
      for (let x = 0; x < w; ++x, idx += 4) {
        // intensity of current pixel
        let I = gimg.getPixel(x, y).r;

        // bin index
        let bin = Math.floor(I / binWidth);

        // current tile
        let tx = x * inv_tile_size[0] - 0.5;
        let ty = y * inv_tile_size[1] - 0.5;

        let xl = Math.max(Math.floor(tx), 0);
        let xr = Math.min(xl + 1, xtiles - 1);

        let yt = Math.max(Math.floor(ty), 0);
        let yd = Math.min(yt + 1, ytiles - 1);

        let fx = tx - xl;
        let fy = ty - yt;

        let cdf11 = cdfs[yt][xl][bin];
        let cdf12 = cdfs[yd][xl][bin];
        let cdf21 = cdfs[yt][xr][bin];
        let cdf22 = cdfs[yd][xr][bin];

        // bilinear interpolation
        let Iout =
          (1 - fx) * (1 - fy) * cdf11 +
          (1 - fx) * fy * cdf12 +
          fx * (1 - fy) * cdf21 +
          fx * fy * cdf22;

        let ratio = Iout / I;
        let c = new Color(
          srcdata[idx] * ratio,
          srcdata[idx + 1] * ratio,
          srcdata[idx + 2] * ratio,
          srcdata[idx + 3]
        );
        dst.setPixel(x, y, c.clamp());
      }
    }

    return dst;
  },
  // lut is the look up table defined by the input curve
  curve: function (src, lut, channel) {
    switch (channel) {
      case "red": {
        return src.map(function (data, idx) {
          data[idx] = lut[data[idx]];
        });
      }
      case "green": {
        return src.map(function (data, idx) {
          data[idx + 1] = lut[data[idx + 1]];
        });
      }
      case "blue": {
        return src.map(function (data, idx) {
          data[idx + 2] = lut[data[idx + 2]];
        });
      }
      case "brightness":
      default: {
        let round = Math.round;
        let clp = clamp;
        return src.map(function (data, idx) {
          let lev = round(
            data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114
          );
          let bias = 1e-6; // prevent divide by zero
          let ratio = lut[lev] / (lev + bias);
          data[idx] = clp(round(data[idx] * ratio), 0, 255);
          ++idx;
          data[idx] = clp(round(data[idx] * ratio), 0, 255);
          ++idx;
          data[idx] = clp(round(data[idx] * ratio), 0, 255);
        });
      }
    }
  },
};
