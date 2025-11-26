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
   LÓGICA DO NPC (Executada Apenas no Carregamento)
============================================================ */

function randomNPC() {
    return Math.floor(Math.random() * 20) + 1 === 1;
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

// 💡 CORREÇÃO: Nova função para acionar a verificação no final do drag.
function onDragEnd(event) {
    // Pega o ID do jogo a partir do item arrastado.
    const gameId = event.target.dataset.game;
    if (gameId) {
        // Garante que a verificação de vitória seja feita após o item
        // ter parado, seja ele solto DENTRO ou FORA de uma dropzone.
        checkAllPlaced(gameId);
    }
}

function onDragEnter(e) {
    e.target.classList.add("drop-target");
    e.relatedTarget.classList.add("can-drop");
}

function onDragLeave(e) {
    e.target.classList.remove("drop-target");
    const item = e.relatedTarget;
    
    item.classList.remove("can-drop");

    // Limpeza dos flags (mantido por boa prática, mas a verificação real
    // acontece no checkAllPlaced)
    item.dataset.placed = "false";
    item.dataset.bad = "false";
    
    // REMOVIDO: Não chama mais checkAllPlaced aqui, para evitar problemas
    // de timing com a atualização da posição. Será chamado no onDragEnd.
}

/* ============================================================
   DROP — com sistema de BAIT
============================================================ */
function onDrop(e) {
    const zone = e.currentTarget || e.target.closest(".dropzone");
    const item = e.relatedTarget;
    // O gameId será obtido e verificado no onDragEnd.
    
    const isRequired = item.hasAttribute("data-required");
    const correctType = item.classList.contains(`item${zone.dataset.type}`);

    if (correctType) {
        // Se a vitória não for acionada, os flags refletem o estado:
        if (isRequired) {
            item.dataset.placed = "true";
            item.dataset.bad = "false";
        } else {
            // BAIT dentro da mesa
            item.dataset.bad = "true";
            item.dataset.placed = "false";
        }
    }

    zone.classList.remove("drop-target");

    // REMOVIDO: Não chama mais checkAllPlaced aqui, para evitar chamada
    // duplicada ou antes do drag realmente terminar. Será chamado no onDragEnd.
}

/* ============================================================
   CHECKALLPLACED — COMPLETO, ROBUSTO E FINAL
============================================================ */
function checkAllPlaced(gameId) {

    const requiredItems = document.querySelectorAll(
        `.draggable[data-game="${gameId}"][data-required="true"]`
    );

    const totalRequired = requiredItems.length;
    const zones = document.querySelectorAll(`.dropzone[data-game="${gameId}"]`);

    let baitInside = false;
    let correctInsideCount = 0;

    // varredura REAL: quais itens estão dentro das zonas?
    zones.forEach(zone => {

        const zoneRect = zone.getBoundingClientRect();

        const items = document.querySelectorAll(`.draggable[data-game="${gameId}"]`);

        items.forEach(item => {

            const itemRect = item.getBoundingClientRect();

            // Lógica de Intersecção (Overlap)
            const overlap =
                !(itemRect.right < zoneRect.left ||
                  itemRect.left > zoneRect.right ||
                  itemRect.bottom < zoneRect.top ||
                  itemRect.top > zoneRect.bottom);

            if (!overlap) return;

            // Item está sobre uma dropzone.
            const isRequired = item.hasAttribute("data-required");
            const correctType = item.classList.contains(`item${zone.dataset.type}`);

            // BAIT DETECTADO: item não-requerido está sobre sua zona correta.
            if (!isRequired && correctType) {
                baitInside = true;
            }

            // Required correto: item requerido está sobre sua zona correta.
            if (isRequired && correctType) {
                correctInsideCount++;
            }
        });
    });

    // BLOQUEIO DE BAIT
    if (baitInside) {
        console.log("❌ Vitória bloqueada: BAIT dentro da mesa");
        return;
    }

    // Ainda não colocou tudo
    if (correctInsideCount !== totalRequired) {
        console.log(`Ainda faltam itens: ${correctInsideCount} de ${totalRequired}`);
        return;
    }

    /* ============================================================
       VITÓRIA — AQUI SIM!
    =========================================================== */
    console.log(`✅ VITÓRIA! Mesa ${gameId} concluída!`);

    if (window.gameData && gameData.mesas) {
        gameData.mesas[gameId] = true; 
    }

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

    alert(`🔥 Mesa ${gameId} concluída!`);
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

    // Configura o item arrastável
    interact(".draggable").draggable({
        inertia: true,
        autoScroll: true,
        listeners: { 
            move: dragMoveListener,
            // 💡 CORREÇÃO: Chama a verificação no final do arrasto.
            end: onDragEnd 
        },
        restrict: {
            restriction: 'window',
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        }
    });
}

/* ============================================================
   MODAIS
============================================================ */
document.querySelectorAll(".open-btn").forEach((btn) => {
    btn.onclick = () => {
        if (btn.classList.contains('completed')) return;

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
   BOTÃO X PARA FECHAR
============================================================ */
document.querySelectorAll(".close-x").forEach(btn => {
    btn.onclick = () => {
        const id = btn.dataset.close;
        const modal = document.getElementById(id);

        modal.classList.remove("active");
        setTimeout(() => modal.classList.add("hidden"), 200);
    };
});

/* ============================================================
   APLICA ESTADO DO SAVE
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
    applyMesaStateFromSave();
    entrarNoLocal();
};