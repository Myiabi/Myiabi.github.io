// --------------------
// GERENCIADOR DE SONS COM BOTÃO DE ÍCONE + LOOPS
// --------------------
let trilhaPendente = null; // Guarda qual trilha deve tocar após interação
let audioLiberado = false; // Flag pra saber se já liberou
let musicaMutada = localStorage.getItem("musicaMutada") === "true"; // Estado persistente

const VOLUME_PADRAO = 0.7; // Volume padrão das músicas (70%)

const Sons = {
  trilhas: {
    city: new Audio("/assets/sounds/trilhas/city.mp3"),
    templo: new Audio("/assets/sounds/trilhas/templo.mp3"),
    boss: new Audio("/assets/sounds/trilhas/boss.mp3"),
  },
  efeitos: {
    win: "/assets/sounds/efeitos/win.wav",
    win2: "/assets/sounds/efeitos/win2.mp3",
    win3: "/assets/sounds/efeitos/win3.mp3",
    win4: "/assets/sounds/efeitos/win4.wav",
    click: "/assets/sounds/efeitos/click.wav",
    whoosh: "/assets/sounds/efeitos/whooshfogo.mp3",
    padlock: "/assets/sounds/efeitos/gear.wav",
    reveal: "/assets/sounds/efeitos/reveal.mp3",
    swoosh: "/assets/sounds/efeitos/swoosh.mp3",
    wind: "/assets/sounds/efeitos/wind.mp3",
    fire: "/assets/sounds/efeitos/fire.wav",
    fireSpell: "/assets/sounds/efeitos/fire_spell.wav",
    reel: "/assets/sounds/efeitos/reel.mp3",
    melt: "/assets/sounds/efeitos/melt.mp3",
    bell: "/assets/sounds/efeitos/bell.mp3",
    ice: "/assets/sounds/efeitos/ice2.mp3",
    fade: "/assets/sounds/efeitos/fade.mp3",
    barrier: "/assets/sounds/efeitos/barrier.mp3",
    cuffs: "/assets/sounds/efeitos/cuffs.mp3",
    steam: "/assets/sounds/efeitos/steam.mp3",
  },
  trilhaAtual: null,
  loopsAtivos: {}, // Armazena os sons contínuos que estão tocando
};

// Configura todas as trilhas
for (let key in Sons.trilhas) {
  Sons.trilhas[key].loop = true;
  Sons.trilhas[key].volume = VOLUME_PADRAO;
}

// --------------------
// FUNÇÕES DE TRILHA
// --------------------
function tocarTrilha(nome) {
  const novaTrilha = Sons.trilhas[nome];
  if (!novaTrilha) return;

  if (Sons.trilhaAtual && Sons.trilhaAtual !== novaTrilha) {
    Sons.trilhaAtual.pause();
    Sons.trilhaAtual.currentTime = 0;
  }

  Sons.trilhaAtual = novaTrilha;
  trilhaPendente = nome; // Sempre guarda como pendente

  // Se estiver mutado, não toca
  if (musicaMutada) {
    console.log(`🔇 Música mutada. Trilha "${nome}" não vai tocar.`);
    return;
  }

  // Tenta tocar
  novaTrilha
    .play()
    .then(() => {
      audioLiberado = true;
      trilhaPendente = null;
      removerListenersAudio();
      console.log(`🔊 Tocando: ${nome}`);
    })
    .catch(() => {
      console.log(
        `🔇 Autoplay bloqueado. Aguardando interação para tocar: ${nome}`
      );
    });
}

// Função pra tentar tocar a trilha pendente
function tentarTocarPendente() {
  if (!trilhaPendente || musicaMutada) return;

  const trilha = Sons.trilhas[trilhaPendente];
  if (trilha) {
    trilha
      .play()
      .then(() => {
        audioLiberado = true;
        console.log(`🔊 Interação detectada! Tocando: ${trilhaPendente}`);
        trilhaPendente = null;
        removerListenersAudio();
      })
      .catch(() => {});
  }
}

// Remove todos os listeners de áudio
function removerListenersAudio() {
  document.removeEventListener("click", tentarTocarPendente, true);
  document.removeEventListener("keydown", tentarTocarPendente, true);
  document.removeEventListener("touchstart", tentarTocarPendente, true);
  document.removeEventListener("touchend", tentarTocarPendente, true);
  document.removeEventListener("pointerdown", tentarTocarPendente, true);
  document.removeEventListener("pointerup", tentarTocarPendente, true);
  document.removeEventListener("mousedown", tentarTocarPendente, true);
  document.removeEventListener("mouseup", tentarTocarPendente, true);
  document.removeEventListener("scroll", tentarTocarPendente, true);
  window.removeEventListener("focus", tentarTocarPendente);
}

// Configura TODOS os listeners possíveis (capture: true pra pegar antes de qualquer outro)
function setupAutoplayFix() {
  document.addEventListener("click", tentarTocarPendente, true);
  document.addEventListener("keydown", tentarTocarPendente, true);
  document.addEventListener("touchstart", tentarTocarPendente, true);
  document.addEventListener("touchend", tentarTocarPendente, true);
  document.addEventListener("pointerdown", tentarTocarPendente, true);
  document.addEventListener("pointerup", tentarTocarPendente, true);
  document.addEventListener("mousedown", tentarTocarPendente, true);
  document.addEventListener("mouseup", tentarTocarPendente, true);
  document.addEventListener("scroll", tentarTocarPendente, {
    capture: true,
    passive: true,
  });
  window.addEventListener("focus", tentarTocarPendente);
}

// Inicializa o fix de autoplay
setupAutoplayFix();

function pausarTrilha() {
  if (Sons.trilhaAtual) Sons.trilhaAtual.pause();
}

function resumirTrilha() {
  if (Sons.trilhaAtual) Sons.trilhaAtual.play().catch(() => {});
}

// --------------------
// FUNÇÕES DE EFEITOS (ONE-SHOT)
// --------------------
function tocarEfeito(nome, volume = 0.5) {
  const caminho = Sons.efeitos[nome];
  if (!caminho) return;
  const som = new Audio(caminho);
  som.volume = volume;
  som.play().catch(() => {});
}

// --------------------
// FUNÇÕES DE LOOP (CONTÍNUOS) - NOVO
// --------------------
function iniciarLoop(nome, volume = 0.5) {
  // Se já estiver tocando, ignora pra não encavalar
  if (Sons.loopsAtivos[nome]) return;

  const caminho = Sons.efeitos[nome];
  if (!caminho) {
    console.warn(
      `Som de loop "${nome}" não encontrado. Verifique a lista Sons.efeitos.`
    );
    return;
  }

  const audio = new Audio(caminho);
  audio.loop = true; // Faz repetir infinitamente
  audio.volume = volume;

  audio.play().catch((e) => {
    console.log("Autoplay bloqueado ou erro no loop:", e);
  });

  Sons.loopsAtivos[nome] = audio;
}

function pararLoop(nome) {
  const audio = Sons.loopsAtivos[nome];
  if (audio) {
    audio.pause();
    audio.currentTime = 0; // Volta pro início
    delete Sons.loopsAtivos[nome]; // Remove da lista de ativos
  }
}

// --------------------
// OVERLAY PARA AUTOPLAY (mantido como fallback visual, mas raramente usado agora)
// --------------------
function mostrarOverlayParaLiberarAudio(trilha) {
  // Não mostra mais o overlay - o sistema automático cuida disso
  // Mantido apenas para compatibilidade caso alguém chame diretamente
  trilhaPendente = trilha;
}

// --------------------
// BOTÃO DE PAUSA/PLAY COM ÍCONE (PERSISTENTE)
// --------------------
function criarBotaoMusica() {
  const btn = document.createElement("div");
  btn.id = "btn-musica";
  btn.innerText = musicaMutada ? "🔇" : "🎵";
  Object.assign(btn.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    width: "40px",
    height: "40px",
    background: musicaMutada ? "rgba(43, 193, 238, 1)" : "rgba(0,0,0,0.6)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 9999,
    fontSize: "20px",
    userSelect: "none",
  });

  btn.addEventListener("click", () => {
    musicaMutada = !musicaMutada;
    localStorage.setItem("musicaMutada", musicaMutada);

    if (musicaMutada) {
      pausarTrilha();
      btn.innerText = "🔇";
      btn.style.background = "rgba(43, 193, 238, 1)";
    } else {
      // Tenta tocar a trilha atual ou pendente
      if (Sons.trilhaAtual) {
        resumirTrilha();
      } else if (trilhaPendente) {
        tocarTrilha(trilhaPendente);
      }
      btn.innerText = "🎵";
      btn.style.background = "rgba(0,0,0,0.6)";
    }
  });

  document.body.appendChild(btn);
}

// --------------------
// INICIALIZAÇÃO
// --------------------
window.addEventListener("load", () => {
  // Se quiser iniciar uma trilha logo de cara, descomente abaixo:
  // tocarTrilha('cidade');

  criarBotaoMusica();
});

// Exemplo de uso existente
const vitoriaBtn = document.getElementById("vitoriaBtn");
if (vitoriaBtn) {
  vitoriaBtn.addEventListener("click", () => {
    tocarEfeito("whoosh", 0.5);
  });
}
