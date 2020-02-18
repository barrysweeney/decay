// TODO: generate divs automatically
// TODO: remove overlapping plots
// TODO: add pause and reset functionality

const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
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

pauseButton.addEventListener("click", pause);
startButton.addEventListener("click", startDecay);

function startDecay() {
  setInitialConditions();
  plotData();
  resetGrid();
  makeTimeSteps();
}


function setInitialConditions() {
  promptForProbabilityOfDecay();
  nucleonsCollection = document.getElementsByClassName("item");
  nucleonsArray = Array.from(nucleonsCollection); // converts collection to array
  decayedNucleons = [];
  undecayedNucleons = nucleonsArray.length;
  yAxisUndecayedNucleons = [undecayedNucleons];
  numTimeSteps = 0;
  xAxisTimeSteps = [0];
  nucleonsDecayedThisTimeStep = 0;
  displayCounters();
}

function promptForProbabilityOfDecay(){
  probabilityOfDecay = prompt(
    "Please enter the probability of decay between 0 and 1"
  );
  if (probabilityOfDecay >= 1 || probabilityOfDecay <= 0) {
    probabilityOfDecay = prompt(
      "Please enter the probability of decay between 0 and 1"
    );
  }
}

function pause(){
  if(paused === false){
    paused = true
    pauseButton.innerHTML= "Resume";
  }else{
    paused = false;
    pauseButton.innerHTML= "Pause";
    makeTimeSteps();
  }
}

function makeTimeSteps() {
  id = setInterval(frame, 1000);
  function frame() {
    if (undecayedNucleons <= 0 || paused === true) {
      clearInterval(id);
      if(undecayedNucleons<=0){
      startButton.addEventListener("click", startDecay);
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

function changeTileColorOfDecayedNucleons() {
  for (i = 0; i < nucleonsDecayedThisTimeStep; i++) {
    if (nucleonsArray.length != 0) {
      // each iteration changes a tile to black
      indexToRemove = Math.floor(Math.random() * nucleonsArray.length);
      nucleonsArray[indexToRemove].style.cssText =
        "background-color: black;";
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
  document.getElementById("timeStepsElapsed").innerHTML = `Time Steps Complete: ${numTimeSteps}`;
  document.getElementById("undecayedNucleonsRemaining").innerHTML = `Undecayed Nucleons Remaining: ${undecayedNucleons}`;
}

function resetGrid() {
  for (i = 0; i < nucleonsArray.length; i++) {
    nucleonsArray[i].style.cssText = "background-color: yellow;";
  }
  for (i = 0; i < decayedNucleons.length; i++) {
    decayedNucleons[i].style.cssText = "background-color: yellow;";
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
