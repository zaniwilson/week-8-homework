console.log("now listening at private!");

//Initialize and connect socket
let socket = io();

//Listen for confirmation of connection
socket.on('connect', () => {
  console.log("Connected");
});

 //Listen for an event named 'message-share' from the server
 socket.on('message-share', (data) => {
  drawEllipse(data);
});

//In global scope
let myDiameter = 10;
let circles = [];
let code;
let passwords = [
  "a3d7k", "p2x8j", "l9m5n", "z8r4y", "q1w6p",
  "t7b3v", "u9k2d", "m5p4j", "x3c7b", "e2r9q",
  "y8f5w", "d6l2z", "n1p7k", "v3h9y", "s5j2d",
  "k7u8p", "a9m6n", "t4r2b", "y3x7q", "l1z5v",
  "p8f4n", "q9j3w", "r2k7y", "d5h1z", "s4n8v",
  "u3m9b", "k6x2q", "j8r4d", "l2t5n", "m7y1p"
];
  

  function setup(){
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);
    noStroke();
    randomSeed(99);
  
    mazePath();
}
function draw() {
    background(220);
    drawCircles();
    touchCircles();

  }

    //Expects an object with x and y properties
function drawEllipse(obj) {
  fill(0);
  ellipse(obj.x, obj.y, obj.d, obj.d);
}

function mouseMoved() {

loop(); // Redraw when the mouse moves
    setTimeout(noLoop, 50); // Stop drawing after a short delay
    socket.emit('message', { x: mouseX, y: mouseY, d: myDiameter });
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
      // console.log(`Circle ${i} touched!`);
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
        a: random(50, 255)
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

    // Generate a random index from 0 to the length of the passwords array
    let indexPos = Math.floor(Math.random() * passwords.length);
    code = passwords[indexPos];

  //Input room name
let roomName = window.prompt("Enter room with code: " + code);
console.log(roomName);

//Check if a name was entered
if (roomName){
    //Emit a msg to join the room
    socket.emit('room', {"room": roomName});
}
else {
    alert("Please refresh and enter a room name");
}