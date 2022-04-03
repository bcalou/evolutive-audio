console.log('ok');

const audio = new Audio('audio.mp3');

const bpm = 128;
const measuresPerCycle = 8;
const chordsPerCycle = 4;
const beatsPerMeasure = 4;
const numberOfCycles = 10;

const hits = Array(chordsPerCycle)
  .fill(undefined)
  .map((_, index) => new Audio(`hit${index}.mp3`));

const beatsPerCycle = measuresPerCycle * beatsPerMeasure;
const cycleDurationInSeconds = (beatsPerCycle / bpm) * 60;

let currentCycle = 0;

let interval;

start.addEventListener('click', () => {
  audio.play();
  refreshInterval();

  next.addEventListener('click', () => {
    playHit();
    goToNextCycle();
  });
});

function goToNextCycle() {
  if (currentCycle === numberOfCycles - 1) {
    return;
  }

  currentCycle++;
  console.log(`Now playing cycle ${currentCycle}`);

  setTimeout(() => {
    audio.currentTime = (cycleDurationInSeconds * currentCycle) + getPlayPositionInCycle();
  }, 250);
}

function playHit() {
  currentMeasure = Math.ceil((getPlayPositionInCycle() / cycleDurationInSeconds) * chordsPerCycle);
  console.log(`Current measure is ${currentMeasure}`);

  const hit = hits[currentMeasure - 1].cloneNode();
  hit.volume = 0.3;
  hit.play();
}

function getPlayPositionInCycle() {
  return audio.currentTime % cycleDurationInSeconds;
}

function refreshInterval() {
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => {
    currentCycle++;

    // When we reach the end
    if (currentCycle === numberOfCycles) {
      currentCycle = numberOfCycles - 2; // Return to the penultimate cycle to create an infinite loop
      audio.currentTime = (cycleDurationInSeconds * currentCycle);
    }

    console.log(`Now playing cycle ${currentCycle}`);
  }, cycleDurationInSeconds * 1000);
}
