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
    carregarComponente('header-container', '../components/header.html');
    carregarComponente('footer-container', '../components/footer.html');
    
    inicializarTema();
});

// --- Lógica de Acessibilidade (Modo Claro) ---
function inicializarTema() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Verifica preferência salva no localStorage
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

// --- Lógica do Quiz Atualizada ---
function verificarQuiz() {
    let pontuacao = 0;
    const totalPerguntas = Object.keys(GABARITO_QUIZ).length;
    const form = document.getElementById('quiz-form');
    const btnSubmit = document.getElementById('submit-quiz');
    
    if (!form) return;

    // Adiciona classe ao form para desabilitar hover visual via CSS e marcar submissão
    form.classList.add('submetido');
    btnSubmit.disabled = true; // Desabilita botão para evitar reenvio

    // Itera por cada pergunta no gabarito
    for (let i = 1; i <= totalPerguntas; i++) {
        const perguntaNome = `q${i}`;
        const respostaCorretaVal = GABARITO_QUIZ[perguntaNome];
        
        // Seleciona o container da pergunta para manipulação do DOM
        const questionContainer = document.getElementById(`${perguntaNome}-container`);
        if (!questionContainer) continue;

        const inputs = questionContainer.querySelectorAll('input[type="radio"]');
        const respostaSelecionada = questionContainer.querySelector('input[type="radio"]:checked');
        
        // Desabilita todos os inputs desta pergunta
        inputs.forEach(input => input.disabled = true);

        // Lógica de Feedback Visual Pergunta por Pergunta
        inputs.forEach(input => {
            const labelPai = input.parentElement; // Pega o <label> que envolve o input

            if (input.value === respostaCorretaVal) {
                // É a alternativa correta
                if (respostaSelecionada && respostaSelecionada.value === respostaCorretaVal) {
                    // Usuário acertou: fica VERDE
                    labelPai.classList.add('is-correct');
                    // Incrementa pontuação apenas uma vez por pergunta aqui
                    if (input === respostaSelecionada) pontuacao++; 
                } else {
                    // Usuário errou ou não marcou: fica CINZA (gabarito)
                    labelPai.classList.add('was-correct');
                }
            } else if (respostaSelecionada && input === respostaSelecionada && input.value !== respostaCorretaVal) {
                // É a alternativa que o usuário marcou E está errada: fica VERMELHO
                labelPai.classList.add('is-wrong');
            }
        });
    }

    // --- Exibição do Resultado Final ---
    const divResultado = document.getElementById('resultado-quiz');
    const textoResultado = document.getElementById('resultado-texto');
    
    divResultado.classList.remove('hidden'); // Mostra área de resultado
    
    // Rola suavemente até o resultado
    divResultado.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Define mensagem baseada na pontuação
    if (pontuacao === totalPerguntas) {
        textoResultado.style.color = 'var(--quiz-correct-text)';
        textoResultado.innerHTML = `<h3>Gabaritou! 🎉</h3><p>Você acertou ${pontuacao} de ${totalPerguntas}. Seu conhecimento em QA está pronto para produção! 🚀</p>`;
    } else if (pontuacao >= (totalPerguntas / 2)) {
        textoResultado.style.color = '#fbbf24'; // Amarelo (não usei variável pois é fixo p/ alerta)
        textoResultado.innerHTML = `<h3>Bom trabalho!</h3><p>Você acertou ${pontuacao} de ${totalPerguntas}. Passou nos testes principais, mas dê uma revisada nos itens cinzas. 🧐</p>`;
    } else {
        textoResultado.style.color = 'var(--quiz-wrong-text)';
        textoResultado.innerHTML = `<h3>Build Failed 🐛</h3><p>Você acertou ${pontuacao} de ${totalPerguntas}. Encontramos falhas críticas. Recomendamos ler o conteúdo acima novamente e refazer o teste.</p>`;
    }
}

// --- Função Jogar de Novo ---
function reiniciarQuiz() {
    const form = document.getElementById('quiz-form');
    const btnSubmit = document.getElementById('submit-quiz');
    const divResultado = document.getElementById('resultado-quiz');
    
    if (!form) return;

    // 1. Reseta o formulário (limpa seleções radio)
    form.reset();
    
    // 2. Remove classes de estado e habilita submit
    form.classList.remove('submetido');
    btnSubmit.disabled = false;
    
    // 3. Esconde área de resultado
    divResultado.classList.add('hidden');

    // 4. Limpa classes de feedback visual e reabilita inputs nas perguntas
    const questions = form.querySelectorAll('.question');
    questions.forEach(question => {
        const labels = question.querySelectorAll('label');
        const inputs = question.querySelectorAll('input[type="radio"]');
        
        labels.forEach(label => {
            label.classList.remove('is-correct', 'is-wrong', 'was-correct');
        });
        
        inputs.forEach(input => {
            input.disabled = false;
        });
    });

    // 5. Rola de volta para o início do quiz
    document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
}