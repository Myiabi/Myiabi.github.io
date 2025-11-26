/* ============================================================
   LÓGICA DO NPC (Executada Apenas no Carregamento)
============================================================ */

function randomNPC() {
    return Math.floor(Math.random() * 25) + 1 === 1;
}

function entrarNoLocal() {
    const npc = document.getElementById("cobra5");

    if (window.gameData && typeof gameData.npcApareceu !== 'undefined') {

        if (!gameData.npcApareceu) {
            const apareceu = randomNPC();
            if (apareceu) gameData.npcApareceu = true;
        }

        if (npc) npc.style.display = gameData.npcApareceu ? "block" : "none";
    }
}


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
   DROP
============================================================ */
function onDrop(e) {
    const zone = e.currentTarget || e.target.closest(".dropzone");
    const item = e.relatedTarget;

    if (!zone) return;

    const gameId = zone.dataset.game;

    if (!gameId) return;

    if (zone.dataset.type && item.classList.contains(`item${zone.dataset.type}`)) {
        item.dataset.placed = "true";
    }

    zone.classList.remove("drop-target");

    checkAllPlaced(gameId);
}

/* ============================================================
   CHECK WIN
============================================================ */
function checkAllPlaced(gameId) {
    const requiredItems = document.querySelectorAll(
        `.draggable[data-game="${gameId}"][data-required]`
    );

    if (requiredItems.length === 0) return;

    const done = [...requiredItems].every(i => i.dataset.placed === "true");

    if (done) {

        if (window.gameData && gameData.mesas) {
            gameData.mesas[gameId] = true;
        }

        const modal = document.getElementById(`game${gameId}`);
        if (modal) {
            modal.classList.remove("active");
            modal.classList.add("hidden");
        }

        const btn = document.querySelector(
            `button[data-modal="game${gameId}"], [data-modal="game${gameId}"]`
        );

        if (btn) {
            btn.classList.add("completed");
            btn.onclick = null;
        }

        alert(`🔥 Mesa ${gameId} concluída!`);
    }
}

/* ============================================================
   INIT DROPZONES — COM BARREIRA REAL DA MODAL
============================================================ */
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
        listeners: { move: dragMoveListener },

        /* 🔥 BARREIRA REAL: impede sair da caixa branca */
        modifiers: [
            interact.modifiers.restrictRect({
                restriction: ".modal-box",
                endOnly: true
            })
        ]
    });
}

/* ============================================================
   MODALS
============================================================ */
document.querySelectorAll(".open-btn").forEach(btn => {
    btn.onclick = () => {
        if (btn.classList.contains('completed')) return;

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

document.querySelectorAll(".close-x").forEach(btn => {
    btn.onclick = () => {
        const id = btn.dataset.close;
        const modal = document.getElementById(id);

        modal.classList.remove("active");
        setTimeout(() => modal.classList.add("hidden"), 200);
    };
});

/* ============================================================
   RESTORE MESAS DO SAVE
============================================================ */
function applyMesaStateFromSave() {
    if (!window.gameData || !gameData.mesas) return;

    for (let id in gameData.mesas) {
        if (gameData.mesas[id]) {
            const btn = document.querySelector(`[data-modal="game${id}"]`);
            if (btn) {
                btn.classList.add("completed");
                btn.onclick = null;
            }
        }
    }
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initDropzones();
    applyMesaStateFromSave();
    entrarNoLocal();
});

window.startMinigameLogic = function () {
    initDropzones();

    if (window.gameData && gameData.mesas) {
        for (let id = 1; id <= 4; id++) {
            if (gameData.mesas[id]) {
                const trigger = document.querySelector(`[data-modal="game${id}"]`);
                if (trigger) {
                    trigger.classList.add("completed");
                    trigger.onclick = null;
                }
            }
        }
    }

    entrarNoLocal();
};
