// ======================================================
// SCRIPT DA CAVERNA (Visual e Lógica de Interação)
// ======================================================

const CHAR_BASE_PATH = "/assets/img/MYO/";

// ========== DISTRIBUIÇÃO DO PASSE WENDIGO (SUN) AO ENTRAR NA CAVERNA ==========
// Se não venceu ainda, ganha o passe (permite tentar de novo se perdeu)
(function () {
  if (localStorage.getItem("wendigo_completo") !== "true") {
    sessionStorage.setItem("acesso_wendigo", "autorizado");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  waitForGameData(() => {
    // 1. Renderiza Personagem Salvo (Se existir)
    if (window.gameData.customCharacter) {
      renderSavedCharacter(window.gameData.customCharacter);
    }

    // 2. Partículas do Fundo (Configuração manual para compatibilidade mobile)
    if (typeof tsParticles !== "undefined") {
      tsParticles.load("fire-background", {
        fullScreen: { enable: false },
        background: { color: "#000000" },
        fpsLimit: 60,
        detectRetina: true,
        particles: {
          number: {
            value: 80,
            density: { enable: true, area: 800 },
          },
          color: {
            value: ["#ff4500", "#ff6a00", "#ff8c00", "#ffa500", "#ffcc00"],
          },
          shape: { type: "circle" },
          opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.1,
              sync: false,
            },
          },
          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: true,
              speed: 3,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 2,
            direction: "top",
            random: true,
            straight: false,
            outModes: { default: "out" },
          },
          life: {
            duration: { value: 3 },
            count: 0,
          },
        },
        emitters: {
          direction: "top",
          position: { x: 50, y: 100 },
          size: { width: 100, height: 0 },
          rate: { quantity: 5, delay: 0.1 },
        },
      });
    }

    // 3. Inicializa Criador de Personagem
    if (document.getElementById("controlsList")) {
      initCharCreator();
      setupFinishButton();
    }

    // 4. Inicializa Puzzle da Pedra
    initRockPuzzle();
  });
});

function waitForGameData(onReady) {
  const maxTries = 60; // 3s @ 50ms
  let tries = 0;

  const check = () => {
    if (window.gameData) {
      onReady();
      return;
    }

    tries += 1;
    if (tries >= maxTries) {
      console.warn("⚠️ GameData não carregou a tempo; seguindo mesmo assim.");
      onReady();
      return;
    }

    setTimeout(check, 50);
  };

  check();
}

// ======================================================
// 2. INTERAÇÃO (Botões e Menus)
// ======================================================

function openGame() {
  // Confere direto do Global
  const inc = window.gameData.incubadora;
  const myoLiberado = window.gameData.myoLiberado;

  if (myoLiberado || (inc.hasJelly && inc.hasRainha && inc.hasMateria)) {
    // Se por acaso a flag estava false mas tem os itens, o Proxy corrige ao salvar
    if (!myoLiberado) {
      window.gameData.myoLiberado = true;
    }
    document.getElementById("charCreatorModal").style.display = "flex";
  } else {
    // Mostra notas se faltar item
    updateNoteList();
    document.getElementById("noteModal").style.display = "flex";
  }
}

function updateNoteList() {
  // Apenas visualização momentânea, o visual fixo é controlado pelo save.js
  const inc = window.gameData.incubadora;
  const liMateria = document.getElementById("note-materia");
  const liRainha = document.getElementById("note-rainha");
  const liJelly = document.getElementById("note-jelly");

  if (liMateria)
    inc.hasMateria
      ? liMateria.classList.add("checked")
      : liMateria.classList.remove("checked");
  if (liRainha)
    inc.hasRainha
      ? liRainha.classList.add("checked")
      : liRainha.classList.remove("checked");
  if (liJelly)
    inc.hasJelly
      ? liJelly.classList.add("checked")
      : liJelly.classList.remove("checked");
}

function closeNote() {
  document.getElementById("noteModal").style.display = "none";
}

function closeGame() {
  document.getElementById("charCreatorModal").style.display = "none";
}

// ======================================================
// 3. PUZZLE DA PEDRA
// ======================================================

// ======================================================
// 3. PUZZLE DA PEDRA (Corrigido)
// ======================================================

function initRockPuzzle() {
  const rock = document.getElementById("rock");
  if (!rock) return;

  const visualState = window.gameData?.visualState;
  const dragState = {
    dragging: false,
    pointerId: null,
    startX: 0,
    originLeft: 0,
    maxDistance: 0,
    solved: false,
  };

  const computeBounds = () => {
    // Usa a mesma distância original (~8vw), limitando a 40% da largura atual
    const travelByWidth = rock.clientWidth * 0.4;
    const travelByViewport = window.innerWidth * 0.08;
    dragState.maxDistance = Math.min(travelByWidth, travelByViewport);
    dragState.originLeft = dragState.solved
      ? rock.offsetLeft - dragState.maxDistance
      : rock.offsetLeft;

    if (dragState.solved) {
      rock.style.left = `${dragState.originLeft + dragState.maxDistance}px`;
    }
  };

  const applySolvedVisual = () => {
    dragState.solved = true;
    dragState.dragging = false;
    rock.classList.add("rock-locked");
    rock.style.pointerEvents = "none";
    rock.style.transition = "left 0.15s ease";
    rock.style.left = `${dragState.originLeft + dragState.maxDistance}px`;
    rock.style.transform = "";
  };

  function finalizePuzzle() {
    if (dragState.solved) return;
    applySolvedVisual();
    setTimeout(() => {
      if (window.gameData?.visualState) {
        window.gameData.visualState.pedraResolvida = true;
      }
    }, 150);
  }

  computeBounds();
  rock.style.touchAction = "none";

  if (visualState && visualState.pedraResolvida) {
    applySolvedVisual();
    return;
  }

  rock.style.left = `${dragState.originLeft}px`;

  const getClientX = (e) => {
    if (typeof e.clientX === "number") return e.clientX;
    if (e.touches && e.touches.length > 0) return e.touches[0].clientX;
    if (e.changedTouches && e.changedTouches.length > 0)
      return e.changedTouches[0].clientX;
    return 0;
  };

  const startDrag = (e) => {
    if (dragState.solved) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    dragState.dragging = true;
    dragState.pointerId = e.pointerId ?? "fallback";
    dragState.startX = getClientX(e);
    rock.style.transition = "none";
    rock.classList.add("dragging");

    rock.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const moveDrag = (e) => {
    if (!dragState.dragging) return;
    if (
      dragState.pointerId &&
      e.pointerId &&
      e.pointerId !== dragState.pointerId
    )
      return;

    const delta = getClientX(e) - dragState.startX;
    const minLeft = dragState.originLeft;
    const maxLeft = dragState.originLeft + dragState.maxDistance;
    let nextLeft = dragState.originLeft + delta;

    if (nextLeft < minLeft) nextLeft = minLeft;
    if (nextLeft > maxLeft) nextLeft = maxLeft;

    rock.style.left = `${nextLeft}px`;

    if (nextLeft >= maxLeft - 1) finalizePuzzle();
    e.preventDefault();
  };

  const endDrag = (e) => {
    if (!dragState.dragging) return;
    if (
      dragState.pointerId &&
      e.pointerId &&
      e.pointerId !== dragState.pointerId
    )
      return;

    dragState.dragging = false;
    dragState.pointerId = null;
    rock.classList.remove("dragging");
    rock.releasePointerCapture?.(e.pointerId);

    if (!dragState.solved) {
      rock.style.transition = "left 0.25s ease";
      rock.style.left = `${dragState.originLeft}px`;
    }
  };

  const addListeners = () => {
    if (window.PointerEvent) {
      rock.addEventListener("pointerdown", startDrag, { passive: false });
      window.addEventListener("pointermove", moveDrag, { passive: false });
      window.addEventListener("pointerup", endDrag, { passive: false });
      window.addEventListener("pointercancel", endDrag, { passive: false });
    } else {
      rock.addEventListener("mousedown", startDrag, { passive: false });
      window.addEventListener("mousemove", moveDrag, { passive: false });
      window.addEventListener("mouseup", endDrag, { passive: false });
      rock.addEventListener("touchstart", startDrag, { passive: false });
      window.addEventListener("touchmove", moveDrag, { passive: false });
      window.addEventListener("touchend", endDrag, { passive: false });
      window.addEventListener("touchcancel", endDrag, { passive: false });
    }
  };

  window.addEventListener("resize", () => {
    computeBounds();
    if (!dragState.solved) {
      rock.style.transition = "";
      rock.style.left = `${dragState.originLeft}px`;
    }
  });

  addListeners();
}

// ======================================================
// 4. CRIADOR DE PERSONAGEM (Lógica Interna)
// ======================================================
// (Mantive igual pois é lógica de UI local, só o final salva no global)

const charConfig = {
  body: { label: "Base", max: 4, current: 1, min: 1, filename: "BASE" },
  eyes: { label: "Eyes", max: 8, current: 1, min: 1 },
  eyebrows: { label: "Eyebrows", max: 4, current: 0 },
  mouth: { label: "Mouth", max: 10, current: 1, min: 1 },
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
    div.innerHTML = `<button class="nav-btn" onclick="changeCharItem('${key}', -1)">&#10094;</button><div class="control-label">${
      item.label
    }<span class="control-value" id="val-${key}">${getDisplayValue(
      key,
      item
    )}</span></div><button class="nav-btn" onclick="changeCharItem('${key}', 1)">&#10095;</button>`;
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
  return item.current === 0 ? "None" : `Option ${item.current}`;
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
    const filePrefix = item.filename ? item.filename : capitalize(key);
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
      item.current = Math.floor(Math.random() * (item.max - min + 1)) + min;
    }
    const valDisplay = document.getElementById(`val-${key}`);
    if (valDisplay) valDisplay.innerText = getDisplayValue(key, item);
    updateLayer(key);
  });
}

function downloadCharacter() {
  return new Promise((resolve, reject) => {
    const tempWrapper = createCharacterElement(
      getcurrentTraits(),
      "500px",
      false
    );
    tempWrapper.style.position = "absolute";
    tempWrapper.style.left = "-9999px";
    tempWrapper.style.top = "0";
    document.body.appendChild(tempWrapper);
    if (typeof html2canvas === "undefined") return;

    html2canvas(tempWrapper, {
      backgroundColor: null,
      scale: 4,
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

  // SALVA NO GLOBAL
  window.gameData.customCharacter = characterInfo;

  // Força o save (garantia extra)
  if (window.salvarJogo) window.salvarJogo();

  // Atualiza visual localmente
  renderSavedCharacter(characterInfo);
  mudarCenario(personagens.wendigo, "pmyo");
  mudarCenario(personagens.aiko, "boss");

  closeGame();
}

function renderSavedCharacter(charInfo) {
  // Esconde incubadora (o save.js também faz isso, mas aqui garantimos o timing da animação)
  const wrapper = document.getElementById("incubadora-wrapper");
  if (wrapper) {
    wrapper.style.display = "none";
    wrapper.style.pointerEvents = "none";
  }

  const existing = document.getElementById("saved-char-display");
  if (existing) existing.remove();

  const boneco = createCharacterElement(charInfo.traits, "100%", false);
  boneco.id = "saved-char-display";
  boneco.style.position = "";
  boneco.style.width = "";
  boneco.style.height = "";
  boneco.style.aspectRatio = "";
  document.body.appendChild(boneco);
}

function createCharacterElement(data, width = "200px", comAura = false) {
  const container = document.createElement("div");
  container.style.width = width;
  container.style.height = "auto";
  container.style.aspectRatio = "500 / 800";
  container.style.position = "relative";
  container.style.display = "inline-block";
  if (comAura)
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
    else if (key === "cloth") zIndex = 46;
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

// Exports para o HTML usar no onclick
window.openGame = openGame;
window.closeGame = closeGame;
window.closeNote = closeNote;
window.changeCharItem = changeCharItem;
window.randomizeCharacter = randomizeCharacter;
window.downloadCharacter = downloadCharacter;
window.closeConfirmBox = closeConfirmBox;
window.finalizeAndDownload = finalizeAndDownload;

// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("cave");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();
