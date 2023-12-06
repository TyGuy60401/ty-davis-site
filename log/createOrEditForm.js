function fillCreateForm() {
    let dateField = document.getElementById("date");
    let today = new Date();
    dateField.valueAsDate = today;
}

function submitForm() {
    let form = document.getElementById("create-run");
    form.addEventListener('submit', handleForm);
    console.log("Submitting form");
}

function handleForm(event) {
    let form = document.forms["create-run"];
    let doSubmitForm = true;

    let fieldNames = {
        'date': 'Date',
        'title': 'Title',
        'total_distance': 'Total Distance',
        'total_time': 'Total Time',
        'results_link': 'Results Link',
    }
    let otherFieldNames = {
        'elevation': 'Elevation',
        'run_type': 'Run Type',
        'description': 'Description',
        'workout_type': 'Workout Type',
        'volume_distance': 'Volume Distance',
        'volume_units': 'Volume Units',
        'volume_time': 'Volume Time',
    }

    function notEmpty(id_string) {
        let except = ['results_link'];
        if (except.includes(id_string)) { return; }
        if (!form[id_string].value) {
            console.log(`${id_string} is null`);
            let badField = document.getElementById(`bad-${id_string}`);
            badField.innerHTML = `${fieldNames[id_string]} cannot be empty.`
            doSubmitForm = false;
        }
    }
    Object.keys(fieldNames).forEach(key => {
        let tempBadField = document.getElementById(`bad-${key}`);
        tempBadField.innerHTML = "";
    });
    Object.keys(fieldNames).forEach(key => {
        notEmpty(key)
    });

    let totalTimeField = form["total_time"];
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
            let badTimeField = document.getElementById("bad-total_time");
            badTimeField.innerHTML = timeMessage;
        }
    }

    let volumeTimeField = form["volume_time"];
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
            let badVolumeTimeField = document.getElementById("bad-volume_time");
            badVolumeTimeField.innerHTML = volumeTimeMessage;
        }
    }

    if (form["results_link"].value) {
        if (!checkIfUrl(form["results_link"].value)) {
            console.log("Bad URL");
            doSubmitForm = false;
            let urlField = document.getElementById("bad-results_link");
            urlField.innerHTML = "Invalid URL";
        }
    }
    if (form["results_link"].value && !checkIfUrl(form["results_link"].value)) {
        console.log("Bad URL");
        doSubmitForm = false;
        let urlField = document.getElementById("bad-results_link");
        urlField.innerHTML = "Invalid URL";
    }
    if (doSubmitForm) {
        let runObject = {};
        Object.keys(fieldNames).forEach(key => {
            runObject[key] = form[key].value;
        })
        Object.keys(otherFieldNames).forEach(key => {
            if (form[key]) {
                console.log(form[key]);
                runObject[key] = form[key].value;
            }
        })
        console.log(runObject);
        fetch(backendURL + 'training/runs/', {
            method: 'POST',
            headers: makeHeader(localStorage.getItem('authToken')),
            body: JSON.stringify(runObject),
        })
            .then(response => response.json())
            .then(data => console.log(data));
    } else {
        event.preventDefault();
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