function buildLog(filename) {
    let logMain = document.querySelector('#log-main');
    $.getJSON("./logFiles/" + filename + ".json");
    console.log(filename);
}