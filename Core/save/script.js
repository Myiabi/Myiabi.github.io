// ======================================================
// SISTEMA GLOBAL: SAVE + ACHIEVEMENTS + PROXY HÍBRIDO
// ======================================================

// ---------------------------
// 🧠 1. DADOS PADRÃO DO JOGO
// ---------------------------
const defaultData = {
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false,

  dialogos: { aiko: "introducao", czar: "inicio" },
  mesas: { 1: false, 2: false, 3: false, 4: false },

  // --- SISTEMA DA INCUBADORA ---
  incubadora: {
    hasJelly: false,
    hasRainha: false,
    hasMateria: false,
  },
  myoLiberado: false, // Trava do criador

  // --- VARIÁVEIS VISUAIS GERAIS (SOL/LUA/PEDRA) ---
  visualState: {
    
  },

  jardimCompleto: false,
  itensJardim: {},
  customCharacter: null,
  unlockedAchievements: {},
};

const SAVE_KEY = "meuSaveDoJogo";

// ---------------------------
// 💾 2. FUNÇÕES DE SAVE/LOAD
// ---------------------------
function salvarJogo() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
    // console.log("💾 Auto-save...");
  } catch (e) {
    console.error("Erro ao salvar:", e);
  }
}

function carregarJogo() {
  const data = localStorage.getItem(SAVE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Garante que variáveis novas existam no save antigo (Merge)
      const merged = Object.assign({}, defaultData, parsed);
      // Garante profundidade do objeto incubadora
      merged.incubadora = {
        ...defaultData.incubadora,
        ...(parsed.incubadora || {}),
      };
      return merged;
    } catch (e) {
      console.error("Erro load:", e);
      return JSON.parse(JSON.stringify(defaultData));
    }
  }
  return JSON.parse(JSON.stringify(defaultData));
}

function apagarSave() {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
}

// ---------------------------
// 👁️ 3. SISTEMA VISUAL UNIFICADO (O CÉREBRO VISUAL)
// ---------------------------
function aplicarMudancaVisual(prop, value) {
  // Elementos Genéricos
  const npc1 = document.getElementById("npc1");
  const porta = document.getElementById("porta");
  const boss = document.getElementById("boss");
  const rigelon = document.getElementById("rigelon");
  const kofongoon = document.getElementById("kofongoon");
  const cobra4 = document.getElementById("cobra4");
  const box = document.getElementById("box");



  switch (prop) {
    // --- VISUAIS GERAIS ---
    case "npc1Visivel":
      if (npc1) npc1.style.display = value ? "block" : "none";
      break;
    case "portaAberta":
      if (porta)
        porta.style.transform = value ? "rotateY(90deg)" : "rotateY(0deg)";
      break;
    case "bossDerrotado":
      if (boss) boss.style.filter = value ? "grayscale(1)" : "none";
      break;
    case "rigelVisivel":
      if (rigelon) rigelon.style.display = value ? "block" : "none";
      break;
    case "kofongoVisivel":
      if (kofongoon) kofongoon.style.display = value ? "block" : "none";
      break;
    case "aldebaranVisivel":
      if (aldebaran) pollux.style.display = value ? "block" : "none";
      break;
    case "capellaVisivel":
      if (capella) pollux.style.display = value ? "block" : "none";
      break;
    case "polluxVisivel":
      if (pollux) pollux.style.display = value ? "block" : "none";
      break;
    case "siriusVisivel":
      if (pollux) pollux.style.display = value ? "block" : "none";
      break;
    case "boxSumiu":
      if (box) {
        box.style.display = value ? "none" : "block";
        if (value) box.classList.add("hidden");
      }
      break;
    case "cobraSumiu":
      if (cobra4) {
        cobra4.style.display = value ? "none" : "block";
        if (value) cobra4.classList.add("hidden");
      }
      break;

  }
}

// Helper para liberar o Myo automaticamente
function checkIncubadoraCompleta() {
  const i = gameData.incubadora;
  if (i.hasJelly && i.hasRainha && i.hasMateria && !gameData.myoLiberado) {
    console.log("⚡ Todos ingredientes reunidos! Liberando Myo...");
    gameData.myoLiberado = true; // O Proxy vai capturar isso e salvar
  }
}

// ---------------------------
// 🤖 4. PROXY INTELIGENTE (O CORAÇÃO)
// ---------------------------
function criarProxy(obj, caminho = []) {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (target[prop] === value) return true;

      const fullPath = [...caminho, prop];

      // Define o valor (Recursivo se for objeto)
      target[prop] =
        value && typeof value === "object" && !Array.isArray(value)
          ? criarProxy(value, fullPath)
          : value;

      // 1. Auto-Save
      salvarJogo();

      // 2. Checa Achievements
      checkAchievements(gameData);

      // 3. REATIVIDADE VISUAL (A Mágica)
      // Se mudou algo no visualState...
      if (fullPath[0] === "visualState") {
        aplicarMudancaVisual(prop, value);
      }
      // ... OU se mudou algo na incubadora (Isso é o que você queria!)
      else if (fullPath[0] === "incubadora") {
        aplicarMudancaVisual(prop, value);
      }
      // ... OU se mudou a trava do Myo
      else if (prop === "myoLiberado") {
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
    },
  });
}

// Inicializa o gameData com o Proxy
const loadedData = carregarJogo();
let gameData = criarProxy(loadedData);

// ---------------------------
// 🏆 5. SISTEMA DE ACHIEVEMENTS
// ---------------------------
// (Seu código original de achievements, mantido idêntico para não quebrar)
let achievementsContainer = document.getElementById("achievements-container");
if (!achievementsContainer) {
  achievementsContainer = document.createElement("div");
  achievementsContainer.id = "achievements-container";
  document.documentElement.appendChild(achievementsContainer);
  // ... estilos ...
  Object.assign(achievementsContainer.style, {
    position: "fixed",
    bottom: "1rem",
    right: "1rem",
    display: "flex",
    flexDirection: "column-reverse",
    gap: "0.5rem",
    zIndex: "9999999",
    pointerEvents: "none",
    transformOrigin: "top left",
    transition: "transform 0.3s ease",
  });
  // ... rotação ...
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
  // ... (Mantive sua função de criação de HTML do achievement intacta para economizar espaço,
  // mas ela deve estar aqui igual ao seu código original) ...
  const ach = document.createElement("div");
  ach.className = "achievement";
  ach.innerHTML = `<img src="${iconUrl}" alt="icon"><div class="text"><div class="title">${title}</div><div class="desc">${desc}</div></div>`;
  // Estilos inline básicos para garantir funcionamento
  Object.assign(ach.style, {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    background: "rgba(44, 47, 51, 0.95)",
    color: "white",
    padding: "0.75rem 1rem",
    borderRadius: "0.6rem",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    fontFamily: "Segoe UI, sans-serif",
    fontSize: "14px",
    transform: "translateY(120%)",
    opacity: "0",
    transition: "transform 0.4s ease, opacity 0.4s ease",
    pointerEvents: "auto",
    marginBottom: "10px",
  });
  const img = ach.querySelector("img");
  img.style.width = "48px";
  img.style.height = "48px";
  achievementsContainer.appendChild(ach);
  audioVitoria.currentTime = 0;
  audioVitoria.play().catch(() => {});
  setTimeout(() => {
    ach.style.transform = "translateY(0)";
    ach.style.opacity = "1";
  }, 50);
  setTimeout(() => {
    ach.style.transform = "translateY(120%)";
    ach.style.opacity = "0";
    setTimeout(() => achievementsContainer.removeChild(ach), 500);
  }, 3000);
}

const secretAchievements = [
  {
    id: "itemMoeda",
    title: "Tesouro!",
    desc: "Você pegou a moeda!",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    unlocked: false,
    condition: (gs) => gs.itemMoeda,
  },
  {
    id: "salaSecreta",
    title: "Segredo Revelado!",
    desc: "Você descobriu a sala secreta!",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    unlocked: false,
    condition: (gs) => gs.salaSecreta,
  },
  {
    id: "minigameWon",
    title: "Campeão!",
    desc: "Você venceu o minigame!",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png",
    unlocked: false,
    condition: (gs) => gs.minigameWon,
  },
];

function checkAchievements(gs) {
  secretAchievements.forEach((ach) => {
    const alreadyUnlocked = gs.unlockedAchievements?.[ach.id];
    if (!ach.unlocked && !alreadyUnlocked && ach.condition(gs)) {
      ach.unlocked = true;
      gs.unlockedAchievements[ach.id] = true;
      salvarJogo(); // Salva o achievement desbloqueado
      showAchievement({
        title: ach.title,
        desc: ach.desc,
        iconUrl: ach.iconUrl,
      });
    }
  });
}

// ---------------------------
// 🔁 6. SINCRONIZAÇÃO INICIAL (ON LOAD)
// ---------------------------
(function syncFromSave() {
  // 1. Achievements
  gameData.unlockedAchievements = gameData.unlockedAchievements || {};
  secretAchievements.forEach((ach) => {
    if (gameData.unlockedAchievements[ach.id]) ach.unlocked = true;
  });

  // 2. Visual State (Sol, Lua, Pedra, etc)
  if (gameData.visualState) {
    Object.entries(gameData.visualState).forEach(([prop, value]) => {
      aplicarMudancaVisual(prop, value);
    });
  }

  // 3. Incubadora (Itens e Myo) - NOVO!
  if (gameData.incubadora) {
    Object.entries(gameData.incubadora).forEach(([prop, value]) => {
      aplicarMudancaVisual(prop, value);
    });
  }
  aplicarMudancaVisual("myoLiberado", gameData.myoLiberado);
})();

// ---------------------------
// 🧩 7. API PARA CENÁRIOS: registrar defaults da cena
// ---------------------------
function registerSceneDefaults(sceneDefaults) {
  if (!sceneDefaults || typeof sceneDefaults !== "object") return;

  function mergeDefaults(target, defaults) {
    Object.keys(defaults).forEach((key) => {
      const def = defaults[key];
      if (def && typeof def === "object" && !Array.isArray(def)) {
        if (!target[key] || typeof target[key] !== "object") target[key] = {};
        mergeDefaults(target[key], def);
      } else {
        if (target[key] === undefined) target[key] = def;
      }
    });
  }

  mergeDefaults(gameData, sceneDefaults);

  // Reaplica visuais relevantes da cena
  if (gameData.visualState)
    Object.entries(gameData.visualState).forEach(([p, v]) =>
      aplicarMudancaVisual(p, v)
    );
  if (gameData.incubadora)
    Object.entries(gameData.incubadora).forEach(([p, v]) =>
      aplicarMudancaVisual(p, v)
    );
  aplicarMudancaVisual("myoLiberado", gameData.myoLiberado);

  // Persiste após mesclar defaults
  salvarJogo();
}

window.registerSceneDefaults = registerSceneDefaults;

// ---------------------------
// 🌍 EXPORTS GLOBAIS
// ---------------------------
function unlockAchievement(flagName) {
  gameData[flagName] = true; // O Proxy cuida do resto
}

window.gameData = gameData;
window.salvarJogo = salvarJogo;
window.apagarSave = apagarSave;
window.unlockAchievement = unlockAchievement;

// Debug: Função pra pegar tudo
window.debugGanharItens = function () {
  gameData.incubadora.hasJelly = true;
  gameData.incubadora.hasMateria = true;
  gameData.incubadora.hasRainha = true;
  console.log("✅ Itens ganhos! Verifique a incubadora.");
};
