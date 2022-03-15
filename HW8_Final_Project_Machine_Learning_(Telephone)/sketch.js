//Author: Alexander Robert
//Goal: let's play a game of telephone 
//      with different pretrained ml5 
//      models and see what happens!

//reference sources:

//doodlenet example:
//https://editor.p5js.org/ml5/sketches/ImageClassification_DoodleNet_Canvas

//MobileNet Image Classification example:
//https://editor.p5js.org/ml5/sketches/ImageClassification

//Sound Classification example:
//https://editor.p5js.org/ml5/sketches/SoundClassification_speechcommand

//-----------------------------------------------------------
//State handling variables:
let state; //track the state of the telephone chain
//define all possible states
let states = ["doodle", "imageAnalyze","model"];
let shouldDraw = true; //bool for draw function
let results; // variable that will hold results from gotResult()

//Telephone specific variables:

//doodleNet variables:
let doodleNet; // Initialize the Image Classifier method with DoodleNet.
let canvas; // A variable to hold the canvas image we want to classify
// Two variable to hold the label and confidence of the result
let label;
let confidence;

//MobileNet variables
let mobileNet;
let imageNames = ["rain", "beach", "stitches", "smiley_face", "animal_migration", "river", "octagon", "line"];
let images = []; //loaded images based off image names

//Model variables
let img; //doodle image used to draw during the model state
let imgText; //text from doodle API
let searchImg;//image used by MobileNet
let searchText; //text result from MobileNet
let textures = [img, imgText, searchImg, searchText];
let textureIndex = 0;

function preload() {
  state = localStorage.getItem("state");
  if(state == null) { //if localStorage is empty
    state = states[0]; //set it to the default state (AKA doodle)
    //localStorage.setItem("state", state);
  }
    
  preloadState();
}

function setup() {
  setupState();
  let nextTelephoneButton = createButton('telephone!');
  nextTelephoneButton.position(width, 0);
  nextTelephoneButton.mousePressed(nextTelephone);
  let restartTelephoneButton = createButton('restart!');
  restartTelephoneButton.position(width, nextTelephoneButton.height);
  restartTelephoneButton.mousePressed(restartTelephone);
}

function draw() {
  if(shouldDraw) {
    drawState();
  }
  else{
    console.log("draw inactive");
  }
}

// A function to run when we get any errors and the results
function gotResult(error, result) {
  // Display error in the console
  if (error) {
    console.error(error);
  }
  results = result;
  gotResultState();
}

function nextTelephone() {
  nextState = (states.indexOf(state)+1 == states.length) ? 
               states[0] : states[states.indexOf(state)+1];
  localStorage.setItem('state', nextState);
  saveInfo();
  window.location.reload();
}

function restartTelephone() {
  localStorage.clear();
  window.location.reload();
}

function preloadState() {
  switch (state) {
  case 'doodle':
        // Load the DoodleNet Image Classification model
        doodleNet = ml5.imageClassifier('DoodleNet');
        break;
  case 'imageAnalyze':
        // Load the MobileNet Image Classification model
        mobileNet = ml5.imageClassifier('MobileNet');
        for (let i=0; i<imageNames.length; i++) {
          images[i] = loadImage(imageNames[i] + ".jpg");
        }
        break;
  case 'model':
      for (let i=0; i<imageNames.length; i++) {
          images[i] = loadImage(imageNames[i] + ".jpg");  
      }
      const str = localStorage.getItem('img');  
      if(str == null) {
        shouldDraw = false;
        console.log("preloadState(model): img not loaded");  
        break;  
      }
      const retrievedArr = JSON.parse(str);
      const retrievedpixelArray = new Uint8ClampedArray(retrievedArr);
      img = createImage(400,400);
      img.loadPixels();
      for(let y = 0;  y < 400; y+=1){
        for(let x = 0;  x < 400; x+=1){
          const i = (y * 400 + x) * 4;
          img.pixels[i] = retrievedpixelArray[i];
          img.pixels[i+1] = retrievedpixelArray[i+1];
          img.pixels[i+2] = retrievedpixelArray[i+2];
          img.pixels[i+3] = retrievedpixelArray[i+3];
        }
      }
      img.updatePixels();  
      break;
  default:
      shouldDraw = false;
      console.log(`preloadState could not find state: ${state}.`);
  }
}

function setupState() {
  switch (state) {
    case 'doodle':
      setupDoodle();
      break;
    case 'imageAnalyze':
      setupImageAnalyze();
      break;
    case 'model':
      setupStateModel();
      break;
    default:
      console.log(`setupState could not find state: ${state}.`);
  }
}

function drawState() {
  switch (state) {
    case 'doodle':
      drawDoodle();
      break;
    case 'imageAnalyze':
      break;
    case 'model':
      drawStateModel();
      break;
    default:
      console.log(`drawState could not find state: ${state}.`);
  }
}

function gotResultState(results) {
    switch (state) {
    case 'doodle':
      gotResultDoodle();
      break;
    case 'imageAnalyze':
      gotResultImageAnalyze();
      break;
    default:
      console.log(`gotResultState could not find state: ${state}.`);
  }
}

function saveInfo() {
  switch (state) {
    case 'doodle':
      if(results == null)
        console.log("Draw something before you telephone!")
      else {
        localStorage.setItem("info", results[0].label);
        localStorage.setItem("imgText", results[0].label);
        let c = get(0,0,width,height);
        c.loadPixels();
        const pixelArray = c.pixels;
        const arr = Array.from // if available
        ? Array.from(pixelArray) // use Array#from
        : [].map.call(pixelArray, (v => v)); // otherwise map()
        // now stringify
        const str = JSON.stringify(arr);
        localStorage.setItem('img', str);
      }
      break;
    case 'imageAnalyze':
      localStorage.setItem("searchText", results[0].label);
      break;
    default:
      console.log(`saveInfo could not find state: ${state}.`);
  }
}

function setupDoodle() {
  // Create a canvas to give to doodleNet
  canvas = createCanvas(400,400);
  // Set canvas background to white
  background(255);
  // Whenever mouseReleased event happens on canvas, call "classifyCanvas" function
  canvas.mouseReleased(classifyCanvas => {doodleNet.classify(canvas, gotResult);});
  // Create a clear canvas button
  let clearCanvasButton = createButton('Clear Canvas');
  clearCanvasButton.position(width, height/2);
  clearCanvasButton.mousePressed(clearCanvas => {background(255);} );
  // Create 'label' and 'confidence' div to hold results
  label = createDiv('Label: ...');
  confidence = createDiv('Confidence: ...');
}

function drawDoodle() {
  // Set stroke weight to 10
  strokeWeight(15);
  // Set stroke color to black
  stroke(0);
  // If mouse is pressed, draw line between previous and current mouse positions
  if (mouseIsPressed) {
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function gotResultDoodle() {  
  // The results are in an array ordered by confidence.
  // Show the first label and confidence
  label.html('Label: ' + results[0].label);
  confidence.html('Confidence: ' + nf(results[0].confidence, 0, 2)); // Round the confidence to 0.01
}

function setupImageAnalyze() {
  let index = -1;
  let info = localStorage.getItem("info");
  if(info == null) {
    shouldDraw = false;
    console.log("setupState(imageAnalyze): info not loaded");
    return; 
  }
  index = imageNames.indexOf(info);
  if (index == -1) 
    index = int(random(0, imageNames.length -1));
  localStorage.setItem("searchImg", index);
  createCanvas(400,400);
  image(images[index], 0, 0, width, height);
  mobileNet.classify(images[index], gotResult);
}

function gotResultImageAnalyze() {
  // The results are in an array ordered by confidence.
  createDiv('Label: ' + results[0].label);
  createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
}

function setupStateModel() {
  createCanvas(400,400, WEBGL);
  
  imgText = createGraphics(400, 400);
  imgText.textSize(75);
  imgText.textWrap(WORD);
  imgText.background(255);
  imgText.text(localStorage.getItem('imgText'), 0, 75, 400, 400);
  
  searchText = createGraphics(400, 400);
  searchText.background(255);
  searchText.textSize(75);
  searchText.textWrap(WORD);
  searchText.text(localStorage.getItem('searchText'), 0, 75, 400, 400);

  
  searchImg = images[localStorage.getItem("searchImg")];
  
  textures = [img, imgText, searchImg, searchText];
  textureIndex = 0;
  texture(textures[textureIndex]);
  //texture(img);
  //texture(imgText);
  //texture(searchImg);
  //texture(searchText);
}

function drawStateModel() {
  background(0);
  rotateZ(frameCount * 0.01);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  if(frameCount % 120 == 0) {
    textureIndex = (textureIndex < textures.length -1) ? textureIndex+1 : 0;
    texture(textures[textureIndex]);
  }
  //pass image as texture
  box(width / 2);
}