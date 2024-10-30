console.log("Hello!");

//Initialize and connect socket
let socket = io();

//In global scope
let myRed, myGreen, myBlue;
let myDiameter;

let circles = [];
let begin;
  
function preload() {
    begin = loadImage("begin.png");
  }

  //Expects an object with x and y properties
function drawEllipse(obj) {
    fill(0);
    // noStroke();
    ellipse(obj.x, obj.y, obj.d, obj.d);
  }

  function setup(){
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);

    //Inside setup
    //Generate random fill values
    myRed = random(150,255);
    myGreen = random(100,230)
    myBlue = random(170,255);

    //Generate random ellipse size
    myDiameter = 10;

    mazePath();
}
function draw() {
    background(220);
    drawCircles();

    let imgX = windowWidth / 2;
    let imgY = windowHeight / 2;
    image(begin, imgX, imgY, begin.width / 3.5, begin.height / 3.5);

  }

function mouseMoved() {
  //Grab mouse position
//   let mouseData = { x: mouseX, y: mouseY };

//   let mouseData = {
//     x: mouseX,
//     y: mouseY,
//     r: myRed,
//     g: myGreen,
//     b: myBlue,
//     d: myDiameter
//   }

  //Draw yourself? Wait for server?
//   fill(0);
//   ellipse(mouseX, mouseY, 10, 10);

  //Send mouse data object to the server
// socket.emit('message', mouseData);

loop(); // Redraw when the mouse moves
    setTimeout(noLoop, 50); // Stop drawing after a short delay
    socket.emit('message', { x: mouseX, y: mouseY, r: myRed, g: myGreen, b: myBlue, d: myDiameter });
}

function mazePath() {
    let protection = 0;
  
    while (circles.length < 300 && protection < 10000) {
      // Combined limit check
      let circle = {
        x: random(windowWidth),
        y: random(windowHeight),
        rad: random(10, 35),
  
        r: random(150, 255),
        g: random(100, 230),
        b: random(170, 255),
      };
  
      let overlapping = false;
  
      for (let j = 0; j < circles.length; j++) {
        let other = circles[j];
        let d = dist(circle.x, circle.y, other.x, other.y);
        if (d < circle.rad + other.rad) {
          overlapping = true;
          break;
        }
      }
  
      if (!overlapping) {
        circles.push(circle);
      }
  
      protection++;
    }
  }
  
  function drawCircles() {
    for (let i = 0; i < circles.length; i++) {
      let circle = circles[i]; // Access each circle in the array
      fill(circle.r, circle.g, circle.b); // Use each circle's color
      ellipse(circle.x, circle.y, circle.rad * 2, circle.rad * 2);
    }
  }

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
  });

  //Listen for an event named 'message-share' from the server
socket.on('message-share', (data) => {
    // console.log(data);

    drawEllipse(data);
  
  });