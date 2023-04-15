function buildLog(dateString) {
    dateNums = dateString.split('-');
    selectedDay = new Date(dateNums[0], dateNums[1] - 1, dateNums[2]);
    selectedDay.setHours(0, 0, 0, 0);
    buildCalendar('calendar-main', selectedDay.toDateString());
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
            let elevationData = thisRun['elevation'];
            let resultsData = thisRun['results-link'];
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
            // Popluate the stats div with general stats
            statsDiv.append(addStat("<b>Distance: </b>", totalDistanceData, "mi"));
            statsDiv.append(addStat("<b>Time: </b>", totalTimeData));
            // Put the pace data in if there is no pace data:
            if (avgPaceData == null) {
                let totalTimeSeconds = secondsFromTimeString(totalTimeData);
                avgPaceData = timeStringFromSeconds(totalTimeSeconds / totalDistanceData);
            }
            statsDiv.append(addStat("<b>Pace: </b>", avgPaceData));
            statsDiv.append(addStat("<b>Elevation: </b>", elevationData, "ft"));

            // Show the link to the results
            if (resultsData != null) {
                let results = document.createElement('a');
                results.setAttribute('href', resultsData);
                results.innerHTML = "Results";
                logMain.appendChild(results);
            }

            // Show the description:
            let description = document.createElement('p');
            description.innerHTML = descriptionData;
            logMain.appendChild(description);
        }




    }).fail( function() {
        noLogMessage = document.createElement('h3');
        noLogMessage.innerHTML = "There is no training log file for this date.";
        logMain.appendChild(noLogMessage);
        console.log('File not found');
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
function addStat(leadString, statString, trailString="") {
    if (statString == null) {
        return "";
    }
    let stat = document.createElement('div');
    stat.innerHTML = leadString + statString + trailString;
    return stat;
}