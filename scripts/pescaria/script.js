(() => {
  const root = document.getElementById("fishing-root");
  let sessionActive = false;

  const especies = [
    { nome: "Bass", raridade: "comum", cor: "#000" },
    { nome: "Salmon", raridade: "raro", cor: "#000" },
    { nome: "Golden Koi", raridade: "lendario", cor: "#d4af37" },
    { nome: "Trash", raridade: "comum", cor: "#555" }
  ];

  function randomPeixe() {
    const chance = Math.random();
    if (chance < 0.05) return especies[2]; // lendário
    if (chance < 0.20) return especies[1]; // raro
    if (chance < 0.90) return especies[0]; // comum
    return especies[3]; // lixo
  }

  function randomTamanho() {
    return Math.floor(Math.random() * (2000 - 10 + 1)) + 10;
  }

  function showResultPopup(text, cor) {
    const popup = document.createElement("div");
    popup.className = "result-popup";
    popup.textContent = text;
    if (cor === "#d4af37") popup.classList.add("gold");
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 3000);
  }

  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "fishing-overlay";
    overlay.innerHTML = `
      <div class="fishing-modal">
        <div class="emote" id="fishEmote">🎣</div>
        <div class="waiting" id="fishStatus">Casting... <span id="dots">...</span></div>
        <div class="action-area" id="actionArea">
          <div id="gestureText">Tap</div>
          <div class="hint" id="hintText">Tap</div>
        </div>
      </div>
    `;
    return overlay;
  }

  function startFishing() {
    if (sessionActive) return;
    sessionActive = true;

    const overlay = createOverlay();
    root.appendChild(overlay);

    const emote = overlay.querySelector("#fishEmote");
    const status = overlay.querySelector("#fishStatus");
    const actionArea = overlay.querySelector("#actionArea");
    const gestureText = overlay.querySelector("#gestureText");
    const hintText = overlay.querySelector("#hintText");

    const peixe = randomPeixe();
    const tamanho = randomTamanho();

    // Espera simulada (3s pra teste)
    setTimeout(() => {
      emote.textContent = "❗";
      status.textContent = `${peixe.nome} is biting!`;
      actionArea.classList.add("show");
      startPhases(peixe, tamanho);
    }, 3000);

    const phases = ["Tap", "Hold", "Spin"];
    let phase = 0;

    function startPhases(peixe, tamanho) {
      gestureText.textContent = phases[phase];
      hintText.textContent = phases[phase];

      const phaseTime = 3000; // fixo 3s p/ teste
      const nextPhase = () => {
        phase++;
        if (phase >= phases.length) {
          success(peixe, tamanho);
          return;
        }
        gestureText.textContent = phases[phase];
        hintText.textContent = phases[phase];
        setTimeout(nextPhase, phaseTime);
      };
      setTimeout(nextPhase, phaseTime);
    }

    function success(peixe, tamanho) {
      overlay.remove();
      sessionActive = false;
      const text = `${peixe.nome} obtained (${tamanho}cm)`;
      showResultPopup(text, peixe.cor);
    }
  }

  const rodButton = document.getElementById("rodButton");
  let clickCount = 0;
  rodButton.addEventListener("click", () => {
    clickCount++;
    if (clickCount === 1) {
      setTimeout(() => (clickCount = 0), 400);
    } else if (clickCount === 2) {
      clickCount = 0;
      startFishing();
    }
  });
})();
