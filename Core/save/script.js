// ======================================================
// SISTEMA GLOBAL DE SAVE + ACHIEVEMENTS + VISUAL STATE
// ======================================================

// ---------------------------
// 🧠 DADOS PADRÃO DO JOGO
// ---------------------------
const defaultData = {
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false,

  // 🆕 Variáveis gerais do jogo
  dialogos: {
    aiko: "introducao",
    czar: "inicio"
  },

  // 🆕 Controle visual de elementos (exemplo)
  visualState: {
    npc1Visivel: true,
    portaAberta: false,
    bossDerrotado: false,
  },

  mesas: {
  1: false,
  2: false,
  3: false,
  4: false
},

visualState: {}, // Variaveis do SOl & LUA 

// --- ADICIONE ESTAS DUAS LINHAS: ---
  jardimCompleto: false, // Trava o minigame se vencer
  itensJardim: {},       // Salva cada item individualmente
  // -----------------------------------


  // achievements já desbloqueados (persistente)
  unlockedAchievements: {}
};

const SAVE_KEY = "meuSaveDoJogo";

// ---------------------------
// 💾 FUNÇÕES DE SAVE
// ---------------------------
function salvarJogo() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
    console.log("💾 Jogo salvo com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar:", e);
  }
}

function carregarJogo() {
  const data = localStorage.getItem(SAVE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      console.log("✅ Save carregado com sucesso!");
      return Object.assign({}, defaultData, parsed);
    } catch (e) {
      console.error("Erro ao carregar save:", e);
      return { ...defaultData };
    }
  } else {
    console.log("⚠️ Nenhum save encontrado, iniciando novo jogo.");
    return { ...defaultData };
  }
}

function apagarSave() {
  localStorage.removeItem(SAVE_KEY);
  console.log("🗑️ Save apagado.");
}

// ---------------------------
// 📦 INICIALIZAÇÃO DO GAMESTATE
// ---------------------------
const loadedData = carregarJogo();
let gameData;

// ---------------------------
// 🏆 SISTEMA DE ACHIEVEMENTS
// ---------------------------
let achievementsContainer = document.getElementById('achievements-container');
if (!achievementsContainer) {
  achievementsContainer = document.createElement('div');
  achievementsContainer.id = 'achievements-container';
  document.documentElement.appendChild(achievementsContainer);

  Object.assign(achievementsContainer.style, {
    position: 'fixed',
    bottom: '1rem',
    right: '1rem',
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: '0.5rem',
    zIndex: '9999999',
    pointerEvents: 'none',
    transformOrigin: 'top left',
    transition: 'transform 0.3s ease',
  });

  // 🌀 Faz o achievements girar junto com o resto do jogo
  function aplicarRotacaoAchievements() {
    const portrait = window.matchMedia("(orientation: portrait)").matches;
    if (portrait) {
      achievementsContainer.style.transform =
        "rotate(-90deg) translate(-30vh, 75vw)";
      achievementsContainer.style.bottom = "auto";
      achievementsContainer.style.right = "auto";
      achievementsContainer.style.left = "1rem";
      achievementsContainer.style.top = "1rem";
    } else {
      achievementsContainer.style.transform = "none";
      achievementsContainer.style.left = "auto";
      achievementsContainer.style.top = "auto";
      achievementsContainer.style.bottom = "1rem";
      achievementsContainer.style.right = "1rem";
    }
  }

  window.addEventListener("orientationchange", aplicarRotacaoAchievements);
  window.addEventListener("resize", aplicarRotacaoAchievements);
  aplicarRotacaoAchievements();
}

const audioVitoria = new Audio("/assets/sounds/efeitos/whooshfogo.mp3");

function showAchievement({ title, desc, iconUrl }) {
  const ach = document.createElement('div');
  ach.className = 'achievement';
  ach.innerHTML = `
    <img src="${iconUrl}" alt="icon">
    <div class="text">
      <div class="title">${title}</div>
      <div class="desc">${desc}</div>
    </div>
  `;
  Object.assign(ach.style, {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '0.75rem',
    background: 'rgba(44, 47, 51, 0.95)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.6rem',
    minWidth: '220px',
    maxWidth: '300px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontSize: '14px',
    transform: 'translateY(120%)',
    opacity: '0',
    transition: 'transform 0.4s ease, opacity 0.4s ease',
    pointerEvents: 'auto',
  });
  const img = ach.querySelector('img');
  Object.assign(img.style, {
    width: '48px',
    height: '48px',
    objectFit: 'contain',
    borderRadius: '8px',
    flexShrink: '0',
  });
  const text = ach.querySelector('.text');
  Object.assign(text.style, {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  });
  const titleEl = ach.querySelector('.title');
  Object.assign(titleEl.style, {
    fontWeight: '700',
    fontSize: '1rem',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });
  const descEl = ach.querySelector('.desc');
  Object.assign(descEl.style, {
    fontSize: '0.85rem',
    opacity: '0.8',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });
  achievementsContainer.appendChild(ach);
  audioVitoria.currentTime = 0;
  audioVitoria.play().catch(() => {});
  setTimeout(() => {
    ach.style.transform = 'translateY(0)';
    ach.style.opacity = '1';
  }, 50);
  setTimeout(() => {
    ach.style.transform = 'translateY(120%)';
    ach.style.opacity = '0';
    setTimeout(() => achievementsContainer.removeChild(ach), 500);
  }, 3000);
}

const secretAchievements = [
  { id: 'itemMoeda', title: 'Tesouro!', desc: 'Você pegou a moeda!', iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', unlocked: false, condition: gs => gs.itemMoeda },
  { id: 'salaSecreta', title: 'Segredo Revelado!', desc: 'Você descobriu a sala secreta!', iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', unlocked: false, condition: gs => gs.salaSecreta },
  { id: 'minigameWon', title: 'Campeão!', desc: 'Você venceu o minigame!', iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', unlocked: false, condition: gs => gs.minigameWon }
];

// ---------------------------
// 🧱 FUNÇÃO DE APLICAÇÃO VISUAL (NOVO)
// ---------------------------
function aplicarMudancaVisual(prop, value) {
  const npc1 = document.getElementById("npc1");
  const porta = document.getElementById("porta");
  const boss = document.getElementById("boss");
  const rigelon = document.getElementById("rigelon");

  switch (prop) {
    case "npc1Visivel":
      if (npc1) npc1.style.display = value ? "block" : "none";
      break;

    case "portaAberta":
      if (porta) porta.style.transform = value ? "rotateY(90deg)" : "rotateY(0deg)";
      break;

    case "bossDerrotado":
      if (boss) boss.style.filter = value ? "grayscale(1)" : "none";
      break;

      case "rigelVisivel": 
            // 🎯 CORREÇÃO DE LÓGICA: Se value é TRUE, o display é "block" (visível)
            if (rigelon) rigelon.style.display = value ? "block" : "none";
            break;
  }
}

// ---------------------------
// 🧠 FUNÇÃO RECURSIVA DE PROXY (atualizada)
// ---------------------------
function criarProxy(obj, caminho = []) {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (target[prop] === value) return true;

      const fullPath = [...caminho, prop];
      target[prop] = (value && typeof value === "object" && !Array.isArray(value))
        ? criarProxy(value, fullPath)
        : value;

      // auto-save e checagem de achievements
      salvarJogo();
      checkAchievements(gameData);

      // 🆕 aplica mudança visual automaticamente se estiver em visualState
      if (fullPath[0] === "visualState") {
        aplicarMudancaVisual(prop, value);
      }

      return true;
    },
    get(target, prop) {
      const value = target[prop];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        return criarProxy(value, [...caminho, prop]);
      }
      return value;
    }
  });
}

// ---------------------------
// 🔍 PROXY COM AUTO-SAVE
// ---------------------------
gameData = criarProxy(loadedData);

// ---------------------------
// 🧩 VERIFICAÇÃO DE ACHIEVEMENTS
// ---------------------------
function checkAchievements(gs) {
  secretAchievements.forEach(ach => {
    const alreadyUnlocked = gs.unlockedAchievements?.[ach.id];
    if (!ach.unlocked && !alreadyUnlocked && ach.condition(gs)) {
      ach.unlocked = true;
      gs.unlockedAchievements[ach.id] = true;
      salvarJogo();
      showAchievement({ title: ach.title, desc: ach.desc, iconUrl: ach.iconUrl });
    }
  });
}

// ---------------------------
// 🔁 SINCRONIZAÇÃO INICIAL (reaplica visuais)
// ---------------------------
(function syncFromSave() {
  gameData.unlockedAchievements = gameData.unlockedAchievements || {};
  secretAchievements.forEach(ach => {
    if (gameData.unlockedAchievements[ach.id]) ach.unlocked = true;
  });

  // 🆕 aplica o estado visual salvo
  if (gameData.visualState) {
    Object.entries(gameData.visualState).forEach(([prop, value]) => {
      aplicarMudancaVisual(prop, value);
    });
  }
})();

// ---------------------------
// 🌍 API GLOBAL
// ---------------------------
function unlockAchievement(flagName) {
  gameData[flagName] = true;
  const ach = secretAchievements.find(a => a.id === flagName);
  if (ach && !ach.unlocked) {
    ach.unlocked = true;
    gameData.unlockedAchievements[ach.id] = true;
    salvarJogo();
    showAchievement({ title: ach.title, desc: ach.desc, iconUrl: ach.iconUrl });
  }
}

window.gameData = gameData;
window.salvarJogo = salvarJogo;
window.apagarSave = apagarSave;
window.unlockAchievement = unlockAchievement;

// ======================================================
// FIM DO SISTEMA
// ======================================================

