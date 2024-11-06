console.log("now listening at private!");

//Initialize and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected");
});

 //Listen for an event named 'message-share' from the server
 socket.on('message-share', (data) => {
  // console.log(data);

  drawEllipse(data);

});

//In global scope
let myRed, myGreen, myBlue;
let myDiameter;

let circles = [];
let begin;
  
function preload() {
    begin = loadImage("begin.png");
  }

  function setup(){
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);
    noStroke();
    randomSeed(99);

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
    touchCircles();

    // let imgX = windowWidth / 2;
    // let imgY = windowHeight / 2;
    // image(begin, imgX, imgY, begin.width / 3.5, begin.height / 3.5);

  }

    //Expects an object with x and y properties
function drawEllipse(obj) {
  fill(0);
  ellipse(obj.x, obj.y, obj.d, obj.d);
}

function mouseMoved() {

loop(); // Redraw when the mouse moves
    setTimeout(noLoop, 50); // Stop drawing after a short delay
    socket.emit('message', { x: mouseX, y: mouseY, r: myRed, g: myGreen, b: myBlue, d: myDiameter });
}

function touchCircles() {
  for (let i = 0; i < circles.length; i++) {
    let circle = circles[i];

    // Skip any circles with undefined properties
    if (circle.x === undefined || circle.y === undefined || circle.rad === undefined) {
      console.log(`Skipping circle ${i} due to missing properties.`);
      continue;
    }

    let d = dist(mouseX, mouseY, circle.x, circle.y);
    if (d <= circle.rad) {
      // Circle is touched, perform an action
      circle.r = random(150, 255);
      circle.g = random(100, 230);
      circle.b = random(170, 255);
      console.log(`Circle ${i} touched!`);
    }
  }
}

function mazePath() {
    let protection = 0;
  
    while (circles.length < windowWidth/7 && protection < 10000) {
      // Combined limit check
      let circle = {
        x: random(windowWidth),
        y: random(windowHeight),
        rad: random(10, 35),
  
        r: random(150, 255),
        g: random(100, 230),
        b: random(170, 255),
        // a: random(50, 255)
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

  //Input room name
let roomName = window.prompt("Create or Join a room");
console.log(roomName);

//Check if a name was entered
if (roomName){
    //Emit a msg to join the room
    socket.emit('room', {"room": roomName});
}
else {
    alert("Please refresh and enter a room name");
}