var mountain;
var foreground;
var mountainStartPos = 20;
var foregroundStartPos = 200;
function init() {
    mountain = document.getElementById("midmountain");
    foreground = document.getElementById("foreground");

    mountain.style.top = mountainStartPos + '%';
    foreground.style.top = foregroundStartPos + '%';
    console.log("Starting...");
}

function parallax() {

    var yPos = 0 - window.pageYOffset;
    var yPosMountain = yPos/30;
    var yPosFore = yPos/4;
    
    mountain.style.top = mountainStartPos - yPosMountain + '%';
    console.log(yPos);
    if (yPos > -180) {
        foreground.style.top = foregroundStartPos - yPosFore + '%';
    } else {
        console.log("Stop moving");
    }
}
window.onload = function() {
    init();
}
window.addEventListener("scroll", function() {
    parallax();
})