/* ============================================================
    SCRIPT COMPLETO CORRIGIDO
    - Focado em Mesa (gameData.mesas) com chaves simples (1, 2, 3, 4)
============================================================ */

/* ---------- NPC ---------- */
function randomNPC() {
  return Math.floor(Math.random() * 5) + 1 === 1;
}
function entrarNoLocal() {
  const npc = document.getElementById("cobra5");

  if (!window.gameData) return;

  // 0. TRAVA ABSOLUTA: Se ele já foi embora, esconde e mata a função aqui.
  if (gameData.npcApareceu === "sumiu") {
    if (npc) npc.style.display = "none";
    return;
  }

  // Inicializa como false se não existir
  if (typeof gameData.npcApareceu === "undefined") {
    gameData.npcApareceu = false;
  }

  // Lógica do Dado: Só roda se for estritamente false (nunca viu e não sumiu)
  if (gameData.npcApareceu === false && randomNPC()) {
    gameData.npcApareceu = true;
    // Salvar jogo aqui se necessário
  }

  // Renderiza: Só mostra se for estritamente true
  if (npc) {
    npc.style.display = gameData.npcApareceu === true ? "block" : "none";
  }
}

/* ---------- CONFIG ---------- */
const CHECK_DEBOUNCE_MS = 80;
const INSIDE_THRESHOLD = 1.0; // 1.0 = 100%
const _checkTimers = new Map();

/* --------------------------------------------------------------------------
   MAPAS DE PERSISTÊNCIA DO CENÁRIO "BAR"
-------------------------------------------------------------------------- */

const FOOD_BY_MESA = {
  1: ["whisky"],
  2: ["salad", "fries", "hotdog", "burg", "chicken"],
  3: ["tea", "cocoa", "coffee"],
  4: ["pizza", "coke", "cake1", "cake2", "milkshake"],
};

// Mapeamento das Tooltips (NPCs) para as Mesas do Bar
const BAR_TOOLTIP_MAPPING = {
  1: ["glass"],
  2: ["girlfriend", "boyfriend"],
  3: ["gorro", "rosinha", "moreno"],
  4: ["verdinha", "kid1", "kid2", "cachecol"],
};

// Conteúdo que a Tooltip DEVE ter após a conclusão da Mesa
const NEW_TOOLTIP_CONTENT = {
  glass: "I feel better now.",
  girlfriend: "Give me some of the fries? hihihi",
  boyfriend: "Of course love! (I knew it grrrr)",
  gorro: "My god I stayed, now I'm cold inside and outside",
  rosinha: "Ahhh that calmed my little belly",
  moreno: "I'm warm now",
  verdinha: "This place is wonderful, my compliments to the chef!",
  kid1: "Thank you for the cake! 😊",
  kid2: "Thank you for the cake! 😄",
  cachecol: "This coffee is strong",
};

/**
 * Exibe ou esconde todas as comidas de uma mesa.
 */
function toggleFoodVisibility(mesaId, isVisible) {
  const foodList = FOOD_BY_MESA[mesaId];
  if (!foodList) return;

  const displayStyle = isVisible ? "block" : "none";

  foodList.forEach((foodId) => {
    const foodEl = document.getElementById(foodId);
    if (foodEl) {
      foodEl.style.display = displayStyle;
    }
  });
}

/**
 * Altera o conteúdo da tooltip, buscando o ID do balão flutuante.
 */
function changeTooltipContent(tooltipId) {
  const newText = NEW_TOOLTIP_CONTENT[tooltipId];
  if (!newText) return;

  // Busca pelo ID único do elemento flutuante (que é 'tooltip-for-' + ID do alvo)
  const tooltipEl = document.getElementById(`tooltip-for-${tooltipId}`);

  if (tooltipEl) {
    // Assume que o texto é o conteúdo direto do balão.
    tooltipEl.textContent = newText;
  }
}

function hideAllFoodInitially() {
  document.querySelectorAll(".food").forEach((el) => {
    el.style.display = "none";
  });
}

/**
 * Cria os elementos tooltip.
 */
function setupTooltips() {
  createFloatingTooltip(
    "glass",
    "So quero esquecer os problemas...",
    150,
    90,
    myStyle,
    true,
    5000
  );

  createFloatingTooltip(
    "girlfriend",
    "Estou de dieta, quero algo leve... (Mas ele pediu minha preferida)",
    140,
    80,
    myStyle,
    true
  );
  createFloatingTooltip(
    "boyfriend",
    "Hoje vou comer de tudo! Certeza que não vai querer uma porçao? Nao? Ok.",
    130,
    100,
    myStyle,
    true
  );

  createFloatingTooltip(
    "gorro",
    "Vão me julgar se eu pedir isso nesse frio...?",
    0,
    0,
    myStyle,
    true
  );
  createFloatingTooltip(
    "rosinha",
    "Sou intolerante a lactose.",
    0,
    0,
    myStyle,
    true
  );
  createFloatingTooltip(
    "moreno",
    "Estou morrendo de frio!!!",
    135,
    30,
    myStyle,
    true
  );

  createFloatingTooltip(
    "verdinha",
    "Vou querer algo que sirva 4 pessoas, ah! e algo gelado.",
    0,
    0,
    myStyle,
    true
  );
  createFloatingTooltip("kid1", "Cake?", 0, 0, myStyle, true);
  createFloatingTooltip("kid2", "CAKE!!!", 0, 0, myStyle, true);
  createFloatingTooltip(
    "cachecol",
    "Estou com tanto sono...",
    0,
    0,
    myStyle,
    true
  );
}

/* ---------- UTIL: área de overlap, DRAG, DEBOUNCE... (sem alteração) ---------- */
function isInsideZoneByArea(item, zone, threshold = INSIDE_THRESHOLD) {
  const ir = item.getBoundingClientRect();
  const zr = zone.getBoundingClientRect();

  if (ir.width <= 0 || ir.height <= 0) return false;

  const overlapX = Math.max(
    0,
    Math.min(ir.right, zr.right) - Math.max(ir.left, zr.left)
  );
  const overlapY = Math.max(
    0,
    Math.min(ir.bottom, zr.bottom) - Math.max(ir.top, zr.top)
  );
  const overlapArea = overlapX * overlapY;
  const itemArea = ir.width * ir.height;

  return overlapArea / itemArea >= threshold;
}

function dragMoveListener(event) {
  const t = event.target;
  const x = (parseFloat(t.dataset.x) || 0) + event.dx;
  const y = (parseFloat(t.dataset.y) || 0) + event.dy;
  t.style.transform = `translate(${x}px, ${y}px)`;
  t.dataset.x = x;
  t.dataset.y = y;
}

function onDragEnd(event) {
  const gameId =
    event.target && event.target.dataset && event.target.dataset.game;
  if (gameId) {
    if (_checkTimers.has(gameId)) {
      clearTimeout(_checkTimers.get(gameId));
      _checkTimers.delete(gameId);
    }
    checkAllPlaced(gameId);
  }
}

function onDragEnter(e) {
  e.target.classList.add("drop-target");
  if (e.relatedTarget) e.relatedTarget.classList.add("can-drop");
}

function onDragLeave(e) {
  e.target.classList.remove("drop-target");
  const item = e.relatedTarget;
  if (!item) return;
  item.classList.remove("can-drop");
  item.dataset.placed = "false";
  item.dataset.bad = "false";
}

function onDrop(e) {
  const zone = e.currentTarget || e.target.closest(".dropzone");
  const item = e.relatedTarget;
  if (!zone || !item) return;

  const isRequired = item.hasAttribute("data-required");
  const correctType =
    zone.dataset.type && item.classList.contains(`item${zone.dataset.type}`);

  if (correctType) {
    if (isRequired) {
      item.dataset.placed = "true";
      item.dataset.bad = "false";
    } else {
      item.dataset.bad = "true";
      item.dataset.placed = "false";
    }
  } else {
    item.dataset.placed = "false";
    item.dataset.bad = "false";
  }

  zone.classList.remove("drop-target");
}

function debouncedCheck(gameId) {
  if (!gameId) return;
  if (_checkTimers.has(gameId)) clearTimeout(_checkTimers.get(gameId));
  _checkTimers.set(
    gameId,
    setTimeout(() => {
      _checkTimers.delete(gameId);
      checkAllPlaced(gameId);
    }, CHECK_DEBOUNCE_MS)
  );
}

/* ---------- VERIFICAÇÃO DE VITÓRIA (checkAllPlaced) ---------- */
function checkAllPlaced(gameId) {
  if (!gameId) return;

  const requiredItems = Array.from(
    document.querySelectorAll(
      `.draggable[data-game="${gameId}"][data-required]`
    )
  );
  const totalRequired = requiredItems.length;
  if (totalRequired === 0) return;

  const zones = Array.from(
    document.querySelectorAll(`.dropzone[data-game="${gameId}"]`)
  );
  if (zones.length === 0) return;

  const items = Array.from(
    document.querySelectorAll(`.draggable[data-game="${gameId}"]`)
  );

  let baitInside = false;
  const countedRequired = new Set();

  zones.forEach((zone) => {
    items.forEach((item) => {
      if (!isInsideZoneByArea(item, zone, INSIDE_THRESHOLD)) return;

      const isRequired = item.hasAttribute("data-required");
      const correctType =
        zone.dataset.type &&
        item.classList.contains(`item${zone.dataset.type}`);

      if (!isRequired && correctType) baitInside = true;
      if (isRequired && correctType) countedRequired.add(item);
    });
  });

  if (baitInside) return;
  if (countedRequired.size !== totalRequired) return;

  // Vitória! Escreve no gameData.mesas com o ID simples
  if (window.gameData && gameData.mesas) gameData.mesas[gameId] = true;

  const mesaId = parseInt(gameId);

  // 1. Exibe as comidas da mesa
  toggleFoodVisibility(mesaId, true);

  // 2. Altera o conteúdo das tooltips da mesa
  BAR_TOOLTIP_MAPPING[mesaId].forEach((tooltipId) => {
    changeTooltipContent(tooltipId);
  });

  const modal = document.getElementById(`game${gameId}`);
  if (modal) {
    modal.classList.remove("active");
    modal.classList.add("hidden");
  }
  const btn = document.querySelector(`[data-modal="game${gameId}"]`);
  if (btn) {
    btn.classList.add("completed");
    btn.onclick = null;
  }

  tocarEfeito("bell");

  // Verifica se TODAS as 4 mesas estão completas
  if (
    gameData.mesas[1] &&
    gameData.mesas[2] &&
    gameData.mesas[3] &&
    gameData.mesas[4]
  ) {
    mudarCenario(personagens.assistant, "segunda");
    mudarCenario(personagens.barman, "final");
    mudarCenario(personagens.maid, "segunda");
    dialogo.abrir(personagens.assistant);
  }
}

/* ---------- INIT e MODAIS (sem alteração) ---------- */
function initDropzones() {
  const zones = document.querySelectorAll(".dropzone");
  zones.forEach((z) => {
    interact(z).dropzone({
      accept: `.item${z.dataset.type}`,
      overlap: 0.75,
      ondragenter: onDragEnter,
      ondragleave: onDragLeave,
      ondrop: onDrop,
    });
  });

  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((el) => {
    try {
      interact(el).unset();
    } catch (err) {}

    const modalBox = el.closest(".modal-box");
    const restrictionTarget = modalBox || el;

    interact(el).draggable({
      inertia: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: restrictionTarget,
          endOnly: true,
        }),
      ],
      listeners: {
        move(event) {
          dragMoveListener(event);
          const gameId =
            event.target && event.target.dataset && event.target.dataset.game;
          if (gameId) debouncedCheck(gameId);
        },
        end(event) {
          onDragEnd(event);
        },
      },
    });
  });
}

document.querySelectorAll(".open-btn").forEach((btn) => {
  btn.onclick = () => {
    if (btn.classList.contains("completed")) return;
    const modal = document.getElementById(btn.dataset.modal);
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("active");
  };
});

document.querySelectorAll(".close-btn, .close-x").forEach((btn) => {
  btn.onclick = () => {
    const modal = document.getElementById(btn.dataset.close);
    if (!modal) return;
    modal.classList.remove("active");
    setTimeout(() => modal.classList.add("hidden"), 200);
  };
});

/* ---------- APLICAR SAVE (Atualizada para carregar Diálogo do Bar) ---------- */
function applyMesaStateFromSave() {
  if (!window.gameData || !gameData.mesas) return;
  for (let id in gameData.mesas) {
    // Assume que as chaves de mesas são as numéricas 1, 2, 3, 4
    const mesaId = parseInt(id);

    if (gameData.mesas[mesaId] === true) {
      const btn = document.querySelector(`[data-modal="game${id}"]`);
      if (btn) {
        btn.classList.add("completed");
        btn.onclick = null;
      }

      // 1. Mostra a comida
      toggleFoodVisibility(mesaId, true);

      // 2. Altera o conteúdo das tooltips carregadas
      const tooltipIds = BAR_TOOLTIP_MAPPING[mesaId];
      if (tooltipIds) {
        tooltipIds.forEach(changeTooltipContent);
      }
    } else {
      // Garante que a comida da mesa esteja escondida se não estiver completa
      toggleFoodVisibility(mesaId, false);
    }
  }
}

/* ---------- START (Ordem Corrigida) ---------- */
document.addEventListener("DOMContentLoaded", () => {
  hideAllFoodInitially();
  setupTooltips();
  initDropzones();
  applyMesaStateFromSave();
  entrarNoLocal();
});

window.startMinigameLogic = function () {
  hideAllFoodInitially();
  setupTooltips();
  initDropzones();
  applyMesaStateFromSave();
  entrarNoLocal();
};

// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("bar");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();
