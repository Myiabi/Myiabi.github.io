// ==========================================
// 🦀 LÓGICA DO PUZZLE DO LAGO (BOLHAS)
// ==========================================

// --- 1. CONFIGURAÇÕES & HELPERS ---
const ROWS = 7;
const COLS = 7;
const BUBBLE_SRC = "/assets/img/Bubble.png";

// Helpers para conversar com o seu Save System Global
function getGameState(key) {
  if (window.gameData && window.gameData.visualState) {
    return window.gameData.visualState[key];
  }
  return false;
}

function setGameState(key, value) {
  if (window.gameData && window.gameData.visualState) {
    window.gameData.visualState[key] = value;
  }
}

// Matrizes dos desenhos
const shapes = {
  hour: [
    1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
  ],
  jelly: [
    0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1,
  ],
  heart: [
    0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
  ],
};

let gridState = [];
let isDragging = false;
let dragMode = null;

// --- 2. SISTEMA DE ÁUDIO SIMPLES ---
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (audioContext.state === "suspended") audioContext.resume();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  const now = audioContext.currentTime;

  if (type === "pop") {
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else {
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

// --- 3. INICIALIZAÇÃO DO GRID ---
function initGrid() {
  // Se o jogo já está salvo como "Completo", não desenha nada.
  if (getGameState("puzzleBubbles_complete")) return;

  // Se tem as 3 partes mas NÃO tem o final (Ex: F5 no meio da animação)
  // Finaliza imediatamente para não bugar.
  if (
    getGameState("puzzleBubbles_hour") &&
    getGameState("puzzleBubbles_jelly") &&
    getGameState("puzzleBubbles_heart")
  ) {
    // Bloqueio de segurança imediato
    setGameState("puzzleBubbles_complete", true);
    const toHide = [
      "crab",
      "grid-wrapper",
      "grid-container",
      "hour",
      "jelly",
      "heart",
    ];
    toHide.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    return;
  }

  const container = document.getElementById("grid-container");
  if (!container) return;

  container.innerHTML = "";
  gridState = new Array(ROWS * COLS).fill(1);

  for (let i = 0; i < ROWS * COLS; i++) {
    const cell = document.createElement("div");
    cell.className = `cell flex items-center justify-center cursor-pointer w-full h-full`;
    cell.dataset.index = i;

    const img = document.createElement("img");
    img.src = BUBBLE_SRC;
    img.className = "bubble-img";
    img.draggable = false;

    img.onerror = function () {
      this.style.display = "none";
      cell.style.backgroundColor = "rgba(255,255,255,0.2)";
      cell.style.borderRadius = "50%";
    };

    cell.appendChild(img);

    cell.addEventListener("mousedown", startDrag);
    cell.addEventListener("mouseenter", handleDragEnter);

    container.appendChild(cell);
  }

  window.addEventListener("mouseup", endDrag);
  container.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  container.addEventListener("touchmove", handleTouchMove, { passive: false });
  container.addEventListener("touchend", endDrag);
}

// --- 4. LÓGICA DE INTERAÇÃO (TOUCH E MOUSE) ---
function toggleCell(index, forceMode = null) {
  const cell = document.querySelector(`.cell[data-index='${index}']`);
  if (!cell) return;
  const img = cell.querySelector("img");
  const currentState = gridState[index];

  if (forceMode === null) dragMode = currentState === 1 ? "pop" : "restore";
  else dragMode = forceMode;

  if (dragMode === "pop" && currentState === 1) {
    gridState[index] = 0;
    if (img) {
      img.style.transform = "scale(0)";
      img.style.opacity = "0";
    }
    playSound("pop");
    checkLogic();
  } else if (dragMode === "restore" && currentState === 0) {
    gridState[index] = 1;
    if (img) {
      img.style.transform = "scale(1)";
      img.style.opacity = "1";
    }
    checkLogic();
  }
}

function startDrag(e) {
  isDragging = true;
  const c = e.target.closest(".cell");
  if (c) toggleCell(parseInt(c.dataset.index));
}
function handleDragEnter(e) {
  if (!isDragging) return;
  const c = e.target.closest(".cell");
  if (c) toggleCell(parseInt(c.dataset.index), dragMode);
}
function endDrag() {
  isDragging = false;
  dragMode = null;
}

function handleTouchStart(e) {
  e.preventDefault();
  isDragging = true;
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  const c = el ? el.closest(".cell") : null;
  if (c) toggleCell(parseInt(c.dataset.index));
}
function handleTouchMove(e) {
  e.preventDefault();
  if (!isDragging) return;
  const t = e.touches[0];
  const el = document.elementFromPoint(t.clientX, t.clientY);
  const c = el ? el.closest(".cell") : null;
  if (c) toggleCell(parseInt(c.dataset.index), dragMode);
}

// --- 5. LÓGICA DE VITÓRIA PARCIAL E TOTAL ---
function checkLogic() {
  if (getGameState("puzzleBubbles_complete")) return;

  if (gridState.filter((val) => val === 1).length === 0) {
    triggerFullReset();
    return;
  }

  checkShape("hour", shapes.hour);
  checkShape("jelly", shapes.jelly);
  checkShape("heart", shapes.heart);

  if (
    getGameState("puzzleBubbles_hour") &&
    getGameState("puzzleBubbles_jelly") &&
    getGameState("puzzleBubbles_heart")
  ) {
    setTimeout(triggerWin, 500);
  }
}

function checkShape(id, shapeGrid) {
  if (getGameState("puzzleBubbles_" + id)) return; // Já feito

  const isMatch = gridState.every((val, index) => val === shapeGrid[index]);

  if (isMatch) {
    setGameState("puzzleBubbles_" + id, true); // SALVA PARCIAL
    playSound("success");

    const container = document.getElementById("grid-container");
    container.classList.add("opacity-50");

    setTimeout(() => {
      container.classList.remove("opacity-50");
      if (
        !(
          getGameState("puzzleBubbles_hour") &&
          getGameState("puzzleBubbles_jelly") &&
          getGameState("puzzleBubbles_heart")
        )
      ) {
        triggerFullReset();
      }
    }, 800);
  }
}

function triggerFullReset() {
  const container = document.getElementById("grid-container");
  container.style.pointerEvents = "none";
  container.classList.add("shake");

  setTimeout(() => {
    gridState.fill(1);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.style.opacity = "1";
      const img = cell.querySelector("img");
      if (img) {
        img.style.transform = "scale(1)";
        img.style.opacity = "1";
      }
    });
    container.style.pointerEvents = "auto";
    container.classList.remove("shake");
  }, 600);
}

// --- 6. ANIMAÇÃO FINAL AJUSTADA (SEM SHIFTS, FADE BOLHAS, QUEDA CRAB) ---
function triggerWin() {
  console.log("WIN! Iniciando sequência final...");

  // Pega os elementos ANTES de salvar (importante!)
  const gridElement =
    document.getElementById("grid-wrapper") ||
    document.getElementById("grid-container");
  const crab = document.getElementById("crab");
  const bubbleElements = ["hour", "jelly", "heart"].map((id) =>
    document.getElementById(id)
  );

  // 🎬 MARCA TODOS OS ELEMENTOS COMO "ANIMANDO"
  // Isso impede que o aplicarMudancaVisual aplique display:none bruscamente
  const allElements = [gridElement, crab, ...bubbleElements].filter(Boolean);
  allElements.forEach((el) => el.classList.add("animating-out"));

  // 🔒 SALVA IMEDIATAMENTE - O estado é salvo, mas os elementos não somem
  // porque têm a classe 'animating-out'
  setGameState("puzzleBubbles_complete", true);
  console.log("Jogo salvo como Completo (Lake) - IMEDIATO.");

  // 1. Grid: fade out suave
  if (gridElement) {
    gridElement.style.transition = "opacity 1s ease";
    gridElement.style.opacity = "0";
  }

  // 2. Crab: Impulso inicial + depois mergulha
  if (crab) {
    crab.style.pointerEvents = "none";
    crab.style.transition =
      "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    crab.style.transform = "translateY(-50px)";

    // Fase 2: Mergulho para baixo até sumir
    setTimeout(() => {
      crab.style.transition =
        "transform 3s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 2s ease 0.5s";
      crab.style.transform = "translateY(150vh)";
      crab.style.opacity = "0";
    }, 500);
  }

  // 3. Bolhas: fade out
  bubbleElements.forEach((el) => {
    if (el) {
      el.style.pointerEvents = "none";
      el.style.transition = "opacity 1.5s ease";
      el.style.opacity = "0";
    }
  });

  // 4. FINALIZA - Remove a classe e aplica display:none depois que animação terminou
  let animationTime = 4000;
  setTimeout(() => {
    // Remove a classe marcadora e esconde de vez
    allElements.forEach((el) => {
      el.classList.remove("animating-out");
      el.style.display = "none";
    });

    mudarCenario(personagens.cory, "segunda");
    mudarCenario(personagens.spanish, "segunda");
    mudarCenario(personagens.paddlefish, "segunda");
    mudarCenario(personagens.wholphin, "segunda");
    gameData.visualState.crabWin = true;
    console.log("Cenários dos NPCs atualizados.");
  }, animationTime);
}

// Inicializa quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  const btnBack = document.getElementById("btn-back");
  if (btnBack)
    btnBack.addEventListener("click", () =>
      window.location.replace("/city.html")
    );

  initGrid();

  // --- DEBUG BUTTON ---
  const debugBtn = document.createElement("button");
  debugBtn.textContent = "WIN (Debug)";
  debugBtn.style.cssText =
    "position:fixed; top:10px; right:10px; z-index:9999; padding:8px; background:red; color:white; border:none; cursor:pointer; font-weight:bold;";
  debugBtn.onclick = () => {
    setGameState("puzzleBubbles_hour", true);
    setGameState("puzzleBubbles_jelly", true);
    setGameState("puzzleBubbles_heart", true);
    triggerWin();
  };
  document.body.appendChild(debugBtn);
});
