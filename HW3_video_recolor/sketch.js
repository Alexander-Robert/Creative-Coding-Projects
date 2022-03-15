let webCam
let randomizeRBGPixels
let range
let a = 0
let b = 1
let c = 2
let d = 3

function setup() {
  createCanvas(640, 480);
  pixelDensity(1)
  webCam = createCapture(VIDEO)
  webCam.size(640,480)
  noStroke()
  frameRate(5)
}

function draw() {

  webCam.loadPixels()
  //let stepSize = map(mouseX, 0, width, 5, 25)
  let stepSize = 5

  for(let y = 0; y < height; y+= int(stepSize)){
    
    for(let x =0; x < width; x+= int(stepSize)){
      let i = (x + y * width) * 4
      randomizeRBGPixels = [webCam.pixels[i],
          webCam.pixels[i+1],
          webCam.pixels[i+2],
          webCam.pixels[i+3]];
      fill(randomizeRBGPixels[a],
          randomizeRBGPixels[b],
          randomizeRBGPixels[c],
          randomizeRBGPixels[d])
      square(x,y, int(stepSize))
    }
  }
  webCam.updatePixels()
}


function mousePressed(event) {
  range = [0,1,2,3];
  a = range[Math.floor(Math.random()*range.length)];
  index = range.indexOf(a);
  if (index > -1) {
    range.splice(index, 1);
  }
  b = range[Math.floor(Math.random()*range.length)];
  index = range.indexOf(b);
  if (index > -1) {
    range.splice(index, 1);
  }
  c = range[Math.floor(Math.random()*range.length)];
  index = range.indexOf(c);
  if (index > -1) {
    range.splice(index, 1);
  }
  d = range[0];
  console.log('a: ' + a, ' b: ' + b, ' c: ' + c, ' d: ' + d);
}