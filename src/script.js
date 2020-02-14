// TODO: generate divs automatically
// fix levels of abstraction

const rollButton = document.getElementById("roll");
const resetButton = document.getElementById("reset");
let squaresCollection; // squares represent dice
let squaresArray;
let decayedSquares;
let numDice;
let numRolls;
let totalOnes;

setInitialConditons();

function setInitialConditons() {
  squaresCollection = document.getElementsByClassName("item");
  squaresArray = Array.from(squaresCollection); // converts collection to array
  decayedSquares = [];
  numDice = squaresArray.length;
  numRolls = 0;
  totalOnes = 0;

  document.getElementById(
    "rollsElapsed"
  ).innerHTML = `Rolls complete: ${numRolls}`;
  document.getElementById(
    "diceRemaining"
  ).innerHTML = `Dice remaining: ${numDice}`;

  rollButton.addEventListener("click", rollDice);
}

function rollDice() {
  // roll all the remaining dice and check them each individually
  for (i = 0; i <= numDice; i++) {
    // generate random number representing the face of the die
    result = Math.floor(Math.random() * 6) + 1;
    // if a die lands on one then it has "decayed"
    if (result == 1) {
      totalOnes += 1;
    }
  }
  numDice -= totalOnes;
  numRolls += 1;

  for (i = 0; i < totalOnes; i++) {
    // each iteration changes a square to black
    indexToRemove = Math.floor(Math.random() * squaresArray.length);
    squaresArray[indexToRemove].style.cssText = "background-color: black;";
    decayedSquares.push(squaresArray[indexToRemove]);
    squaresArray.splice(indexToRemove, 1);
  }

  totalOnes = 0; // resetting for next roll

  // prevents number of rolls being incremented when no dice remain
  if (numDice === 0) {
    rollButton.removeEventListener("click", rollDice);
  }

  document.getElementById(
    "rollsElapsed"
  ).innerHTML = `Rolls complete: ${numRolls}`;
  document.getElementById(
    "diceRemaining"
  ).innerHTML = `Dice remaining: ${numDice}`;
}

resetButton.addEventListener("click", function(event) {
  for (i = 0; i < squaresArray.length; i++) {
    squaresArray[i].style.cssText = "background-color: yellow;";
  }
  for (i = 0; i < decayedSquares.length; i++) {
    decayedSquares[i].style.cssText = "background-color: yellow;";
  }
  setInitialConditons();
});
