
function renderizarConteudo(elemento, textoHTML) {
    elemento.innerHTML = '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = textoHTML;
    
    let delayAcumulado = 0;
    
    tempDiv.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const palavras = node.textContent.split(' ');
            palavras.forEach(palavra => {
                if (palavra.trim() !== '') {
                    const span = document.createElement('span');
                    span.textContent = palavra;
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
    })
}

//aqui são selecionados os elementos contidos no html
const botoes = document.querySelectorAll('nav button');

//aqui será feita a requisição do objeto do arquivo json
//primeiro será reconhecido o conteúdo do botão clicado
botoes.forEach(botao => {
    botao.addEventListener('click', () => {
        const termoBusca = botao.textContent.trim().toLowerCase();
        
        //agora busca no json o objeto que tem o título igual ao termo de busca
        fetch('./content/dados.json')
        .then(response => response.json())
        .then(dados => {
            const conteudo = dados.find(item => item.titulo === termoBusca);
            
            //se o conteúdo for encontrado, insere o título e o texto na seção
            if (conteudo) {
                    const section = document.querySelector('section');
                    section.innerHTML = ''; // Limpa o conteúdo anterior

                    // Cria e insere o título
                    const sectionH1 = document.createElement('h1');
                    section.appendChild(sectionH1);
                    renderizarConteudo(sectionH1, conteudo.titulo);

                    // Cria e insere o texto
                    conteudo.texto.forEach(paragrafoTexto => {
                    const sectionP = document.createElement('p');
                    section.appendChild(sectionP);
                    renderizarConteudo(sectionP, paragrafoTexto);
                    });
                }
            })
        //se ocorrer um erro na requisição do json, ele será exibido no console
        .catch(error => console.error('Erro ao carregar o JSON: ',error));
    });
});