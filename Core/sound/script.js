// --------------------
// GERENCIADOR DE SONS COM BOTÃO DE ÍCONE + LOOPS
// --------------------
let trilhaPendente = null; // Guarda qual trilha deve tocar após interação
let audioLiberado = false; // Flag pra saber se já liberou
let musicaMutada = localStorage.getItem("musicaMutada") === "true"; // Estado persistente
let volumeMusica = parseFloat(localStorage.getItem("volumeMusica")) || 0.3; // Volume persistente (0-1)
let volumeEfeitos = parseFloat(localStorage.getItem("volumeEfeitos")) || 0.5; // Volume persistente (0-1)

const VOLUME_PADRAO = volumeMusica; // Volume padrão das músicas

const Sons = {
  trilhas: {
    city: new Audio("/assets/sounds/trilhas/city.mp3"),
    templo: new Audio("/assets/sounds/trilhas/templo.mp3"),
    boss: new Audio("/assets/sounds/trilhas/boss.mp3"),
    intro: new Audio("/assets/sounds/trilhas/intro.mp3"),
    market: new Audio("/assets/sounds/trilhas/market.mp3"),
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
function tocarEfeito(nome, volume = null) {
  const caminho = Sons.efeitos[nome];
  if (!caminho) return;
  const som = new Audio(caminho);
  // Se não especificar volume, usa o volume de efeitos global
  som.volume = volume !== null ? volume : volumeEfeitos;
  som.play().catch(() => {});
}

// --------------------
// FUNÇÕES DE LOOP (CONTÍNUOS) - NOVO
// --------------------
function iniciarLoop(nome, volume = null) {
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
  // Se não especificar volume, usa o volume de efeitos global
  audio.volume = volume !== null ? volume : volumeEfeitos;

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
// FUNÇÕES DE CONTROLE DE VOLUME
// --------------------
function setVolumeMusica(novoVolume) {
  volumeMusica = Math.max(0, Math.min(1, novoVolume)); // Clamp 0-1
  localStorage.setItem("volumeMusica", volumeMusica);

  // Aplica a todos os elementos de áudio de trilhas
  for (let key in Sons.trilhas) {
    Sons.trilhas[key].volume = musicaMutada ? 0 : volumeMusica;
  }

  // Atualiza o slider visual se existir
  const slider = document.getElementById("volumeMusicaSlider");
  if (slider) slider.value = volumeMusica * 100;

  console.log(`🔊 Volume de música: ${(volumeMusica * 100).toFixed(0)}%`);
}

function setVolumeEfeitos(novoVolume) {
  volumeEfeitos = Math.max(0, Math.min(1, novoVolume)); // Clamp 0-1
  localStorage.setItem("volumeEfeitos", volumeEfeitos);

  // Aplica a todos os loops ativos
  for (let key in Sons.loopsAtivos) {
    Sons.loopsAtivos[key].volume = volumeEfeitos;
  }

  // Atualiza o slider visual se existir
  const slider = document.getElementById("volumeEfeitosSlider");
  if (slider) slider.value = volumeEfeitos * 100;

  console.log(`🔊 Volume de efeitos: ${(volumeEfeitos * 100).toFixed(0)}%`);
}

// Aplica volume inicial
for (let key in Sons.trilhas) {
  Sons.trilhas[key].volume = volumeMusica;
}

// --------------------
// PAINEL DE CONTROLE DE VOLUME (RETRÁTIL)
// --------------------
function criarPainelVolume() {
  // Cria o ícone de som (botão toggle)
  const botaoMusica = document.createElement("div");
  botaoMusica.id = "btn-musica";
  botaoMusica.innerText = musicaMutada ? "🔇" : "🎵";
  Object.assign(botaoMusica.style, {
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
    zIndex: 10000,
    fontSize: "20px",
    userSelect: "none",
    transition: "all 0.3s ease",
  });

  // Cria o painel (inicialmente oculto)
  const painel = document.createElement("div");
  painel.id = "painel-volume";
  painel.style.display = "none"; // Começa oculto
  Object.assign(painel.style, {
    position: "fixed",
    top: "60px",
    right: "10px",
    background: "rgba(0, 0, 0, 0.9)",
    padding: "15px",
    borderRadius: "10px",
    zIndex: 9999,
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    minWidth: "220px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
    animation: "slideDown 0.3s ease",
  });

  painel.innerHTML = `
    <div style="margin-bottom: 12px; font-weight: bold;">🔊 Volume</div>
    
    <div style="margin-bottom: 10px;">
      <label for="volumeMusicaSlider" style="display: block; font-size: 12px; margin-bottom: 5px;">Música: <span id="textoMusica">30</span>%</label>
      <input 
        type="range" 
        id="volumeMusicaSlider" 
        min="0" 
        max="100" 
        value="${volumeMusica * 100}" 
        style="width: 100%; cursor: pointer;"
      />
    </div>

    <div style="margin-bottom: 10px;">
      <label for="volumeEfeitosSlider" style="display: block; font-size: 12px; margin-bottom: 5px;">Efeitos: <span id="textoEfeitos">50</span>%</label>
      <input 
        type="range" 
        id="volumeEfeitosSlider" 
        min="0" 
        max="100" 
        value="${volumeEfeitos * 100}" 
        style="width: 100%; cursor: pointer;"
      />
    </div>

    <div style="text-align: center;">
      <button id="btnMutarMusica" style="
        padding: 6px 12px;
        background: ${musicaMutada ? "#2c3e50" : "#27ae60"};
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
        width: 100%;
        transition: background 0.3s ease;
      ">
        ${musicaMutada ? "🔇 Mutar" : "🎵 Som ligado"}
      </button>
    </div>
  `;

  document.body.appendChild(botaoMusica);
  document.body.appendChild(painel);

  // Adiciona animação CSS se não existir
  if (!document.getElementById("anim-volume-style")) {
    const style = document.createElement("style");
    style.id = "anim-volume-style";
    style.innerText = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Toggle painel ao clicar no botão
  botaoMusica.addEventListener("click", (e) => {
    e.stopPropagation();
    const estaVisivel = painel.style.display === "block";
    painel.style.display = estaVisivel ? "none" : "block";
  });

  // Fecha o painel se clicar fora dele
  document.addEventListener("click", (e) => {
    if (e.target !== botaoMusica && !painel.contains(e.target)) {
      painel.style.display = "none";
    }
  });

  // Event listeners para sliders
  const sliderMusica = document.getElementById("volumeMusicaSlider");
  const sliderEfeitos = document.getElementById("volumeEfeitosSlider");
  const btnMutar = document.getElementById("btnMutarMusica");
  const textoMusica = document.getElementById("textoMusica");
  const textoEfeitos = document.getElementById("textoEfeitos");

  sliderMusica.addEventListener("input", (e) => {
    const valor = e.target.value / 100;
    setVolumeMusica(valor);
    textoMusica.innerText = Math.round(valor * 100);
  });

  sliderEfeitos.addEventListener("input", (e) => {
    const valor = e.target.value / 100;
    setVolumeEfeitos(valor);
    textoEfeitos.innerText = Math.round(valor * 100);
  });

  btnMutar.addEventListener("click", () => {
    musicaMutada = !musicaMutada;
    localStorage.setItem("musicaMutada", musicaMutada);

    if (musicaMutada) {
      pausarTrilha();
      btnMutar.innerText = "🔇 Mutar";
      btnMutar.style.background = "#2c3e50";
      botaoMusica.innerText = "🔇";
      botaoMusica.style.background = "rgba(43, 193, 238, 1)";
      // Define volume para 0 mas mantém o estado da música
      for (let key in Sons.trilhas) {
        Sons.trilhas[key].volume = 0;
      }
    } else {
      if (Sons.trilhaAtual) {
        resumirTrilha();
      } else if (trilhaPendente) {
        tocarTrilha(trilhaPendente);
      }
      btnMutar.innerText = "🎵 Som ligado";
      btnMutar.style.background = "#27ae60";
      botaoMusica.innerText = "🎵";
      botaoMusica.style.background = "rgba(0,0,0,0.6)";
      // Restaura o volume
      for (let key in Sons.trilhas) {
        Sons.trilhas[key].volume = volumeMusica;
      }
    }
  });
}

// --------------------
// BOTÃO DE PAUSA/PLAY COM ÍCONE (PERSISTENTE) - ANTIGO (MANTÉM COMPATIBILIDADE)
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

  // Cria o painel de volume (novo sistema) em vez do botão antigo
  criarPainelVolume();
});

// Exemplo de uso existente
const vitoriaBtn = document.getElementById("vitoriaBtn");
if (vitoriaBtn) {
  vitoriaBtn.addEventListener("click", () => {
    tocarEfeito("whoosh", 0.5);
  });
}
