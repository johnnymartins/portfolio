const form = document.querySelector('form');

function validaEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
    
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;

    if (!validaEmail(email)) {
        alert('E-mail inválido.');
        return;
    }

    alert('Mensagem enviada com sucesso.');
    form.reset();
});
