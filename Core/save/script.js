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

  // Adicione ou atualize isso dentro do defaultData
  fishing: {
    inventory: [],      // Histórico
    uniqueItems: {},    // Para o Clip: { 'Star Hair Clip': false }
    stats: {
      totalCatches: 0,
      legendaryCount: 0
    },
    // AQUI ESTÁ O NOVO CAMPO DO RECORDE:
    biggestFish: {
      name: "None",
      size: 0
    }
  },

  // --- VARIÁVEIS VISUAIS GERAIS (SOL/LUA/PEDRA) ---
  visualState: {
    // Visuais globais e da caverna
    pedraResolvida: false,
    polluxVisivel: false,
    incubadoraLiberada: false
    
  },

  jardimCompleto: false,
  itensJardim: {},
  customCharacter: null, // Onde o JSON do boneco final será salvo
  unlockedAchievements: {},


  npcApareceu: false,
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
      
      merged.incubadora = { ...defaultData.incubadora, ...(parsed.incubadora || {}) };
      merged.visualState = { ...defaultData.visualState, ...(parsed.visualState || {}) };
      
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
  const box = document.getElementById("box");
  const pollux = document.getElementById("pollux");
  const rigelon = document.getElementById("rigelon");
  const kofongo = document.getElementById("kofongo");
  const sirius = document.getElementById("sirius")
  const capella = document.getElementById("capella")
  const aldebaran = document.getElementById("aldebaran")
  

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
    case "boxSumiu":
      if (box) {
        box.style.display = value ? "none" : "block";
        if (value) box.classList.add("hidden");
      }
      break;
      
    case "luaON":
      if (menu_lua) {
        menu_lua.style.display = value ? "block" : "none";
        // Lógica para mostrar container se Sol ou Lua estiverem ativos
        const solVisivel = menu_sol && getComputedStyle(menu_sol).display !== "none";
        if (container) container.style.display = (value || solVisivel) ? "flex" : "none";
      }
      break;
    case "solON":
      if (menu_sol) {
        menu_sol.style.display = value ? "block" : "none";
        const luaVisivel = menu_lua && getComputedStyle(menu_lua).display !== "none";
        if (container) container.style.display = (value || luaVisivel) ? "flex" : "none";
      }
      break;
    case "minigame1":
      if (cadeadoOFF) {
        cadeadoOFF.parentElement.style.pointerEvents = value ? "none" : "auto";
        cadeadoOFF.parentElement.style.cursor = value ? "default" : "pointer";
      }
      if (myopic) myopic.src = value ? "/assets/img/NPC_Myopic2.png" : "/assets/img/NPC_Myopic1.png";
      break;

    case "minigame2":
      // Verifica se estamos no templo (estátua existe)
      if (estatua) {
        estatua.style.pointerEvents = value ? "none" : "auto";
        estatua.style.cursor = value ? "default" : "pointer";

        // AGORA SIM: Protegido dentro do IF.
        // Só tenta mudar os personagens se estivermos no mapa certo.
        // Adicionei uma checagem extra pra garantir que 'personagens' já carregou
        if (window.personagens) {
            if (personagens.aiko) mudarCenario(personagens.aiko, 'estatuaWon');
        }
      }
      break;
    case "minigame4":
      
        if (window.personagens) {
            if (personagens.wendigo) mudarCenario(personagens.wendigo, 'segunda');
            if (personagens.lily) mudarCenario(personagens.lily, 'jardim');
        
      }

      break;
      case "estatuasON":
      if (estatua) {
        estatua.style.pointerEvents = value ? "auto" : "none";
        estatua.style.cursor = value ? "pointer" : "default";

      }  

    // ==================================
    // 2. NOVOS VISUAIS (CAVERNA)
    // ==================================
    
    // --- Itens da Incubadora ---
    case "hasMateria":
      if (elMateria) elMateria.style.display = value ? "block" : "none";
      if (noteMateria) value ? noteMateria.classList.add("checked") : noteMateria.classList.remove("checked");
      break;
    case "hasRainha":
      if (elRainha) elRainha.style.display = value ? "block" : "none";
      if (noteRainha) value ? noteRainha.classList.add("checked") : noteRainha.classList.remove("checked");
      break;
    case "hasJelly":
      if (elBase) elBase.src = value ? "/assets/img/Incubator-stage-only-honey.png" : "/assets/img/Incubator-stage0.png";
      if (noteJelly) value ? noteJelly.classList.add("checked") : noteJelly.classList.remove("checked");
      break;

    // --- Estado da Incubadora / Myo ---
    case "myoLiberado":
      // Se Myo nasceu, o cursor muda e podemos liberar interações extras
      if (elWrapper) {
          elWrapper.style.cursor = value ? "pointer" : "default";
      }
      break;



    // --- Puzzle da Pedra e Cobra ---
    case "pedraResolvida":
      if (value === true) {
        if (rock) {
          rock.classList.add("rock-locked");
          rock.style.pointerEvents = "none";
          // Força a posição final se o CSS ou JS local não pegou
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


      //mesas //

      case "mesasON":
      if (mesa1) mesa1.style.pointerEvents = value ? "auto" : "none";
      if (mesa2) mesa2.style.pointerEvents = value ? "auto" : "none";
      if (mesa3) mesa3.style.pointerEvents = value ? "auto" : "none";
      if (mesa4) mesa4.style.pointerEvents = value ? "auto" : "none";
      break;

      // ghost //

    case "mintVisivel":
      if (mint) mint.style.display = value ? "block" : "none";
      break;
      
    case "varaOn":
      if (vara) vara.style.display = value ? "block" : "none";
      break;

    case "buracoON":
      
      break;

    case "lendario":
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
      target[prop] = (value && typeof value === "object" && !Array.isArray(value))
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
      }
      else if (fullPath[0] === "incubadora") {
        aplicarMudancaVisual(prop, value);
      }
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

// Inicializa
const loadedData = carregarJogo();
let gameData = criarProxy(loadedData);

// ---------------------------
// 🏆 5. ACHIEVEMENTS
// ---------------------------
let achievementsContainer = document.getElementById("achievements-container");
if (!achievementsContainer) {
  achievementsContainer = document.createElement("div");
  achievementsContainer.id = "achievements-container";
  document.documentElement.appendChild(achievementsContainer);
  Object.assign(achievementsContainer.style, {
    position: "fixed", bottom: "1rem", right: "1rem", display: "flex", flexDirection: "column-reverse", gap: "0.5rem", zIndex: "9999999", pointerEvents: "none", transition: "transform 0.3s ease",
  });
  // Rotação para mobile/landscape
  const rotateAch = () => {
    if (window.matchMedia("(orientation: portrait)").matches) {
       achievementsContainer.style.transform = "rotate(-90deg) translate(-30vh, 75vw)";
    } else {
       achievementsContainer.style.transform = "none";
    }
  };
  window.addEventListener("resize", rotateAch);
  rotateAch();
}

const audioVitoria = new Audio("/assets/sounds/efeitos/whooshfogo.mp3");

function showAchievement({ title, desc, iconUrl }) {
  const ach = document.createElement("div");
  ach.className = "achievement";
  ach.innerHTML = `<img src="${iconUrl}" style="width:48px;height:48px"><div style="color:white;font-family:sans-serif"><div style="font-weight:bold">${title}</div><div style="font-size:0.9em">${desc}</div></div>`;
  Object.assign(ach.style, {
    display: "flex", alignItems: "center", gap: "10px", background: "rgba(44, 47, 51, 0.95)", padding: "10px", borderRadius: "8px", boxShadow: "0 4px 10px rgba(0,0,0,0.5)", transform: "translateY(120%)", opacity: "0", transition: "all 0.4s ease", pointerEvents: "auto"
  });
  achievementsContainer.appendChild(ach);
  audioVitoria.play().catch(()=>{});
  
  setTimeout(() => { ach.style.transform = "translateY(0)"; ach.style.opacity = "1"; }, 50);
  setTimeout(() => { ach.style.transform = "translateY(120%)"; ach.style.opacity = "0"; setTimeout(()=>ach.remove(), 500); }, 3000);
}

const secretAchievements = [
  { id: "itemMoeda", title: "Tesouro!", desc: "Você pegou a moeda!", iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", unlocked: false, condition: (gs) => gs.itemMoeda },
  { id: "salaSecreta", title: "Segredo Revelado!", desc: "Você descobriu a sala secreta!", iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", unlocked: false, condition: (gs) => gs.salaSecreta },
  { id: "minigameWon", title: "Campeão!", desc: "Você venceu o minigame!", iconUrl: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png", unlocked: false, condition: (gs) => gs.minigameWon },
];

function checkAchievements(gs) {
  secretAchievements.forEach((ach) => {
    const already = gs.unlockedAchievements?.[ach.id];
    if (!ach.unlocked && !already && ach.condition(gs)) {
      ach.unlocked = true;
      gs.unlockedAchievements[ach.id] = true;
      salvarJogo();
      showAchievement(ach);
    }
  });
}

// ---------------------------
// 🔁 6. SINCRONIZAÇÃO INICIAL (ON LOAD)
// ---------------------------
(function syncFromSave() {
  // Sync Achievements
  gameData.unlockedAchievements = gameData.unlockedAchievements || {};
  secretAchievements.forEach((ach) => { if (gameData.unlockedAchievements[ach.id]) ach.unlocked = true; });

  // Sync Visual State Geral + Caverna
  if (gameData.visualState) {
    Object.entries(gameData.visualState).forEach(([p, v]) => aplicarMudancaVisual(p, v));
  }
  // Sync Incubadora
  if (gameData.incubadora) {
    Object.entries(gameData.incubadora).forEach(([p, v]) => aplicarMudancaVisual(p, v));
  }
  aplicarMudancaVisual("myoLiberado", gameData.myoLiberado);
})();

// ---------------------------
// 🌍 EXPORTS GLOBAIS
// ---------------------------
window.gameData = gameData;
window.salvarJogo = salvarJogo;
window.apagarSave = apagarSave;
window.unlockAchievement = (flag) => { gameData[flag] = true; };

// Debug helper
window.debugCave = function() {
    console.log("🔓 Desbloqueando caverna para testes...");
    gameData.incubadora.hasJelly = true;
    gameData.incubadora.hasMateria = true;
    gameData.incubadora.hasRainha = true;
};