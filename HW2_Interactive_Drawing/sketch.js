//define globals
let canvasWidth = 400;
let canvasHeight = canvasWidth;
let reverse = false;
let i = 0;
let alphaSlider; //slider for changing the alpha of the random colors
let savedLines = []; //array for saved lines to draw triangles with
//I know savedLines is a really horrible way to save this info so I explain it here:
//each index in savedLines is as follows:
//savedLines[i][0 through 5] is a coordinate for drawing triangles
//savedLines[i][6] is a len 3 array for random rgb values -> r [0], g[1], b[2]

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  alphaSlider = createSlider(0,100,20);
  alphaSlider.position(30,2);
}

function draw() {
  background(220);
      
  updateIncrement();
  
  drawSavedLines();

  fill(255);
  drawEdgeLines();
  
  clearSavedButton();
}

//simple bool logic to increment or decrement the offset position saved as i
function updateIncrement() {
  //this logic works because it's being called by the draw function which is being updated by itself. Therefore, no for loops needed.
    if(!reverse) {
    if (i == canvasWidth + 1) {
      reverse = !reverse;
    }
    i++;
  }
  else {
    if (i == -1) {
      reverse = !reverse;
    }
    i--;
  }
}

//goes through the savedLines array and correctly handles drawing them
function drawSavedLines() {
  fill(255,255,255); //safety line
  if(savedLines.length > 0) {
    for(let len = 0; len < savedLines.length; len++) {
      fill(savedLines[len][6][0], 
           savedLines[len][6][1], 
           savedLines[len][6][2],
           alphaSlider.value());
      triangle(savedLines[len][0],
               savedLines[len][1],
               savedLines[len][2],
               savedLines[len][3],
               savedLines[len][4],
               savedLines[len][5]);
    }
  }
}

//draw lines from the mouse to the edge of the screen given the current i
function drawEdgeLines() {
  //console.log(i);
  line(mouseX, mouseY, i,           0);
  line(mouseX, mouseY, canvasWidth, i);
  line(mouseX, mouseY, 0,           canvasWidth - i);
  line(mouseX, mouseY, canvasWidth - i, canvasWidth);
}

//clicking saves the current line coords in an array to be drawn permanently
function mousePressed(event) {
  if(!(mouseX < 160 && mouseY < 20)) {
  savedLines[savedLines.length] = [i, 0, mouseX, mouseY, canvasWidth, i, [random()*255,random()*255,random()*255]];  
  savedLines[savedLines.length] = [mouseX, mouseY, canvasWidth, i, canvasWidth - i, canvasWidth, [random()*255,random()*255,random()*255]];
  savedLines[savedLines.length] = [mouseX, mouseY, 0, canvasWidth - i, canvasWidth - i, canvasWidth, [random()*255,random()*255,random()*255]];
  savedLines[savedLines.length] = [mouseX, mouseY, 0, canvasWidth - i, i, 0, [random()*255,random()*255,random()*255]];
  }
}
//draws and handles logic for button to erase saved lines
function clearSavedButton() {
  fill(255,0, 0);
  rect(0,0,25,25);
  
  if(mouseX < 25 && mouseY < 25) {
    fill(0,255, 0);
    rect(0,0,25,25);
    if(mouseIsPressed)
      savedLines = [];
  }
}