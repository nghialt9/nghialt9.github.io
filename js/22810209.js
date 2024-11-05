const API = 'https://web1-api.vercel.app';

async function loadData(request, templateId, viewId) {
    const response = await fetch(`${API}/api/${request}`);
    const data = await response.json();
    var source = document.getElementById(templateId).innerHTML;
    var template = Handlebars.compile(source);
    var context = { data: data};
    var view = document.getElementById(viewId);
    view.innerHTML = template(context);
}

async function getAuthenticate(username, password) {
    const response = await fetch(`${API}/users/authenticate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({username, password})
    });
    const data = await response.json();
    if (response.status == 200) {
        return data.token;
    }

    throw new Error(data.message);
}

async function login(e) {
    e.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    try {
        let token = await getAuthenticate(username, password);
        if (token) {
            localStorage.setItem('token', token);
            document.getElementsByClassName("btn-close")[0].click();
            displayControls();
        }
    } catch (error) {
        document.getElementById("errorMessage").innerHTML = error;
        displayControls(false);
    }
}

function displayControls(isLogin = true) {
    let linkLogins = document.getElementsByClassName("linkLogin");
    let linkLogouts = document.getElementsByClassName("linkLogout");

    let displayLogin = 'none';
    let displayLogout = 'block';

    if (!isLogin) {
        displayLogin = 'block';
        displayLogout = 'none';
    }

    for (let i = 0; i < 2; i++) {
        linkLogins[i].style.display = displayLogin;
        linkLogouts[i].style.display = displayLogout;
    }

    let leaveComment = document.getElementById("leave-comment");
    if (leaveComment) {
        leaveComment.style.display = displayLogout;
    }
}

async function checkLogin() {
    let isLogin = await verifyToken();
    displayControls(isLogin);
}

async function verifyToken() {
    let token = localStorage.getItem('token');
    if (token) {
        let response = await fetch(`${API}/users/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({username, password})
        });

        if (response.status == 200) {
            return true;
        }
    }

    return false;
}

function logout() {
    localStorage.clear();
    displayControls(false);
}