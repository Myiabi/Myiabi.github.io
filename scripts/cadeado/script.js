// =====================================================
// ESTADO GLOBAL → mantém o que o jogador deixou sempre
// =====================================================
let initialCurrent = null;

// =====================================================
// FUNÇÃO QUE ABRE O LOCK GAME
// =====================================================
function abrirLockGame() {

    // ====== ÍCONES COMO PNG ======
    const icons = [
        "/assets/img/Locker-symbol-1.png",
        "/assets/img/Locker-symbol-2.png",
        "/assets/img/Locker-symbol-3.png",
        "/assets/img/Locker-symbol-4.png",
        "/assets/img/Locker-symbol-5.png",
        "/assets/img/Locker-symbol-6.png",
        "/assets/img/Locker-symbol-7.png"
    ];

    // ====== SENHA DEFINIDA POR VOCÊ ======
    const secretCode = [6, 5, 2, 0];

    // ====== DEFINE O ESTADO INICIAL SE FOR A PRIMEIRA VEZ ======
    if (!initialCurrent) {
        // começa longe da senha (aleatório)
        initialCurrent = Array.from({ length: 4 }, () =>
            Math.floor(Math.random() * icons.length)
        );
    }

    // AGORA current APONTA PARA O MESMO ARRAY
    const current = initialCurrent;

    // =====================================================
    // MODAL
    // =====================================================
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.background = "rgba(0,0,0,0.4)";
    document.body.appendChild(modal);

    // Fecha ao clicar fora
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // =====================================================
    // WRAPPER DO CADEADO
    // =====================================================
    const lockWrapper = document.createElement("div");
    lockWrapper.style.width = "40vw";
    lockWrapper.style.maxWidth = "240px";
    lockWrapper.style.aspectRatio = "1/1.4";
    lockWrapper.style.position = "relative";

    lockWrapper.style.backgroundImage = "url('/assets/img/Locker.png')";
    lockWrapper.style.backgroundSize = "contain";
    lockWrapper.style.backgroundRepeat = "no-repeat";
    lockWrapper.style.backgroundPosition = "center";

    modal.appendChild(lockWrapper);

    // =====================================================
    // ÁREA DOS DÍGITOS
    // =====================================================
    const digitsArea = document.createElement("div");
    digitsArea.style.position = "absolute";
    digitsArea.style.width = "90%";
    digitsArea.style.height = "30%";
    digitsArea.style.top = "42%";
    digitsArea.style.left = "3.2%";
    digitsArea.style.display = "flex";
    digitsArea.style.justifyContent = "center";
    digitsArea.style.alignItems = "center";
    digitsArea.style.gap = "8.6%";

    lockWrapper.appendChild(digitsArea);

    const slots = [];

    // =====================================================
    // SLOTS (4)
    // =====================================================
    for (let i = 0; i < 4; i++) {

        const slot = document.createElement("div");

        slot.style.width = "12%";
        slot.style.aspectRatio = "1 / 1";
        slot.style.height = "26%";
        slot.style.cursor = "pointer";

        // Imagem inicial (PEGANDO O ESTADO SALVO!)
        slot.style.backgroundImage = `url("${icons[current[i]]}")`;
        slot.style.backgroundSize = "contain";
        slot.style.backgroundRepeat = "no-repeat";
        slot.style.backgroundPosition = "center";

        // Delay
        slot.blocked = false;

        slot.onclick = () => {
            if (slot.blocked) return;

            slot.blocked = true;
            setTimeout(() => (slot.blocked = false), 200);

            // Avança em SEQUÊNCIA
            current[i] = (current[i] + 1) % icons.length;

            // Atualiza visual
            slot.style.backgroundImage = `url("${icons[current[i]]}")`;

            checkWin();
        };

        digitsArea.appendChild(slot);
        slots.push(slot);
    }

    // =====================================================
    // VERIFICA SE GANHOU
    // =====================================================
    function checkWin() {
        if (current.every((v, i) => v === secretCode[i])) {
            win();
        }
    }

    // =====================================================
    // VITÓRIA
    // =====================================================
    function win() {
        const audio = new Audio("/assets/sounds/win.mp3");
        audio.play();

        // desativa todos os slots imediatamente ao vencer
    slots.forEach(slot => {
    slot.style.pointerEvents = "none";
});


        // esconde botão do cadeado se existir
        const btn = document.getElementById("padlock");
        if (btn) btn.style.display = "none";

        // SALVA estado como senha correta
        // (assim se abrir de novo, fica "desbloqueado")
        initialCurrent = [...secretCode];

        // Fecha com delay
        setTimeout(() => {
            modal.remove();
        }, 3000);
    }
}
