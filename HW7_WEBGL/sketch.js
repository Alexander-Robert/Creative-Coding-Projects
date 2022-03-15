//find 3d models using link below:
//free3d.com/3d-models/
//shaders tutorial:
//https://itp-xstory.github.io/p5js-shaders/#/
//make sure the file isn't too big so you can download then upload it to the sketch

let lock = false;
let lockX = 0;
let lockY = 0;
let locked;
let lockedSize;

let colorToggle = false;
let colored;

function setup() {
  createCanvas(400, 400, WEBGL);
  img = loadImage('dirtblock.png');
  //video = createCapture(VIDEO);
  //video.size(320,240);
  //video.hide();
  
  //tree = loadModel('Lowpoly_tree_sample.obj', true);
  //models can be of type .stl or .obj
  noStroke();
  
  locked = createButton('L = lock');
  locked.position(0, 0);
  locked.mousePressed(() =>{});
  colored = createButton('C = color');
  colored.position(80, 0);
  colored.mousePressed(() =>{});
}

function draw() {
  background(220);
  
  let locX = mouseX-height/2;
  let locY = mouseY-width/2;
  let size = map(mouseX, 0, width, 50, 150);
  let R = map(mouseX, 0, width, 0, 255);
  let G = map(mouseX, 0, width, 0, 255);
  let B = map(mouseX, 0, width, 0, 255);

  
  //materials and lights work together
  //try out different material types
  //different lights colors and material colors interact with each other depending on the material type. EX. ambientMaterial() will only highlight it's own color based on the light also emitting that RGB color
  
  if(!lock) {
    if(mouseIsPressed) {
      rotateX(map(mouseX, 0, width, 0, TWO_PI));
      rotateY(map(mouseY, 0, height, 0, TWO_PI));    
    }
    else {
      rotateX(frameCount * 0.01);
      rotateY(frameCount * 0.01);
    }
  }
  else {
    rotateX(lockX);
    rotateY(lockY);
    size = lockSize;
  }
  
  if(!colorToggle) {
    
  }
  else {
    R = map(mouseX, 0, width/2, 0, 255);
    G = map(mouseX, width/2, width, 0, 255);
    B = map(mouseY, 0, width, 0, 255);
    locX = width/2;
    locY = height/2;
  }
  
  
  //normalMaterial();
  //ambientMaterial(0,0,0);
  //specularMaterial(250);
  //texture(img);
  //texture(video);
  //you can also look at shaders instead of textures
  
  pointLight(255,255,255, locX, locY, size*2);
  ambientLight(R,G,B);
  texture(img);
  box(size);
  //torus(100, 60);
  
  //model(tree);
}

function keyPressed() {
  if (keyCode === 76) { //L key
    if(mouseIsPressed) {
      lockX = map(mouseX, 0, width, 0, TWO_PI);
      lockY = map(mouseY, 0, height, 0, TWO_PI);
    }
    else {
      lockX = lockY = frameCount * 0.01;
    }
    lockSize = map(mouseX, 0, width, 50, 150);
    lock = !lock;
  } else if (keyCode === 67) { //C key
    colorToggle = !colorToggle;
  }
}
