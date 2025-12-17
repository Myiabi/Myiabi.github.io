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

  mesas: { 1: false, 2: false, 3: false, 4: false },

  // --- SISTEMA DA INCUBADORA (CAVERNA) ---
  incubadora: {
    hasJelly: false,
    hasRainha: false,
    hasMateria: false,
  },
  myoLiberado: false, // Define se o criador de personagem abre

  // Fishing System
  fishing: {
    inventory: [], // Histórico
    uniqueItems: {}, // Para o Clip: { 'Star Hair Clip': false }
    stats: {
      totalCatches: 0,
      legendaryCount: 0,
    },
    biggestFish: {
      name: "None",
      size: 0,
    },
  },

  // --- VARIÁVEIS VISUAIS GERAIS (SOL/LUA/PEDRA) ---
  visualState: {
    // Visuais globais e da caverna
    pedraResolvida: false,
    polluxVisivel: false,
    incubadoraLiberada: false,

    // Sol e Lua
    solON: false,
    luaON: false,

    puzzleBubbles_hour: false,
    puzzleBubbles_jelly: false,
    puzzleBubbles_heart: false,
    puzzleBubbles_complete: false,
  },

  jardimCompleto: false,
  itensJardim: {},
  customCharacter: null, // Onde o JSON do boneco final será salvo
  unlockedAchievements: {},

  npcApareceu: false,
  mint: false,
  cat: false,
  emperor: false,
  snakes: false,
};

const SAVE_KEY = "meuSaveDoJogo";

// ---------------------------
// 💾 2. FUNÇÕES DE SAVE/LOAD
// ---------------------------
function salvarJogo() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
  } catch (e) {
    console.error("Erro ao salvar:", e);
  }
}

function carregarJogo() {
  const data = localStorage.getItem(SAVE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      // Merge seguro para garantir que propriedades novas existam em saves velhos
      const merged = Object.assign({}, defaultData, parsed);

      merged.incubadora = {
        ...defaultData.incubadora,
        ...(parsed.incubadora || {}),
      };
      merged.visualState = {
        ...defaultData.visualState,
        ...(parsed.visualState || {}),
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
  // --- ELEMENTOS GERAIS (Jardim/Menu) ---
  const menu_lua = document.getElementById("item-lupa");
  const menu_sol = document.getElementById("item-fogo");
  const container = document.getElementById("menu-secundario");
  const cadeadoOFF = document.getElementById("locker");
  const myopic = document.getElementById("myopic");
  const estatua = document.getElementById("btn-open");

  // --- COBRINHAS ---- ///
  const cobra3 = document.getElementById("cobra3");
  const cobra4 = document.getElementById("cobra4");
  const cobra5 = document.getElementById("cobra5");
  const cobra6 = document.getElementById("cobra6");
  const box = document.getElementById("box");
  const pollux = document.getElementById("pollux");
  const rigelon = document.getElementById("rigelon");
  const kofongo = document.getElementById("kofongo");
  const sirius = document.getElementById("sirius");
  const capella = document.getElementById("capella");
  const aldebaran = document.getElementById("aldebaran");

  // --- ELEMENTOS ESPECÍFICOS DA CAVERNA ---
  const elMateria = document.getElementById("inc-materia");
  const elRainha = document.getElementById("inc-rainha");
  const elBase = document.getElementById("openCreatorBtn");
  const elWrapper = document.getElementById("incubadora-wrapper");
  const rock = document.getElementById("rock");
  const cobra1 = document.getElementById("cobra1");
  const cobra2 = document.getElementById("cobra2");
  const wendigo = document.getElementById("wendigo");

  // Notas da Caverna
  const noteMateria = document.getElementById("note-materia");
  const noteRainha = document.getElementById("note-rainha");
  const noteJelly = document.getElementById("note-jelly");

  // mesas
  const mesa1 = document.getElementById("table1");
  const mesa2 = document.getElementById("table2");
  const mesa3 = document.getElementById("table3");
  const mesa4 = document.getElementById("table4");

  const mint = document.getElementById("mint");
  const vara = document.getElementById("rodButton");
  const hole = document.getElementById("hole");

  // --- CITY ---
  const day25 = document.getElementById("day25");

  //--- FOREST ---- //
  const felicia = document.getElementById("felicia");
  const feliciabar = document.getElementById("felicia2");
  const ice = document.getElementById("iceBlock");

  switch (prop) {
    // ==================================
    // 1. VISUAIS ORIGINAIS
    // ==================================

    case "polluxVisivel":
      if (pollux) pollux.style.display = value ? "block" : "none";
      if (cobra1) cobra1.style.display = value ? "none" : "block";
      break;

    case "rigelVisivel":
      if (rigelon) rigelon.style.display = value ? "block" : "none";
      if (cobra2) cobra2.style.display = value ? "none" : "block";
      if (felicia) felicia.style.display = value ? "none" : "block";
      if (feliciabar) feliciabar.style.display = value ? "block" : "none";
      if (cobra3) cobra3.style.display = value ? "block" : "none";
      if (ice) ice.style.display = value ? "block" : "none";
      break;

    case "rigelGhost":
      if (cobra2) cobra2.style.display = value ? "block" : "none";
      break;

    case "kofongoVisivel":
      if (kofongo) kofongo.style.display = value ? "block" : "none";
      if (cobra4) cobra4.style.display = value ? "none" : "block";
      break;

    case "capellaVisivel":
      if (capella) capella.style.display = value ? "block" : "none";
      if (cobra5) cobra5.style.display = value ? "none" : "block";
      break;

    case "siriusVisivel":
      if (sirius) sirius.style.display = value ? "block" : "none";
      if (cobra3) cobra3.style.display = value ? "none" : "block";
      break;
    case "aldebaranVisivel":
      if (aldebaran) aldebaran.style.display = value ? "block" : "none";
      if (cobra6) cobra6.style.display = value ? "none" : "block";
      break;
  }

  // Verifica se TODOS os 7 personagens estão visíveis
  const todosVisiveis =
    gameData.visualState?.polluxVisivel &&
    gameData.visualState?.rigelVisivel &&
    gameData.visualState?.kofongoVisivel &&
    gameData.visualState?.capellaVisivel &&
    gameData.visualState?.siriusVisivel &&
    gameData.visualState?.aldebaranVisivel;

  if (todosVisiveis && !gameData.snakes) {
  gameData.snakes = true;
  if (window.personagens && personagens.nodata && personagens.marin) {
    mudarCenario(personagens.nodata, "segunda");
    mudarCenario(personagens.marin, "final");
  }
}


  switch (prop) {
    case "boxSumiu":
      if (box) {
        box.style.display = value ? "none" : "block";
        if (value) box.classList.add("hidden");
      }
      break;

    case "luaON":
      if (menu_lua) {
        menu_lua.style.display = value ? "block" : "none";
        const solVisivel =
          menu_sol && getComputedStyle(menu_sol).display !== "none";
        if (container)
          container.style.display = value || solVisivel ? "flex" : "none";
      }
      break;

    case "solON":
      if (menu_sol) {
        menu_sol.style.display = value ? "block" : "none";
        const luaVisivel =
          menu_lua && getComputedStyle(menu_lua).display !== "none";
        if (container)
          container.style.display = value || luaVisivel ? "flex" : "none";
      }
      break;

    case "minigame1":
      if (cadeadoOFF) {
        cadeadoOFF.parentElement.style.pointerEvents = value ? "none" : "auto";
        cadeadoOFF.parentElement.style.cursor = value ? "default" : "pointer";
      }
      if (myopic)
        myopic.src = value
          ? "/assets/img/NPC_Myopic2.png"
          : "/assets/img/NPC_Myopic1.png";
      break;

    case "minigame2":
      if (estatua) {
        estatua.style.pointerEvents = value ? "none" : "auto";
        estatua.style.cursor = value ? "default" : "pointer";
        if (window.personagens) {
          if (personagens.aiko) mudarCenario(personagens.aiko, "estatuaWon");
        }
      }
      break;

    case "minigame4":
      if (window.personagens) {
        if (personagens.wendigo) mudarCenario(personagens.wendigo, "segunda");
        if (personagens.lily) mudarCenario(personagens.lily, "jardim");
      }
      break;

    case "estatuasON":
      if (estatua) {
        estatua.style.pointerEvents = value ? "auto" : "none";
        estatua.style.cursor = value ? "pointer" : "default";
      }
      break;

    // ==================================
    // 2. NOVOS VISUAIS (CAVERNA)
    // ==================================

    // --- Itens da Incubadora ---
    case "hasMateria":
      if (elMateria) elMateria.style.display = value ? "block" : "none";
      if (noteMateria)
        value
          ? noteMateria.classList.add("checked")
          : noteMateria.classList.remove("checked");
      break;
    case "hasRainha":
      if (elRainha) elRainha.style.display = value ? "block" : "none";
      if (noteRainha)
        value
          ? noteRainha.classList.add("checked")
          : noteRainha.classList.remove("checked");
      break;
    case "hasJelly":
      if (elBase)
        elBase.src = value
          ? "/assets/img/Incubator-stage-only-honey.png"
          : "/assets/img/Incubator-stage0.png";
      if (noteJelly)
        value
          ? noteJelly.classList.add("checked")
          : noteJelly.classList.remove("checked");
      break;
  }

  // ============================================
  // 🥚 VERIFICA SE TODOS OS 3 ITENS DA INCUBADORA ESTÃO COMPLETOS
  // ============================================
  const incubadoraCompleta =
  gameData.incubadora?.hasMateria &&
  gameData.incubadora?.hasRainha &&
  gameData.incubadora?.hasJelly;

if (incubadoraCompleta && !gameData.myoLiberado) {
  // Só executa se ainda não liberou!
  mudarCenario(personagens.wendigo, "myo");
  window.gameData.myoLiberado = true;
}

  switch (prop) {
    // --- Estado da Incubadora / Myo ---
    case "myoLiberado":
      if (elWrapper) {
        elWrapper.style.pointerEvents = value ? "auto" : "none";
      }
      break;

    // --- Puzzle da Pedra e Cobra ---
    case "pedraResolvida":
      if (value === true) {
        if (rock) {
          rock.classList.add("rock-locked");
          rock.style.pointerEvents = "none";
          if (rock.style.left === "") {
            rock.style.transform = `translateX(8vw)`;
          }
        }
      }
      if (cobra1) cobra1.style.pointerEvents = value ? "auto" : "none";
      break;

    // --- Wendigo (Guardião) ---
    case "wendigoAparece":
      if (wendigo) wendigo.style.display = value ? "block" : "none";
      break;

    case "pedraLiberada":
      if (rock) rock.style.pointerEvents = value ? "auto" : "none";
      break;

    case "incLista":
      if (elWrapper) elWrapper.style.pointerEvents = value ? "auto" : "none";
      break;

    // mesas
    case "mesasON":
      if (mesa1) mesa1.style.pointerEvents = value ? "auto" : "none";
      if (mesa2) mesa2.style.pointerEvents = value ? "auto" : "none";
      if (mesa3) mesa3.style.pointerEvents = value ? "auto" : "none";
      if (mesa4) mesa4.style.pointerEvents = value ? "auto" : "none";
      break;

    // ghost
    case "mintVisivel":
      if (mint) mint.style.display = value ? "block" : "none";
      break;

    case "varaON":
      if (vara) vara.style.pointerEvents = value ? "auto" : "none";
      break;

    case "presilha":
      if (hole) hole.style.pointerEvents = value ? "auto" : "none";
      break;

    case "crabWin":
      if (cobra6) cobra6.style.pointerEvents = value ? "auto" : "none";
      break;

    case "postesAcesos":
      if (day25) {
        // Se value for true: vai pra posição nova
        // Se value for false: "" (string vazia) remove o estilo inline e o elemento volta pro lugar original do CSS
        day25.style.top = value ? "83%" : "";
        day25.style.left = value ? "45%" : "";
      }
      break;

    // --- PUZZLE DAS BOLHAS ---
    case "puzzleBubbles_hour":
    case "puzzleBubbles_jelly":
    case "puzzleBubbles_heart":
      // O nome da propriedade é "puzzleBubbles_hour", mas o ID do elemento é "hour"
      // Vamos pegar o sufixo (hour, jelly, heart)
      const idElemento = prop.split("_")[1];
      const elPuzzle = document.getElementById(idElemento);

      if (elPuzzle && value) {
        // Aplica o brilho permanente
        elPuzzle.classList.add("glow-effect");
        elPuzzle.style.filter = "drop-shadow(0 0 15px white) brightness(2)";
        elPuzzle.style.opacity = "1";
      }
      break;

    case "puzzleBubbles_complete":
      // Se completou, esconde tudo
      const pGrid =
        document.getElementById("grid-wrapper") ||
        document.getElementById("grid-container");
      const pCrab = document.getElementById("crab");
      const pHour = document.getElementById("hour");
      const pJelly = document.getElementById("jelly");
      const pHeart = document.getElementById("heart");

      if (value) {
        // Só aplica display:none se o elemento NÃO estiver animando
        // Elementos com classe 'animating-out' estão em fade/queda e não devem ser escondidos bruscamente
        if (pGrid && !pGrid.classList.contains("animating-out"))
          pGrid.style.display = "none";
        if (pCrab && !pCrab.classList.contains("animating-out"))
          pCrab.style.display = "none";
        if (pHour && !pHour.classList.contains("animating-out"))
          pHour.style.display = "none";
        if (pJelly && !pJelly.classList.contains("animating-out"))
          pJelly.style.display = "none";
        if (pHeart && !pHeart.classList.contains("animating-out"))
          pHeart.style.display = "none";
      }
      break;
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

      // Define valor (Recursivo)
      target[prop] =
        value && typeof value === "object" && !Array.isArray(value)
          ? criarProxy(value, fullPath)
          : value;

      // 1. Auto-Save
      salvarJogo();

      // 2. Achievements
      checkAchievements(gameData);

      // 3. REATIVIDADE VISUAL
      // Detecta onde foi a mudança para chamar o visualizador
      if (fullPath[0] === "visualState") {
        aplicarMudancaVisual(prop, value);
      } else if (fullPath[0] === "incubadora") {
        aplicarMudancaVisual(prop, value);
      } else if (prop === "myoLiberado") {
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

// Inicializa
const loadedData = carregarJogo();
let gameData = criarProxy(loadedData);

// ---------------------------
// 🏆 5. ACHIEVEMENTS (VISUAL STEAM + FILA ANTI-ERRO)
// ---------------------------

// 1. INJEÇÃO DE CSS (Visual Steam)
const styleSteam = document.createElement("style");
styleSteam.innerHTML = `
  .steam-achievement {
    display: flex;
    align-items: center;
    width: 300px;
    background: #1b2838; /* Fundo escuro azulado */
    color: #c7d5e0;
    font-family: Arial, Helvetica, sans-serif;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    border-radius: 0px; 
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    pointer-events: none; /* Permite clicar através do popup */
  }
  
  .steam-achievement::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%);
    pointer-events: none;
  }

  .steam-icon {
    width: 44px;
    height: 44px;
    margin-right: 12px;
    flex-shrink: 0;
    background: #000;
    border: 1px solid #3d4d5d;
  }
  
  .steam-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .steam-content {
    flex-grow: 1;
    z-index: 1;
  }

  .steam-title {
    font-size: 11px;
    font-weight: bold;
    color: #66c0f4; /* Azul Steam */
    text-transform: uppercase;
    margin-bottom: 2px;
    letter-spacing: 0.5px;
  }

  .steam-desc {
    font-size: 13px;
    color: #e1e1e1;
    line-height: 1.2;
  }
`;
document.head.appendChild(styleSteam);

// 2. CONTAINER (Persistente - sobrevive a mudanças de cenário)
let achievementsContainer = null;

function ensureAchievementContainer() {
  // Verifica se o container ainda existe no DOM
  achievementsContainer = document.getElementById("achievements-container");

  if (!achievementsContainer) {
    achievementsContainer = document.createElement("div");
    achievementsContainer.id = "achievements-container";

    Object.assign(achievementsContainer.style, {
      position: "fixed",
      bottom: "10px",
      right: "20px",
      display: "flex",
      flexDirection: "column-reverse",
      gap: "10px",
      zIndex: "9999999",
      pointerEvents: "none",
    });
  }

  // Sempre garante que está no body (mesmo se foi removido)
  if (!document.body.contains(achievementsContainer)) {
    document.body.appendChild(achievementsContainer);
  }

  return achievementsContainer;
}

// Garante que o container existe inicialmente
ensureAchievementContainer();

// 3. CONFIGURAÇÃO DE ÁUDIO E DADOS
const audioVitoria = new Audio("/assets/sounds/efeitos/steam.mp3");
audioVitoria.volume = 0.5;

const secretAchievements = [
  {
    id: "lastBoss",
    title: "Zere o jogo",
    desc: "Você derrotou o Imperador do Gelo",
    iconUrl: "/assets/img/boss.png",
    unlocked: false,
    condition: (gs) => gs.emperor,
  },
  {
    id: "gatoLendario",
    title: "Morto de fome",
    desc: "Alimente o gato com o peixe lendário",
    iconUrl: "/assets/img/fish.png",
    unlocked: false,
    condition: (gs) => gs.cat,
  },
  {
    id: "mintRevelado",
    title: "Achou!",
    desc: "Revele o fantasma de gelo",
    iconUrl: "/assets/img/ghost.png",
    unlocked: false,
    condition: (gs) => gs.mint,
  },
  {
    id: "allCobrinhas",
    title: "Hide and Seek",
    desc: "Você encontrou todas as cobrinhas escondidas",
    iconUrl: "/assets/img/snake.png",
    unlocked: false,
    condition: (gs) => gs.snakes,
  },
];

// --- 4. FILA DE ESPERA (COM TRAVA ANTI-DUPLO CLIQUE) ---
const QUEUE_KEY = "steam_ach_queue";
let isQueueProcessing = false; // <--- A TRAVA DE SEGURANÇA

// Renderiza visualmente (Com verificação se já existe na tela)
function renderAchievement(ach) {
  // 1. BLINDAGEM VISUAL: Se esse achievement já estiver na tela, aborta.
  if (document.querySelector(`.steam-achievement[data-id="${ach.id}"]`)) return;

  // Garante que o container existe no DOM
  const container = ensureAchievementContainer();

  // Cria o modal bloqueador (3 segundos)
  const overlay = document.createElement("div");
  overlay.id = "achievement-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    background: "transparent",
    zIndex: "9999998",
    pointerEvents: "all",
    cursor: "default",
  });
  document.body.appendChild(overlay);

  // Remove o overlay após 3 segundos
  setTimeout(() => {
    overlay.remove();
  }, 3000);

  const el = document.createElement("div");
  el.className = "steam-achievement";
  el.setAttribute("data-id", ach.id); // Marca o ID no HTML pra evitar duplicatas

  el.innerHTML = `
      <div class="steam-icon"><img src="${ach.iconUrl}"></div>
      <div class="steam-content">
          <div class="steam-title">${ach.title}</div>
          <div class="steam-desc">${ach.desc}</div> 
      </div>
    `;
  container.appendChild(el);

  // Tenta tocar som
  audioVitoria.currentTime = 0;
  audioVitoria.play().catch(() => {});

  // Animação Entrada/Saída
  requestAnimationFrame(() => {
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  });
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 500);
  }, 8000);
}

// Processa a fila
function processQueue() {
  // 2. BLINDAGEM LÓGICA: Se já tem um processo armado, NÃO arma outro.
  if (isQueueProcessing) return;

  // Verifica se tem algo na fila antes de travar
  const queueJson = localStorage.getItem(QUEUE_KEY);
  if (!queueJson) return;
  const queue = JSON.parse(queueJson);
  if (!Array.isArray(queue) || queue.length === 0) return;

  // Ativa a trava
  isQueueProcessing = true;

  // "ARMADILHA": Aguarda interação
  const trigger = () => {
    // Remove gatilhos
    document.removeEventListener("click", trigger, { capture: true });
    document.removeEventListener("touchstart", trigger, { capture: true });
    document.removeEventListener("keydown", trigger, { capture: true });

    // Ler a fila DE NOVO (Fresh) para garantir que pegamos tudo atualizado
    const freshQueue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");

    freshQueue.forEach((achId) => {
      const achData = secretAchievements.find((a) => a.id === achId);
      if (achData) renderAchievement(achData);
    });

    // Limpa a fila e solta a trava
    localStorage.removeItem(QUEUE_KEY);

    // Pequeno delay para liberar a trava, evitando spam de clique muito rápido
    setTimeout(() => {
      isQueueProcessing = false;
    }, 100);
  };

  // Adiciona gatilhos
  document.addEventListener("click", trigger, { capture: true, once: true });
  document.addEventListener("touchstart", trigger, {
    capture: true,
    once: true,
  });
  document.addEventListener("keydown", trigger, { capture: true, once: true });
}

// Função chamada pelo Proxy quando algo muda
function checkAchievements(gs) {
  let hasNew = false;
  let queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");

  secretAchievements.forEach((ach) => {
    const already = gs.unlockedAchievements?.[ach.id];

    // Se desbloqueou agora
    if (!ach.unlocked && !already && ach.condition(gs)) {
      ach.unlocked = true;
      gs.unlockedAchievements[ach.id] = true;

      // Adiciona na fila de espera (persiste mesmo se der refresh/redirect)
      if (!queue.includes(ach.id)) {
        queue.push(ach.id);
        hasNew = true;
      }
    }
  });

  if (hasNew) {
    salvarJogo();
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));

    // Chama o processador imediatamente (caso o usuário continue na mesma página)
    processQueue();
  }
}

// ---------------------------
// 🔁 6. SINCRONIZAÇÃO INICIAL (ON LOAD)
// ---------------------------
(function syncFromSave() {
  // Sync Achievements (Apenas estado interno)
  gameData.unlockedAchievements = gameData.unlockedAchievements || {};
  secretAchievements.forEach((ach) => {
    if (gameData.unlockedAchievements[ach.id]) ach.unlocked = true;
  });

  // Sync Visuais
  if (gameData.visualState) {
    Object.entries(gameData.visualState).forEach(([p, v]) =>
      aplicarMudancaVisual(p, v)
    );
  }
  if (gameData.incubadora) {
    Object.entries(gameData.incubadora).forEach(([p, v]) =>
      aplicarMudancaVisual(p, v)
    );
  }
  aplicarMudancaVisual("myoLiberado", gameData.myoLiberado);

  // VERIFICA SE FICOU PENDÊNCIA DA PÁGINA ANTERIOR
  processQueue();
})();

// ---------------------------
// 🌍 EXPORTS GLOBAIS
// ---------------------------
window.gameData = gameData;
window.salvarJogo = salvarJogo;
window.apagarSave = apagarSave;
window.unlockAchievement = (flag) => {
  gameData[flag] = true;
};

// Debug helper
window.debugCave = function () {
  console.log("🔓 Desbloqueando caverna para testes...");
  gameData.incubadora.hasJelly = true;
  gameData.incubadora.hasMateria = true;
  gameData.incubadora.hasRainha = true;
};
