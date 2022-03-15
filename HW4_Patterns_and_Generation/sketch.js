//This project was adapted from the example sketch below:
//https://editor.p5js.org/p5/sketches/Simulate:_Recursive_Tree
let theta;
let initSize = 86; //good size for all branches to meet in the middle
let heightRatio = 2/120;
let reductionRatio = 0.66;
let exitHeight = initSize * heightRatio;

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(0);
  frameRate(30);
  stroke(255);
  // Let's pick an angle 0 to 90 degrees based on the mouse position
  let a = (mouseX / width) * 90;
  fill((mouseX/width) * 255);
  theta = radians(a);
  
  // Start the base from the bottom of the screen
  push();
  //shift in mouseX and theta pushes the branch from the middle
  //to the corner of the screen as mouseX goes from 0 to width. 
  translate(width/2 - (mouseX/2),height);
  rotate(theta/2);
  ellipse(0,-initSize/2,initSize);
  // Move to the end of that translation
  push();
  translate(0,-initSize);
  // Start the recursive branching!
  branch(initSize);
  pop();
  pop();
  
  //repeat pattern on all sides

  //right side of screen
  push();
  translate(width,height/2 + (mouseX/2));
  rotate(-PI/2);
  rotate(theta/2); //rotation is also additive like translate
  ellipse(0,-initSize/2,initSize);
  push();
  translate(0,-initSize);
  branch(initSize);
  pop();
  pop();
  
  //top side of screen
  push();
  translate(width/2 + (mouseX/2),0);
  rotate(-PI);
  rotate(theta/2);
  ellipse(0,-initSize/2,initSize);
  push();
  translate(0,-initSize);
  branch(initSize);
  pop();
  pop();
  
  //left side of screen
  push();
  translate(0,height/2 - (mouseX/2));
  rotate(-3*PI/2);
  rotate(theta/2);
  ellipse(0,-initSize/2,initSize);
  push();
  translate(0,-initSize);
  branch(initSize);
  pop();
  pop();
}

function branch(h) {
  // Each branch will be 2/3rds the size of the previous one
  h *= reductionRatio;

  //exit condition when the length of the branch is 2 pixels or less
  if (abs(h) > exitHeight) {
    push();    //Save the current state of transformation (i.e. where are we now)
    rotate(theta);   // Rotate by theta
    ellipse(0,-h/2,-h);
    translate(0, -h); // Move to the end of the branch
    branch(h);       // Ok, now call myself to draw two new branches!!
    pop();     // Whenever we get back here, we "pop" in order to restore the previous matrix state

    // Repeat the same thing, only branch off to the "left" this time!
    push();
    rotate(-theta);
    ellipse(0,-h/2,-h);
    translate(0, -h);
    branch(h);
    pop();
  }
}