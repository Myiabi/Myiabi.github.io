
/* ---------------------- NOTA DO ENIGMA ---------------------- */
function toggleRiddle(e) {
  if(e) e.stopPropagation(); 
  const note = document.getElementById("riddle-note");
  note.classList.toggle("expanded");
}

/* ---------------------- VARIÁVEIS LOCAIS ---------------------- */
const container = document.getElementById("container");

let dragSrc = null;
let isTouchDragging = false;
let isSolved = false;
let ghost = null;
let lastHighlight = null;

/* ---------------------- UTILITÁRIOS ---------------------- */
function isLocked() { return isSolved; }

function clearDragState() {
  removeGhost();
  if (lastHighlight) {
    lastHighlight.classList.remove("highlight");
    lastHighlight = null;
  }
  isTouchDragging = false;
  dragSrc = null;
}

/* ---------------------- GHOST VISUAL ---------------------- */
function createGhost(item, x = 0, y = 0) {
  removeGhost();
  ghost = item.cloneNode(true);
  ghost.classList.add("drag-ghost");

  const rect = item.getBoundingClientRect();
  ghost.style.width = rect.width + "px";
  ghost.style.height = rect.height + "px";

  document.body.appendChild(ghost);
  moveGhost(x, y);
}

function moveGhost(x, y) {
  if (!ghost) return;
  ghost.style.left = x - ghost.offsetWidth / 2 + "px";
  ghost.style.top = y - ghost.offsetHeight / 2 + "px";
}

function removeGhost() {
  if (ghost) {
    ghost.remove();
    ghost = null;
  }
}

/* ---------------------- HIGHLIGHT ---------------------- */
function updateHighlight(x, y) {
  if (lastHighlight) {
    lastHighlight.classList.remove("highlight");
    lastHighlight = null;
  }
  const el = document.elementFromPoint(x, y);
  const item = el && el.closest(".item");
  if (item && !isLocked()) {
    item.classList.add("highlight");
    lastHighlight = item;
  }
}

/* ---------------------- DRAG DESKTOP ---------------------- */
container.addEventListener("dragstart", e => {
  if (isLocked()) return e.preventDefault();
  const item = e.target.closest(".item");
  if (!item) return;

  dragSrc = item;
  const img = document.createElement("img");
  img.src = "";
  try { e.dataTransfer.setDragImage(img, 0, 0); } catch(e) {}
  createGhost(item, e.clientX, e.clientY);
});

container.addEventListener("dragover", e => {
  if (isLocked()) return;
  e.preventDefault();
  moveGhost(e.clientX, e.clientY);
  updateHighlight(e.clientX, e.clientY);
});

container.addEventListener("drop", e => {
  if (isLocked()) return;
  e.preventDefault();
  const dropTarget = e.target.closest(".item");
  removeGhost();
  if (!dropTarget) { clearDragState(); return; }
  performSwap(dropTarget);
});

container.addEventListener("dragend", () => clearDragState());

/* ---------------------- TOUCH (POINTER) ---------------------- */
container.addEventListener("pointerdown", e => {
  if (isLocked()) return;
  const item = e.target.closest(".item");
  if (!item) return;

  isTouchDragging = true;
  dragSrc = item;
  createGhost(item, e.clientX, e.clientY);
  try { item.setPointerCapture && item.setPointerCapture(e.pointerId); } catch (err) {}
});

container.addEventListener("pointermove", e => {
  if (!isTouchDragging || isLocked()) return;
  moveGhost(e.clientX, e.clientY);
  updateHighlight(e.clientX, e.clientY);
});

container.addEventListener("pointerup", e => {
  if (!isTouchDragging || isLocked()) return;
  const tgt = document.elementFromPoint(e.clientX, e.clientY);
  const dropTarget = tgt && tgt.closest(".item");
  removeGhost();
  if (!dropTarget) { clearDragState(); return; }
  performSwap(dropTarget);
  clearDragState();
});

/* ---------------------- FALLBACKS GLOBAIS ---------------------- */
document.addEventListener("pointerup", e => {
  if (!isTouchDragging) return;
  const tgt = document.elementFromPoint(e.clientX, e.clientY);
  const dropTarget = tgt && tgt.closest(".item");
  removeGhost();
  if (dropTarget) performSwap(dropTarget);
  clearDragState();
});

document.addEventListener("drop", (e) => {
  if (!dragSrc) return;
  const dropTarget = e.target.closest && e.target.closest(".item");
  if (!dropTarget) { removeGhost(); clearDragState(); }
});

document.addEventListener("dragend", () => { removeGhost(); clearDragState(); });

/* ---------------------- LÓGICA DE TROCA ---------------------- */
function performSwap(dropTarget) {
  if (!dropTarget || dropTarget === dragSrc) return;

  dropTarget.classList.remove("highlight");
  if (lastHighlight === dropTarget) lastHighlight = null;
  dragSrc.classList.remove("highlight");

  const firstRect = dropTarget.getBoundingClientRect();
  const srcClone = dragSrc.cloneNode(true);
  const tgtClone = dropTarget.cloneNode(true);

  srcClone.classList.remove("highlight");
  tgtClone.classList.remove("highlight");

  dragSrc.replaceWith(tgtClone);
  dropTarget.replaceWith(srcClone);

  const lastRect = tgtClone.getBoundingClientRect();
  const dx = firstRect.left - lastRect.left;
  const dy = firstRect.top - lastRect.top;

  tgtClone.style.transition = "none";
  tgtClone.style.transform = `translate(${dx}px, ${dy}px)`;

  requestAnimationFrame(() => {
    tgtClone.style.transition = "transform 260ms ease";
    tgtClone.style.transform = "translate(0,0)";
  });

  dragSrc = null;
  checkOrder();
}

/* ---------------------- CHECAGEM DE VITÓRIA ---------------------- */
function checkOrder() {
  const order = Array.from(container.children).map(el => el.dataset.value).join("");

  if (order === "12345") {
    // Apenas trava visualmente e fecha o modal.
    // O seu sistema externo (proxy/save) deve detectar o estado ou ouvir eventos.
    isSolved = true;
    gameData.visualState.minigame2 = true;
    disablePuzzle();
    setTimeout(closeModal, 500); 
  }
}

/* ---------------------- BLOQUEIO INTERNO ---------------------- */
function disablePuzzle() {
  container.querySelectorAll(".item").forEach(item => {
    item.draggable = false;
    item.style.pointerEvents = "none";
    item.style.cursor = "default";
    item.classList.remove("highlight");
  });
}

/* ---------------------- MODAL ---------------------- */
function openModal() {
  document.getElementById("modalSequencia").style.display = "flex";
  // Se quiser que ele verifique se já ganhou ao abrir, teria que ter lógica aqui,
  // mas como pediu pra tirar tudo, ele abre sempre "jogável" a menos que isSolved local esteja true.
  if (isSolved) setTimeout(closeModal, 2000);
}

function closeModal() {
  document.getElementById("modalSequencia").style.display = "none";
}

// Botão de voltar (se existir no HTML)
const btnBack = document.getElementById("btn-back");
if(btnBack) {
    btnBack.addEventListener("pointerdown", (e) => {
        const destino = e.target.getAttribute("data-destino");
        if (destino) window.location.href = destino;
    });
}

