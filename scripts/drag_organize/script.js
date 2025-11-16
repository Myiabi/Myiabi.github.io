// --------------------- DRAG ---------------------
function dragMoveListener(event) {
  const t = event.target;
  const x = (parseFloat(t.dataset.x) || 0) + event.dx;
  const y = (parseFloat(t.dataset.y) || 0) + event.dy;

  t.style.transform = `translate(${x}px, ${y}px)`;
  t.dataset.x = x;
  t.dataset.y = y;
}

function onDragEnter(e) {
  e.target.classList.add("drop-target");
  e.relatedTarget.classList.add("can-drop");
}

function onDragLeave(e) {
  e.target.classList.remove("drop-target");
  e.relatedTarget.classList.remove("can-drop");
  e.relatedTarget.dataset.placed = "false";
}

function onDrop(e) {
  const zone = e.target;
  const item = e.relatedTarget;
  const gameId = zone.dataset.game;

  if (zone.dataset.type && item.classList.contains(`item${zone.dataset.type}`)) {
    item.dataset.placed = "true";
  }

  zone.classList.remove("drop-target");

  checkAllPlaced(gameId);
}


// --------------------- WIN CHECK POR JOGO ---------------------
function checkAllPlaced(gameId) {
  const items = document.querySelectorAll(`.draggable[data-game="${gameId}"]`);
  const done = [...items].every(i => i.dataset.placed === "true");

  if (done) {

    // ⭐ AQUI É SEU ESPAÇO RESERVADO (efeitos, som, pontuação...)
    // ex:
    // playSound("win1.mp3");
    // adicionarPontos(100);
    // console.log("Ganhou o jogo", gameId);

    const modal = document.getElementById(`game${gameId}`);
    modal.classList.remove("active");

    setTimeout(() => modal.classList.add("hidden"), 200);

    const btn = document.querySelector(`button[data-modal="game${gameId}"]`);
    if (btn) btn.style.display = "none";

    alert(`🔥 Mesa ${gameId} concluída!`);
  }
}


// --------------------- INIT DROPZONES ---------------------
function initDropzones() {
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

  interact(".draggable").draggable({
    inertia: true,
    autoScroll: true,
    listeners: { move: dragMoveListener }
  });
}


// --------------------- MODAL SYS ---------------------
document.querySelectorAll(".open-btn").forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.modal;
    const modal = document.getElementById(id);

    modal.classList.add("active");
    modal.classList.remove("hidden");
  };
});

document.querySelectorAll(".close-btn").forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.close;
    const modal = document.getElementById(id);

    modal.classList.remove("active");
    setTimeout(() => modal.classList.add("hidden"), 200);
  };
});

document.addEventListener("DOMContentLoaded", initDropzones);
