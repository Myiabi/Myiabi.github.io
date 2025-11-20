/* ============================================================
   DRAG
============================================================ */
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

/* ============================================================
   DROP — AGORA ROBUSTO
============================================================ */
function onDrop(e) {
  const zone = e.currentTarget || e.target.closest(".dropzone");
  const item = e.relatedTarget;

  if (!zone) {
    console.warn("onDrop: zone não encontrada", e);
    return;
  }

  const gameId = zone.dataset.game;

  if (!gameId) {
    console.warn("onDrop: dropzone sem data-game:", zone);
    return;
  }

  if (zone.dataset.type && item.classList.contains(`item${zone.dataset.type}`)) {
    item.dataset.placed = "true";
    console.log(
      `✔ onDrop: item ${item.className} colocado na zona ${zone.dataset.type} (game ${gameId})`
    );
  } else {
    console.log(
      `✖ onDrop: item NÃO combina com a zona (zone=${zone.dataset.type}, item=${item.className})`
    );
  }

  zone.classList.remove("drop-target");

  checkAllPlaced(gameId);
}

/* ============================================================
   CHECAR VITÓRIA POR MESA
============================================================ */
function checkAllPlaced(gameId) {
  const requiredItems = document.querySelectorAll(
    `.draggable[data-game="${gameId}"][data-required]`
  );

  console.log(
    `checkAllPlaced: mesa ${gameId} — itens obrigatórios encontrados:`,
    requiredItems.length
  );

  if (requiredItems.length === 0) {
    console.warn(
      `⚠ Mesa ${gameId} não tem itens com data-required (nenhuma vitória será detectada)`
    );
    return;
  }

  const done = [...requiredItems].every((i) => i.dataset.placed === "true");

  console.log(`checkAllPlaced: mesa ${gameId} → done = ${done}`);

  if (done) {
    // 🔥 SALVA NO SISTEMA DE SAVE
    if (window.gameData && gameData.mesas) {
      gameData.mesas[gameId] = true; // Proxy já salva automaticamente
      console.log(`💾 Mesa ${gameId} salva como concluída`);
    }

    // esconde modal
    const modal = document.getElementById(`game${gameId}`);
    if (modal) {
      modal.classList.remove("active");
      setTimeout(() => modal.classList.add("hidden"), 200);
    }

    // esconde botão de abrir mesa
    const btn = document.querySelector(
      `button[data-modal="game${gameId}"], [data-modal="game${gameId}"]`
    );
    if (btn) btn.style.display = "none";

    alert(`🔥 Mesa ${gameId} concluída!`);
  }
}

/* ============================================================
   DROPZONES
============================================================ */
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

  interact(".draggable").draggable({
    inertia: true,
    autoScroll: true,
    listeners: { move: dragMoveListener },
  });
}

/* ============================================================
   SISTEMA DE MODAIS
============================================================ */
document.querySelectorAll(".open-btn").forEach((btn) => {
  btn.onclick = () => {
    const id = btn.dataset.modal;
    const modal = document.getElementById(id);

    modal.classList.add("active");
    modal.classList.remove("hidden");
  };
});

document.querySelectorAll(".close-btn").forEach((btn) => {
  btn.onclick = () => {
    const id = btn.dataset.close;
    const modal = document.getElementById(id);

    modal.classList.remove("active");
    setTimeout(() => modal.classList.add("hidden"), 200);
  };
});

/* ============================================================
   APLICAR ESTADO DO SAVE NAS MESAS
============================================================ */
function applyMesaStateFromSave() {
  if (!window.gameData || !gameData.mesas) return;

  for (let id in gameData.mesas) {
    if (gameData.mesas[id]) {
      const btn = document.querySelector(`[data-modal="game${id}"]`);
      if (btn) btn.style.display = "none"; // já estava concluída
    }
  }
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  initDropzones();
  applyMesaStateFromSave();
});

window.startMinigameLogic = function () {
  initDropzones();

  if (window.gameData && gameData.mesas) {
    for (let id = 1; id <= 4; id++) {
      if (gameData.mesas[id]) {
        const trigger = document.querySelector(`[data-modal="game${id}"]`);
        if (trigger) trigger.style.display = "none";
      }
    }
  }

  console.log("startMinigameLogic: minigame inicializado");
};
