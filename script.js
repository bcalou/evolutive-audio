console.log('ok');

const audio = new Audio('audio.webm');
const over = new Audio('over.mp3');
const menu = new Audio('menu.mp3');
menu.volume = 0.1;

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

let started = false;

progression.addEventListener('click', () => {
  const progressionFactor = parseFloat(prompt('Progression du jeu entre 0 (début) et 1 (hors jeu) ?'));
  progressTo(progressionFactor);
});

hit.addEventListener('click', () => {
  const progressionFactor = parseFloat(prompt('Progression du jeu entre 0 (début) et 1 (hors jeu) ?'));
  playHit();

  setTimeout(() => {
    progressTo(progressionFactor);
  }, 250);
});

game_over.addEventListener('click', () => {
  audio.pause();
  over.play();

  setTimeout(() => {
    progressTo(1);
  }, 2500);
});

function goToCycle(cycle) {
  if (cycle >= numberOfCycles) {
    return;
  }

  currentCycle = cycle;
  console.log(`Now playing cycle ${currentCycle}`);

  audio.currentTime = (cycleDurationInSeconds * currentCycle) + getPlayPositionInCycle();
}

function playHit() {
  currentMeasure = Math.ceil((getPlayPositionInCycle() / cycleDurationInSeconds) * chordsPerCycle) || 1;
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
    if (currentCycle < currentCycle - 1) {
      currentCycle++;

      console.log(`Now playing cycle ${currentCycle}`);
    }
  }, cycleDurationInSeconds * 1000);
}

function progressTo(progressionFactor) {
  console.log('progress to', progressionFactor);

  if (progressionFactor === 1) {
    audio.pause();
    menu.currentTime = 0;
    menu.play();
  } else {
    if (audio.paused) {
      console.log('set current time 0');
      audio.currentTime = 0;
      currentCycle = 0;
      audio.play();
      menu.pause();
    }

    const cycleMatchingProgression = Math.floor(numberOfCycles * progressionFactor);

    if (cycleMatchingProgression > currentCycle) {
      goToCycle(cycleMatchingProgression);
    }
  }
}

