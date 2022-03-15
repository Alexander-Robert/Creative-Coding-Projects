//Alex Robert
//Clicking/holding changes the speed and volume of the song

//resources used:
//https://p5js.org/reference/#/p5.FFT
//https://canvas.ucsc.edu/courses/50098/pages/1-slash-25-slash-2022-professor-notes-sound

let song;
let str;
function preload() 
{ 
  // Load a sound file 
  song = loadSound('RickAstley.mp3'); 
} 
function setup() { 
  createCanvas(710, 400);
  // Loop the sound forever 
  // (well, at least until stop() is called) 
  song.loop(); 
  //default settings
  song.amp(0.5);
  str = "speed:   1\nvolume: 0.5";
  //"FFT (Fast Fourier Transform) is an analysis algorithm that isolates individual audio frequencies within a waveform.""
  fft = new p5.FFT();
} 
function draw() { 
  background(200);

  drawAnalyzedWave();
  
  drawWaveForm();
  
  handleInput(); //calls drawInput() within this func
}

function drawAnalyzedWave() {
  let spectrum = fft.analyze();
  noStroke();
  fill(255, 0, 255);
  for (let i = 0; i< spectrum.length; i++){
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h )
  }
}

function drawWaveForm() {
 let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(50);
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();
}

function handleInput() {
  if(mouseIsPressed) {
    // Set the volume to a range between 0 and 1.0 
    let volume = map(mouseX, 0, width, 0, 1); 
    volume = constrain(volume, 0, 1); 
    song.amp(volume); 
    // Set the rate to a range between 0.1 and 4 
    // Changing the rate alters the pitch 
    let speed = map(mouseY, 0.1, height, 0, 2); 
    speed = constrain(speed, 0.01, 4); 
    song.rate(speed);
    str = "speed:   " + speed.toFixed(3) + "\nvolume: " + volume.toFixed(3);
    fill(0,255,0);
  }
  else {
    fill(51,100);
  }
  
  drawInput();
}

function drawInput() {
  // Draw some circles to show what is going on 
  stroke(0); 
  ellipse(mouseX, 100, 48, 48); 
  stroke(0); 
  ellipse(100, mouseY, 48, 48);
  
  rect(width/2 - 5, height/2 - 5, 10,10);
  
  fill(255);
  text(str, 30, 30);
}