function RGBAImage( w, h, data )
{
	this.type = 'RGBAImage';
    this.w = w;
    this.h = h;
    this.data = new Uint8Array(w*h*4);	
    data && this.data.set(data);	
}

// get a pixel from the image
RGBAImage.prototype.getPixel = function(x, y) {
    let idx = (y * this.w + x) * 4;
    return new Color(
        this.data[idx+0],
        this.data[idx+1],
        this.data[idx+2],
        this.data[idx+3]
    );
};

// bilinear sample of the image
RGBAImage.prototype.sample = function(x, y) {
    let w = this.w, h = this.h;
    let ty = Math.floor(y);
    let dy = Math.ceil(y);

    let lx = Math.floor(x);
    let rx = Math.ceil(x);

    let fx = x - lx;
    let fy = y - ty;

    let c = this.getPixel(lx, ty).mul((1-fy) * (1-fx))
        .add(this.getPixel(lx, dy).mul(fy * (1-fx)))
        .add(this.getPixel(rx, ty).mul((1-fy) * fx))
        .add(this.getPixel(rx, dy).mul(fy * fx));

    c.clamp();

    return c;
};

// set a pixel value in the image
RGBAImage.prototype.setPixel = function(x, y, c) {
    let idx = (y * this.w + x) * 4;
    this.data[idx] = c.r;
    this.data[idx+1] = c.g;
    this.data[idx+2] = c.b;
    this.data[idx+3] = c.a;
};

// utility function
// per-pixel operation
RGBAImage.prototype.apply = function( f ) {
    for(let y=0;y<this.h;y++) {
        for(let x=0;x<this.w;x++) {
            this.setPixel(x, y, f(this.getPixel(x, y)));
        }
    }
    return this;
};

// utility function
// per-pixel operation
RGBAImage.prototype.map = function( f ) {
    let w = this.w, h = this.h;
    let dst = new RGBAImage(w, h, this.data);
    let data = dst.data;
	for(let y = 0,idx= 0;y<this.h;++y) {
		for(let x=0;x<this.w;++x,idx+=4) {
            f( data, idx, w, h );
		}
	}
	return dst;
};

// utility function
// resize image
RGBAImage.prototype.resize = function(w, h) {
    let iw = this.w, ih = this.h;
    // bilinear interpolation
    let dst = new RGBAImage(w, h);

    let ystep = 1.0 / (h-1);
    let xstep = 1.0 / (w-1);
    for(let i=0;i<h;i++) {
        let y = i * ystep;
        for(let j=0;j<w;j++) {
            let x = j * xstep;
            dst.setPixel(j, i, this.sample(x * (iw-1), y * (ih-1)));
        }
    }
    return dst;
};

RGBAImage.prototype.resize_longedge = function( L ) {
    let nw, nh;
    if( this.w > this.h && this.w > L ) {
        nw = L;
        nh = Math.round((L / this.w) * this.h);
        return this.resize(nw, nh);
    }
    else if( this.h > L ){
        nh = L;
        nw = Math.round((L / this.h) * this.w);
        return this.resize(nw, nh);
    }
    else return this;
};

// for web-gl
RGBAImage.prototype.uploadTexture = function( ctx, texId )
{
    let w = this.w;
    let h = this.h;

    ctx.bindTexture(ctx.TEXTURE_2D, texId);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texImage2D(ctx.TEXTURE_2D, 0,  ctx.RGBA, w, h, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, this.data);
};

// for html canvas
RGBAImage.prototype.toImageData = function( ctx ) {
    let imgData = ctx.createImageData(this.w, this.h);
    imgData.data.set(this.data);
    return imgData;
};

/* render the image to the passed canvas */
RGBAImage.prototype.render = function( cvs ) {
	canvas.width = this.w;
	canvas.height = this.h;
	context.putImageData(this.toImageData(context), 0, 0);
};

/* get RGBA image data from the passed image object */
RGBAImage.fromImage = function( img, cvs ) {
    let w = img.width;
    let h = img.height;

    // resize the canvas for drawing
    cvs.width = w;
	cvs.height = h;
	let ctx = cvs.getContext('2d');

    // render the image to the canvas in order to obtain image data
    ctx.drawImage(img, 0, 0);
    let imgData = ctx.getImageData(0, 0, w, h);
    let newImage = new RGBAImage(w, h, imgData.data);
    imgData = null;

    // clear up the canvas
    ctx.clearRect(0, 0, w, h);
    return newImage;
};