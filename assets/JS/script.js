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

// Gabarito global para uso na verificação e reinicialização
const GABARITO_QUIZ = {
    q1: 'b', q2: 'c', q3: 'a', q4: 'b', q5: 'b',
    q6: 'b', q7: 'b', q8: 'a', q9: 'b', q10: 'a'
};

// --- Inicialização ---
document.addEventListener('DOMContentLoaded', () => {
    // Corrigido: caminhos relativos considerando index.html na raiz do projeto
    carregarComponente('header-container', 'components/header.html');
    carregarComponente('footer-container', 'components/footer.html');
    
    inicializarTema();
});

// --- Lógica de Acessibilidade (Modo Claro/Escuro) ---
function inicializarTema() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const body = document.body;
    
    const temaSalvo = localStorage.getItem('theme');
    if (temaSalvo === 'light') {
        body.classList.add('light-mode');
        themeToggle.innerText = 'Modo Escuro 🌙';
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeToggle.innerText = 'Modo Escuro 🌙';
        } else {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerText = 'Modo Claro ☀️';
        }
    });
}

// --- Lógica do Quiz ---
function verificarQuiz() {
    let pontuacao = 0;
    const totalPerguntas = Object.keys(GABARITO_QUIZ).length;
    const form = document.getElementById('quiz-form');
    const btnSubmit = document.getElementById('submit-quiz');
    
    if (!form) return;

    form.classList.add('submetido');
    btnSubmit.disabled = true;

    for (let i = 1; i <= totalPerguntas; i++) {
        const perguntaNome = `q${i}`;
        const respostaCorretaVal = GABARITO_QUIZ[perguntaNome];
        
        const questionContainer = document.getElementById(`${perguntaNome}-container`);
        if (!questionContainer) continue;

        const inputs = questionContainer.querySelectorAll('input[type="radio"]');
        const respostaSelecionada = questionContainer.querySelector('input[type="radio"]:checked');
        
        inputs.forEach(input => input.disabled = true);

        inputs.forEach(input => {
            const labelPai = input.parentElement;

            if (input.value === respostaCorretaVal) {
                if (respostaSelecionada && respostaSelecionada.value === respostaCorretaVal) {
                    labelPai.classList.add('is-correct');
                    if (input === respostaSelecionada) pontuacao++; 
                } else {
                    labelPai.classList.add('was-correct');
                }
            } else if (respostaSelecionada && input === respostaSelecionada && input.value !== respostaCorretaVal) {
                labelPai.classList.add('is-wrong');
            }
        });
    }

    const divResultado = document.getElementById('resultado-quiz');
    const textoResultado = document.getElementById('resultado-texto');
    
    divResultado.classList.remove('hidden');
    divResultado.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (pontuacao === totalPerguntas) {
        textoResultado.style.color = 'var(--quiz-correct-text)';
        textoResultado.innerHTML = `<h3>Gabaritou! 🎉</h3><p>Você acertou ${pontuacao} de ${totalPerguntas}. Seu conhecimento em QA está pronto para produção! 🚀</p>`;
    } else if (pontuacao >= (totalPerguntas / 2)) {
        textoResultado.style.color = '#fbbf24';
        textoResultado.innerHTML = `<h3>Bom trabalho!</h3><p>Você acertou ${pontuacao} de ${totalPerguntas}. Passou nos testes principais, mas dê uma revisada nos itens marcados. 🧐</p>`;
    } else {
        textoResultado.style.color = 'var(--quiz-wrong-text)';
        textoResultado.innerHTML = `<h3>Build Failed 🐛</h3><p>Você acertou ${pontuacao} de ${totalPerguntas}. Encontramos falhas críticas. Recomendamos ler o conteúdo acima novamente e refazer o teste.</p>`;
    }
}

function reiniciarQuiz() {
    const form = document.getElementById('quiz-form');
    const btnSubmit = document.getElementById('submit-quiz');
    const divResultado = document.getElementById('resultado-quiz');
    
    if (!form) return;

    form.reset();
    form.classList.remove('submetido');
    btnSubmit.disabled = false;
    divResultado.classList.add('hidden');

    const questions = form.querySelectorAll('.question');
    questions.forEach(question => {
        const labels = question.querySelectorAll('label');
        const inputs = question.querySelectorAll('input[type="radio"]');
        
        labels.forEach(label => label.classList.remove('is-correct', 'is-wrong', 'was-correct'));
        inputs.forEach(input => input.disabled = false);
    });

    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
}