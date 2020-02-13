// this version is currently for a hardcoded 100 dice

// TODO: each square (dice) has a unique id
// maybe store these in array
// when dice is landing on 1 then that square turns black and is removed from array
// could do this linearly first and then randomly

const rollButton = document.getElementById("roll");
const squaresCollection = document.getElementsByClassName("item"); // squares represent dice
const squaresArray = Array.from(squaresCollection); // converts collection to array
const decayedSquares = []
numDice = 100;
numRolls = 0;
totalOnes = 0;

rollButton.addEventListener("click", rollDice);

console.log(squaresArray);

function rollDice() {
  // roll all the remaining dice and check them each individually
  for (i = 0; i < numDice; i++) {
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
    squaresArray[i].style.cssText = "background-color: black;";
  }

  // remove squares from squaresArray if they've "decayed"
for(i=0; i<totalOnes; i++){
    squaresArray.shift();
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
