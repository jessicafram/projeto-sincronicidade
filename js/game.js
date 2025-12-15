// --- CARREGAMENTO DE ÁUDIOS ---
// O javascript carrega os sons mas só pode tocar depois que o usuário clicar na tela
const audioGlitch = new Audio('assets/audio/glitch.mp3');
const audioFundo = new Audio('assets/audio/fundo.mp3');
audioFundo.loop = true; // O som de fundo fica repetindo
audioFundo.volume = 0.5; // Volume a 50%

const audioErro = new Audio('assets/audio/erro.mp3');
const audioSucesso = new Audio('assets/audio/sucesso.mp3');

// --- ELEMENTOS HTML ---
const btnIniciar = document.getElementById('btn-iniciar');
const container = document.getElementById('game-container');
const introScreen = document.getElementById('intro-screen');
const terminalScreen = document.getElementById('terminal-screen');
const terminalContent = document.getElementById('terminal-content');
const tvNoise = document.getElementById('tv-noise');
const puzzleContainer = document.getElementById('puzzle-container');
const senhaInput = document.getElementById('senha-input');
const msgErro = document.getElementById('mensagem-erro');

// --- CONFIGURAÇÕES ---
const SENHA_CORRETA = "1666";

// Texto atualizado conforme seu roteiro
const textoHacker = `Conexão insegura estabelecida...
Sujeito #409 localizado.

Eles mentiram para você. Não é um teste. É uma contenção.
Para sair, você precisa entender o passado.

...Baixando arquivo: arquivo_1348.txt...
[DOWNLOAD CONCLUÍDO]`;

// --- FUNÇÕES ---

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
            // Fim do texto: Mostra a carta
            setTimeout(mostrarEnigma, 500);
        }
    }
    type();
}

function mostrarEnigma() {
    puzzleContainer.classList.remove('hidden');
    senhaInput.focus();
    terminalScreen.scrollTo({ top: terminalScreen.scrollHeight, behavior: 'smooth' });
}

// Botão Iniciar (O Susto + Play no Áudio)
btnIniciar.addEventListener('click', () => {
    // 1. Toca o som do glitch (modem)
    audioGlitch.play().catch(e => console.log("Erro ao tocar áudio:", e));

    // 2. Toca o som de ambiente (loop)
    audioFundo.play();

    // 3. Efeitos Visuais
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
    }, 1500); // Aumentei um pouco o tempo do susto para combinar com o som de modem
});

// Verificar Senha
senhaInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const tentativa = senhaInput.value;

        if (tentativa === SENHA_CORRETA) {
            // --- VITÓRIA ---
            audioSucesso.play(); // Toca o sino
            msgErro.classList.add('hidden');

            // Feedback Visual de Vitória
            senhaInput.style.borderBottom = "2px solid #00ff00"; // Fica verde
            puzzleContainer.innerHTML += `
                <br><br>
                <p style="color: #00ff00; text-shadow: 0 0 10px #00ff00;">
                    > Sincronização 5% concluída.<br>
                    > Acesso concedido ao diretório: ALQUIMIA.
                </p>
            `;
            terminalScreen.scrollTop = terminalScreen.scrollHeight;

        } else {
            // --- DERROTA ---
            audioErro.play(); // Toca chiado
            audioErro.currentTime = 0; // Reinicia o som se apertar rápido

            document.body.classList.add('glitch-anim');
            msgErro.classList.remove('hidden');
            msgErro.innerText = "A INSTABILIDADE AUMENTOU. ELES OUVIRAM VOCÊ."; // Texto do roteiro
            msgErro.classList.add('erro-texto');

            senhaInput.value = '';
            setTimeout(() => document.body.classList.remove('glitch-anim'), 500);
        }
    }
});