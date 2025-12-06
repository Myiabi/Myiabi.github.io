// ======================================================
// 1. CONFIGURAÇÕES E DADOS PADRÃO
// ======================================================
const CHAR_BASE_PATH = "/assets/img/MYO/";
const SAVE_KEY = "meuSaveDoJogo";

const defaultData = {
  // --- Dados Gerais ---
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false,
  dialogos: { aiko: "introducao", czar: "inicio" },
  mesas: { 1: false, 2: false, 3: false, 4: false },
  jardimCompleto: false,
  customCharacter: null,

  // --- SISTEMA DA INCUBADORA ---
  incubadora: {
    hasJelly: false,
    hasRainha: false,
    hasMateria: false,
  },
  myoLiberado: false,

  // --- SISTEMA DA PEDRA ---
  visualState: {
    pedraResolvida: false,
  },
};

// ======================================================
// 2. SISTEMA DE SAVE E REATIVIDADE (O CÉREBRO)
// ======================================================

// --- Carregar Jogo ---
function carregarJogo() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const merged = Object.assign({}, defaultData, parsed);
      // Garante profundidade dos objetos
      merged.incubadora = { ...defaultData.incubadora, ...(parsed.incubadora || {}) };
      merged.visualState = { ...defaultData.visualState, ...(parsed.visualState || {}) };
      return merged;
    } catch (e) {
      console.error("Save corrompido, resetando.", e);
    }
  }
  return JSON.parse(JSON.stringify(defaultData));
}

// --- Salvar Jogo ---
window.salvarJogo = function () {
  localStorage.setItem(SAVE_KEY, JSON.stringify(window.gameData));
};

window.apagarSave = function () {
  localStorage.removeItem(SAVE_KEY);
  location.reload();
};

// --- Aplicação Visual (O que muda na tela) ---
function aplicarMudancaVisual(prop, value) {
  const elMateria = document.getElementById("inc-materia");
  const elRainha = document.getElementById("inc-rainha");
  const elBase = document.getElementById("openCreatorBtn");
  const elWrapper = document.getElementById("incubadora-wrapper");

  const rock = document.getElementById("rock");
  const cobra1 = document.getElementById("cobra1");

  switch (prop) {
    // Incubadora
    case "hasMateria":
      if (elMateria) elMateria.style.display = value ? "block" : "none";
      break;
    case "hasRainha":
      if (elRainha) elRainha.style.display = value ? "block" : "none";
      break;
    case "hasJelly":
      if (elBase)
        elBase.src = value
          ? "/assets/img/Incubator-stage-only-honey.png"
          : "/assets/img/Incubator-stage0.png";
      break;
    case "myoLiberado":
      if (elWrapper) elWrapper.style.cursor = value ? "pointer" : "default";
      break;

    // Pedra (Estado Final Persistente)
    case "pedraResolvida":
      if (value === true) {
        if (cobra1) cobra1.style.display = "none"; // Some definitivo
        if (rock) {
          rock.classList.add("rock-locked");
          rock.style.pointerEvents = "none";
        }
      }
      break;
  }
}

// --- Checagem de Vitória da Incubadora ---
function checkIncubadoraCompleta() {
  const i = window.gameData.incubadora;
  if (
    i.hasJelly &&
    i.hasRainha &&
    i.hasMateria &&
    !window.gameData.myoLiberado
  ) {
    console.log("⚡ Completou! Liberando Myo...");
    window.gameData.myoLiberado = true;
  }
}

// --- Proxy Inteligente ---
function criarProxy(obj, caminho = []) {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (target[prop] === value) return true;

      const fullPath = [...caminho, prop];
      target[prop] =
        value && typeof value === "object" && !Array.isArray(value)
          ? criarProxy(value, fullPath)
          : value;

      // Reatividade
      if (fullPath[0] === "incubadora") {
        aplicarMudancaVisual(prop, value);
        checkIncubadoraCompleta();
      } else if (fullPath[0] === "visualState") {
        aplicarMudancaVisual(prop, value);
      } else if (prop === "myoLiberado") {
        aplicarMudancaVisual(prop, value);
      }

      window.salvarJogo();
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
window.gameData = criarProxy(loadedData);

// ======================================================
// 3. INTERAÇÃO E INICIALIZAÇÃO
// ======================================================

function openGame() {
  if (window.gameData.myoLiberado) {
    document.getElementById("charCreatorModal").style.display = "flex";
  } else {
    alert("A incubadora precisa de: Jelly, Matéria e Rainha.");
  }
}

function closeGame() {
  document.getElementById("charCreatorModal").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Aplica visuais salvos da Incubadora e Myo
  if (window.gameData.incubadora) {
    Object.entries(window.gameData.incubadora).forEach(([k, v]) =>
      aplicarMudancaVisual(k, v)
    );
  }
  aplicarMudancaVisual("myoLiberado", window.gameData.myoLiberado);

  // 2. Pedra já resolvida? (Importante para persistência)
  if (
    window.gameData.visualState &&
    window.gameData.visualState.pedraResolvida
  ) {
    aplicarMudancaVisual("pedraResolvida", true);
  }

  // 3. Personagem já criado?
  if (window.gameData.customCharacter) {
    renderSavedCharacter(window.gameData.customCharacter);
  }

  // 4. Partículas
  if (typeof tsParticles !== "undefined") {
    tsParticles.load("fire-background", {
      preset: "fire",
      fullScreen: { enable: false },
      background: { color: "#000000" },
    });
  }

  // Inicializadores UI
  if (document.getElementById("controlsList")) {
    initCharCreator();
    setupFinishButton();
  }

  // INICIA O PUZZLE RESTAURADO
  initRockPuzzle();

  // Botão Voltar
  const btnBack = document.getElementById("btn-back");
  if (btnBack) {
    btnBack.addEventListener("click", () => {
      const dest = btnBack.getAttribute("data-destino");
      if (dest) window.location.href = dest;
    });
  }
});

// Debug
window.debugGanharTudo = function () {
  window.gameData.incubadora.hasJelly = true;
  window.gameData.incubadora.hasMateria = true;
  window.gameData.incubadora.hasRainha = true;
  console.log("✅ Itens ganhos via Debug!");
};

// ======================================================
// 4. CRIADOR DE PERSONAGEM
// ======================================================
const charConfig = {
  body: { label: "Base", max: 4, current: 1, min: 1, filename: "BASE" },
  eyes: { label: "Eyes", max: 8, current: 1, min: 1 },
  eyebrows: { label: "Eyebrows", max: 4, current: 0 },
  mouth: { label: "Mouth", max: 10, current: 0 },
  hairStyle: { label: "Hair Style", max: 20, current: 0 },
  hairColor: {
    label: "Hair Color",
    type: "color",
    current: 0,
    options: [
      "Black",
      "Blue",
      "Brown",
      "Green",
      "Pink",
      "Purple",
      "Red",
      "White",
      "Yellow",
    ],
  },
  horns: { label: "Horns", max: 3, current: 1, min: 1 },
  claws: { label: "Claws", max: 3, current: 1, min: 1 },
  marks: { label: "Marks", max: 5, current: 0 },
  tail: { label: "Tail", max: 3, current: 1, min: 1 },
  cloth: { label: "Cloth", max: 16, current: 0 },
  accessory: { label: "Accessory", max: 9, current: 0 },
};
const menuOrder = [
  "body",
  "eyes",
  "eyebrows",
  "mouth",
  "hairStyle",
  "hairColor",
  "horns",
  "claws",
  "marks",
  "tail",
  "cloth",
  "accessory",
];

function initCharCreator() {
  const controlsList = document.getElementById("controlsList");
  if (!controlsList) return;
  controlsList.innerHTML = "";
  menuOrder.forEach((key) => {
    const item = charConfig[key];
    const div = document.createElement("div");
    div.className = "control-row";
    div.innerHTML = `
            <button class="nav-btn" onclick="changeCharItem('${key}', -1)">&#10094;</button>
            <div class="control-label">${
              item.label
            }<span class="control-value" id="val-${key}">${getDisplayValue(
      key,
      item
    )}</span></div>
            <button class="nav-btn" onclick="changeCharItem('${key}', 1)">&#10095;</button>
        `;
    controlsList.appendChild(div);
  });
  updateAllLayers();
}

function changeCharItem(key, direction) {
  const item = charConfig[key];
  if (item.type === "color") {
    let newIndex = item.current + direction;
    if (newIndex < 0) newIndex = item.options.length - 1;
    if (newIndex >= item.options.length) newIndex = 0;
    item.current = newIndex;
  } else {
    const min = item.min || 0;
    let newIndex = item.current + direction;
    if (newIndex > item.max) newIndex = min;
    if (newIndex < min) newIndex = item.max;
    item.current = newIndex;
  }
  const display = document.getElementById(`val-${key}`);
  if (display) display.innerText = getDisplayValue(key, item);
  updateLayer(key);
}

function getDisplayValue(key, item) {
  if (item.type === "color") return item.options[item.current];
  if (item.current === 0) return "None";
  return `Option ${item.current}`;
}

function updateAllLayers() {
  Object.keys(charConfig).forEach((key) => {
    if (key !== "hairColor") updateLayer(key);
  });
}

function updateLayer(key) {
  if (key === "hairStyle" || key === "hairColor") {
    updateHair();
    return;
  }
  const item = charConfig[key];
  const imgEl = document.getElementById(`img-${key}`);
  if (!imgEl) return;
  if (key === "accessory")
    imgEl.style.zIndex = item.current === 2 || item.current === 4 ? "55" : "49";

  if (item.current === 0) {
    imgEl.style.display = "none";
    imgEl.src = "";
  } else {
    const filePrefix = item.filename
      ? item.filename
      : capitalize(key);
    imgEl.src = `${CHAR_BASE_PATH}${filePrefix}-${item.current}.png`;
    imgEl.style.display = "block";
  }
}

function updateHair() {
  const style = charConfig.hairStyle.current;
  const colorIndex = charConfig.hairColor.current;
  const colorName = charConfig.hairColor.options[colorIndex];
  const imgEl = document.getElementById("img-hair");
  if (!imgEl) return;
  if (style === 0) {
    imgEl.style.display = "none";
    imgEl.src = "";
  } else {
    imgEl.style.display = "block";
    imgEl.src = `${CHAR_BASE_PATH}Hair${style}-${colorName}.png`;
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getcurrentTraits() {
  const traits = {};
  Object.keys(charConfig).forEach((key) => {
    traits[key] = charConfig[key].current;
  });
  return traits;
}

function randomizeCharacter() {
  Object.keys(charConfig).forEach((key) => {
    const item = charConfig[key];
    if (item.type === "color")
      item.current = Math.floor(Math.random() * item.options.length);
    else {
      const min = item.min || 0;
      const max = item.max;
      item.current = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const valDisplay = document.getElementById(`val-${key}`);
    if (valDisplay) valDisplay.innerText = getDisplayValue(key, item);
    updateLayer(key);
  });
}

function downloadCharacter() {
  return new Promise((resolve, reject) => {
    const tempWrapper = createCharacterElement(getcurrentTraits(), "500px");
    tempWrapper.style.position = "absolute";
    tempWrapper.style.left = "-9999px";
    tempWrapper.style.top = "0";
    tempWrapper.style.width = "500px";
    tempWrapper.style.height = "800px";
    tempWrapper.style.filter = "none";
    document.body.appendChild(tempWrapper);

    if (typeof html2canvas === "undefined") {
      console.error("Html2Canvas não carregado.");
      return;
    }

    html2canvas(tempWrapper, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    })
      .then((canvas) => {
        const imageURL = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = imageURL;
        a.download = "Personagem_Magma.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        document.body.removeChild(tempWrapper);
        resolve();
      })
      .catch((err) => reject(err));
  });
}

function setupFinishButton() {
  const finishBtn = document.getElementById("finishBtn");
  const finishContainer = document.getElementById("finishContainer");
  const confirmBox = document.getElementById("confirmBox");
  if (!finishBtn) return;
  let holdTimer = null;
  function startHold(e) {
    if (e.type === "touchstart") e.preventDefault();
    finishContainer.classList.add("is-holding");
    holdTimer = setTimeout(() => {
      confirmBox.classList.add("active");
      cancelHold();
    }, 3000);
  }
  function cancelHold() {
    clearTimeout(holdTimer);
    finishContainer.classList.remove("is-holding");
  }
  finishBtn.addEventListener("mousedown", startHold);
  finishBtn.addEventListener("touchstart", startHold);
  finishBtn.addEventListener("mouseup", cancelHold);
  finishBtn.addEventListener("mouseleave", cancelHold);
  finishBtn.addEventListener("touchend", cancelHold);
}

function closeConfirmBox() {
  const box = document.getElementById("confirmBox");
  if (box) box.classList.remove("active");
}

async function finalizeAndDownload() {
  closeConfirmBox();
  const finishBtn = document.getElementById("finishBtn");
  const oldText = finishBtn.innerText;
  finishBtn.innerText = "Baixando...";
  finishBtn.disabled = true;
  try {
    await downloadCharacter();
    finalizeCharacter();
  } catch (error) {
    console.error(error);
    finalizeCharacter();
  } finally {
    finishBtn.innerText = oldText;
    finishBtn.disabled = false;
  }
}

function finalizeCharacter() {
  const characterInfo = { traits: getcurrentTraits(), x: "50%", y: "60%" };
  window.gameData.customCharacter = characterInfo;
  salvarJogo();
  renderSavedCharacter(characterInfo);
  closeGame();
}

function renderSavedCharacter(charInfo) {
  const wrapper = document.getElementById("incubadora-wrapper");
  if (wrapper) {
    wrapper.style.display = "none";
    wrapper.style.pointerEvents = "none";
  }
  const existing = document.getElementById("saved-char-display");
  if (existing) existing.remove();

  const boneco = createCharacterElement(charInfo.traits, "100%");
  boneco.id = "saved-char-display";

  boneco.style.position = "";
  boneco.style.width = "";
  boneco.style.height = "";
  boneco.style.aspectRatio = "";

  document.body.appendChild(boneco);
}

function createCharacterElement(data, width = "200px") {
  const container = document.createElement("div");
  container.style.width = width;
  container.style.height = "auto";
  container.style.aspectRatio = "500 / 800";
  container.style.position = "relative";
  container.style.display = "inline-block";
  container.style.filter = "drop-shadow(0 0 2px rgba(255,255,255,0.5))";
  Object.keys(data).forEach((key) => {
    if (key === "hairColor") return;
    const currentVal = data[key];
    if (!currentVal || currentVal === 0) return;
    const img = document.createElement("img");
    img.style.position = "absolute";
    img.style.top = "0";
    img.style.left = "0";
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    let zIndex = 20;
    if (key === "body") zIndex = 0;
    else if (key === "eyes") zIndex = 25;
    else if (key === "cloth") zIndex = 35;
    else if (key === "hairStyle") zIndex = 45;
    else if (key === "horns") zIndex = 50;
    else if (key === "accessory")
      zIndex = currentVal === 2 || currentVal === 4 ? 55 : 49;
    img.style.zIndex = zIndex;
    const itemConfig = charConfig[key];
    if (key === "hairStyle") {
      const colorIndex = data["hairColor"] || 0;
      const colorName = charConfig.hairColor.options[colorIndex];
      img.src = `${CHAR_BASE_PATH}Hair${currentVal}-${colorName}.png`;
    } else {
      const filePrefix = itemConfig.filename
        ? itemConfig.filename
        : capitalize(key);
      img.src = `${CHAR_BASE_PATH}${filePrefix}-${currentVal}.png`;
    }
    container.appendChild(img);
  });
  return container;
}

// ======================================================
// 5. PUZZLE DA PEDRA (CORRIGIDO)
// ======================================================

function initRockPuzzle() {
  const rock = document.getElementById("rock");
  const cobra = document.getElementById("cobra1");

  // Proteção básica
  if (!rock || !cobra) return;

  // --- FIX: Se já resolveu, cancela o drag ---
  if (window.gameData.visualState && window.gameData.visualState.pedraResolvida) {
      return; 
  }
  // -------------------------------------------

  // --- Variáveis ---
  let isDragging = false;
  let startMouseX = 0;
  let startRockLeft = 0; 
  let solved = false;
  let originLeft = rock.offsetLeft;
  let maxDistance = 0;

  // Atualiza referências se a tela mudar de tamanho
  window.addEventListener("resize", () => {
    if (!solved) {
      rock.style.left = ""; 
      originLeft = rock.offsetLeft;
    }
  });

  const getX = (e) =>
    e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

  function startDrag(e) {
    if (solved) return;
    if (e.cancelable && e.type !== "mousedown") e.preventDefault();

    // CALCULA LARGURA AGORA (Correção do bug de não arrastar)
    maxDistance = rock.clientWidth * 0.4;
    
    isDragging = true;
    rock.classList.add("dragging");
    rock.style.transition = 'none';

    startMouseX = getX(e);
    startRockLeft = rock.offsetLeft;
  }

  function onDrag(e) {
    if (!isDragging || solved) return;
    if (e.cancelable) e.preventDefault(); 

    const currentMouseX = getX(e);
    const mouseDiff = currentMouseX - startMouseX; 
    let newPos = startRockLeft + mouseDiff;

    if (newPos < originLeft) {
      newPos = originLeft;
    }
    if (newPos > originLeft + maxDistance) {
      newPos = originLeft + maxDistance;
    }

    rock.style.left = `${newPos}px`;

    // Ganha se chegou em 90%
    if (newPos >= originLeft + maxDistance * 0.9) {
      triggerWin();
    }
  }

  function stopDrag() {
    isDragging = false;
    rock.classList.remove("dragging");
    
    if (!solved) {
        rock.style.transition = 'left 0.3s ease';
        rock.style.left = originLeft + 'px';
    }
  }

  function triggerWin() {
    if (solved) return;
    solved = true;
    
    // 1. Trava tudo
    isDragging = false;
    rock.classList.remove("dragging");
    rock.style.pointerEvents = 'none'; // Ninguém mexe mais

    // 2. Trava a pedra no limite exato (sem animação de slide)
    // Assim ela parece que "encaixou" no lugar final instantaneamente.
    rock.style.transition = "none"; 

    // 3. Efeitos visuais
    console.log("Pedra travada no final.");
    cobra.classList.add("fade-out");

    // 4. Salva depois (mas a pedra já tá parada)
    setTimeout(() => {
      if (window.gameData) {
        window.gameData.visualState.pedraResolvida = true;
      }
    }, 1500);
  }

  // --- Listeners ---
  rock.addEventListener("mousedown", startDrag);
  rock.addEventListener("touchstart", startDrag, { passive: false });

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("touchmove", onDrag, { passive: false });

  window.addEventListener("mouseup", stopDrag);
  window.addEventListener("touchend", stopDrag);
}

// Exporta globais
window.openGame = openGame;
window.closeGame = closeGame;
window.changeCharItem = changeCharItem;
window.randomizeCharacter = randomizeCharacter;
window.downloadCharacter = downloadCharacter;
window.closeConfirmBox = closeConfirmBox;
window.finalizeAndDownload = finalizeAndDownload;