document.addEventListener('DOMContentLoaded', () => {
    // Verifica se l'utente è già loggato
    if (localStorage.getItem('loggedIn')) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('welcome-container').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Benvenuto ${localStorage.getItem('username')}`;
    }
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    const credentials = {
        'utente1': 'password1',
        'utente2': 'password2',
        'utente3': 'password3'
    };

    if (credentials[username] && credentials[username] === password) {
        if (rememberMe) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
        } else {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', username);
        }
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('welcome-container').style.display = 'block';
        document.getElementById('welcome-message').textContent = `Benvenuto ${username}`;
    } else {
        alert('Credenziali non valide');
    }
});

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

// Gestione della navigazione per la sezione Camion
document.querySelectorAll('.nav-link')[0].addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = 'camion.html'; // Naviga alla pagina camion.html
});

// Gestione della visualizzazione della sezione delle mappe
document.getElementById('maps-container').addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        hideMaps();
    }
});

function hideMaps() {
    document.getElementById('maps-container').style.display = 'none';
}