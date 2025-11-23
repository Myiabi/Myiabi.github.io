/* ============================================================
   LÓGICA DO NPC (Executada Apenas no Carregamento)
============================================================ */

// Nota: Assume-se que 'gameData' existe globalmente no seu projeto.
// Se 'gameData' não existir, você deve inicializá-lo:
// const gameData = { npcApareceu: false, mesas: {} }; 

// Probabilidade de 1 em 20
function randomNPC() {
    // Retorna true com 1/20 de chance
    return Math.floor(Math.random() * 20) + 1 === 1;
}

function entrarNoLocal() {
    // Agora usando o div `#npc`
    const npc = document.getElementById("npc");
    
    // Verifica se gameData e npcApareceu existem antes de usar
    if (window.gameData && typeof gameData.npcApareceu !== 'undefined') {
        // 1. Lógica de aparição do NPC
        // Só executa o random SE ainda não tiver aparecido
        if (!gameData.npcApareceu) {
            const apareceu = randomNPC();
            if (apareceu) {
                gameData.npcApareceu = true; // marca como apareceu
            }
        }

        // 2. Exibir baseado no estado atual
        // O NPC só é exibido se gameData.npcApareceu for true.
        if(npc) {
            npc.style.display = gameData.npcApareceu ? "block" : "none";
        }
    }
}

// ============================================================
// DRAG
// ============================================================ 
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

// ============================================================
// DROP
// ============================================================
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

// ============================================================
// CHECAR VITÓRIA POR MESA (CORRIGIDO PARA FECHAMENTO DE MODAL)
// ============================================================
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

        // 1. CORREÇÃO CRUCIAL: Fechar e esconder o modal imediatamente
        const modal = document.getElementById(`game${gameId}`);
        if (modal) {
            modal.classList.remove("active");
            modal.classList.add("hidden"); // Remove o setTimeout para evitar conflito
        }

        // 2. Desabilita a mesa em vez de esconder (usando a classe 'completed')
        const btn = document.querySelector(
            `button[data-modal="game${gameId}"], [data-modal="game${gameId}"]`
        );
        
        if (btn) {
            btn.classList.add("completed");
            // 3. CORREÇÃO CRUCIAL: Remove o listener de evento 'onclick'
            btn.onclick = null; 
        }

        alert(`🔥 Mesa ${gameId} concluída!`);
    }
}

// ============================================================
// DROPZONES (ADICIONADA RESTRIÇÃO ROBUSTA)
// ============================================================
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
        // NOVO: Restringe o movimento à janela de visualização para evitar clipping
        restrict: {
            restriction: 'window', 
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 } 
        }
    });
}

// ============================================================
// SISTEMA DE MODAIS (UNIFICADO E COM CLÁUSULA DE RESGUARDO)
// ============================================================
document.querySelectorAll(".open-btn").forEach((btn) => {
    // Usamos .onclick para que possa ser facilmente anulado em checkAllPlaced
    btn.onclick = () => {
        // Cláusula de Resguardo: Se a mesa estiver concluída, sai imediatamente
        if (btn.classList.contains('completed')) {
            console.log(`Mesa ${btn.dataset.modal} já concluída e desabilitada. Clique ignorado.`);
            return; 
        }
        
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

        // Usa as classes de transição (active) e de estado (hidden)
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
            if (btn) {
                btn.classList.add("completed"); // Aplica o visual de desabilitado
                btn.onclick = null; // Desabilita o clique explicitamente
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
    
    // Inicia a lógica do NPC apenas uma vez no carregamento
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
                    trigger.onclick = null; // Desabilita o clique explicitamente
                }
            }
        }
    }
    
    // Garante que a lógica do NPC é executada
    entrarNoLocal();
    console.log("startMinigameLogic: minigame inicializado");
};