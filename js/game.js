// =========================================
// ARQUIVO: js/game.js (Versão Final Consolidada)
// =========================================

// --- 1. CARREGAMENTO DE ÁUDIOS ---
const audioGlitch = new Audio('assets/audio/glitch.mp3');
const audioFundo = new Audio('assets/audio/fundo.mp3');
audioFundo.loop = true;
audioFundo.volume = 0.5;

const audioErro = new Audio('assets/audio/erro.mp3');
const audioSucesso = new Audio('assets/audio/sucesso.mp3');

// Voz da Entidade (Regras)
const audioRules = new Audio('assets/audio/rules_voice.mp3');
audioRules.volume = 1.0;


// --- 2. ELEMENTOS DO HTML ---
const btnIniciar = document.getElementById('btn-iniciar');
const container = document.getElementById('game-container');

// Telas
const introScreen = document.getElementById('intro-screen');
const terminalScreen = document.getElementById('terminal-screen');
const rulesScreen = document.getElementById('rules-screen');
const desktopScreen = document.getElementById('desktop-screen');

// Elementos do Puzzle (Terminal)
const terminalContent = document.getElementById('terminal-content');
const tvNoise = document.getElementById('tv-noise');
const puzzleContainer = document.getElementById('puzzle-container');
const senhaInput = document.getElementById('senha-input');
const msgErro = document.getElementById('mensagem-erro');

// Elementos do Vídeo/Legenda
const entityVideo = document.getElementById('entity-face');
const legendaContainer = document.getElementById('legenda-container');

// Elementos da Pasta (Desktop)
const janelaSenha = document.getElementById('janela-senha');
const inputSenhaPasta = document.getElementById('senha-pasta');
const msgErroPasta = document.getElementById('msg-erro-pasta');
const barraSanidade = document.getElementById('sanity-bar');
const textoSanidade = document.getElementById('sanity-text');


// --- 3. CONFIGURAÇÕES & ESTADO ---
const SENHA_CORRETA = "1666";
const SENHA_PASTA = "409";
let sanidadeAtual = 100;

const textoHacker = `Insecure connection established...
Subject #409 located.

They lied to you. This is not a test. It is containment.
To exit, you must understand the past.

...Downloading file: file_1348.txt...
[DOWNLOAD COMPLETE]`;

const legendasRoteiro = [
    { start: 0, end: 4, text: "Impressive, Subject 409. Few pass the first barrier." },
    { start: 4.5, end: 7, text: "But the real test begins now." },
    { start: 7.5, end: 11, text: "Pay attention: Your neural connection is stable at 100%." },
    { start: 11.5, end: 14, text: "This is your Sanity." },
    { start: 14.5, end: 18, text: "Every mistake, every time you beg for our help..." },
    { start: 18.5, end: 21, text: "...it will cost you mentally." },
    { start: 22, end: 26, text: "Be fast and precise, and perhaps the system will reward you..." },
    { start: 26.5, end: 29, text: "...by returning fragments of your mind." },
    { start: 30, end: 34, text: "But remember: if this number reaches zero..." },
    { start: 34.5, end: 37, text: "Disconnection is permanent." },
    { start: 37.5, end: 41, text: "You will never return to your reality." },
    { start: 42, end: 45, text: "The next file is already open." },
    { start: 45.5, end: 48, text: "Good luck." }
];


// --- 4. FUNÇÕES GERAIS ---

function reduzirSanidade(valor) {
    sanidadeAtual -= valor;

    // Atualiza visual
    if (barraSanidade && textoSanidade) {
        barraSanidade.style.width = sanidadeAtual + '%';
        textoSanidade.innerText = sanidadeAtual + '%';

        if (sanidadeAtual <= 30) {
            barraSanidade.style.backgroundColor = 'red';
            textoSanidade.style.color = 'red';
        }
    }

    if (sanidadeAtual <= 0) {
        gameOver();
    }
}

function gameOver() {
    audioErro.play();
    document.body.classList.add('glitch-anim');
    setTimeout(() => {
        alert("SISTEMA CRÍTICO: CONEXÃO NEURAL PERDIDA.\n\nVocê falhou.");
        location.reload();
    }, 1000);
}

// --- 5. LÓGICA DO TERMINAL (Começo do Jogo) ---

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
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
            setTimeout(type, velocidade);
        } else {
            // AQUI ESTAVA O PROBLEMA: Quando acaba de digitar, chama o enigma!
            setTimeout(mostrarEnigma, 500);
        }
    }
    type();
}

function mostrarEnigma() {
    // Essa função torna o enigma visível
    if (puzzleContainer) {
        puzzleContainer.classList.remove('hidden');
        senhaInput.focus();
        terminalScreen.scrollTo({ top: terminalScreen.scrollHeight, behavior: 'smooth' });
    } else {
        console.error("ERRO: puzzle-container não encontrado no HTML!");
    }
}

// Evento: Clicar em INICIAR
btnIniciar.addEventListener('click', () => {
    audioGlitch.play().catch(e => console.log("Audio play error:", e));
    audioFundo.play();

    document.body.classList.add('glitch-anim');
    tvNoise.classList.remove('hidden');
    tvNoise.classList.add('noise-ativo');

    setTimeout(() => {
        document.body.classList.remove('glitch-anim');
        tvNoise.classList.remove('noise-ativo');
        tvNoise.classList.add('hidden');

        container.classList.remove('modo-clean');
        container.classList.add('modo-terror');
        introScreen.classList.add('hidden');
        terminalScreen.classList.remove('hidden');

        digitarTexto(textoHacker, terminalContent);
    }, 1500);
});

// Evento: Digitar SENHA (1666)
senhaInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const tentativa = senhaInput.value;

        if (tentativa === SENHA_CORRETA) {
            // SUCESSO
            audioSucesso.play();
            msgErro.classList.add('hidden');
            senhaInput.style.borderBottom = "2px solid #00ff00";
            senhaInput.disabled = true;

            puzzleContainer.innerHTML += `
                <br><br>
                <p style="color: #00ff00; text-shadow: 0 0 10px #00ff00;">
                    > Synchronization 5% complete.<br>
                    > Access granted. Initiating Rules Protocol...
                </p>
            `;
            terminalScreen.scrollTop = terminalScreen.scrollHeight;

            // Transição para VÍDEO
            setTimeout(() => {
                audioFundo.pause();
                audioSucesso.pause();
                terminalScreen.classList.add('hidden');
                rulesScreen.classList.remove('hidden');

                audioRules.play();
                entityVideo.currentTime = 0;
                entityVideo.play();
                document.querySelector('.rules-content').classList.add('pulsando');
            }, 3000);

        } else {
            // ERRO NA SENHA 1666
            audioErro.play();
            audioErro.currentTime = 0;
            document.body.classList.add('glitch-anim');
            msgErro.classList.remove('hidden');
            msgErro.innerText = "INSTABILITY INCREASED. THEY HEARD YOU.";

            senhaInput.value = '';
            setTimeout(() => document.body.classList.remove('glitch-anim'), 500);
        }
    }
});


// --- 6. LÓGICA DO VÍDEO (Legendas) ---

audioRules.ontimeupdate = function () {
    const tempoAtual = audioRules.currentTime;
    const fala = legendasRoteiro.find(l => tempoAtual >= l.start && tempoAtual <= l.end);

    if (fala) {
        legendaContainer.innerText = fala.text;
        legendaContainer.style.display = 'block';
    } else {
        legendaContainer.innerText = "";
        legendaContainer.style.display = 'none';
    }
};

audioRules.onended = function () {
    // Acabou o vídeo -> Vai para o DESKTOP
    rulesScreen.classList.add('hidden');
    entityVideo.pause();
    desktopScreen.classList.remove('hidden');
};


// --- 7. LÓGICA DA PASTA (Desktop) ---

// Funções globais para o HTML poder chamar (onclick)
window.abrirPastaConfidencial = function () {
    janelaSenha.classList.remove('hidden');
    inputSenhaPasta.value = '';
    msgErroPasta.classList.add('hidden');
    inputSenhaPasta.focus();
};

window.fecharPasta = function () {
    janelaSenha.classList.add('hidden');
};

window.verificarSenhaPasta = function () {
    const tentativa = inputSenhaPasta.value;

    if (tentativa === SENHA_PASTA) {
        audioSucesso.play();
        alert("ARQUIVO DECRIPTADO! \n\n[O próximo enigma estaria aqui...]");
        fecharPasta();
    } else {
        // ERRO NA PASTA -> PERDE SANIDADE
        audioErro.play();
        audioErro.currentTime = 0;
        msgErroPasta.classList.remove('hidden');

        janelaSenha.classList.add('glitch-anim');
        setTimeout(() => janelaSenha.classList.remove('glitch-anim'), 500);

        reduzirSanidade(20);
    }
};