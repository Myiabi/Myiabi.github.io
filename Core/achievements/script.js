// ------------------ script.js ------------------
const achievementsContainer = document.getElementById('achievements-container');

// Áudio único pra vitória
const audioVitoria = new Audio("/assets/sounds/efeitos/tuturu_1.mp3");

// Função para mostrar popup
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
  achievementsContainer.appendChild(ach);

  // Toca o som só uma vez
  audioVitoria.currentTime = 0;
  audioVitoria.play().catch(()=>{}); 

  setTimeout(() => ach.classList.add('show'), 50);
  setTimeout(() => {
    ach.classList.remove('show');
    setTimeout(() => achievementsContainer.removeChild(ach), 500);
  }, 3000);
}

// Estado do jogo
const gameState = {
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false
};

// Lista de achievements
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

// Proxy para gameState
const proxiedGameState = new Proxy(gameState, {
  set(target, prop, value) {
    target[prop] = value;
    checkAchievements(proxiedGameState);
    return true;
  }
});

// Checa achievements
function checkAchievements(gs) {
  secretAchievements.forEach(ach => {
    if (!ach.unlocked && ach.condition(gs)) {
      ach.unlocked = true;
      showAchievement({
        title: ach.title,
        desc: ach.desc,
        iconUrl: ach.iconUrl
      });
    }
  });
}

// Função única para desbloquear qualquer achievement
function unlockAchievement(flagName) {
  proxiedGameState[flagName] = true;
}

// ------------------ tornar global ------------------
window.unlockAchievement = unlockAchievement;

