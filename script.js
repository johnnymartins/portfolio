// 1. Adicionamos 'return new Promise' para o JS saber quando a animação termina
function insereTexto(elemento, textoHTML) {
    return new Promise((resolve) => {
        elemento.innerHTML = '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = textoHTML;
        let delayAcumulado = 0;
        const nodes = Array.from(tempDiv.childNodes);

        nodes.forEach((node, index) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const palavras = node.textContent.split(' ');
                palavras.forEach(palavra => {
                    if (palavra.trim() !== '') {
                        const span = document.createElement('span');
                        span.textContent = palavra + ' ';
                        span.classList.add('palavraAnimada');
                        span.style.animationDelay = `${delayAcumulado}s`;
                        elemento.appendChild(span);
                        delayAcumulado += 0.05;
                    }
                });
            } else {
                const cloneNode = node.cloneNode(true);
                if (cloneNode.tagName !== 'BR') {
                    cloneNode.classList.add('palavraAnimada');
                    cloneNode.style.animationDelay = `${delayAcumulado}s`;
                    delayAcumulado += 0.05;
                }
                elemento.appendChild(cloneNode);
            }
            // Quando chega na última palavra do bloco, resolve a promise
            if (index === nodes.length - 1) {
                setTimeout(resolve, (delayAcumulado + 0.4) * 1000);
            }
        });
    });
}

const botoes = document.querySelectorAll('.btn-menu');


botoes.forEach(botao => {
    // Usa 'async' para permitir o uso de 'await'
    botao.addEventListener('click', async () => {
        const termoBusca = botao.textContent.trim().toLowerCase();
        
        try {
            const response = await fetch('./content/dados.json');
            const dados = await response.json();
            const conteudo = dados.find(item => item.titulo.toLowerCase() === termoBusca);
            
            if (conteudo) {
                const section = document.querySelector('section');
                section.innerHTML = ''; 

                // Título
                const sectionH1 = document.createElement('h1');
                sectionH1.setAttribute('aria-label', conteudo.titulo);
                section.appendChild(sectionH1);
                await insereTexto(sectionH1, conteudo.titulo);
                
                // Se for "contato", renderiza o formulário
                if (termoBusca === 'contato') {
                    const form = document.createElement('form');
                    //form.setAttribute('action', 'GET');
                    form.innerHTML = `
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required>
                    
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" required>
                    
                    <label for="mensagem">Mensagem:</label>
                    <textarea id="mensagem" name="mensagem" required></textarea>
                    
                    <button type="submit" class="btn-enviar">Enviar</button>
                    `;
                    section.appendChild(form);

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
                    
                } else {
                    // Parágrafos
                    for (const textoParagrafo of conteudo.texto) {
                        const p = document.createElement('p');
                        const textoLimpo = textoParagrafo.replace(/<[^>]+>/g, '');
                        p.setAttribute('role', 'text');
                        p.setAttribute('aria-label', textoLimpo);
                        section.appendChild(p);
                        await insereTexto(p, textoParagrafo);
                    }
                }
            }
        } catch (error) {
            console.error('Erro ao carregar o JSON: ', error);
        }
    });
});
