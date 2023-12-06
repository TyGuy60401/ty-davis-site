function fillCreateOrEditForm() {
    let dateField = document.getElementById("date");
    let today = new Date();
    dateField.valueAsDate = today;
    let form = document.forms["create-run"];

    const queryString = window.location.search;
    const URLParams = new URLSearchParams(queryString);
    if (URLParams.get('id')) {
        console.log("We're editing today")
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
            let run = data['run'];
            run['total_time'] = timeStringFromSeconds(run['total_time'], 0);
            if (run['volume_time']) {
                run['volume_time'] = timeStringFromSeconds(run['volume_time'], 0);
            }
            Object.keys(run).forEach( key => {
                if (form[key]) {
                    form[key].value = data['run'][key];
                    console.log(key, data['run'][key]);
                }
            })
            deleteButton = document.getElementById('delete-button');
            deleteButton.style.visibility = 'visible';
        }).catch(error => {
            console.log(error);
        });
    }
}

function deleteRun() {
    const URLParams = new URLSearchParams(window.location.search);
    id = URLParams.get('id');
    fetch(`${backendURL}training/runs/`, {
        method: 'DELETE',
        headers: makeHeader(localStorage.getItem('authToken')),
        body: JSON.stringify({'id': id})
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    }).then( data => {
        console.log(data);
        sessionStorage.clear();
        window.location.replace(`./training.html?date=${data['date']}`)
        // It has been deleted
    }).catch( error => {
        console.log(error);
        // It wasn't deleted
    })
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
    if (!doSubmitForm) {
        event.preventDefault();
    } else {
        const URLParams = new URLSearchParams(window.location.search);
        let runObject = {};
        Object.keys(fieldNames).forEach(key => {
            runObject[key] = form[key].value;
            form[key].disabled = true;
        })
        Object.keys(otherFieldNames).forEach(key => {
            if (form[key]) {
                console.log(form[key]);
                runObject[key] = form[key].value;
                form[key].disabled = true;
            }
        })
        console.log(runObject);
        event.preventDefault();
        let noticeText = document.getElementById('notice-text');
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
                if (data['detail'] == "Run Saved") {
                    noticeText.innerHTML = "Run successfully saved.";
                    sessionStorage.clear();
                    // window.location.replace(`./createoreditrun.html/?id=${data['id']}`);
                    // window.location.replace(`./createoreditrun.html?id=${data['id']}`);
                    window.location.assign(`./training.html?date=${runObject['date']}`)
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
                if (error.type == 'cors') {
                    noticeText.innerHTML += "<br>Are you logged in?"
                }
            });

        } else {
            runObject['id'] = URLParams.get('id');
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
                window.location.assign(`./training.html?date=${runObject['date']}`);
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
                if (error.type == 'cors') {
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