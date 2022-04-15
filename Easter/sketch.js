//game variables
let eggSpeed = 2;
let droppedEggs = 0;

//statemachine variables
let gameState = 0;
let userInputName = null;

//images
let bunnyPic;

function drawBackground() {
  grass = color(150, 250, 30);
  background(103, 190, 250);
  fill(grass);
  noStroke();
  rect(0, height - 100, width, 100);
}

function displayPlayerScore(playerBunny) {
  fill(0);
  //sets the x and y position for the text
  const playerTextX = 25;
  const playerTextY = 30;
  //sets the text alignment, size and content
  textAlign(LEFT);
  textSize(15);
  text("Score: " + playerBunny.playerScore, playerTextX, playerTextY + 20);
  text("Dropped eggs: " + droppedEggs, playerTextX, playerTextY + 40);
}

function displayGameOver(bunny) {
  textAlign(CENTER);
  fill(0);
  textSize(50);
  text("Game over!", width / 2, height / 2 - 100);
  textSize(20);
  text(
    "You finished with a score of: " + bunny.playerScore,
    width / 2,
    height / 2 - 70
  );
}

function displayStart() {
  textAlign(CENTER);
  fill(0);
  textSize(30);
  text("Easter Bunny Egg catch!", width / 2, height / 3 - 100);
  textSize(20);
  text(
    "Catch the falling eggs. \n If you drop 3 eggs it's game over.",
    width / 3 - 100,
    height / 3 - 70,
    width / 3 + 200
  );
  imageMode(CENTER);
  image(bunnyPic, width / 3, height - 150, 200, 200);
}

function hasCollision(playerBunny, egg) {
  const requiredDist = (playerBunny.bunnyWidth + egg.eggHeight) / 2;
  const actualDist = dist(
    egg.eggX,
    egg.eggY,
    playerBunny.bunnyX,
    playerBunny.bunnyY
  );
  const distanceBetween = Math.round(actualDist);
  return distanceBetween < requiredDist;
}

function preload() {
  bunnyPic = loadImage("assets/Bunny.png");
}

function setup() {
  createCanvas(500, 600);
  playerBunny = new Bunny();
  //egg = new Egg(random(width), 0, eggSpeed);
  egg1 = new Egg(random(width), -450, eggSpeed);
  egg2 = new Egg(random(width), 0, eggSpeed);
  egg3 = new Egg(random(width), -200, eggSpeed);
  eggs = [egg1, egg2, egg3];

  startBtn = new Button(width / 3, height / 3, 150, 30, "Start");
  restartBtn = new Button(width / 3, height / 3 + 50, 150, 30, "Restart");
}

function draw() {
  drawBackground();
  if (gameState == 0) {
    displayStart();
    startBtn.display();
    if (startBtn.mouseOnButton() && mouseIsPressed) {
      gameState = 1;
    }
  }

  if (gameState == 1) {
    displayPlayerScore(playerBunny);
    playerBunny.move(mouseX, height - 110);
    playerBunny.display();

    for (let i = 0; i < eggs.length; i++) {
      if (!eggs[i].isDestroyed) {
        eggs[i].display();
        eggs[i].move();
      } else {
        eggs[i] = new Egg(random(width), -random(height), eggSpeed);
      }

      if (hasCollision(playerBunny, eggs[i])) {
        playerBunny.addPoint(1); // SCORE!
        eggs[i].destroy();
        if (playerBunny.playerScore > 0 && playerBunny.playerScore % 10 === 0) {
          eggSpeed += Math.random();
        }
      }
    }

    if (droppedEggs >= 3) {
      gameState = 2;
    }
  }
  if (gameState == 2) {
    displayGameOver(playerBunny);
    imageMode(CENTER);
    image(bunnyPic, width / 3, height - 150, 200, 200);
    restartBtn.display();
    if (restartBtn.mouseOnButton() && mouseIsPressed) {
      for (let i = 0; i < eggs.length; i++) {
        eggs[i].destroy();
      }
      playerBunny.playerScore = 0;
      droppedEggs = 0;
      eggSpeed = 2;
      gameState = 1;
    }
  }
}

class Bunny {
  constructor() {
    this.bunnyX = 0;
    this.bunnyY = 0;
    this.bunnyWidth = 60;
    this.bunnyHeight = 40;
    this.color = color("#FFECC0");
    this.playerScore = 0;
  }

  display() {
    //draws bunny
    fill(this.color);
    //collision circle for testing
    //circle(this.bunnyX, this.bunnyY, this.bunnyWidth);
    fill(0);
    imageMode(CENTER);
    image(bunnyPic, this.bunnyX, this.bunnyY - 15, 70, 70);
  }

  move(x, y) {
    this.bunnyX = x;
    this.bunnyY = y;
  }

  addPoint(number) {
    this.playerScore = this.playerScore + number;
  }
}

class Egg {
  constructor(x, y, speed) {
    const easterPalette = [
      color("#FF7ECB"),
      color("#9EF8DF"),
      color("#FFFCB8"),
      color("#FCC470"),
      color("#9386e6"),
    ];
    let random = Math.floor(Math.random() * easterPalette.length);
    this.eggX = x;
    this.eggY = y;
    this.eggHeight = 30;
    this.eggWidth = 20;
    this.color = easterPalette[random];
    this.speed = speed;
    this.isDestroyed = false;
  }

  display() {
    //draws fish
    fill(this.color);
    ellipse(this.eggX, this.eggY, this.eggWidth, this.eggHeight);
    this.move();
  }

  move() {
    this.eggY = this.eggY + this.speed;
    if (this.eggY >= height && !this.isDestroyed) {
      this.destroy();
      droppedEggs += 1;
      console.log("egg dropped");
    }
  }

  destroy() {
    this.isDestroyed = true;
  }
}

// State Button class
class Button {
  constructor(buttonX, buttonY, buttonWidth, buttonHeight, buttonText) {
    this.x = buttonX;
    this.y = buttonY;
    this.width = buttonWidth;
    this.height = buttonHeight;
    this.text = buttonText;
    this.color = color("#FFFCB8"); //default color
  }

  //Function to determine if mouse is hovering on button
  mouseOnButton() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    ) {
      this.color = color("#FCC470"); //hover display color
      return true;
    } else {
      this.color = color("#FFFCB8"); //default color
      return false;
    }
  }

  //Function to draw button
  display() {
    fill(this.color);
    rect(this.x, this.y, this.width, this.height, 5);
    textAlign(CENTER);
    fill(0);
    text(this.text, this.x, this.y + this.height / 4, this.width);
  }
}
