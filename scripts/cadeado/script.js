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

    // Estado inicial aleatório
    const current = Array.from({ length: 4 }, () =>
        Math.floor(Math.random() * icons.length)
    );

    // Modal
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

    // Wrapper → transparente + PNG do cadeado
    const lockWrapper = document.createElement("div");
    lockWrapper.style.width = "40vw";
    lockWrapper.style.maxWidth = "240px";
    lockWrapper.style.aspectRatio = "1/1.4";
    lockWrapper.style.position = "relative";
    lockWrapper.style.backgroundColor = "transparent";

    lockWrapper.style.backgroundImage = "url('/assets/img/Locker.png')";
    lockWrapper.style.backgroundSize = "contain";
    lockWrapper.style.backgroundRepeat = "no-repeat";
    lockWrapper.style.backgroundPosition = "center";

    modal.appendChild(lockWrapper);

    // ======= ÁREA DOS DÍGITOS =======
    const digitsArea = document.createElement("div");
    digitsArea.style.position = "absolute";
    digitsArea.style.width = "90%";
    digitsArea.style.height = "30%";
    digitsArea.style.top = "42%";
    digitsArea.style.left = "3%";
    digitsArea.style.display = "flex";
    digitsArea.style.border = "2px solid transparent";
    digitsArea.style.justifyContent = "center";
    digitsArea.style.alignItems = "center";
    digitsArea.style.gap = "7%";

    lockWrapper.appendChild(digitsArea);

    const slots = [];

    // ======= SLOTS =======
    for (let i = 0; i < 4; i++) {

        const slot = document.createElement("div");

        slot.style.width = "12%";
        slot.style.aspectRatio = "1 / 1";
        slot.style.height = "26%";
        slot.style.backgroundColor = "transparent";
        slot.style.border = "2px solid transparent";
        slot.style.cursor = "pointer";

        // Imagem inicial
        slot.style.backgroundImage = `url("${icons[current[i]]}")`;
        slot.style.backgroundSize = "contain";
        slot.style.backgroundRepeat = "no-repeat";
        slot.style.backgroundPosition = "center";

        // ===== DELAY DE 0.5s =====
        slot.blocked = false;

        slot.onclick = () => {
            if (slot.blocked) return;

            slot.blocked = true;
            setTimeout(() => (slot.blocked = false), 200);

            // >>> AVANÇA EM SEQUÊNCIA <<<
            current[i] = (current[i] + 1) % icons.length;

            slot.style.backgroundImage = `url("${icons[current[i]]}")`;

            checkWin();
        };

        digitsArea.appendChild(slot);
        slots.push(slot);
    }

    function checkWin() {
        if (current.every((v, i) => v === secretCode[i])) {
            win();
        }
    }

    function win() {
        const audio = new Audio("/assets/sounds/win.mp3");
        audio.play();

        const btn = document.getElementById("padlock");
        if (btn) btn.style.display = "none";

        setTimeout(() => {
            modal.remove();
        }, 3000);
    }
}
