function buildLog(dateString) {
    let logMain = document.querySelector('#log-main');
    logMain.innerHTML = "";
    $.getJSON("./logFiles/" + dateString + ".json", function (data) {
        logMain.setAttribute('style', 'align-items: start;');
        // Show the date:
        let dateElement = document.createElement('h4');
        dateElement.innerHTML = dateFromDateString(dateString).toDateString();
        logMain.appendChild(dateElement);

        for (let run in data) {
            let thisRun = data[run];
            
            // Let's get some info
            let titleData = thisRun['title'];
            let typeData = thisRun['type'];
            let totalTimeData = thisRun['total-time'];
            let raceTimeDate = thisRun['race-time'];
            let totalDistanceData = thisRun['total-distance'];
            let volumeData = thisRun['volume'];
            let avgPaceData = thisRun['avg-pace'];
            let descriptionData = thisRun['description'];
            let splitsData = thisRun['splits'];

            // Show the title:
            let title = document.createElement('h2');
            title.innerHTML = titleData;
            logMain.appendChild(title);

            // Show the stats
            let statsDiv = document.createElement('div');
            statsDiv.setAttribute('class', 'stats-div');
            logMain.appendChild(statsDiv);
            // Popluate the stats div
            statsDiv.appendChild(addStat("<b>Distance: </b>" + totalDistanceData.toString() + "mi"));
            statsDiv.appendChild(addStat("<b>Time: </b>" + totalTimeData));

            // Show the description:
            let description = document.createElement('p');
            description.innerHTML = descriptionData;
            logMain.appendChild(description);
        }
        // console.log(data);




    }).fail( function() {
        noLogMessage = document.createElement('h3');
        noLogMessage.innerHTML = "There is no training log file for this date.";
        logMain.appendChild(noLogMessage);
        console.log('error');
    });
}
function dateFromDateString(dateString) {
    let numStrings = dateString.split('-');
    let nums = [];
    for (i=0; i<numStrings.length; i++) {
        nums.push(parseInt(numStrings[i]));
    }
    let day = new Date(nums[0], nums[1]-1, nums[2])
    return day;
}
function addStat(statString) {
    let stat = document.createElement('div');
    stat.innerHTML = statString;
    return stat;
}