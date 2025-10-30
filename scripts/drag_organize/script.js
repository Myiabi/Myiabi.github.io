// ------------------ Função Modal ------------------
function abrirModal(minigameId) {
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    document.body.appendChild(overlay);
  }

  const minigame = document.getElementById(minigameId);
  if (!minigame) return console.error(`Minigame "${minigameId}" não encontrado.`);

  minigame.style.display = 'block';
  overlay.appendChild(minigame);

  // Botão fechar
  let fecharBtn = document.createElement('button');
  fecharBtn.textContent = '✖';
  fecharBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: #000000aa;
    color: white;
    border: none;
    font-size: 1.2rem;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 8px;
  `;
  fecharBtn.onclick = () => {
    overlay.removeChild(minigame);
    document.body.appendChild(minigame);
    minigame.style.display = 'none';
  };

  overlay.appendChild(fecharBtn);
}

// ------------------ Função Drag & Drop ------------------
function dragMoveListener(event) {
  const target = event.target;
  const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
  target.style.transform = `translate(${x}px, ${y}px)`;
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function onDragEnter(event) {
  const draggableElement = event.relatedTarget;
  const dropzoneElement = event.target;
  dropzoneElement.classList.add("drop-target");
  draggableElement.classList.add("can-drop");
}

function onDragLeave(event) {
  event.target.classList.remove("drop-target");
  event.relatedTarget.classList.remove("can-drop");
  event.relatedTarget.dataset.placed = "false";
}

function onDrop(event) {
  event.target.classList.remove("drop-target");

  const dropzone = event.target;
  const item = event.relatedTarget;

  if (
    (dropzone.id === "dropzoneA" && item.classList.contains("itemA")) ||
    (dropzone.id === "dropzoneB" && item.classList.contains("itemB"))
  ) {
    item.dataset.placed = "true";
  }

  checkAllPlaced();
}

function checkAllPlaced() {
  const allA = document.querySelectorAll(".itemA");
  const allB = document.querySelectorAll(".itemB");

  const allPlaced = [...allA, ...allB].every(
    item => item.dataset.placed === "true"
  );

  if (allPlaced) {
    alert("🎉 Todos os itens estão no lugar certo!");
    document.querySelectorAll(".draggable").forEach(d => d.style.pointerEvents = "none");
  }
}

// ------------------ Inicializa Interact.js ------------------
document.addEventListener("DOMContentLoaded", () => {
  window.dragMoveListener = dragMoveListener;

  interact("#dropzoneA").dropzone({
    accept: ".itemA",
    overlap: 0.75,
    ondragenter: onDragEnter,
    ondragleave: onDragLeave,
    ondrop: onDrop
  });

  interact("#dropzoneB").dropzone({
    accept: ".itemB",
    overlap: 0.75,
    ondragenter: onDragEnter,
    ondragleave: onDragLeave,
    ondrop: onDrop
  });

  interact(".draggable").draggable({
    inertia: true,
    autoScroll: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: "parent",
        endOnly: true
      })
    ],
    listeners: { move: dragMoveListener }
  });
});
