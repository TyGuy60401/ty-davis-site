function buildHeader(subtitleText) {
    fetch('/src/header.html')
      .then(response => response.text())
      .then(html => {
        const container = document.querySelector('#header');
        container.innerHTML = html;

        let userInfo = document.getElementById("user-info");
        
        let noUser = '<a href=/accounts/login.html>Log In</a>'
        userInfo.innerHTML = noUser;
        let token = localStorage.getItem('authToken');
        if (token) {
            fetch(`${backendURL}account/test_token`, {
                method: "GET",
                headers: {
                  'Content-type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Token ${token}`
                }
            }).then(response => response.json())
            .then(data => {
              if (data['detail'] == 'Invalid token.') {
                localStorage.removeItem('authToken');
                userInfo.innerHTML = noUser;
              } else {
                userInfo.innerHTML = '<b><a href="/accounts/profile.html" style="text-decoration: none;">' + data['username'] + '</a></b>';
              }
            });
        }
        let subtitle = document.querySelector('#subtitle');
        subtitle.innerHTML = '- ' + subtitleText;
      });
}