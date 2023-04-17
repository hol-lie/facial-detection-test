
//holds the webcam for connection to the detection stuff.
let video 
//starts the webcam
let capture;

//"loft" the detections so it's available both in the face detector and the p5 spaces.
let detectionOutput;

let levelTwoScreen = false
let happiness
let sadness
let speed = 0.05
let ball
let hole
let clean
let myFont

function preload(){
  myFont = loadFont('inconsolata.ttf')
}

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


function setup(){

  capture = createCapture(VIDEO);
  video = document.getElementsByTagName('video')
  video = video[0]
  createCanvas(windowWidth,windowHeight,WEBGL)
  ball = new roll(-300,0,30);
  hole = new target(0,200,70);
  
  stroke(0,0,255)
  fill(0,0,255);
 
}



function draw(){
  
  background(255)
  textFont(myFont);
  textSize(20);
  fill(0,0,255);
  text('smile to move the ball towards the hole.', -200, 300);
    hole.show();
  

    ball.disappear()
    ball.display();
    ball.smile();
    ball.bounceTop();
    ball.shrink();
   
    

}
class roll{
  constructor(temporaryX, temporaryY, temporarySize){
    this.xpos = temporaryX
    this.ypos = temporaryY
    this.Sz = temporarySize
    this.fill=(0,0,255)
    this.stroke = (0,0,255) 
  } 
  display(){
    rotate(PI / 2)
    stroke(0,0,255)
    translate(this.xpos, this.ypos)
    fill(this.fill)
    rotateY(millis()/10200)

    sphere(this.Sz)

  }
  disappear(){
    if(this.Sz < 1){
      this.Sz = 0
    }
  }
  smile(){
  if(detectionOutput != undefined && detectionOutput.length > 0 ){
      happiness = detectionOutput[0].expressions.happy
    }
  if(happiness > 0.5){
    this.xpos = this.xpos + 0.15
   speed = 0.5
   }else if(happiness < 0.5){
      this.xpos = this.xpos - 0.5
       speed = 0.5
   }}
   bounceTop(){
    if(this.xpos < -320){
      this.xpos = -300
    }
   }
   shrink(){
    if(this.xpos >= 170)
    this.Sz = this.Sz - 1
    if (this.Sz <= 0.5){
      this.Sz = 30 
      this.xpos = -300
    }
  }
   
   
  }

class target{
  constructor(temporaryX, temporaryY,temporarySize){
   this.positionX = temporaryX
   this.positionY = temporaryY
   this.Size = temporarySize
  }
  show(){
    fill(0,0,255)
    ellipse(this.positionX,this.positionY,this.Size)
  }
}


//   potential options!
//   angry: 0.9407893419265747
// disgusted: 0.015454781241714954
// fearful: 0.011939520947635174
// happy: 0.017854880541563034
// neutral: 0.005642498377710581
// sad: 0.006536602508276701
// surprised: 0.0017822942463681102 