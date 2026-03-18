// aqui se cria a variável que recebe o formulário da html
const form = document.querySelector('form');

// aqui se cria a função que valida o email usando uma expressão regular
function validaEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
    
}

// aqui se cria o evento submit do formlário
form.addEventListener('submit', (event) => {
    // aqui se previne o comportamento padrão do formulário, que é enviar os dados para um servidor e recarregar a página
    event.preventDefault();
     // aqui se cria a variável que recebe o valor do campo de email do formulário
    const email = document.getElementById('email').value;

    // aqui se chama a função de validação do email e se exibe um alerta caso o email seja inválido
    if (!validaEmail(email)) {
        alert('E-mail inválido.');
        return;
    }

    // aqui se exibe um alerta de sucesso caso o email seja válido e se reseta o formulário
    alert('Mensagem enviada com sucesso.');
    form.reset();
});
