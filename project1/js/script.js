/******************************************************
Game - Chaser
Pippin Barr
A simple game of cat and mouse.
Physics-based movement, keyboard controls, health/stamina,
sprinting, random movement, screen wrap.
******************************************************/

// Track whether the game is over
var gameOver = false;

// Player position, size, velocity
var playerImage;
var playerX;
var playerY;
var playerSize = 35;
var playerSizeMin=50;
var playerSizeMax=100;
var playerVX = 0;
var playerVY = 0;
var playerMaxSpeed = 2;
// Player health
var playerHealth;
var playerMaxHealth = 255;
// Player fill color
var playerFill = 50;
// Player fill color
var playerPosition=playerX+playerY;

// variables for the sounds
var eatSound = new Audio ("assets/sounds/cartoon-bite-sound-effect.mp4");
var failSound = new Audio ("assets/sounds/Failure.mp3");

// Prey position, size, velocity
var preyImage;
var preyX;
var preyY;
var preySize = 50;
var preySizeMin = 25;
var preySizeMax = 100;
var preyVX;
var preyVY;
var preyMaxSpeed = 4;
// Prey health
var preyHealth;
var preyMaxHealth = 200;

// Amount of health obtained per frame of "eating" the prey
var eatHealth = 10;
// Number of prey eaten during the game
var preyEaten = 0;
// variables for the movement of the prey
var tx=0;
var ty=100;
// variables for the title in the corner of the game
var titleImage;
var titleImageX;
var titleImageY;
var titleImagePosition;

// setup()
//
// Sets up the basic elements of the game
function setup() {
  createCanvas(500, 500);
  // informations for the background and the title
  floorX=0;
  floorY=0;
  titleImageX=15;
  titleImageY=15;

  noStroke();

  setupPrey();
  setupPlayer();

}

function preload(){
// informations for the images
floor = loadImage("assets/images/floor.jpg");
playerImage = loadImage("assets/images/player.png");
preyImage = loadImage("assets/images/prey.png");
titleImage = loadImage("assets/images/title.png");
gameoverImage = loadImage("assets/images/gameover.png");
obstacleImage = loadImage("assets/images/obstacle.png");
gameoverFont = loadFont("assets/fonts/FunSized.ttf");
// informations for the sounds
eatSound = new Audio("assets/sounds/cartoon-bite-sound-effect.mp4");
failSound = new Audio("assets/sounds/Failure.mp3");
}
// setupPrey()
//
// Initialises prey's position, velocity, and health
function setupPrey() {
  preyX = width / 5;
  preyY = height / 2;
  preyVX = -preyMaxSpeed;
  preyVY = preyMaxSpeed;
  preyHealth = preyMaxHealth;
}
// setupPlayer()
//
// Initialises player position and health
function setupPlayer() {
  playerX = 4 * width / 5;
  playerY = height / 2;
  playerHealth = playerMaxHealth;
}

// draw()

function draw() {
  // displaying the background
  image(floor,floorX,floorY);
  // displaying the title
  image(titleImage,titleImageX,titleImageY,200,78);

  if (!gameOver) {
    handleInput();

    movePlayer();
    movePrey();

    updateHealth();
    checkEating();

    drawPrey();
    drawPlayer();
    //drawObstacle();

  } else {
    showGameOver();
  }
}

// handleInput()

function handleInput() {
  // Check for horizontal movement
  if (keyIsDown(LEFT_ARROW)) {
    playerVX = -playerMaxSpeed;
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerVX = playerMaxSpeed;
  } else {
    playerVX = 0;
  }

  // Check for vertical movement
  if (keyIsDown(UP_ARROW)) {
    playerVY = -playerMaxSpeed;
  } else if (keyIsDown(DOWN_ARROW)) {
    playerVY = playerMaxSpeed;
  } else {
    playerVY = 0;
  }
  // Ability to sprint for the prey
  if (keyIsDown(SHIFT)) {
    playerMaxSpeed = 10;
  } else {
    playerMaxSpeed = 2;
  }

}

// movePlayer()
//
// wraps around the edges.
function movePlayer() {
  // Update position
  playerX += playerVX;
  playerY += playerVY;

  // Wrap when player goes off the canvas
  if (playerX < 0) {
    playerX += width;
  } else if (playerX > width) {
    playerX -= width;
  }

  if (playerY < 0) {
    playerY += height;
  } else if (playerY > height) {
    playerY -= height;
  }
}

// updateHealth()
//
function updateHealth() {
  // Reduce player health, constrain to reasonable range
  playerHealth = constrain(playerHealth - 0.5, 0, playerMaxHealth);
  // Check if the player is dead
  if (playerHealth === 0) {
    // If so, the game is over
    gameOver = true;
  }
}

// checkEating()
//
// Check if the player overlaps the prey and updates health of both
function checkEating() {
  // Get distance of player to prey
  var d = dist(playerX, playerY, preyX, preyY);
  // Check if it's an overlap
  if (d < playerSize + preySize) {
    // Increase the player health
    playerHealth = constrain(playerHealth + eatHealth, 0, playerMaxHealth);
    // Reduce the prey health
    preyHealth = constrain(preyHealth - eatHealth, 0, preyMaxHealth);
    // sounds when the player eats the prey
    eatSound.play();


    // Check if the prey died
    if (preyHealth === 0) {
      // Move the "new" prey to a random position
      preyX = random(0, width);
      preyY = random(0, height);
      // Give it full health
      preyHealth = preyMaxHealth;
      // Track how many prey were eaten
      preyEaten++;
    }

  }
  // Changing the playerHealth when he sprints
  if (keyIsDown(SHIFT)) {
    playerHealth -= 5;
  } else {
    playerHealth = constrain(playerHealth + eatHealth, 0, playerMaxHealth);

  }


}


// movePrey()
//
// Moves the prey based on random velocity changes
function movePrey() {
  preyVX = map(noise(tx),0,1,-preyMaxSpeed,preyMaxSpeed);
  preyVY = map(noise(ty),0,1,-preyMaxSpeed,preyMaxSpeed);


    // Update prey position based on velocity
    preyX += preyVX;
    preyY += preyVY;
    tx += 0.05;
    ty += 0.05;

  // Screen wrapping
  if (preyX < 0) {
    preyX += width;
  } else if (preyX > width) {
    preyX -= width;
  }

  if (preyY < 0) {
    preyY += height;
  } else if (preyY > height) {
    preyY -= height;
  }
}

// drawPrey()
//
// Draw the prey as an ellipse with alpha based on health
function drawPrey() {
  push();
  tint(255,map(preyHealth,0,100,0,255));
  image(preyImage,preyX, preyY, preySize*2);
  pop();
}

// drawPlayer()
//
// Draw the player as an ellipse with alpha based on health
function drawPlayer() {
  push();
  tint(255,playerHealth);
  image(playerImage,playerX, playerY,playerSize*2);
  pop();
}

// showGameOver()
//
// Display text about the game being over!
function showGameOver() {
  image(gameoverImage,75,90,350,350)
  textFont(gameoverFont);
  textSize(32);
  textAlign(CENTER, CENTER);
  fill(0);
  var gameOverText = "GAME OVER\n";
  gameOverText += "You ate " + preyEaten + " prey\n";
  gameOverText += "before you died"
  text(gameOverText, width / 2, height / 2);
  failSound.play();

}
