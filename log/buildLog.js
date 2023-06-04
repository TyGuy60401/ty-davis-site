function buildLog(dateString) {
    dateNums = dateString.split('-');
    selectedDay = new Date(dateNums[0], dateNums[1] - 1, dateNums[2]);
    selectedDay.setHours(0, 0, 0, 0);
    buildCalendar('calendar-main', selectedDay.toDateString());
    let logMain = document.querySelector('#log-main');
    logMain.innerHTML = "";
    let fullString = dateString.substr(0, 7) + "/" + dateString;
    $.getJSON("./logFiles/" + fullString + ".json", function (data) {

        for (let run in data) {
            let thisRun = data[run];
            
            // Let's get some info
            let titleData = thisRun['title'];
            let typeData = thisRun['type'];
            let totalTimeData = thisRun['total-time'];
            let totalDistanceData = thisRun['total-distance'];
            let volumeDistanceData = thisRun['volume-distance'];
            let volumeTimeData = thisRun['volume-time'];
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
            let generalStatsDiv = document.createElement('div');
            statsDiv.className = 'stats-div';
            generalStatsDiv.className = 'general-stats';
            logMain.appendChild(statsDiv);
            statsDiv.appendChild(generalStatsDiv);
            // Popluate the stats div with general stats
            generalStatsDiv.append(addStat("Distance: ", totalDistanceData, "mi"));
            generalStatsDiv.append(addStat("Time: ", totalTimeData));

            // Put the pace data in if there is no pace data:
            if (avgPaceData == null) {
                let totalTimeSeconds = secondsFromTimeString(totalTimeData);
                avgPaceData = timeStringFromSeconds(totalTimeSeconds / totalDistanceData, 0);
            }
            generalStatsDiv.append(addStat("Pace: ", avgPaceData));
            generalStatsDiv.append(addStat("Elevation: ", elevationData, "ft"));
            if (typeData == "race") {
                let raceDiv = document.createElement('div');
                raceDiv.className = 'race-div';
                raceDiv.innerHTML = "<h3>Race:</h3>";
                statsDiv.appendChild(raceDiv);
                raceDiv.append(addStat("Distance: ", volumeDistanceData));
                raceDiv.append(addStat("Time: ", volumeTimeData));
            }

            // Show the link to the results
            if (resultsData != null) {
                let results = document.createElement('a');
                results.href = resultsData;
                results.target = '_blank';
                results.rel = 'noopener noreferrer';
                results.innerHTML = "Results";
                logMain.appendChild(results);
            }

            // Show the description:
            let description = document.createElement('p');
            description.innerHTML = descriptionData;
            logMain.appendChild(description);

            // Show the splits:
            if (splitsData != null) {
                let splitsDiv = document.createElement('div');
                let splitsTable = document.createElement('table');
                let splitsTitle = document.createElement('h3');

                splitsTitle.innerHTML = "Splits:";
                splitsDiv.appendChild(splitsTitle);

                splitsDiv.className = 'splits-div';
                splitsTable.className = 'splits-table';
                logMain.appendChild(splitsDiv);
                splitsDiv.appendChild(splitsTable);
                $.each(splitsData, function(key, val) {
                    // Split the key string up
                    let num = key.split('-')[0];
                    let dist = key.split('-')[1];

                    let row = splitsTable.insertRow();
                    if (num == 'set') {
                        let setBreakCell = row.insertCell();
                        setBreakCell.className = 'dist';
                        setBreakCell.innerHTML = "Set Break";
                        setBreakCell.colSpan = 3;
                        setBreakCell.style = "text-align: center;"
                        return;
                    }
                    let splitNum = row.insertCell();
                    let splitDist = row.insertCell();
                    let splitTime = row.insertCell();

                    splitNum.className = 'num';
                    splitDist.className = 'dist';
                    splitTime.className = 'time';

                    splitNum.innerHTML = num;
                    splitDist.innerHTML = dist;

                    if (typeof(val) == "number") {
                        splitTime.innerHTML = val.toFixed(2);
                        splitTime.innerHTML = timeStringFromSeconds(val, 1);
                    } else {
                        splitTime.innerHTML = val;
                    }
                });
            }
        }
    }).fail( function() {
        noLogMessage = document.createElement('h3');
        noLogMessage.innerHTML = "There is no training log file for this date.";
        logMain.appendChild(noLogMessage);
        console.log('File not found');

    }).complete( function() {
        logMain.setAttribute('style', 'align-items: start;');
        // Show the nav div:
        let navDiv = document.createElement('div');
        navDiv.className = 'nav-div';
        let dateElement = document.createElement('h4');
        dateElement.style = 'width:8em; text-align:center;';
        dateElement.innerHTML = dateFromDateString(dateString).toDateString();

        let yearString = selectedDay.getFullYear().toString();
        let monthString = (selectedDay.getMonth() + 1).toString().padStart(2, '0');
        let dayString;
        let prevButton = document.createElement('input');
        prevButton.type = "button";
        prevButton.defaultValue = "<<";
        prevButton.onclick = function () {
            dayString = (selectedDay.getDate() - 1).toString().padStart(2, '0');
            buildLog(yearString + '-' + monthString + '-' + dayString);
        }
        let nextButton = document.createElement('input');
        nextButton.type = "button";
        nextButton.defaultValue = ">>";
        nextButton.onclick = function () {
            dayString = (selectedDay.getDate() + 1).toString().padStart(2, '0');
            buildLog(yearString + '-' + monthString + '-' + dayString);
        }

        navDiv.appendChild(prevButton);
        navDiv.append(dateElement);
        navDiv.appendChild(nextButton);
        logMain.appendChild(navDiv);

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
    stat.innerHTML = '<b>' + leadString + '</b>' + statString + trailString;
    return stat;
}