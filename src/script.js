// TODO: generate divs automatically

const timeStepButton = document.getElementById("timeStep");
const resetButton = document.getElementById("reset");
const ctx = document.getElementById('decayChart').getContext('2d'); // chart js convention to use ctx
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

setInitialConditions();

function setInitialConditions() {
  probabilityOfDecay = prompt("Please enter the probability of decay")
  nucleonsCollection = document.getElementsByClassName("item");
  nucleonsArray = Array.from(nucleonsCollection); // converts collection to array
  decayedNucleons = [];
  undecayedNucleons = nucleonsArray.length;
  yAxisUndecayedNucleons = [undecayedNucleons]
  numTimeSteps = 0;
  xAxisTimeSteps = [0];
  nucleonsDecayedThisTimeStep = 0;

  document.getElementById(
    "timeStepsElapsed"
  ).innerHTML = `Time Steps Complete: ${numTimeSteps}`;
  document.getElementById(
    "undecayedNucleonsRemaining"
  ).innerHTML = `Undecayed Nucleons Remaining: ${undecayedNucleons}`;

  timeStepButton.addEventListener("click", makeTimeStep);

  plotData();
}

function makeTimeStep() {
  // simulate all the remaining undecayed nucleons and check them each individually
  for (i = 0; i <= undecayedNucleons; i++) {
    // generate random number representing the state of the die
    result = Math.floor(Math.random() * (1/probabilityOfDecay)) + 1; 
    // if the state of the nucleon is one then it has "decayed"
    if (result == 1) {
      nucleonsDecayedThisTimeStep += 1;
    }
  }
  undecayedNucleons -= nucleonsDecayedThisTimeStep;
  yAxisUndecayedNucleons.push(undecayedNucleons);
  numTimeSteps += 1;
  xAxisTimeSteps.push(numTimeSteps)

  for (i = 0; i < nucleonsDecayedThisTimeStep; i++) {
    // each iteration changes a tile to black
    indexToRemove = Math.floor(Math.random() * nucleonsArray.length);
    nucleonsArray[indexToRemove].style.cssText = "background-color: black;";
    decayedNucleons.push(nucleonsArray[indexToRemove]);
    nucleonsArray.splice(indexToRemove, 1);
  }

  nucleonsDecayedThisTimeStep = 0; // resetting for next timeStep

  // prevents number of timeSteps being incremented when no nucleons remain
  if (undecayedNucleons === 0) {
    timeStepButton.removeEventListener("click", makeTimeStep);
  }

  document.getElementById(
    "timeStepsElapsed"
  ).innerHTML = `Time Steps Complete: ${numTimeSteps}`;
  document.getElementById(
    "undecayedNucleonsRemaining"
  ).innerHTML = `Undecayed Nucleons Remaining: ${undecayedNucleons}`;

  updateChart();
}

resetButton.addEventListener("click", function(event) {
  for (i = 0; i < nucleonsArray.length; i++) {
    nucleonsArray[i].style.cssText = "background-color: yellow;";
  }
  for (i = 0; i < decayedNucleons.length; i++) {
    decayedNucleons[i].style.cssText = "background-color: yellow;";
  }
  setInitialConditions();
  updateChart();
});

function plotData(){
  decayChart = new Chart(ctx, {
  type: 'line',
  data: {
      labels: xAxisTimeSteps,
      datasets: [{
          label: 'Undecayed Nucleons',
          data: yAxisUndecayedNucleons,
          backgroundColor: "yellow",
          borderColor: "black",
          borderWidth: 1
      }],
      
  },
  options: {
    responsive: true,
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Time'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Nucleons Remaining'
        }
      }]
    }
  }
});
}

function updateChart(){
  decayChart.destroy();
  plotData();
}
