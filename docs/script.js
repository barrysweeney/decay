// TODO: allow user to change number of initial nucleons

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const resetButton = document.getElementById("reset");
const ctx = document.getElementById("decayChart").getContext("2d"); // chart js convention to use ctx
let decayChart;
let nucleonsCollection;
let nucleonsArray;
let decayedNucleons;
let undecayedNucleons;
let numTimeSteps;
let nucleonsDecayedThisTimeStep;
let probabilityOfDecay;
let xAxisTimeSteps = [];
let yAxisUndecayedNucleons = [];
let id;
let paused = false;
let simulationsRun = 0;

pauseButton.addEventListener("click", pause);
startButton.addEventListener("click", startDecay);
createIcons(100);

function startDecay() {
  simulationsRun++;
  setInitialConditions();
  if (simulationsRun > 1) {
    updateChart();
  } else {
    plotData();
  }
  resetGrid();
  makeTimeSteps();
}

function createIcons(numberIcons) {
  for (let i = 1; i <= numberIcons; i++) {
    const icon = document.createElement("i");
    icon.className = "fas fa-atom";
    container.appendChild(icon);
  }
}

function setInitialConditions() {
  promptForProbabilityOfDecay();
  nucleonsCollection = document.getElementsByClassName("fas fa-atom");
  nucleonsArray = Array.from(nucleonsCollection); // converts collection to array
  decayedNucleons = [];
  undecayedNucleons = nucleonsArray.length;
  yAxisUndecayedNucleons = [undecayedNucleons];
  numTimeSteps = 0;
  xAxisTimeSteps = [0];
  nucleonsDecayedThisTimeStep = 0;
  displayCounters();
}

function promptForProbabilityOfDecay() {
  let invalidProbabilityEnterred = false;
  do {
    probabilityOfDecay = prompt(
      "Please enter the probability of decay between 0 and 1"
    );
    if (
      probabilityOfDecay >= 1 ||
      probabilityOfDecay <= 0 ||
      isNaN(probabilityOfDecay)
    ) {
      invalidProbabilityEnterred = true;
    } else {
      invalidProbabilityEnterred = false;
    }
  } while (invalidProbabilityEnterred);
}

function pause() {
  if (paused === false) {
    paused = true;
    pauseButton.innerHTML = "Resume";
  } else {
    paused = false;
    pauseButton.innerHTML = "Pause";
    makeTimeSteps();
  }
}

function makeTimeSteps() {
  resetButton.addEventListener("click", reset);
  id = setInterval(frame, 1000);
  function frame() {
    if (undecayedNucleons <= 0 || paused === true) {
      clearInterval(id);
      if (undecayedNucleons <= 0) {
        startButton.addEventListener("click", startDecay);
        // resetButton.removeEventListener("click", reset);
      }
    } else {
      startButton.removeEventListener("click", startDecay);
      // simulate all the remaining undecayed nucleons and check them each individually
      checkStateOfEachNucleon();
      updateCurrentConditions();
      changeTileColorOfDecayedNucleons();
      nucleonsDecayedThisTimeStep = 0; // resetting for next timeStep
      displayCounters();
      updateChart();
    }
  }
}

function reset() {
  clearInterval(id);
  startButton.addEventListener("click", startDecay);
  setInitialConditions();
  plotData();
  resetGrid();
  // this unpauses if reset has been pressed after the animation has been paused
  if (paused === true) {
    pause();
  } else {
    makeTimeSteps();
  }
}

function changeTileColorOfDecayedNucleons() {
  for (i = 0; i < nucleonsDecayedThisTimeStep; i++) {
    // each iteration changes a tile to black
    if (nucleonsArray.length != 0) {
      indexToRemove = Math.floor(Math.random() * nucleonsArray.length);
      nucleonsArray[indexToRemove].style.cssText = "color: black;";
      updateDecayedAndUndecayedNucleons();
    }
  }
}

function updateDecayedAndUndecayedNucleons() {
  decayedNucleons.push(nucleonsArray[indexToRemove]);
  nucleonsArray.splice(indexToRemove, 1);
}

function updateCurrentConditions() {
  undecayedNucleons -= nucleonsDecayedThisTimeStep;
  if (undecayedNucleons < 0) {
    undecayedNucleons = 0;
  }
  yAxisUndecayedNucleons.push(undecayedNucleons);
  numTimeSteps += 1;
  xAxisTimeSteps.push(numTimeSteps);
}

function checkStateOfEachNucleon() {
  for (i = 0; i <= undecayedNucleons; i++) {
    // generate random number representing the state of the nucleon
    result = Math.floor(Math.random() * (1 / probabilityOfDecay)) + 1;
    // if the state of the nucleon is one then it has "decayed"
    if (result == 1) {
      nucleonsDecayedThisTimeStep += 1;
    }
  }
}

function displayCounters() {
  document.getElementById(
    "timeStepsElapsed"
  ).innerHTML = `Time Steps Complete: ${numTimeSteps}`;
  document.getElementById(
    "undecayedNucleonsRemaining"
  ).innerHTML = `Undecayed Nucleons Remaining: ${undecayedNucleons}`;
}

function resetGrid() {
  for (i = 0; i < nucleonsArray.length; i++) {
    nucleonsArray[i].style.cssText = "color: yellow;";
  }
  for (i = 0; i < decayedNucleons.length; i++) {
    decayedNucleons[i].style.cssText = "color: yellow;";
  }
}

function plotData() {
  decayChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: xAxisTimeSteps,
      datasets: [
        {
          label: "Undecayed Nucleons",
          data: yAxisUndecayedNucleons,
          backgroundColor: "yellow",
          borderColor: "black",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Time"
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Nucleons Remaining"
            }
          }
        ]
      }
    }
  });
}

function updateChart() {
  decayChart.destroy();
  plotData();
}
