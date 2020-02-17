// TODO: generate divs automatically
// TODO: remove overlapping plots

const timeStepButton = document.getElementById("timeStep");
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
let id;

timeStepButton.addEventListener("click", makeTimeStep);

function setInitialConditions() {
  probabilityOfDecay = prompt("Please enter the probability of decay between 0 and 1")
  if (probabilityOfDecay >=1 || probabilityOfDecay<=0){
    probabilityOfDecay = prompt("Please enter the probability of decay between 0 and 1")
  }
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

  plotData();

}

function makeTimeStep() {
  setInitialConditions();
  reset();
  id = setInterval(frame, 1000);
  function frame(){
    if(undecayedNucleons <= 0){
      clearInterval(id);
    }else{
  // simulate all the remaining undecayed nucleons and check them each individually
  for (i = 0; i <= undecayedNucleons; i++) {
    // generate random number representing the state of the nucleon
    result = Math.floor(Math.random() * (1/probabilityOfDecay)) + 1; 
    // if the state of the nucleon is one then it has "decayed"
    if (result == 1) {
      nucleonsDecayedThisTimeStep += 1;
    }
  }
  undecayedNucleons -= nucleonsDecayedThisTimeStep;
  if(undecayedNucleons<0){
    undecayedNucleons = 0;
  }
  yAxisUndecayedNucleons.push(undecayedNucleons);
  numTimeSteps += 1;
  xAxisTimeSteps.push(numTimeSteps)


  for (i = 0; i < nucleonsDecayedThisTimeStep; i++) {
    if(nucleonsArray.length != 0){
    // each iteration changes a tile to black
    indexToRemove = Math.floor(Math.random() * nucleonsArray.length);
    nucleonsArray[indexToRemove].style.cssText = "background-color: black;";
    decayedNucleons.push(nucleonsArray[indexToRemove]);
    nucleonsArray.splice(indexToRemove, 1);
  }
}

  nucleonsDecayedThisTimeStep = 0; // resetting for next timeStep


  document.getElementById(
    "timeStepsElapsed"
  ).innerHTML = `Time Steps Complete: ${numTimeSteps}`;
  document.getElementById(
    "undecayedNucleonsRemaining"
  ).innerHTML = `Undecayed Nucleons Remaining: ${undecayedNucleons}`;

  updateChart();
}
// if(undecayedNucleons <= 0){
//   clearInterval(id);
// }
}
}

function reset(){
  for (i = 0; i < nucleonsArray.length; i++) {
    nucleonsArray[i].style.cssText = "background-color: yellow;";
  }
  for (i = 0; i < decayedNucleons.length; i++) {
    decayedNucleons[i].style.cssText = "background-color: yellow;";
  }
}

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
