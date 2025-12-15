// Captura elementos
const btnIniciar = document.getElementById('btn-iniciar');
const container = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const terminalScreen = document.getElementById('terminal-screen');
const terminalContent = document.getElementById('terminal-content');
const tvNoise = document.getElementById('tv-noise');
const puzzleContainer = document.getElementById('puzzle-container');
const senhaInput = document.getElementById('senha-input');
const msgErro = document.getElementById('mensagem-erro');

// CONFIGURAÇÃO DO JOGO
const SENHA_CORRETA = "1666";
const textoHacker = `Conexão insegura estabelecida...
Rastreando IP... Sujeito #409 localizado.

Eles mentiram para você. Não é um teste. É uma contenção.
Para sair, você precisa entender o passado.

...Baixando arquivo: carta_1500.txt...
[DOWNLOAD CONCLUÍDO]`;

// Função de Digitação (Typewriter)
function digitarTexto(texto, elemento, velocidade = 30) {
    let i = 0;
    function type() {
        if (i < texto.length) {
            if (texto.charAt(i) === '\n') {
                elemento.innerHTML += '<br>';
            } else {
                elemento.innerHTML += texto.charAt(i);
            }
            i++;
            // Scroll automático
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
            setTimeout(type, velocidade);
        } else {
            // Fim do texto: Mostra a carta após 0.5 segundos
            setTimeout(mostrarEnigma, 500);
        }
    }
    type();
}

function mostrarEnigma() {
    puzzleContainer.classList.remove('hidden'); // Revela a carta
    senhaInput.focus(); // Foca no input
    // FORÇA O SCROLL PARA BAIXO (Importante para ver o código no rodapé da carta)
    terminalScreen.scrollTo({
        top: terminalScreen.scrollHeight,
        behavior: 'smooth'
    });
}

// Verifica Senha ao apertar ENTER
senhaInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const tentativa = senhaInput.value;
        if (tentativa === SENHA_CORRETA) {
            // VITÓRIA
            msgErro.classList.add('hidden');
            alert("ACESSO PERMITIDO! DIRETÓRIO 'ALQUIMIA' ABERTO.");
        } else {
            // DERROTA (Susto leve)
            document.body.classList.add('glitch-anim');
            msgErro.classList.remove('hidden');
            msgErro.classList.add('erro-texto');
            senhaInput.value = '';
            setTimeout(() => document.body.classList.remove('glitch-anim'), 500);
        }
    }
});

// Botão Iniciar (Sequência de Susto Inicial)
btnIniciar.addEventListener('click', () => {
    // Ativa caos visual
    document.body.classList.add('glitch-anim');
    tvNoise.classList.remove('hidden');
    tvNoise.classList.add('noise-ativo');

    setTimeout(() => {
        // Limpa caos e troca telas
        document.body.classList.remove('glitch-anim');
        tvNoise.classList.remove('noise-ativo');
        tvNoise.classList.add('hidden');

        container.classList.remove('modo-clean');
        container.classList.add('modo-terror');
        introScreen.classList.add('hidden');
        terminalScreen.classList.remove('hidden');

        // Inicia o jogo
        digitarTexto(textoHacker, terminalContent);
    }, 800);
});