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