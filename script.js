// 1. Adicionamos 'return new Promise' para o JS saber quando a animação termina
function renderizarConteudo(elemento, textoHTML) {
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
            // Quando chega na última palavra do bloco, resolve a promessa
            if (index === nodes.length - 1) {
                setTimeout(resolve, (delayAcumulado + 0.4) * 1000);
            }
        });
    });
}

const botoes = document.querySelectorAll('nav button');

botoes.forEach(botao => {
    // 2. Usamos 'async' para permitir o uso de 'await' (espera)
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
                // 3. 'await' faz o código parar aqui até o título terminar de animar
                await renderizarConteudo(sectionH1, conteudo.titulo);

                // Parágrafos
                for (const textoParagrafo of conteudo.texto) {
                    const p = document.createElement('p');
                    const textoLimpo = textoParagrafo.replace(/<[^>]+>/g, '');
                    p.setAttribute('role', 'text');
                    p.setAttribute('aria-label', textoLimpo);
                    section.appendChild(p);
                    
                    // 4. Espera cada parágrafo terminar antes de começar o próximo
                    await renderizarConteudo(p, textoParagrafo);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar o JSON: ', error);
        }
    });
});