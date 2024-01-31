function fillCreateOrEditForm() {
    const dateField = document.getElementById("date");
    const today = new Date();
    dateField.valueAsDate = today;
    const form = document.forms["create-run"];


    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);
    let run = null;
    let splits = null;
    if (URLParams.get('id')) {
        fetch(`${backendURL}training/runs/?id=${URLParams.get('id')}`, {
            method: 'GET',
            headers: makeHeader(localStorage.getItem('authToken')),
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(response);
        })
        .then(data => {
            document.getElementById('create-edit-title').innerHTML = "Edit Run";
            run = data.run;
            splits = data.splits;
            run.total_time = timeStringFromSeconds(run.total_time, 0);
            if (run.volume_time) {
                run.volume_time = timeStringFromSeconds(run.volume_time, 0);
            }
            Object.keys(run).forEach( key => {
                if (form[key]) {
                    console.log(form[key]);
                    form[key].value = data.run[key];
                    // console.log(key, data['run'][key]);
                }
            })
            const deleteButton = document.getElementById('delete-button');
            deleteButton.style.visibility = 'visible';
            const discardChangesButton = document.getElementById('discard-changes-button');
            discardChangesButton.style.visibility = 'visible';
        }).catch(error => {
            console.log(error);
        }).finally( () => {
            buildSplitsTable(splits);
        });
    } else {
        buildSplitsTable([]);
    }
}

function buildSplitsTable(splits) {
    console.log(splits);
    const splitsTable = document.createElement('table');
    splitsTable.id = 'ce-splits-table';
    splitsTable.className = 'ce-splits-table';
    // splitsTable.contentEditable = true;
    // make the units list
    const unitsList = document.createElement('datalist');
    unitsList.id = 'units-list';
    const units = ['m', 'km', 'mi'];
    for (let i = 0; i < units.length; i++) {
        const unitOption = document.createElement('option');
        unitOption.value = units[i];
        unitsList.appendChild(unitOption);
    }
    // build the splits table
    // console.log(splits);
    if (splits) {
        splits.sort((a, b) => (a.id - b.id))
        let i = 0;
        let offset = 0;
        Object.values(splits).forEach(val => {
            i++;
            const row = document.createElement('tr');
            const smallCol = document.createElement('td');
            smallCol.className = 'splits-delete-button';
            const xButton = document.createElement('input');
            xButton.type = 'button';
            const removeItem = i;
            function removeRow(row) {
                const newSplits = buildSplitsFromTable();
                newSplits.splice(removeItem - 1, 1);
                buildSplitsTable(newSplits);
            }
            xButton.onclick = removeRow;
            xButton.defaultValue = 'x';
            smallCol.appendChild(xButton)
            // smallCol.innerHTML = '<input type=button>&times;</input>'
            row.appendChild(smallCol);
            if (val.units === 'set') {
                const bigCol = document.createElement('td');
                bigCol.colSpan = 4;
                bigCol.className = 'set-break';
                bigCol.innerHTML = 'Set Break';
                row.appendChild(bigCol);
                offset++;
            } else {
                if (i % 2 === 0) {
                    row.className = 'splits-even';
                }
                const numberCol = document.createElement('td');
                const specifierCol = document.createElement('td');
                const unitsCol = document.getElementById('volume_units').cloneNode(true);
                unitsCol.id = `${volume_units.id}-${i.toString().padStart(2, '0')}`
                // let unitsCol = document.createElement('input');
                const valueCol = document.createElement('td');

                numberCol.innerHTML = i - offset;
                specifierCol.innerHTML = val.specifier;
                specifierCol.className = 'splits-specifier';
                specifierCol.id = `splits-specifier-${i.toString().padStart(2, '0')}`;
                specifierCol.contentEditable = true;
                unitsCol.value = val.units;
                unitsCol.setAttribute('list', 'volume_units');
                // unitsCol.list = 'units-list';
                unitsCol.className = 'splits-units';
                valueCol.innerHTML = timeStringFromSeconds(val.value, 1);
                valueCol.className = 'splits-value';
                valueCol.id = `splits-value-${i.toString().padStart(2, '0')}`;
                valueCol.contentEditable = true;

                row.appendChild(numberCol);
                row.appendChild(specifierCol);
                row.appendChild(unitsCol);
                row.appendChild(valueCol);
            }
            const checkBoxCol = document.createElement('td');
            const checkBox = document.createElement('input');
            checkBox.type = "checkbox";
            checkBox.checked = val.units === 'set';
            checkBoxCol.appendChild(checkBox);
            row.appendChild(checkBoxCol);

            splitsTable.appendChild(row);
            // console.log(val.specifier);
        })
        // Create default row
        const lastRow = document.createElement('tr');
        const lastCol = document.createElement('td');
        const xButton = document.createElement('input');
        xButton.type = 'button';
        const clickedString = 'Clicked the + button'
        function addRow() {
            if (!checkSplitsTable()) {
                return
            }
            const newSplits = buildSplitsFromTable();
            let newSplit;
            if (newSplits.length > 0) {
                newSplit = newSplits.at(-1);
            } else {
                newSplit = {
                    id: 100,
                    workoutID: 100,
                    specifier: 1000,
                    units: 'm',
                    value: 180,
                }
            }
            console.log(newSplit);
            newSplits.push(newSplit);
            console.log(newSplits);
            buildSplitsTable(newSplits);
        }
        xButton.onclick = addRow;
        xButton.defaultValue = '+';
        const lastColDesc = document.createElement('td')
        lastColDesc.innerHTML = 'Add new row';
        lastColDesc.colSpan = 3;
        lastCol.appendChild(xButton)

        lastRow.appendChild(lastCol);
        lastRow.appendChild(lastColDesc);
        splitsTable.appendChild(lastRow);
        const newSplits = splits;
        
    }
    const content = document.createElement('p');
    document.getElementById('splits-table-wrapper').innerHTML = '';
    document.getElementById('splits-table-wrapper').appendChild(splitsTable);
    content.innerHTML = 'hi there <b>bold</b> again'
    // return content.toString();
    return splitsTable.toString();
}
function checkSplitsTable() {
    let allGood = true;
    const newSplits = buildSplitsFromTable();
    if (newSplits.length === 0) {
        return true;
    }
    newSplits.forEach(split => {
        console.log(split);
        if (!Number.isFinite(split.specifier)) {
            console.log("Is NaN")
            allGood = false;
        }
    })
    if (allGood) {
        return true;
    }
    return false;
}

function discardChanges(date) {
    const URLParams = new URLSearchParams(window.location.search);
    id = URLParams.get('id');
    fetch(`${backendURL}training/runs/?id=${id}`,{
        method: 'GET',
        headers: makeHeader(localStorage.getItem('authToken')),
    }).then( response => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    })
        .then(data => {
            window.location.replace(`./training.html?date=${data.run.date}`)
        }).catch( error => {
            console.log(error);
            // window.location.replace(`./training.html`);
        })
}

function buildSplitsFromTable() {
    const splitsTable = document.getElementById('ce-splits-table');
    if (!splitsTable) {
        return [];
    }
    const newSplits = [];
    for (let i = 1; i < splitsTable.childNodes.length; i++) {
        const newSplit = {};
        newSplit.id = null;
        const valueCell = document.getElementById(`splits-value-${i.toString().padStart(2, '0')}`);
        if (valueCell) {
            newSplit.value = secondsFromTimeString(valueCell.innerHTML);
            const specifierCell = document.getElementById(`splits-specifier-${i.toString().padStart(2, '0')}`);
            newSplit.specifier = parseFloat(specifierCell.innerHTML);

            const unitsCell = document.getElementById(`volume_units-${i.toString().padStart(2, '0')}`);
            newSplit.units = unitsCell.value;

        } else {
            newSplit.value = 0;
            newSplit.specifier = 800;
            newSplit.units = 'set';
        }
        newSplits.push(newSplit);
    }
    console.log(newSplits);

    return newSplits;
}

function deleteRun() {
    const URLParams = new URLSearchParams(window.location.search);
    id = URLParams.get('id');
    fetch(`${backendURL}training/runs/`, {
        method: 'DELETE',
        headers: makeHeader(localStorage.getItem('authToken')),
        body: JSON.stringify({id: id})
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    }).then( data => {
        console.log(data);
        sessionStorage.clear();
        window.location.replace(`./training.html?date=${data.date}`)
        // It has been deleted
    }).catch( error => {
        console.log(error);
        // It wasn't deleted
    })
}

function submitForm() {
    const form = document.getElementById("create-run");
    form.addEventListener('submit', handleForm);
    console.log("Submitting form");
}

function handleForm(event) {
    const form = document.forms["create-run"];
    let doSubmitForm = true;

    const fieldNames = {
        date: 'Date',
        title: 'Title',
        total_distance: 'Total Distance',
        total_time: 'Total Time',
        results_link: 'Results Link',
    }
    const otherFieldNames = {
        elevation: 'Elevation',
        run_type: 'Run Type',
        description: 'Description',
        workout_type: 'Workout Type',
        volume_specifier: 'Volume Specifier',
        volume_units: 'Volume Units',
        volume_time: 'Volume Time',
    }

    function notEmpty(id_string) {
        const except = ['results_link'];
        if (except.includes(id_string)) { return; }
        if (!form[id_string].value) {
            console.log(`${id_string} is null`);
            const badField = document.getElementById(`bad-${id_string}`);
            badField.innerHTML = `${fieldNames[id_string]} cannot be empty.`
            doSubmitForm = false;
        }
    }
    Object.keys(fieldNames).forEach(key => {
        const tempBadField = document.getElementById(`bad-${key}`);
        tempBadField.innerHTML = "";
    });
    Object.keys(fieldNames).forEach(key => {
        notEmpty(key)
    });

    const totalTimeField = form.total_time;
    if (totalTimeField.value) {
        let timeMessage = null;
        for (let i = 0; i < totalTimeField.value.length; i++) {
            if (!("0123456789.:".includes(totalTimeField.value[i]))) {
                console.log("Invalid input in Time field")
                timeMessage = "Invalid format";
                break;
            }
        }
        if (!totalTimeField.value.includes(":")) {
            timeMessage = "Invalid format";
        }
        if (timeMessage) {
            doSubmitForm = false;
            const badTimeField = document.getElementById("bad-total_time");
            badTimeField.innerHTML = timeMessage;
        }
    }

    const volumeTimeField = form.volume_time;
    if (volumeTimeField.value) {
        let volumeTimeMessage = null;
        for (let i = 0; i < volumeTimeField.value.length; i++) {
            if (!("0123456789.:".includes(volumeTimeField.value[i]))) {
                console.log("Invalid input in Volume Time field")
                volumeTimeMessage = "Invalid format";
                break;
            }
        }
        if (volumeTimeField.value) {
            if (!volumeTimeField.value.includes(":")) {
                timeMessage = "Invalid format";
            }
        }
        if (volumeTimeMessage) {
            doSubmitForm = false;
            const badVolumeTimeField = document.getElementById("bad-volume_time");
            badVolumeTimeField.innerHTML = volumeTimeMessage;
        }
    }

    if (form.results_link.value) {
        if (!checkIfUrl(form.results_link.value)) {
            console.log("Bad URL");
            doSubmitForm = false;
            const urlField = document.getElementById("bad-results_link");
            urlField.innerHTML = "Invalid URL";
        }
    }
    if (form.results_link.value && !checkIfUrl(form.results_link.value)) {
        console.log("Bad URL");
        doSubmitForm = false;
        const urlField = document.getElementById("bad-results_link");
        urlField.innerHTML = "Invalid URL";
    }

    // handling the splitsTable object
    doSubmitForm = false;
    event.preventDefault();
    const splitsTable = document.getElementById("ce-splits-table");
    
    const splitsSubmission = [];
    let numSetBreaks = 0;
    for (i=0; i<splitsTable.rows.length; i++) {
        const arrayTD = splitsTable.rows[i].getElementsByTagName("td");
        const splitIndex = i + 1
        if (arrayTD[1].innerHTML === 'Add new row') {
            break;
        }
        if (arrayTD[1].innerHTML === 'Set Break') {
            // It's a set break!
            numSetBreaks ++;
            splitsSubmission.push({
                specifier: 0,
                units: "set",
                value: 0,
                splitIndex: splitIndex,
            })
            continue;
        }
        splitsSubmission.push({
            specifier: arrayTD[2].innerHTML,
            units: splitsTable.rows[i].getElementsByTagName("select")[0].value,
            value: secondsFromTimeString(arrayTD[3].innerHTML),
            splitIndex: splitIndex,
        })
        
    }
    console.log(splitsSubmission);


    if (!doSubmitForm) {
        event.preventDefault();
    } else {
        const URLParams = new URLSearchParams(window.location.search);
        const runObject = {};
        Object.keys(fieldNames).forEach(key => {
            runObject[key] = form[key].value;
            form[key].disabled = true;
        })
        Object.keys(otherFieldNames).forEach(key => {
            if (form[key]) {
                // console.log(form[key]);
                console.log(form[key].value);
                runObject[key] = form[key].value;
                form[key].disabled = true;
            }
        })
        console.log(runObject);
        event.preventDefault();
        const noticeText = document.getElementById('notice-text');
        // posting a new run
        if (!URLParams.get('id')) {
            fetch(`${backendURL}training/runs/`, {
                method: 'POST',
                headers: makeHeader(localStorage.getItem('authToken')),
                body: JSON.stringify(runObject),
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            })
            .then(data => {
                console.log(data);
                if (data.detail === "Run Saved") {
                    noticeText.innerHTML = "Run successfully saved.";
                    sessionStorage.clear();
                    // window.location.replace(`./createoreditrun.html/?id=${data['id']}`);
                    // window.location.replace(`./createoreditrun.html?id=${data['id']}`);
                    window.location.assign(`./training.html?date=${runObject.date}`)
                }
            }).catch( error => {
                console.log("error:")
                console.log(error);
                Object.keys(fieldNames).forEach(key => {
                    form[key].disabled = false;
                })
                Object.keys(otherFieldNames).forEach(key => {
                    if (form[key]) {
                        form[key].disabled = false;
                    }
                })
                noticeText.innerHTML = "Run couldn't be saved at this time."
                if (error.type === 'cors') {
                    noticeText.innerHTML += "<br>Are you logged in?"
                }
            });

        // editing a current run
        } else {
            runObject.id = URLParams.get('id');
            fetch(`${backendURL}training/runs/`, {
                method: 'PUT',
                headers: makeHeader(localStorage.getItem('authToken')),
                body: JSON.stringify(runObject),
            })
            .then( response => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(response);
            }).then( data => {
                console.log("data");
                sessionStorage.clear();
                window.location.assign(`./training.html?date=${runObject.date}`);
            }).catch( error => {

                console.log("error:")
                console.log(error);
                Object.keys(fieldNames).forEach(key => {
                    form[key].disabled = false;
                })
                Object.keys(otherFieldNames).forEach(key => {
                    if (form[key]) {
                        form[key].disabled = false;
                    }
                })
                noticeText.innerHTML = "Run couldn't be saved at this time."
                if (error.type === 'cors') {
                    noticeText.innerHTML += "<br>Are you logged in?"
                }

            });
        }
    }
}

function checkIfUrl(urlString) {
    let url;

    try {
        url = new URL(urlString);
    } catch (_) {
        return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
}
