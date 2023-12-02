
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
        fetch('http://localhost:8000/account/signup', options)
            .then(response => response.json())
            .then(data => console.log(data));
    }
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