const canvas = document.getElementById("race-sim-canvas");
const ctx = canvas.getContext("2d");

const ctr = {x: canvas.width/2, y: canvas.height/2}

function drawBackround() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#36687d");
    gradient.addColorStop(1, "#48575E");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawTrack() {
    const pxToM = 4;
    const innerRadius = 36.5 * pxToM;
    const straightLength = 84.39 * pxToM;
    const laneWidth = 4 * pxToM;
    const numLanes = 5;

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
}

drawBackround();
drawTrack();

