// Função genérica para carregar componentes HTML dinamicamente
async function carregarComponente(elementId, caminhoArquivo) {
    try {
        const resposta = await fetch(caminhoArquivo);
        if (!resposta.ok) {
            throw new Error(`Erro ao carregar ${caminhoArquivo}: status ${resposta.status}`);
        }
        const html = await resposta.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (erro) {
        console.error('Erro no carregamento do componente:', erro);
    }
}

// Carrega o Header e o Footer assim que o documento HTML estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Como a página index.html está em /pages, subimos um nível (../) para acessar /components
    carregarComponente('header-container', '../components/header.html');
    carregarComponente('footer-container', '../components/footer.html');
});

// Lógica do Quiz
function verificarQuiz() {
    const gabarito = {
        q1: 'b',
        q2: 'c'
    };

    let pontuacao = 0;
    const totalPerguntas = Object.keys(gabarito).length;
    const form = document.getElementById('quiz-form');
    
    if (!form) return;

    for (let pergunta in gabarito) {
        const respostaUsuario = form.elements[pergunta]?.value;
        if (respostaUsuario === gabarito[pergunta]) {
            pontuacao++;
        }
    }

    const divResultado = document.getElementById('resultado-quiz');
    if (pontuacao === totalPerguntas) {
        divResultado.style.color = '#10b981';
        divResultado.innerText = `Parabéns! Você acertou ${pontuacao} de ${totalPerguntas}. Código pronto para produção! 🚀`;
    } else {
        divResultado.style.color = '#ef4444';
        divResultado.innerText = `Você acertou ${pontuacao} de ${totalPerguntas}. Encontramos alguns bugs, revise o conteúdo e tente novamente! 🐛`;
    }
}