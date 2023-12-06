// var backendURL = 'http://localhost:8000/'
var backendURL =  'http://192.168.1.195:8000/'


function makeHeader(token=null, contentType='application/json', accept='application/json') {
    let headers = {
        'Content-type': contentType,
        'Accept': accept,
    }
    if (token) {
        headers.Authorization = `Token ${token}`;
    }
    return headers;
}

function logIn() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var errorField = document.getElementById("error-field");

    errorField.innerHTML = "";

    var options = {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
        })
    }
    fetch(`${backendURL}account/login`, options)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data["detail"] == "Not found.") {
                errorField.style.visibility = "visible";
                errorField.innerHTML = "Username and Password combo are not found."
            } else {
                console.log(data["token"]);
                localStorage.setItem('authToken', data['token']);
                window.location.replace('/');
            }
        })
        .catch( err => {
            console.log(err)
        })
}

function createAccount() {
    if (checkUsernameAndPassword()) {
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var email = document.getElementById("email").value;
        var options = {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                "username": username,
                "email": email,
                "password": password,
            })
        }
        console.log(options);
        fetch(backendURL + 'account/signup', options)
            .then(response => response.json())
            .then(data => console.log(data));
    }
}

function logOut() {
    localStorage.clear();
    sessionStorage.clear();
    location.reload();
    return;
}

function checkUsernameAndPassword() {
    var username = document.getElementById("username");
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirm-password");
    
    var errorField = document.getElementById("error-field");
    errorField.innerHTML = ""

    if (username.value == "") {
        errorField.style.visibility = "visible";
        errorField.innerHTML += "You must include a username.";
        return false
    }

    if (password.value != confirmPassword.value) {
        errorField.style.visibility = "visible";
        errorField.innerHTML += "The passwords do not match.";
        return false
    }
    if (password.value.length < 8) {
        errorField.style.visibility = "visible";
        errorField.innerHTML += "Your password must be at least 8 characters long.";
        return false
    }

    return true
}