function parallax() {
    var mountain = document.getElementById("midmountain");
    var foreground = document.getElementById("foreground");

    var yPos = 0 - window.pageYOffset;
    var yPosMountain = yPos/30;
    var yPosFore = yPos/4;
    
    mountain.style.top = 20 - yPosMountain + '%';
    foreground.style.top = 20 - yPosFore + '%';
}
window.addEventListener("scroll", function() {
    parallax();
})