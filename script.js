// this version is currently for a hardcoded 100 dice

// TODO: each square (dice) has a unique id
// maybe store these in array
// when dice is landing on 1 then that square turns black and is removed from array

// TODO: make it so only one roll occurs when the roll button is pressed

const rollButton = document.getElementById("roll");
const squares = document.getElementsByClassName('item') // squares represent dice
numDice = 100;
numRolls = 0;
totalOnes = 0;

while(numDice>0){
rollButton.addEventListener('click', rollDice)
}

function rollDice() {
    while (numDice > 0) {
        for (i = 0; i < numDice; i++) {
            result = Math.floor(Math.random() * 6) + 1
            if (result == 1) {
                totalOnes += 1;
            }
        }
        numDice -= totalOnes;
        numRolls += 1;
        totalOnes = 0;

        document.getElementById("rollsElapsed").innerHTML = `Rolls complete: ${numRolls}`;
        document.getElementById("diceRemaining").innerHTML = `Dice remaining: ${numDice}`;
    }
}
