// =========================================
// ARQUIVO: js/game.js (LÓGICA COMPLETA)
// =========================================

// --- 1. CONFIGURAÇÕES & SENHAS ---
const SENHA_TERMINAL = "1666";
const SENHA_PASTA = "409";
const SENHA_CAMERAS = "8824"; // Código descoberto no relatório
const SENHA_HELP = "MORGUE";
const SENHA_AUDIO = "LIAR";

let sanidadeAtual = 100;
let glitchIntervalo; // Controle do loop de interferência

// Roteiros e Textos
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
    { start: 34.5, end: 37, text: "Disconnection is permanent." },
    { start: 45.5, end: 48, text: "Good luck." }
];

// --- 2. ÁUDIOS ---
const audioGlitch = new Audio('assets/audio/glitch.mp3');
const audioFundo = new Audio('assets/audio/fundo.mp3');
audioFundo.loop = true; audioFundo.volume = 0.5;
const audioErro = new Audio('assets/audio/erro.mp3');
const audioSucesso = new Audio('assets/audio/sucesso.mp3');
const audioRules = new Audio('assets/audio/rules_voice.mp3');

// --- 3. REFERÊNCIAS DO DOM ---
const container = document.getElementById('game-container');
const tvNoise = document.getElementById('tv-noise');
const janelaHelp = document.getElementById('janela-help');
const inputSenhaHelp = document.getElementById('senha-help');
const msgErroHelp = document.getElementById('msg-erro-help');
const janelaAudio = document.getElementById('janela-audio');
const inputSenhaAudio = document.getElementById('senha-audio');
const msgErroAudio = document.getElementById('msg-erro-audio');

// Telas Principais
const introScreen = document.getElementById('intro-screen');
const terminalScreen = document.getElementById('terminal-screen');
const rulesScreen = document.getElementById('rules-screen');
const desktopScreen = document.getElementById('desktop-screen');

// Terminal
const terminalContent = document.getElementById('terminal-content');
const puzzleContainer = document.getElementById('puzzle-container');
const senhaInput = document.getElementById('senha-input');
const msgErro = document.getElementById('mensagem-erro');

// Entidade
const entityVideo = document.getElementById('entity-face');
const legendaContainer = document.getElementById('legenda-container');

// Desktop - Pasta
const janelaSenha = document.getElementById('janela-senha');
const janelaRelatorio = document.getElementById('janela-relatorio');
const inputSenhaPasta = document.getElementById('senha-pasta');
const msgErroPasta = document.getElementById('msg-erro-pasta');

// Desktop - Câmeras
const janelaCameras = document.getElementById('janela-cameras');
const cameraLogin = document.getElementById('camera-login');
const cameraFeed = document.getElementById('camera-feed');
const inputSenhaCamera = document.getElementById('senha-camera');
const msgErroCamera = document.getElementById('msg-erro-camera');
const imgDisplay = document.getElementById('img-cam-display');
const camNumberLabel = document.getElementById('cam-number');
const staticOverlay = document.getElementById('static-overlay');

// Sanidade
const barraSanidade = document.getElementById('sanity-bar');
const textoSanidade = document.getElementById('sanity-text');

// --- 4. FUNÇÕES GERAIS ---

function reduzirSanidade(valor) {
    sanidadeAtual -= valor;
    if (barraSanidade && textoSanidade) {
        barraSanidade.style.width = sanidadeAtual + '%';
        textoSanidade.innerText = sanidadeAtual + '%';
        if (sanidadeAtual <= 30) {
            barraSanidade.style.backgroundColor = 'red';
            textoSanidade.style.color = 'red';
        }
    }
    if (sanidadeAtual <= 0) gameOver();
}

function gameOver() {
    audioErro.play();
    document.body.classList.add('glitch-anim');
    setTimeout(() => {
        alert("SISTEMA CRÍTICO: CONEXÃO NEURAL PERDIDA.\n\nVocê falhou.");
        location.reload();
    }, 1000);
}

// --- 5. FLUXO: INTRO -> TERMINAL -> ENTIDADE -> DESKTOP ---

// Iniciar Jogo
document.getElementById('btn-iniciar').addEventListener('click', () => {
    audioGlitch.play().catch(e => { });
    audioFundo.play();

    // Glitch Inicial
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

// Efeito Digitação Terminal
function digitarTexto(texto, elemento, velocidade = 30) {
    let i = 0;
    function type() {
        if (i < texto.length) {
            elemento.innerHTML += (texto.charAt(i) === '\n') ? '<br>' : texto.charAt(i);
            i++;
            terminalScreen.scrollTop = terminalScreen.scrollHeight;
            setTimeout(type, velocidade);
        } else {
            setTimeout(() => {
                puzzleContainer.classList.remove('hidden');
                senhaInput.focus();
                terminalScreen.scrollTo({ top: terminalScreen.scrollHeight, behavior: 'smooth' });
            }, 500);
        }
    }
    type();
}

// Senha Terminal (1666)
senhaInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (senhaInput.value === SENHA_TERMINAL) {
            audioSucesso.play();
            msgErro.classList.add('hidden');
            senhaInput.disabled = true;
            senhaInput.style.borderBottom = "2px solid #00ff00";

            setTimeout(() => {
                terminalScreen.classList.add('hidden');
                rulesScreen.classList.remove('hidden');
                audioFundo.pause();
                audioRules.play();
                entityVideo.currentTime = 0;
                entityVideo.play();
                document.querySelector('.rules-content').classList.add('pulsando');
            }, 2000);
        } else {
            audioErro.play();
            msgErro.classList.remove('hidden');
            msgErro.innerText = "INVALID DATA.";
            document.body.classList.add('glitch-anim');
            setTimeout(() => document.body.classList.remove('glitch-anim'), 500);
        }
    }
});

// Vídeo Entidade e Transição pro Desktop
audioRules.ontimeupdate = function () {
    const tempo = audioRules.currentTime;
    const fala = legendasRoteiro.find(l => tempo >= l.start && tempo <= l.end);
    legendaContainer.style.display = fala ? 'block' : 'none';
    if (fala) legendaContainer.innerText = fala.text;
};

audioRules.onended = function () {
    rulesScreen.classList.add('hidden');
    entityVideo.pause();
    desktopScreen.classList.remove('hidden');
    // Relógio
    setInterval(() => {
        const now = new Date();
        document.getElementById('relogio').innerText = now.toLocaleTimeString();
    }, 1000);
};

// --- 6. SISTEMAS DO DESKTOP ---

// --- PASTA CONFIDENCIAL ---
window.abrirPastaConfidencial = function () {
    janelaSenha.classList.remove('hidden');
    inputSenhaPasta.value = '';
    msgErroPasta.classList.add('hidden');
    inputSenhaPasta.focus();
};

window.fecharPasta = function () { janelaSenha.classList.add('hidden'); };
window.fecharRelatorio = function () { janelaRelatorio.classList.add('hidden'); };

window.verificarSenhaPasta = function () {
    if (inputSenhaPasta.value.trim() === SENHA_PASTA) {
        audioSucesso.play();
        fecharPasta();
        janelaRelatorio.classList.remove('hidden');
    } else {
        audioErro.play();
        msgErroPasta.classList.remove('hidden');
        reduzirSanidade(20);
        janelaSenha.classList.add('glitch-anim');
        setTimeout(() => janelaSenha.classList.remove('glitch-anim'), 500);
        inputSenhaPasta.value = "";
    }
};

// --- SISTEMA DE CÂMERAS (SEC_FEED) ---

window.abrirAppCameras = function () {
    janelaCameras.classList.remove('hidden');
    cameraLogin.classList.remove('hidden');
    cameraFeed.classList.add('hidden');
    inputSenhaCamera.value = "";
    msgErroCamera.classList.add('hidden');
};

window.fecharAppCameras = function () {
    janelaCameras.classList.add('hidden');
    pararLoopGlitch(); // Para o barulho se fechar
};

window.verificarSenhaCamera = function () {
    if (inputSenhaCamera.value === SENHA_CAMERAS) {
        audioSucesso.play();
        cameraLogin.classList.add('hidden');
        cameraFeed.classList.remove('hidden');

        // SUCESSO: Inicia Loop de Glitch
        iniciarLoopGlitch();
    } else {
        audioErro.play();
        msgErroCamera.classList.remove('hidden');
        reduzirSanidade(15);
    }
};

window.mudarCam = function (num) {
    audioGlitch.play();
    camNumberLabel.innerText = "0" + num;

    // 1. Liga o chuvisco
    staticOverlay.classList.add('static-active');

    // 2. O QUE FALTAVA: Desliga o chuvisco depois de 0.3 segundos
    setTimeout(() => {
        staticOverlay.classList.remove('static-active');
    }, 300);

    // 3. Troca a imagem (mantendo o .jpeg que corrigimos)
    imgDisplay.src = `assets/img/cam${num}.jpeg`;
};

// --- FUNÇÕES DE GLITCH (MEDO AUTOMÁTICO) ---
function iniciarLoopGlitch() {
    glitchIntervalo = setInterval(() => {
        // 30% de chance de susto a cada 2 seg
        if (Math.random() > 0.7) {
            executarGlitch();
        }
    }, 2000);
}

function executarGlitch() {
    if (!audioGlitch.paused) audioGlitch.currentTime = 0;
    audioGlitch.play().catch(e => { });

    // NOVO: Aplica o chuvisco no overlay
    staticOverlay.classList.add('static-active');

    // Remove rápido (200ms de chuvisco)
    setTimeout(() => {
        staticOverlay.classList.remove('static-active');
    }, 200);
}

// --- LÓGICA DO ARQUIVO HELP_ME.txt (EPISÓDIO 04) ---

window.abrirJanelaHelp = function () {
    janelaHelp.classList.remove('hidden');
    inputSenhaHelp.value = "";
    msgErroHelp.classList.add('hidden');
    inputSenhaHelp.focus();
};

window.fecharJanelaHelp = function () {
    janelaHelp.classList.add('hidden');
};

window.verificarSenhaHelp = function () {
    // .toUpperCase() serve para aceitar "morgue" ou "MORGUE"
    if (inputSenhaHelp.value.trim().toUpperCase() === SENHA_HELP) {
        audioSucesso.play();

        // Troca o conteúdo da janela para a mensagem secreta
        janelaHelp.querySelector('.conteudo-janela').innerHTML = `
            <p class="text-left" style="font-family: 'Courier Prime', monospace; color: #fff;">
                <strong>FROM:</strong> SUBJECT_13<br>
                <strong>TO:</strong> YOU<br><br>
                They are listening. The sanity bar is a lie.<br>
                It tracks your compliance, not your health.<br><br>
                Do not trust the voices. Trust the code.<br>
                The next key is in the sound spectrum.<br>
                <br>
                <strong>[CONNECTION TERMINATED]</strong>
            </p>
            <button class="btn-unlock" onclick="fecharJanelaHelp()">CLOSE</button>
        `;
    } else {
        audioErro.play();
        msgErroHelp.classList.remove('hidden');
        reduzirSanidade(10); // Punição por erro!
        janelaHelp.classList.add('glitch-anim');
        setTimeout(() => janelaHelp.classList.remove('glitch-anim'), 500);
    }
};
// --- LÓGICA DO ARQUIVO AUDIO_CLUE.txt (EPISÓDIO 05) ---
window.abrirJanelaAudio = function () {
    janelaAudio.classList.remove('hidden');
    inputSenhaAudio.value = "";
    msgErroAudio.classList.add('hidden');
    inputSenhaAudio.focus();
}

window.fecharJanelaAudio = function () {
    janelaAudio.classList.add('hidden');
}

window.verificarSenhaAudio = function () {
    if (inputSenhaAudio.value.trim().toUpperCase() === SENHA_AUDIO) {
        audioSucesso.play();

        // Conteúdo de Sucesso (Em Inglês)
        janelaAudio.querySelector('.conteudo-janela').innerHTML = `
            <div class="center-content">
                <h2 style="color: #00ff00; letter-spacing: 2px;">ACCESS GRANTED</h2>
                <br>
                <p class="text-left" style="font-family: 'Share Tech Mono', monospace;">
                    > COMMAND: DELETE RECORD<br>
                    > TARGET: session_409.wav<br>
                    > PROCESSING...<br>
                    > [██████████] 100%<br>
                </p>
                <br>
                <p style="color: cyan; border: 1px solid cyan; padding: 10px;">
                    <strong>SYSTEM MESSAGE:</strong><br>
                    Evidence deleted successfully.<br>
                    Subject 409 memory purge initiated.<br>
                    Dr. Vance has been notified.
                </p>
                <br><br>
                <button class="btn-unlock" onclick="fecharJanelaAudio()">TERMINATE SESSION</button>
            </div>
        `;
    } else {
        // Erro: Tira sanidade e faz glitch
        audioErro.play();
        msgErroAudio.classList.remove('hidden');
        reduzirSanidade(15); // Errar aqui custa caro!
        janelaAudio.classList.add('glitch-anim');
        setTimeout(() => janelaAudio.classList.remove('glitch-anim'), 500);
    }
};