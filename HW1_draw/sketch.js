function setup() {
  let width = windowWidth / 2;
  let height = windowHeight / 2;
  createCanvas(width, height);
}

function draw() {
  background(220);
  pumpkin();
}

function pumpkin() {
  //define pumpkin body (oval)
  let size = 150;
  let l1 = size;
  let l2 = l1 * (2 / 3);

  let orange = [255, 165, 0];
  let white = [255,255,255];
  fill(orange);
  let oval = ellipse((width / 2), (height / 2), l1, l2);

  //console.log(oval);
  

  stroke(0);
  fill(white);
  ellipse((width / 2), (height / 2) + 20, 75, 50);
  //draw the mouth (squares)
  stroke(orange);
  fill(orange);
  rect((width / 2)- 37.5, (height / 2) - 7.5, 75, 25);
  
  rect((width / 2) - 25, (height / 2) + 15,15,15);  
  rect((width / 2) + 15, (height / 2) + 30,15,15);

  
  //draw the eyes (triangles)
  stroke(0);
  fill(white);
  
  triangle((width / 2) - 35,(height / 2) - 35,
           (width / 2) - 50,(height / 2) - 10, 
           (width / 2) - 20,(height / 2) - 10);
  
  triangle((width / 2) + 35,(height / 2) - 35,
           (width / 2) + 50,(height / 2) - 10, 
           (width / 2) + 20,(height / 2) - 10);
  
  triangle((width / 2) ,(height / 2) + 10,
           (width / 2) + 10,(height / 2) - 5, 
           (width / 2) - 10,(height / 2) - 5);
  
  //TODO: figure out how to access positional coords for saved shapes
//  triangle(oval.width, oval.height, 
  //         oval.width + 25, oval.height + 25, 
    //       oval.width + 25, oval.height - 25);
    
}