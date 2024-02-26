const WIDTH = 800;
const HEIGHT = 500;

let app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    background: '#222',
    antialias: true,
});

raceSimDiv = document.getElementById("race-sim-div");
raceSimDiv.prepend(app.view);


// canvas specific dimensions
const ctr = {x: WIDTH/2, y: HEIGHT/2}
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

const timeBar = document.getElementById("time-bar");
let timeBarBeingClicked = false;
function timeBarDown() {
    timeBarBeingClicked = true;
}
function timeBarUp() {
    timeBarBeingClicked = false;
}

timeBar.addEventListener("mousedown", timeBarDown);
timeBar.addEventListener("touchstart", timeBarDown);
timeBar.addEventListener("mouseup", timeBarUp);
timeBar.addEventListener("touchend", timeBarUp);

let userPause = true;
app.view.addEventListener("click", (event) => {
    userPause = !userPause;
})

let track = new PIXI.Graphics();

function drawTrack() {
    track.lineStyle(1, 0xFAFAFA, 1);
    for (let i=0; i <= numLanes; i++) {
        const radius = innerRadius + i * laneWidth;
        track.moveTo(ctr.x + straightLength / 2, ctr.y + radius);

        // right side
        track.arc(ctr.x + straightLength / 2, ctr.y, radius, Math.PI/2, -Math.PI/2, true);
        
        track.lineTo(ctr.x - straightLength / 2, ctr.y - radius);

        track.arc(ctr.x - straightLength / 2, ctr.y, radius, -Math.PI/2, Math.PI/2, true);

        track.lineTo(ctr.x + straightLength / 2, ctr.y + radius);
    }
    app.stage.addChild(track);
}

drawTrack();
