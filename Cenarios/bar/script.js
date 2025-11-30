/* ============================================================
   SCRIPT COMPLETO CORRIGIDO
   - restrição por modal (por elemento)
   - debounce no check
   - vitória só quando 100% do item estiver dentro
   - bait bloqueando vitória
   - NPC random
============================================================ */

/* ---------- NPC ---------- */
function randomNPC() {
  return Math.floor(Math.random() * 20) + 1 === 1;
}
function entrarNoLocal() {
  const npc = document.getElementById("cobra5");
  if (!window.gameData || typeof gameData.npcApareceu === "undefined") return;
  if (!gameData.npcApareceu && randomNPC()) gameData.npcApareceu = true;
  if (npc) npc.style.display = gameData.npcApareceu ? "block" : "none";
}

/* ---------- CONFIG ---------- */
const CHECK_DEBOUNCE_MS = 80;
const INSIDE_THRESHOLD = 1.0; // 1.0 = 100%
const _checkTimers = new Map();

/* ---------- UTIL: área de overlap ---------- */
function isInsideZoneByArea(item, zone, threshold = INSIDE_THRESHOLD) {
  const ir = item.getBoundingClientRect();
  const zr = zone.getBoundingClientRect();

  // se elemento invisível/0 size
  if (ir.width <= 0 || ir.height <= 0) return false;

  const overlapX = Math.max(0, Math.min(ir.right, zr.right) - Math.max(ir.left, zr.left));
  const overlapY = Math.max(0, Math.min(ir.bottom, zr.bottom) - Math.max(ir.top, zr.top));
  const overlapArea = overlapX * overlapY;
  const itemArea = ir.width * ir.height;

  return (overlapArea / itemArea) >= threshold;
}

/* ---------- DRAG HELPERS ---------- */
function dragMoveListener(event) {
  const t = event.target;
  const x = (parseFloat(t.dataset.x) || 0) + event.dx;
  const y = (parseFloat(t.dataset.y) || 0) + event.dy;
  t.style.transform = `translate(${x}px, ${y}px)`;
  t.dataset.x = x;
  t.dataset.y = y;
}

function onDragEnd(event) {
  const gameId = event.target && event.target.dataset && event.target.dataset.game;
  if (gameId) {
    if (_checkTimers.has(gameId)) { clearTimeout(_checkTimers.get(gameId)); _checkTimers.delete(gameId); }
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
  // flags visuais apenas
  item.dataset.placed = "false";
  item.dataset.bad = "false";
}

/* ---------- DROP (bait handling) ---------- */
function onDrop(e) {
  const zone = e.currentTarget || e.target.closest(".dropzone");
  const item = e.relatedTarget;
  if (!zone || !item) return;

  const isRequired = item.hasAttribute("data-required");
  const correctType = zone.dataset.type && item.classList.contains(`item${zone.dataset.type}`);

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
  // não chamamos check aqui; move/end/debounce cuidam disso
}

/* ---------- DEBOUNCE ---------- */
function debouncedCheck(gameId) {
  if (!gameId) return;
  if (_checkTimers.has(gameId)) clearTimeout(_checkTimers.get(gameId));
  _checkTimers.set(gameId, setTimeout(() => {
    _checkTimers.delete(gameId);
    checkAllPlaced(gameId);
  }, CHECK_DEBOUNCE_MS));
}

/* ---------- VERIFICAÇÃO DE VITÓRIA (bounding-box + threshold) ---------- */
function checkAllPlaced(gameId) {
  if (!gameId) return;

  const requiredItems = Array.from(document.querySelectorAll(`.draggable[data-game="${gameId}"][data-required]`));
  const totalRequired = requiredItems.length;
  if (totalRequired === 0) return; // nada a checar

  const zones = Array.from(document.querySelectorAll(`.dropzone[data-game="${gameId}"]`));
  if (zones.length === 0) return;

  const items = Array.from(document.querySelectorAll(`.draggable[data-game="${gameId}"]`));

  let baitInside = false;
  const countedRequired = new Set();

  zones.forEach(zone => {
    items.forEach(item => {
      if (!isInsideZoneByArea(item, zone, INSIDE_THRESHOLD)) return;

      const isRequired = item.hasAttribute("data-required");
      const correctType = zone.dataset.type && item.classList.contains(`item${zone.dataset.type}`);

      if (!isRequired && correctType) baitInside = true;
      if (isRequired && correctType) countedRequired.add(item);
    });
  });

  if (baitInside) return;
  if (countedRequired.size !== totalRequired) return;

  // Vitória!
  if (window.gameData && gameData.mesas) gameData.mesas[gameId] = true;

  const modal = document.getElementById(`game${gameId}`);
  if (modal) {
    modal.classList.remove("active");
    modal.classList.add("hidden");
  }
  const btn = document.querySelector(`[data-modal="game${gameId}"]`);
  if (btn) { btn.classList.add("completed"); btn.onclick = null; }

  alert(`🔥 Mesa ${gameId} concluída!`);
}

/* ---------- INIT: aplica dropzones e registra draggable por elemento ---------- */
function initDropzones() {
  // dropzones
  const zones = document.querySelectorAll(".dropzone");
  zones.forEach(z => {
    interact(z).dropzone({
      accept: `.item${z.dataset.type}`,
      overlap: 0.75,
      ondragenter: onDragEnter,
      ondragleave: onDragLeave,
      ondrop: onDrop
    });
  });

  // draggables: registrar por elemento (permite restrictRect com modal específico)
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach(el => {
    // cleanup: evita múltiplas instâncias se init rodar várias vezes
    try { interact(el).unset(); } catch (err) {}

    // encontra modal-box mais próxima (fallback: o próprio elemento)
    const modalBox = el.closest(".modal-box");
    const restrictionTarget = modalBox || el;

    interact(el).draggable({
      inertia: true,
      autoScroll: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: restrictionTarget,
          endOnly: true
        })
      ],
      listeners: {
        move(event) {
          dragMoveListener(event);
          const gameId = event.target && event.target.dataset && event.target.dataset.game;
          if (gameId) debouncedCheck(gameId);
        },
        end(event) {
          onDragEnd(event);
        }
      }
    });
  });
}

/* ---------- MODAIS ---------- */
document.querySelectorAll(".open-btn").forEach(btn => {
  btn.onclick = () => {
    if (btn.classList.contains("completed")) return;
    const modal = document.getElementById(btn.dataset.modal);
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("active");
  };
});

document.querySelectorAll(".close-btn, .close-x").forEach(btn => {
  btn.onclick = () => {
    const modal = document.getElementById(btn.dataset.close);
    if (!modal) return;
    modal.classList.remove("active");
    setTimeout(() => modal.classList.add("hidden"), 200);
  };
});

/* ---------- APLICAR SAVE ---------- */
function applyMesaStateFromSave() {
  if (!window.gameData || !gameData.mesas) return;
  for (let id in gameData.mesas) {
    if (gameData.mesas[id]) {
      const btn = document.querySelector(`[data-modal="game${id}"]`);
      if (btn) { btn.classList.add("completed"); btn.onclick = null; }
    }
  }
}

/* ---------- START ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initDropzones();
  applyMesaStateFromSave();
  entrarNoLocal();
});

window.startMinigameLogic = function () {
  initDropzones();
  applyMesaStateFromSave();
  entrarNoLocal();
};

//button back//
document.getElementById("btn-back").addEventListener("click", () => {
  window.location.replace("/city.html");
});