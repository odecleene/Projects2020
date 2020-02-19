

// image(img: Image, func: (p: Pixel) => Pixel): Image
function imageMap(image, f) {
  let newImage = image.copy();
  for (let i = 0; i < image.width; ++i) {
    for (let j = 0; j < image.height; ++j) {
      newImage.setPixel(i, j, f(image.getPixel(i, j)));
    }
  }
  return newImage;
}


//imageMapXY(img: Image, func: (img: Image, x: number, y: number) => Pixel): Image
function imageMapXY(img, f) {
  let newImg = img.copy();
  for (let x = 0; x < img.width; ++x) {
    for (let y = 0; y < img.height; ++y) {
      newImg.setPixel(x, y, f(img, x, y));
    }
  }
  return newImg;
}

// imageMask(img: Image, func: (img: Image, x: number, y: number) => boolean, maskValue: Pixel): Image
function imageMask(img, f, maskValue) {
  function mask(img, x, y){
    if (f(img, x, y)) {return maskValue;}
    else {return img.getPixel(x, y);}
  }
  return imageMapXY(img, mask);
}

// sets each pixel to the average of the eight surrounding pixels and itself
// blurPixel(img: Image, x: number, y: number): Pixel
function blurPixel(img, x, y){
  let count = 0;
  let r = 0; let g = 0; let b = 0;
  for (let i = -1; i <= 1; ++i) {
     for (let j = -1; j <= 1; ++j) {
       if (x + i >= 0 && x + i < img.width && y + j >= 0 && y + j < img.height) {
         let pixel = img.getPixel(x + i, y + j);
         r = r + pixel[0];
         g = g + pixel[1];
         b = b + pixel[2];
         ++count;
      }
    }
  }
  return [r/count, g/count, b/count];
}

// applies blurPixel to whole image
// blurImage(img: Image): Image
function blurImage(img){
  return imageMapXY(img, blurPixel);
}

// returns true if all pixel channels are between 0.3 and 0.7 inclusive
// isGrayish(p: Pixel): boolean
function isGrayish(pixel){
  for (let i = 0; i < 3; ++i) {
    if ( pixel[i] < 0.3 || pixel[i] > 0.7){ 
      return false; 
    }
  }
  return true;
}

// averages all pixel channels if "isGrayish" returns true
// toGrayscale(img: Image): Image
function toGrayscale(img) {
  function gray(img, x, y) {
    if (isGrayish(img.getPixel(x, y))){
      let avg = (img.getPixel(x,y)[0] + img.getPixel(x,y)[1] + img.getPixel(x,y)[2])/3;
      return [avg, avg, avg];
    }
    else {
      return img.getPixel(x, y);
    }
  }
  return imageMapXY(img, gray);
}


// sets any pixel channels > 0.7 to 1
// saturateHigh(img: Image): Image
function saturateHigh(img) {
  const epsilon = 0.002;
  function saturate(img, x, y) {
    let pixel = img.getPixel(x, y);
    if ((pixel[0] - 0.7) > epsilon) { pixel[0] = 1;}
    if ((pixel[1] - 0.7) > epsilon) { pixel[1] = 1;}
    if ((pixel[2] - 0.7) > epsilon) { pixel[2] = 1;}
    return pixel;
  }
  return imageMapXY(img, saturate);
}

// sets any pixel channels < 0.3 to 0
// blackenLow(img: Image): Image
function blackenLow(img){
  const epsilon = 0.002;
  function blacken(img, x, y) {
    let pixel = img.getPixel(x, y);
    if ((pixel[0] - 0.3) < -epsilon) { pixel[0] = 0;}
    if ((pixel[1] - 0.3) < -epsilon) { pixel[1] = 0;}
    if ((pixel[2] - 0.3) < -epsilon) { pixel[2] = 0;}
    return pixel;
  }
  return imageMapXY(img, blacken);
}

// reduceFunctions(fa: ((p: Pixel) => Pixel)[]): ((x: Pixel) => Pixel)
function reduceFunctions(fa) {
  // compose(f: (pixel => pixel), g: (pixel => pixel)): (pixel => pixel)
  let compose = (f, g) => (x => g(f(x)));
  return fa.reduce(compose, (x => x));
}

// colorize(img Image): Image
function colorize(img) {

  const epsilon = 0.002;

  // gray(p: Pixel): Pixel
  function gray(pixel) {
    if (isGrayish(pixel)){
      let avg = (pixel[0] + pixel[1] + pixel[2])/3;
      return [avg, avg, avg];
    }
    else {
      return pixel;
    }
  }

  // saturate(p: Pixel): Pixel
  function saturate(pixel) {
    if ((pixel[0] - 0.7) > epsilon) { pixel[0] = 1;}
    if ((pixel[1] - 0.7) > epsilon) { pixel[1] = 1;}
    if ((pixel[2] - 0.7) > epsilon) { pixel[2] = 1;}
    return pixel;
  }

  // blacken(p: Pixel): Pixel
  function blacken(pixel) {
    if ((pixel[0] - 0.3) < -epsilon) { pixel[0] = 0;}
    if ((pixel[1] - 0.3) < -epsilon) { pixel[1] = 0;}
    if ((pixel[2] - 0.3) < -epsilon) { pixel[2] = 0;}
    return pixel;
  }

  let bigF = reduceFunctions([gray, saturate, blacken]);

  return imageMap(img, bigF);
}

function main() {
  

  
}


// pixelEq(p1: Pixel, p2: Pixel): boolean
function pixelEq (p1, p2) {
 const epsilon = 0.002;
 for (let i = 0; i < 3; ++i) {
  if (Math.abs(p1[i] - p2[i]) > epsilon) {
    return false;
  }
 }
 return true;
}

function useNumbers() {
  const fa = [(x => x + 1), (x => x + 5)];
  const F = reduceFunctions(fa);
  console.log(F(0));
}





// Test Cases:

test('Test imageMapXY', function(){
  const testImg = lib220.createImage(10,10, [1, 1, 1]);
  const mapImg = imageMapXY(testImg, function(img, x, y){ return [0, 0, 0];});
  assert(pixelEq(mapImg.getPixel(0, 0),[0, 0, 0]));
  assert(pixelEq(testImg.getPixel(0, 0),[1, 1, 1]));
  assert(testImg !== mapImg);
});

test('identity function with imageMapXY', function() {
 let identityFunction = function(image, x, y ) {
 return image.getPixel(x, y);
 };
 let inputImage = lib220.createImage(10, 10, [0.2, 0.2, 0.2]);
 inputImage.setPixel(0, 0, [0.5, 0.5, 0.5]);
 inputImage.setPixel(5, 5, [0.1, 0.2, 0.3]);
 inputImage.setPixel(2, 8, [0.9, 0.7, 0.8]);
 let outputImage = imageMapXY(inputImage, identityFunction);
 assert(pixelEq(outputImage.getPixel(0, 0), [0.5, 0.5, 0.5]));
 assert(pixelEq(outputImage.getPixel(5, 5), [0.1, 0.2, 0.3]));
 assert(pixelEq(outputImage.getPixel(2, 8), [0.9, 0.7, 0.8]));
 assert(pixelEq(outputImage.getPixel(9, 9), [0.2, 0.2, 0.2]));
});

test('imageMapXY function definition is correct', function() {
 let identityFunction = function(image, x, y) {
 return image.getPixel(x, y);
 };
 let inputImage = lib220.createImage(10, 10, [0, 0, 0]);
 let outputImage = imageMapXY(inputImage, identityFunction);
 // Output should be an image, so getPixel must work without errors.
 let p = outputImage.getPixel(0, 0);
 assert(p[0] === 0);
 assert(p[1] === 0);
 assert(p[2] === 0);
 assert(inputImage !== outputImage);
});

test('Test imageMapXY on 1x1', function(){
  const testImg = lib220.createImage(1,1, [1, 1, 1]);
  const mapImg = imageMapXY(testImg, function(img, x, y){ return [0, 0, 0];});
  assert(pixelEq(mapImg.getPixel(0, 0),[0, 0, 0]));
  assert(pixelEq(testImg.getPixel(0, 0),[1, 1, 1]));
  assert(testImg !== mapImg);
});

test('Test imageMask', function(){
  const testImg = lib220.createImage(10,10, [1, 1, 1]);
  const maskImg = imageMask(testImg, function(img, x, y){ return x === y;}, [0, 0, 0]);
  assert(pixelEq(maskImg.getPixel(0, 0),[0, 0, 0]));
  assert(pixelEq(maskImg.getPixel(0, 5),[1, 1, 1]));
  assert(pixelEq(maskImg.getPixel(5, 5),[0, 0, 0]));
  assert(pixelEq(testImg.getPixel(0, 0),[1, 1, 1]));
});

test('Test imageMask on 1x1', function(){
  const testImg = lib220.createImage(10,10, [1, 1, 1]);
  const maskImg = imageMask(testImg, function(img, x, y){ return x === y;}, [0, 0, 0]);
  assert(pixelEq(maskImg.getPixel(0, 0),[0, 0, 0]));
  assert(pixelEq(testImg.getPixel(0, 0),[1, 1, 1]));
});

test('Test blurPixel', function(){
  let testImg = lib220.createImage(10,10, [1, 1, 1]);
  testImg.setPixel(0, 0, [0, 0, 0]);
  testImg.setPixel(1, 0, [1, 0, 0]);
  testImg.setPixel(1, 1, [1, 1, 0]);
  testImg.setPixel(0, 1, [0, 1, 0]);
  assert(pixelEq(blurPixel(testImg, 8, 8), [1, 1, 1]));
  assert(pixelEq(blurPixel(testImg, 0, 0), [0.5, 0.5, 0]));
  assert(pixelEq(blurPixel(testImg, 1, 0), [2/3, 2/3, 1/3]));
  assert(pixelEq(blurPixel(testImg, 0, 1), [2/3, 2/3, 1/3]));
  assert(pixelEq(blurPixel(testImg, 2, 2), [1, 1, 8/9]));
});

test('Test blurImage', function(){
  let testImg = lib220.createImage(10,10, [1, 1, 1]);
  testImg.setPixel(0, 0, [0, 0, 0]);
  testImg.setPixel(1, 0, [1, 0, 0]);
  testImg.setPixel(1, 1, [1, 1, 0]);
  testImg.setPixel(0, 1, [0, 1, 0]);
  const blurImg = blurImage(testImg);
  assert(pixelEq(blurImg.getPixel(8, 8), [1, 1, 1]));
  assert(pixelEq(blurImg.getPixel(0, 0), [0.5, 0.5, 0]));
  assert(pixelEq(blurImg.getPixel(1, 0), [2/3, 2/3, 1/3]));
  assert(pixelEq(blurImg.getPixel(0, 1), [2/3, 2/3, 1/3]));
  assert(pixelEq(blurImg.getPixel(2, 2), [1, 1, 8/9]));
});

test('Test blurImage on 1x1', function(){
  const testImg = lib220.createImage(1, 1, [1, 0, 0.14]);
  const blurImg = blurImage(testImg);
  assert(pixelEq(testImg.getPixel(0, 0), blurImg.getPixel(0, 0)));
  assert(testImg !== blurImg);
});

test('Test isGrayish', function(){
  assert(isGrayish([0.5, 0.5, 0.5]));
  assert(! isGrayish([0, 0.5, 1]));
});

test('Test toGrayscale', function(){
  let testImg = lib220.createImage(3, 3, [0.4, 0.5, 0.6])
  testImg.setPixel(1, 1, [0, 0, 0]);
  const grayImg = toGrayscale(testImg);
  assert(pixelEq(grayImg.getPixel(0, 0), [0.5, 0.5, 0.5]));
  assert(pixelEq(grayImg.getPixel(1, 1), [0, 0, 0]));
  assert(pixelEq(grayImg.getPixel(2, 2), [0.5, 0.5, 0.5]));
  assert(grayImg !== testImg);
});

test('Test saturateHigh', function(){
  let testImg = lib220.createImage(3, 3, [0.4, 0.8, 0.6])
  testImg.setPixel(1, 1, [0.4, 0.5, 0.6]);
  const satImg = saturateHigh(testImg);
  assert(pixelEq(satImg.getPixel(0, 0), [0.4, 1, 0.6]));
  assert(pixelEq(satImg.getPixel(1, 1), [0.4, 0.5, 0.6]));
  assert(pixelEq(satImg.getPixel(2, 2), [0.4, 1, 0.6]));
  assert(satImg !== testImg);
});

test('Test saturateHigh & blackenLow on 1x1', function(){
  let noChange = lib220.createImage(1, 1, [0.3, 0.5, 0.7]);
  assert(pixelEq(saturateHigh(noChange).getPixel(0, 0), [0.3, 0.5, 0.7]));
  assert(pixelEq(blackenLow(noChange).getPixel(0, 0), [0.3, 0.5, 0.7]));

  const change = lib220.createImage(1, 1, [0.2, 0.9, 0.5]);
  assert(pixelEq(saturateHigh(change).getPixel(0, 0), [0.2, 1, 0.5]));
  assert(pixelEq(blackenLow(change).getPixel(0, 0), [0, 0.9, 0.5]));
});

test('Test blackenLow', function(){
  let testImg = lib220.createImage(3, 3, [0.4, 0.2, 0.6])
  testImg.setPixel(1, 1, [0.4, 0.5, 0.6]);
  const lowImg = blackenLow(testImg);
  assert(pixelEq(lowImg.getPixel(0, 0), [0.4, 0, 0.6]));
  assert(pixelEq(lowImg.getPixel(1, 1), [0.4, 0.5, 0.6]));
  assert(pixelEq(lowImg.getPixel(2, 2), [0.4, 0, 0.6]));
  assert(lowImg !== testImg);
});

test('Test reduceFunctions on numbers', function(){
  const fa = [(x => x*x), (x => x - 5), (x => x + 5), (x => Math.sqrt(x))];
  const F = reduceFunctions(fa);
  assert(F(8) === 8);
  assert(F(-1) === 1);
});

test('Test reduceFunctions on Identity Image', function(){
  const testImg = lib220.createImage(3, 3, [1, 1, 1]);
  const func = (x => x.copy());
  const F = reduceFunctions([func, func, func]);
  const newImg = F(testImg);
  assert(pixelEq(newImg.getPixel(0, 0), testImg.getPixel(0, 0)));
  assert(newImg !== testImg);
});

test('Test colorize', function(){
  let testImg = lib220.createImage(3, 3, [0.4, 0.5, 0.6]);
  testImg.setPixel(0, 0, [0.3, 0.2, 0.1]);
  testImg.setPixel(0, 2, [0.7, 0.8, 0.9]);
  testImg.setPixel(2, 2, [0.1, 0.9, 0.3]);
  testImg.setPixel(2, 0, [0.8, 0.5, 0.2]);
  const colorImg = colorize(testImg);
  assert(pixelEq(colorImg.getPixel(1, 1), [0.5, 0.5, 0.5]));
  assert(pixelEq(colorImg.getPixel(0, 0), [0.3, 0, 0]));
  assert(pixelEq(colorImg.getPixel(0, 2), [0.7, 1, 1]));
  assert(pixelEq(colorImg.getPixel(2, 2), [0, 1, 0.3]));
  assert(pixelEq(colorImg.getPixel(2, 0), [1, 0.5, 0]));
  assert(colorImg !== testImg);
});

test('Test colorize on 1x1', function(){
  const testImg1 = colorize(lib220.createImage(1, 1, [0.4, 0.5, 0.6]));
  const testImg2 = colorize(lib220.createImage(1, 1, [0.3, 0.2, 0.1]));
  const testImg3 = colorize(lib220.createImage(1, 1, [0.7, 0.8, 0.9]));
  const testImg4 = colorize(lib220.createImage(1, 1, [0.1, 0.9, 0.3]));
  const testImg5 = colorize(lib220.createImage(1, 1, [0.8, 0.5, 0.2]));
  assert(pixelEq(testImg1.getPixel(0, 0), [0.5, 0.5, 0.5]));
  assert(pixelEq(testImg2.getPixel(0, 0), [0.3, 0, 0]));
  assert(pixelEq(testImg3.getPixel(0, 0), [0.7, 1, 1]));
  assert(pixelEq(testImg4.getPixel(0, 0), [0, 1, 0.3]));
  assert(pixelEq(testImg5.getPixel(0, 0), [1, 0.5, 0]));
});
