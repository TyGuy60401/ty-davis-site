var mountain;
var foreground;
var mountainStartPos = 20;
var foregroundStartPos = 20;
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
    var yPosFore = yPos/6;
    
    mountain.style.top = mountainStartPos - yPosMountain + '%';
    if (yPos > -180) {
        foreground.style.top = foregroundStartPos - yPosFore + '%';
    }
}

window.onload = function() {
    init();
}
window.addEventListener("scroll", function() {
    parallax();
})