const powerBtn = document.getElementById("power-btn");
const startBtn = document.getElementById("start-btn");
const displayText = document.getElementById("display-text");
const toggleSwitch = document.querySelector("input");
const ledLight = document.getElementById("led-light");
const coloredBtnsArr = ["green", "red", "yellow", "blue"];

let isPowerOn = false;
let isGameStarted = false;
let strict = false;
let playersTurn = false;
let gamePattern = [];
let playerPattern = [];
let currentLevel = 0;
let displayLevel = 'LEVEL:<span id="display-number">0</span>';
let count;

alert("hello");

//MAIN FUNCTIONS---------------------------------------------------------------------

//POWER ON/OFF
powerBtn.addEventListener("click", function () {
  if (isPowerOn === false) {
    powerOnAnimation(1500);
    setTimeout(function () {
      isPowerOn = true;
    }, 1500);
  } else {
    powerOffAnimation(1500);
    setTimeout(function () {
      isPowerOn = false;
      resetGame();
    }, 1500);
  }
});

//STARTS THE SEQUENCE

startBtn.addEventListener("click", function () {
  if (displayText.innerHTML === "PRESS START TO BEGIN") {
    isGameStarted = true;
    setDefaultDisplayText();
    gameSequence();
  }
});

//HANDLES COMPUTER'S SEQUENCE

function gameSequence() {
  displayText.innerHTML = "WATCH!";
  currentLevel++;
  playerPattern = [];
  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColor = coloredBtnsArr[randomNumber];
  gamePattern.push(randomChosenColor);
  count = gamePattern.length;
  coloredBtnsAnimation(count);
  playersTurn = true;
  makeLedLightFlash("yellow", 1000 * count);
  setTimeout(function () {
    setDefaultDisplayText();
  }, 1000 * count);
}

//HANDLES PLAYER'S SEQUENCE

for (let i = 0; i <= 3; i++) {
  document.querySelectorAll(".colored-btn")[i].addEventListener("click", function () {
      if (playersTurn === true) {
        const clickedBtn = this.id;
        makeButtonFlash(clickedBtn, 200);
        playASound(clickedBtn);
        playerPattern.push(this.id);
        let index = playerPattern.length - 1;
        if (strict === true) {
          strictCheck(index);
        } else {
          normalCheck(index);
        }
      }
    });
}

//COMPARES PLAYER'S CHOICE AGAINST THE COMPUTER'S

function normalCheck(index) {
  if (playerPattern[index] === gamePattern[index]) {
    if (playerPattern.length === gamePattern.length) {
      makeLedLightFlash("green", 200);
      displayText.innerHTML = "CORRECT!";
      setTimeout(function () {
        playersTurn = false;
        gameSequence();
      }, 1000);
    }
  } else {
    playerPattern = [];
    playASound("wrong");
    makeLedLightFlash("red", 1000);
    displayText.innerHTML = "WRONG!";
    setTimeout(function () {
      displayText.innerHTML = "WATCH!";
      makeLedLightFlash("yellow", 1000 * count);
    }, 1000);
    setTimeout(function () {
      coloredBtnsAnimation(count);
    }, 1000);
    setTimeout(function () {
      setDefaultDisplayText();
    }, 1000 * count);
  }
}

function strictCheck(index) {
  if (playerPattern[index] === gamePattern[index]) {
    if (playerPattern.length === gamePattern.length) {
      makeLedLightFlash("green", 100);
      displayText.innerHTML = "CORRECT!";
      setTimeout(function () {
        gameSequence();
      }, 1000);
    }
  } else {
    playASound("wrong");
    gameOver();
    resetGame();
  }
}

//COLORED BUTTONS ANIMATION
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
async function coloredBtnsAnimation(count) {
  let i = 0;
  while (i <= count) {
    const color = gamePattern[i];
    makeButtonFlash(color, 600);
    playASound(color);
    i++;
    await timer(1000);
  }
}

//CALLED FUNCTIONS-------------------------------------------------------------

function powerOnAnimation(time) {
  displayAnimation("fade-in", time);
  makeAllBtnsFlash(1500);
  makeLedLightFlash("green", time);
}

function powerOffAnimation(time) {
  displayAnimation("fade-out", time);
}

function displayAnimation(animation, time) {
  if (animation === "fade-in") {
    displayText.innerHTML = "HELLO!";
    displayText.classList.toggle("display-animation-fade-in");
    displayText.style.visibility = "visible";
    setTimeout(function () {
      displayText.innerHTML = "PRESS START TO BEGIN";
    }, time);
    setTimeout(function () {
      displayText.classList.toggle("display-animation-fade-in");
    }, time);
  } else {
    displayText.innerHTML = "SHUTTING DOWN :(";
    displayText.classList.toggle("display-animation-fade-out");
    setTimeout(function () {
      displayText.style.visibility = "hidden";
    }, time);
  }
}

function makeAllBtnsFlash(time) {
  for (let i = 0; i <= 3; i++) {
    document
      .getElementById(coloredBtnsArr[i])
      .classList.toggle("colored-btn-on");
    setTimeout(function () {
      document
        .getElementById(coloredBtnsArr[i])
        .classList.toggle("colored-btn-on");
    }, time);
  }
}

function makeButtonFlash(coloredBtn, time) {
  document.getElementById(coloredBtn).classList.toggle("colored-btn-on");
  setTimeout(function () {
    document.getElementById(coloredBtn).classList.toggle("colored-btn-on");
  }, time);
}

function playASound(color) {
  const colorAudio = new Audio("assets/sounds/" + color + ".mp3");
  colorAudio.play();
}

function makeLedLightFlash(color, time) {
  ledLight.classList.toggle("led-light-" + color);
  setTimeout(function () {
    ledLight.classList.toggle("led-light-" + color);
  }, time);
}

function setDefaultDisplayText() {
  displayText.innerHTML = displayText.innerHTML = displayLevel;
  document.getElementById("display-number").innerHTML = currentLevel;
}

function gameOver() {
  makeLedLightFlash("red", 1000);
  displayText.innerHTML = "GAME OVER";
  setTimeout(function () {
    displayText.innerHTML = "PRESS START TO BEGIN";
  }, 1000);
}

function resetGame() {
  currentLevel = 0;
  gamePattern = [];
  playerPattern = [];
  isGameStarted = false;
  count = 0;
}
