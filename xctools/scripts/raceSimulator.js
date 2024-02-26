const canvas = document.getElementById("race-sim-canvas");
const ctx = canvas.getContext("2d");

// canvas specific dimensions
const ctr = {x: canvas.width/2, y: canvas.height/2}
const pxToM = 4;

// track dimensions
const innerRadius = 36.5 * pxToM;
const straightLength = 84.39 * pxToM;
const laneWidth = 4 * pxToM;
const numLanes = 5;

// Runner path is innerRadius + half of lane width
const runnerPathArcLength = (innerRadius + laneWidth/2) * Math.PI
const runnerPathTotalLength = runnerPathArcLength * 2 + straightLength * 2

const runnerRadius = 10;
let timeInterval = 0.016667; // speeed 

// global state
let globalTime = 0;
let progressTime = true;
let maxGlobalTime = 3000;

let runnerData;
let raceEvent;
let numFinished = 0;

// the time bar
const timeBar = document.getElementById("time-bar");
let timeBarBeingClicked = false;
function timeBarDown() {
    timeBarBeingClicked = true;
    manageAnimation();
}
function timeBarUp() {
    timeBarBeingClicked = false;
}

timeBar.addEventListener("mousedown", timeBarDown);
timeBar.addEventListener("touchstart", timeBarDown);
timeBar.addEventListener("mouseup", timeBarUp);
timeBar.addEventListener("touchend", timeBarUp);

let userPause = true;
canvas.addEventListener("click", (event) => {
    userPause = !userPause;
})

// the speed bar
const speedBar = document.getElementById("speed-bar");
const speedView = document.getElementById("speed-view");


// text stuff
const textSize = 8 * pxToM;
ctx.font = `${textSize}px serif`;

// color stuff
const backgroundGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
backgroundGradient.addColorStop(0, "#36687d");
backgroundGradient.addColorStop(1, "#48575E");


function drawBackround() {
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTrack() {
    for (let i=0; i <= numLanes; i++) {
        const radius = innerRadius + i * laneWidth;
        ctx.strokeStyle = "#FAFAFA";
        
        // right side
        ctx.beginPath();
        ctx.arc(ctr.x + straightLength / 2, ctr.y, radius, Math.PI/2, -Math.PI/2, true);
        ctx.stroke();

        // left side
        ctx.beginPath();
        ctx.arc(ctr.x - straightLength / 2, ctr.y, radius, Math.PI/2, -Math.PI/2);
        ctx.stroke();
        
        // top straights
        ctx.beginPath();
        ctx.moveTo(ctr.x - straightLength / 2, ctr.y - radius);
        ctx.lineTo(ctr.x + straightLength / 2, ctr.y - radius);
        ctx.stroke();

        // bottom straights
        ctx.beginPath();
        ctx.moveTo(ctr.x - straightLength / 2, ctr.y + radius);
        ctx.lineTo(ctr.x + straightLength / 2, ctr.y + radius);
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(ctr.x + straightLength / 2, ctr.y + innerRadius);
    ctx.lineTo(ctr.x + straightLength / 2, ctr.y + innerRadius + laneWidth * numLanes);
    ctx.stroke();
}

function getRunnerStatusFromSplits(splits) {
    const runnerPathRadius = innerRadius + laneWidth/2;
    startPos = {x: ctr.x + straightLength/2, y: ctr.y + innerRadius + laneWidth/2};
    splitNum = 0;
    let splitTime = globalTime;
    for (const split of splits) {
        if (splitTime > split.seconds) {
            splitNum++;
            splitTime -= split.seconds;
        } else {
            break;
        }
    }

    let ratio = 0;
    let finished = false;

    if (splitNum < splits.length) {
        ratio = splitTime / splits[splitNum].seconds;
    } else {
        ratio = 0;
        finished = true;
        numFinished += 1;
    }
    const finishedPlace = numFinished;
    const currentProgress = splitNum + ratio;

    if (finished) {
        // runnerInfo.finished = true;
        // return runnerInfo;
        return {pos: {x: 0, y: 0}, finished: true, finishedPlace: finishedPlace};
    }
    const runnerInfo = {
        pos: { x: 0, y: 0},
        finished: false,
        finishedPlace: finishedPlace
    }
    // This is for if there is a different starting point for 
    // different events
    // if (splitNum === 0) {
    //
    // }
    const trackPortions = [0, runnerPathArcLength/runnerPathTotalLength, (runnerPathArcLength + straightLength)/runnerPathTotalLength, (runnerPathArcLength*2 + straightLength)/runnerPathTotalLength, 1]
    
    let quadrant = 0;
    for (let j = 1; j < trackPortions.length; j++) {
        if (ratio < trackPortions[j]) {
            break;
        }
        quadrant++;
    }
    if (quadrant === 0) {
        const ratio2 = (ratio - 0) / (runnerPathArcLength/runnerPathTotalLength);
        const theta = ratio2 * Math.PI + Math.PI/2
        runnerInfo.pos = {x: runnerPathRadius * -Math.cos(theta) + ctr.x + straightLength/2, y: runnerPathRadius * Math.sin(theta) + ctr.y};
        return runnerInfo;
    }
    if (quadrant === 1) {
        const ratio2 = (ratio - trackPortions[1]) / (straightLength/runnerPathTotalLength);
        runnerInfo.pos = {x: ctr.x + straightLength/2 - ratio2 * straightLength, y: ctr.y - runnerPathRadius};
        return runnerInfo;
    } 
    if (quadrant === 2) {
        const ratio2 = (ratio - trackPortions[2]) / (runnerPathArcLength/runnerPathTotalLength);
        const theta = ratio2 * Math.PI + Math.PI/2
        runnerInfo.pos = {x: runnerPathRadius * Math.cos(theta) + ctr.x - straightLength/2, y: runnerPathRadius * -Math.sin(theta) + ctr.y};
        return runnerInfo;
    }
    const ratio2 = (ratio - trackPortions[3]) / (straightLength/runnerPathTotalLength);
    runnerInfo.pos = {x: ctr.x - straightLength/2 + ratio2 * straightLength, y: ctr.y + runnerPathRadius};
    return runnerInfo;
}

function drawRunners() {
    numFinished = 0;
    const runnerInfos = [];
    for (const runner of runnerData.splits) {
        // console.log(runner.heat);
        const runnerStatus = getRunnerStatusFromSplits(runner.splits);
        const runnerInfo = {
            pos: runnerStatus.pos,
            finished: runnerStatus.finished,
            finishedPlace: runnerStatus.finishedPlace,
            initials: `${runner.firstname[0]}${runner.lastname[0]}`,
            heat: runner.heat ? runner.heat : 1,
        }
        runnerInfos.push(runnerInfo);
    }
    for (const runnerInfo of runnerInfos) {
        if (runnerInfo.finished) {
            const xPos = ctr.x + runnerRadius * 4 + (runnerInfo.finishedPlace - 1) % 5 * 3 * runnerRadius;
            const yPos = ctr.y - innerRadius + runnerRadius * 2 + Math.floor((runnerInfo.finishedPlace - 1) / 5) * 3 * runnerRadius;
            runnerInfo.pos = {x: xPos, y: yPos};
        }
        drawRunnersExact(runnerInfo);
    }

}

function drawRunnersBoid() {

}

function drawRunnersExact(runnerInfo) {
    const heat = parseInt(runnerInfo.heat);
    if (heat === 1) {
        ctx.fillStyle = "#cccccc";
    } else if (heat === 2) {
        ctx.fillStyle = "#aaaaaa";
    }
    // ctx.fillStyle = "#cccccc";
    ctx.beginPath();
    ctx.arc(runnerInfo.pos.x, runnerInfo.pos.y, runnerRadius, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = backgroundGradient;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.font = `${runnerRadius * 1.4}px sans-serif`;
    ctx.fillText(runnerInfo.initials, runnerInfo.pos.x, runnerInfo.pos.y + runnerRadius/7);
}


function drawInfo() {
    ctx.beginPath();
    ctx.fillStyle = '#CCCCCC';
    ctx.roundRect(ctr.x - straightLength/2 * 1.2, ctr.y - innerRadius * 0.9, straightLength*2/3, innerRadius*1.8, 10);
    ctx.fill();

    ctx.font = `${textSize}px serif`;
    ctx.fillStyle = backgroundGradient;
    ctx.fillText(secToString(globalTime, 0), ctr.x - straightLength/2.1, ctr.y + innerRadius - textSize);
}


function drawScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackround();
    drawTrack();

    drawInfo();
    drawRunners();
}


function manageAnimation() {
    drawScreen();

    timeInterval = parseInt(speedBar.value) / 60;
    speedView.innerHTML = speedBar.value;
    const progressTime = !timeBarBeingClicked && globalTime < maxGlobalTime && !userPause;

    if (!timeBarBeingClicked) {
        timeBar.value = globalTime;
    } else {
        globalTime = parseFloat(timeBar.value);
    }
    if (progressTime) {
        globalTime += timeInterval;
    }

    if (globalTime > maxGlobalTime) {
        console.log('requesting frames');
        return;
    }
    requestAnimationFrame(manageAnimation);

    // console.log("running");
}

let FILE_NAME = '/xctools/data/10ksplits.json'
FILE_NAME = '/xctools/data/IndoorBigSky24_3k.json'
// FILE_NAME = '/xctools/data/IndoorBigSky24_5k.json'
// FILE_NAME = '/xctools/data/IndoorBigSky24_mile.json'

function getDataFromJson() {
    fetch(FILE_NAME)
        .then(response => response.json())
        .then( (data) => {
            runnerData = data;
            raceEvent = runnerData.event;
            const runnerTimes = [];
            const newSplits = [];

            for (const runner of runnerData.splits) {
                let runnerTotalTime = 0;
                let numLaps = 0;
                for (const split of runner.splits) {
                    numLaps++;
                    if (split.seconds == null) {
                        break;
                    }
                    runnerTotalTime += split.seconds;
                }
                runnerTimes.push(runnerTotalTime);
                const newRunner = runner;
                newRunner.totalTime = runnerTotalTime;
                newRunner.numLaps = numLaps;
                newSplits.push(newRunner);
            }

            maxGlobalTime = Math.max(...runnerTimes) + 1;
            timeBar.max = maxGlobalTime;
            timeBar.style.width = `${canvas.width}px`;
            newSplits.sort((a, b) => a.totalTime - b.totalTime);
            newSplits.sort((a, b) => b.numLaps - a.numLaps);
            runnerData.splits = newSplits;
            console.log(runnerData);
        });
}
getDataFromJson();

setTimeout(() => requestAnimationFrame(manageAnimation), 500);
// setTimeout(() => drawRunnersExact(), 500);
