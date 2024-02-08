// let distInput = document.getElementById("distance");

// distInput.addEventListener('input', function (evt) {
//         console.log(this.value);
// })

function validateInput() {
        let distField = document.getElementById('distance');
        let dist = distField.value;
        let timeField = document.getElementById('time');
        let time = timeField.value;
        let paceField = document.getElementById('pace');
        let pace = paceField.value;
        let unitField = document.getElementById('unit');
        let unit = unitField.value;

        let errorArea = document.getElementById('error-area');

        // Count if two of them are empty
        let countEmpty = 0;
        [dist, time, pace].forEach( (val) => {
                countEmpty = countEmpty + (val == '');
        })
        if (countEmpty > 1) {
                errorArea.style.visibility = 'visible';
                errorArea.innerHTML = "Enter at least 2 of the three fields";
                return "Not enough fields specified";
        }

        if (countEmpty == 0) {
                let testPace = paceFromTimeDist(time, dist, unit);
                if (testPace != pace) {
                        errorArea.style.visibility = 'visible';
                        errorArea.innerHTML = "Those values don't line up, clear out at least one of the above fields."
                        return "Mismatched values";
                }
                return "success";
                

        }
        
        // Assuming that the two that are filled are dist/time
        let badTimeString = isNaN(stringToSec(time));
        let badPaceString = isNaN(stringToSec(pace));
        if (pace == '') {
                if (badTimeString) {
                        errorArea.style.visibility = 'visible';
                        errorArea.innerHTML = "Make sure the time string fits the specified format.";
                        return "Couldn't be converted, try again.";
                }
                paceField.value = paceFromTimeDist(time, dist, unit);
                return "success";
        } else if (time == '') { // Assuming that dist/pace are filled
                if (badPaceString) {
                        errorArea.style.visibility = 'visible';
                        errorArea.innerHTML = "Make sure the pace string fits the specified format.";
                        return "Couldn't be converted, try again.";
                }
                timeField.value = timeFromPaceDist(pace, dist, unit);
                return "success";
        } else if (dist == '') {
                if (badPaceString || badTimeString) {
                        errorArea.style.visibility = 'visible';
                        errorArea.innerHTML = "Make sure the pace and time strings fit the specified format."
                        return "Couldn't be converted, try again.";
                }

                let distMeters = distFromTimePace(time, pace);
                if (unit == 'm') {
                        distField.value = distMeters.toFixed(1);
                } else if (unit == 'km') {
                        distField.value = (distMeters / 1000).toFixed(1);
                } else if (unit == 'mi') {
                        distField.value = (distMeters * METER_CONVERSION).toFixed(1);
                }
                if (distField.value.includes('.')) {
                        let decimal = distField.value.split('.')[1];
                        if (["0", "00"].includes(decimal)) {
                                console.log("The decimal is just zero.");
                        } else {
                                console.log("The decimal is not zero.");
                        }
                        distField.value = distField.value.split('.')[0];
                }
                return "success";
        }
}

function calculate() {
        let inputCode = validateInput();
        if (inputCode != "success") {
                console.log(inputCode);
                return;
        }
        let errorArea = document.getElementById('error-area');
        errorArea.innerHTML = '';
        let time = document.getElementById('time').value;
        let dist = document.getElementById('distance').value;
        let unit = document.getElementById('unit').value;

        let errorArea2 = document.getElementById('error-area-2');
        errorArea2.innerHTML = '';
        let splitDist = document.getElementById('splitDist').value;
        let splitUnit = document.getElementById('splitUnit').value;

        let splits = getSplits(time, dist, unit, {'dist': splitDist, 'unit': splitUnit});

        let splitsTableDiv = document.getElementById('splitsTableDiv');
        splitsTableDiv.innerHTML = "";
        splitsTableDiv.style.display = "block";

        if (splitDist == '' || splitDist == '0') {
                console.log("No bad")
                errorArea2.style.visibility = 'visible';
                errorArea2.innerHTML = "Interval Distance can not be 0 or empty.";
                splitsTableDiv.innerHTML = "";
                splitsTableDiv.style.display = "none";
                return
        }

        let splitsTable = document.createElement('table');
        splitsTableDiv.appendChild(splitsTable);

        // let splitsTable = document.getElementById('splitsTable');
        let headerRow = splitsTable.insertRow();
        let splitHead = headerRow.insertCell();
        splitHead.innerHTML = 'Split';
        splitHead.colSpan = 3;
        splitHead.className = 'table-header'
        let timeHead = headerRow.insertCell();
        timeHead.innerHTML = 'Time';
        timeHead.className = 'table-header'

        let i = 1;
        splits.forEach( (spl) => {
                let newRow = splitsTable.insertRow();

                let numCell = newRow.insertCell();
                numCell.className = 'num-cell';
                numCell.innerHTML = i;
                i++;
                let distCell = newRow.insertCell();
                distCell.innerHTML = spl.dist;
                distCell.className = 'dist-cell';
                let unitCell = newRow.insertCell();
                unitCell.innerHTML = spl.unit;
                unitCell.className = 'unit-cell';
                let timeCell = newRow.insertCell();
                timeCell.innerHTML = secToString(spl.time);

                // console.log(secToString(spl.time), spl.dist, spl.unit);
        })
}
