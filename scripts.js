document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let rememberMe = document.getElementById('remember-me').checked;

    // Simulazione di controllo delle credenziali
    if (username === 'test' && password === 'password') {
        if (rememberMe) {
            localStorage.setItem('username', username);
            localStorage.setItem('password', password);
        }
        showWelcomeMessage(username);
    } else {
        showPopup("Credenziali non valide. Riprova.");
    }
});

function showWelcomeMessage(username) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('welcome-message').innerText = `Benvenuto, ${username}!`;
    document.getElementById('welcome-container').style.display = 'block';
}

function showPopup(message) {
    document.getElementById('popup').querySelector('h4').innerText = message;
    document.getElementById('popup-overlay').style.display = 'flex';
}

document.getElementById('popup-close').addEventListener('click', function() {
    document.getElementById('popup-overlay').style.display = 'none';
});

function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', function() {
    let username = localStorage.getItem('username');
    if (username) {
        showWelcomeMessage(username);
    }
});