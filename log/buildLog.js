function buildLog(filename) {
    let logMain = document.querySelector('#log-main');
    logMain.innerHTML = "";
    $.getJSON("./logFiles/" + filename + ".json", function (data) {
        console.log(data);
        let title = data['title'];
        let description = data['description'];
        let distance = data['distance'];
        let time = data['time'];
        let pace = data['pace'];
        let type = data['type'];

    }).fail( function() {
        noLogMessage = document.createElement('h3');
        noLogMessage.innerHTML = "There is no training log file for this date.";
        logMain.appendChild(noLogMessage);
        console.log('error');
    });
}