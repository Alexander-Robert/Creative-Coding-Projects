//Oringally By Cameron Beattie; Adapted by Alexander Robert
//original: https://editor.p5js.org/csbeatti/sketches/fyu76s3JY
//Remix Assignment! Take a classmate's file and remix it to make something of your own.

//move mouse around to play with pitch and reverb

let mic, recorder, soundFile, str;
let update = false;
let state = 0;
let song;
let reverb;
let cVerb;
let tick;

function preload() {
  // Load a sound file
  //cVerb = createConvolver('assets/yoo.wav');
  //soundFile = loadSound('assets/yoo.wav');
}

function setup() {
  let cnv = createCanvas(500, 500);
  cnv.mousePressed(canvasPressed);
  background(220);
  textAlign(CENTER, CENTER);

  // create an audio in
  mic = new p5.AudioIn();

  // prompts user to enable their browser mic
  mic.start();

  // create a sound recorder
  recorder = new p5.SoundRecorder();

  // connect the mic to the recorder
  recorder.setInput(mic);
  //*/
  // this sound file will be used to
  // playback & save the recording
  soundFile = new p5.SoundFile();

  text('tap to record', width/2, height/2);
  
  intializeAlgorithms();
}

function intializeAlgorithms() {
  fft = new p5.FFT();
  reverb = new p5.Reverb();
  cVerb = createConvolver(soundFile);
  tick = 0;
}

function canvasPressed() {
  // ensure audio is enabled
  userStartAudio();

  // make sure user enabled the mic
  if (state === 0 && mic.enabled) {

    // record to our p5.SoundFile
    recorder.record(soundFile);

    background(255,0,0);
    text('Recording!', width/2, height/2);
    state++;
  }
  else if (state === 1) {
    background(0,255,0);

    // stop recorder and
    // send result to soundFile
    recorder.stop();

    reverb.process(soundFile, 3, 2);
    cVerb.process(soundFile);
    
    text('Done! Tap to play', width/2, height/2);
    state++;
  }

  else if (state === 2) {
    background(0,100,255);
    soundFile.play(); // play the result!
    soundFile.loop();
    //save(soundFile, 'mySound.wav');
    text('Playing audio', width/2, height/2);
    state++;
    update = true;
  }
}

function draw() {
  if (update == false) return;
  background(155);
  
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
  tick++;
  if(mouseIsPressed) {
  
    let dryWet = constrain(map(mouseX, 0, width, 0, 1), 0, 1);
    // 1 = all reverb, 0 = no reverb
    reverb.drywet(dryWet);
    //text('dry/wet: ' + round(dryWet * 100) + '%', 50, height - 20);

    soundFile.amp(0.3);

    // Set the rate to a range between 0.1 and 4
    // Changing the rate alters the pitch
    let speed = map(mouseY, 0.1, height, 0, 2);
    speed = constrain(speed, 0.01, 4) + (sin(tick) / 4);
    soundFile.rate(speed);
    str = "dry/wet: " + round(dryWet * 100) + '%' + " speed: " + speed.toFixed(3);
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
  text(str, 80, 30);
}