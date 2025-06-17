document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

       if (response.ok) {
    const data = await response.json();
    alert(`Bienvenido ${data.username}`);
window.location.href = '../dashboard/index.html'
}
 else {
            const error = await response.json();
            alert(`❌ ${error.message}`);
        }
    } catch (error) {
        console.error('❌ Error de red o conexión:', error);
        alert('Error de red o conexión con el servidor');
    }
});
