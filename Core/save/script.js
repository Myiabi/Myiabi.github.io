// ======================================================
// SISTEMA GLOBAL DE SAVE + ACHIEVEMENTS (FUSIONADO)
// ======================================================

// ---------------------------
// 🧠 DADOS PADRÃO DO JOGO
// ---------------------------
const defaultData = {
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false,

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

// ✅ cria container global
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
  });
}

// 🔊 som de conquista
const audioVitoria = new Audio("/assets/sounds/efeitos/whooshfogo.mp3");

// ✅ Função popup visual
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

  // toca o som
  audioVitoria.currentTime = 0;
  audioVitoria.play().catch(() => {});

  // animação
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

// ---------------------------
// 🎯 LISTA DE ACHIEVEMENTS
// ---------------------------
const secretAchievements = [
  {
    id: 'itemMoeda',
    title: 'Tesouro!',
    desc: 'Você pegou a moeda!',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    unlocked: false,
    condition: gs => gs.itemMoeda
  },
  {
    id: 'salaSecreta',
    title: 'Segredo Revelado!',
    desc: 'Você descobriu a sala secreta!',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    unlocked: false,
    condition: gs => gs.salaSecreta
  },
  {
    id: 'minigameWon',
    title: 'Campeão!',
    desc: 'Você venceu o minigame!',
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    unlocked: false,
    condition: gs => gs.minigameWon
  }
];

// ---------------------------
// 🔍 PROXY COM AUTO-SAVE
// ---------------------------
gameData = new Proxy(loadedData, {
  set(target, prop, value) {
    if (target[prop] === value) return true;
    target[prop] = value;
    salvarJogo(); // auto-save em qualquer mudança
    checkAchievements(gameData);
    return true;
  }
});

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
      showAchievement({
        title: ach.title,
        desc: ach.desc,
        iconUrl: ach.iconUrl
      });
    }
  });
}

// ---------------------------
// 🔁 SINCRONIZAÇÃO INICIAL
// ---------------------------
(function syncAchievementsFromSave() {
  gameData.unlockedAchievements = gameData.unlockedAchievements || {};

  secretAchievements.forEach(ach => {
    if (gameData.unlockedAchievements[ach.id]) {
      ach.unlocked = true;
    }
  });
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
