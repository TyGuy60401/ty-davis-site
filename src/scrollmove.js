var mountain;
var foreground;
var mountainStartPos = 20;
var foregroundStartPos = 20;
function init() {
    if (window.innerWidth < 1000) {
        var mountainId = "midmountain-mobile";
        var foregroundId = "foreground-mobile";
    } else {
        var mountainId = "midmountain-desktop";
        var foregroundId = "foreground-desktop";
    }
    mountain = document.getElementById(mountainId);
    foreground = document.getElementById(foregroundId);

    mountain.style.top = mountainStartPos + '%';
    foreground.style.top = foregroundStartPos + '%';
    console.log("Starting...");
}

function parallax() {
    var headerText = document.getElementById("overlay");

    var yPos = 0 - window.pageYOffset;
    var yPosMountain = yPos/30;
    var yPosFore = yPos/7.5;
    
    if (yPos > -80) {
        headerText.style.top = -yPos*7/8 + '%';
    }
    
    mountain.style.top = mountainStartPos - yPosMountain + '%';
    if (yPos > -270) {
        foreground.style.top = foregroundStartPos - yPosFore + '%';
    }
}

window.onload = function() {
    init();
}
window.addEventListener("scroll", function() {
    parallax();
})