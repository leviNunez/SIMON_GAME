const powerBtn = document.getElementById('power-btn');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const displayText = document.getElementById('display-text');
const toggleSwitch = document.querySelector('input');
const ledLight = document.getElementById('led-light');

const coloredBtnsArr = ['green', 'red', 'yellow', 'blue'];
const correctAnswerArr = ['CORRECT!', 'EXCELLENT!', 'AWESOME!', 'PERFECT!'];
const levelText = 'LEVEL: ';
const pressStart = 'PRESS START TO BEGING';

let isPowerOn = false;
let isGameStarted = false;
let strict = false;
let playersTurn = false;
let functionStopper = false;
let gamePattern = [];
let playerPattern = [];
let currentLevel = 0;
let count;

//MAIN FUNCTIONS---------------------------------------------------------------------

//POWER ON/OFF
powerBtn.addEventListener("click", function () {
  if (isPowerOn === false) {
    powerOnAnimation(1500);
    turnLedLightOn("green");
    setTimeout(function () {
      isPowerOn = true;
    }, 1500);
  } else {
    powerOffAnimation(1500);
    setTimeout(function () {
      isPowerOn = false;
      resetGame();
      turnLedLightOff();
    }, 1500);
  }
});

//STARTS THE GAME

startBtn.addEventListener("click", function () {
  if (displayText.innerHTML === pressStart) {
    isGameStarted = true;
    functionStopper = false;
    setDefaultDisplayText();
    gameSequence();
  }
});

//RESETS THE GAME

resetBtn.addEventListener("click", function () {
  if (isGameStarted) {
    functionStopper = true;
    displayText.innerHTML = "RESETTING...";
    setTimeout(function () {
      resetGame();
      displayText.innerHTML = pressStart;
    }, 500);
  }
});

//HANDLES COMPUTER'S SEQUENCE

function gameSequence() {
  playersTurn = false;
  turnLedLightOn("yellow");
  displayText.innerHTML = "WATCH!";
  currentLevel++;
  playerPattern = [];
  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColor = coloredBtnsArr[randomNumber];
  gamePattern.push(randomChosenColor);
  count = gamePattern.length;
  coloredBtnsAnimation(count);
  setTimeout(function () {
    if (functionStopper === true) {
      return;
    }
    setDefaultDisplayText();
    playersTurn = true;
    turnLedLightOn("green");
  }, 1000 * count);
}

//HANDLES PLAYER'S SEQUENCE

for (let i = 0; i <= 3; i++) {
  document
    .querySelectorAll(".colored-btn")
    [i].addEventListener("click", function () {
      if (playersTurn === true) {
        const clickedBtn = this.id;
        makeAButtonFlash(clickedBtn, 400);
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
      displayText.innerHTML = pickRandomText();
      turnLedLightOff();
      setTimeout(function () {
        gameSequence();
      }, 1000);
    }
  } else {
    playersTurn = false;
    playerPattern = [];
    playASound("wrong");
    makeLedLightFlash("red", 1000);
    displayText.innerHTML = "WRONG!";
    setTimeout(function () {
      displayText.innerHTML = "WATCH!";
      turnLedLightOn("yellow");
    }, 1000);
    setTimeout(function () {
      coloredBtnsAnimation(count);
    }, 1000);
    setTimeout(function () {
      if (functionStopper === true) {
        return;
      }
      setDefaultDisplayText();
      playersTurn = true;
      turnLedLightOn("green");
    }, 1000 * count);
  }
}

function strictCheck(index) {
  if (playerPattern[index] === gamePattern[index]) {
    if (playerPattern.length === gamePattern.length) {
      displayText.innerHTML = pickRandomText();
      turnLedLightOff();
      setTimeout(function () {
        gameSequence();
      }, 1000);
    }
  } else {
    playersTurn = false;
    playASound("wrong");
    gameOver();
    setTimeout(function () {
      resetGame();
    }, 1000);
  }
}

//COLORED BUTTON SEQUENCE
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
async function coloredBtnsAnimation(count) {
  let color;
  for (let i = 0; i < count; i++) {
    if (functionStopper === true) {
      return;
    }
    color = gamePattern[i];
    makeAButtonFlash(color, 500);
    playASound(color);
    await timer(1000);
  }
}

//NORMAL/STRICT TOGGLE

toggleSwitch.addEventListener("click", function () {
  if (toggleSwitch.checked) {
    strict = true;
    const currentDisplayText =
      displayText.innerHTML !== "WATCH!"
        ? displayText.innerHTML
        : (displayText.innerHTML = levelText + currentLevel);
    displayText.innerHTML = "STRICT MODE";
    setTimeout(function () {
      displayText.innerHTML = currentDisplayText;
    }, 1000);
  } else {
    strict = false;
    const currentDisplayText =
      displayText.innerHTML !== "WATCH!"
        ? displayText.innerHTML
        : (displayText.innerHTML = levelText + currentLevel);
    displayText.innerHTML = "NORMAL MODE";
    setTimeout(function () {
      displayText.innerHTML = currentDisplayText;
    }, 1000);
  }
});

//CALLED BACK FUNCTIONS-------------------------------------------------------------

function powerOnAnimation(time) {
  textAnimation("fade-in", time);
  makeAllBtnsFlash(1500);
}

function powerOffAnimation(time) {
  textAnimation("fade-out", time);
}

function textAnimation(animationType, time) {
  if (animationType === "fade-in") {
    displayText.innerHTML = "WELCOME";
    displayText.classList.toggle("display-animation-fade-in");
    displayText.style.visibility = "visible";
    setTimeout(function () {
      displayText.innerHTML = pressStart;
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

function makeAButtonFlash(coloredBtn, time) {
  document.getElementById(coloredBtn).classList.toggle("colored-btn-on");
  setTimeout(function () {
    document.getElementById(coloredBtn).classList.toggle("colored-btn-on");
  }, time);
}

function playASound(color) {
  const colorAudio = new Audio("assets/sounds/" + color + ".mp3");
  colorAudio.play();
}

function turnLedLightOn(color) {
  if (typeof ledLight.classList[1] === "undefinded") {
    ledLight.classList.add("led-light-" + color);
  } else {
    turnLedLightOff();
    ledLight.classList.add("led-light-" + color);
  }
}

function turnLedLightOff() {
  ledColorToBeRemove = ledLight.classList[1];
  ledLight.classList.remove(ledColorToBeRemove);
}

function makeLedLightFlash(color, time) {
  turnLedLightOff();
  ledLight.classList.toggle("led-light-" + color);
  setTimeout(function () {
    ledLight.classList.toggle("led-light-" + color);
  }, time);
}

function setDefaultDisplayText() {
  displayText.innerHTML = levelText + currentLevel;
}

function pickRandomText() {
  const randomnumber = Math.floor(Math.random() * 3);
  return correctAnswerArr[randomnumber];
}

function gameOver() {
  displayText.innerHTML = "GAME OVER";
  turnLedLightOn("red");
  setTimeout(function () {
    displayText.innerHTML = pressStart;
  }, 1000);
}

function resetGame() {
  currentLevel = 0;
  count = 0;
  gamePattern = [];
  playerPattern = [];
  isGameStarted = false;
  turnLedLightOn("green");
}
