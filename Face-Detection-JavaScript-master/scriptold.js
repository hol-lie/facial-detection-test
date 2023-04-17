
//holds the webcam for connection to the detection stuff.
let video 
//starts the webcam
let capture;

//"loft" the detections so it's available both in the face detector and the p5 spaces.
let detectionOutput;

let happiness

let speed = 0
let sz
let sz2 
let tallsz 
let xPos 
let yPos
let hole



Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(modelsLoaded)

function modelsLoaded(){

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // console.log(detections)
    detectionOutput = detections
  }, 100)

}

// function preload(){
//   inconsolata = loadFont('https://use.typekit.net/tjv7bvx.csssets/inconsolata.otf');
// }

function setup(){
  capture = createCapture(VIDEO);
  video = document.getElementsByTagName('video')
  video = video[0]
  createCanvas(windowWidth,windowHeight,WEBGL)
  xPos = 0 
  yPos = -300
  sz = 30 
  sz2 = 30
  hole = 70
  // textFont(brother-1816)
  // textSize(width/3)
  // textAlign(CENTER,CENTER)

  


}

function draw(){


  background(255)
  // console.log(detectionOutput)
  
  speed = 0

  

  fill(0)
  ellipse(0, -50, hole, hole)
  

  //potential options!
//   angry: 0.9407893419265747
// disgusted: 0.015454781241714954
// fearful: 0.011939520947635174
// happy: 0.017854880541563034
// neutral: 0.005642498377710581
// sad: 0.006536602508276701
// surprised: 0.0017822942463681102



  if(detectionOutput != undefined && detectionOutput.length > 0 ){
    console.log(detectionOutput[0].expressions.happy)
    happiness = detectionOutput[0].expressions.happy

  }

  if(detectionOutput != undefined && detectionOutput.length > 0 ){
    console.log(detectionOutput[0].expressions.sad)
    sad = detectionOutput[0].expressions.sad

  }

  //when you are smiling, then the ball rolls downward, when you are not smiling, the ball rolls up
  if(happiness > 0.5){
    yPos = yPos + 0.5
    speed = 1
  }else {
    yPos = yPos - 0.5
    speed = 0.5
  }

  //if the ball reaches the hole, then it will decrease in size
  if(happiness > 0.5 && yPos > -70){
    sz = sz - 1
  }

  //have a behavior on hole called shrink 
  //from the ball you have to tell it to shrink
  //if the ball decreased to a size less than 10, then the ball will disappear and so will the hole. 
  if (sz < 10){
    sz = 0
    hole = hole - 1
  }
  if (hole < 1){
    hole = 0
  }

  if (happiness > 0.5 && hole <= 0){
    translate(xPos,yPos,0)
    fill(255)
    stroke(0)
    sphere(sz2)
  }

  
  //make a sphere that rotates on the x axis 
  text('Hello World!', 0, 0);
  fill(0)

  fill(255)
  translate(xPos, yPos,0);
  rotateX(frameCount * speed);
  rotate(PI / 2);
  noStroke();
  pointLight(0,-width/2,height/2)
  pointLight(0,width,height/2)
  ambientMaterial(0) // Adds an ambient material (RGB or HSB color)
  sphere(sz);


}









