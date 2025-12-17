// --- CONFIGURAÇÕES GLOBAIS ---
var jardim = false; // A variável que você pediu pra ativar no final
const HOLD_TIME = 2000; // Tempo segurando (2 segundos)
const TOTAL_ITEMS = 12; // Total de itens para achar

let itemsFoundCount = 0;
let holdTimer = null;
let isHolding = false;

// Elementos do DOM
const gameContainer = document.getElementById("gameContainer");
const loader = document.getElementById("cursorLoader");
const loaderCircle = loader.querySelector(".circle");
const errorMarker = document.getElementById("errorMarker");

// =================================================================
// 💾 SISTEMA DE SAVE (INICIALIZAÇÃO)
// =================================================================
// Esse bloco roda assim que o jogo abre para restaurar o que já foi feito
(function carregarEstadoMinigame() {
  // Verifica se o gameData existe (do seu outro script)
  if (typeof gameData !== "undefined") {
    // Garante que o objeto de itens existe no save
    if (!gameData.itensJardim) gameData.itensJardim = {};

    // Percorre os itens salvos e atualiza a tela
    Object.keys(gameData.itensJardim).forEach((itemId) => {
      if (gameData.itensJardim[itemId]) {
        itemsFoundCount++; // Atualiza o contador para não zerar no F5

        // 1. Esconde o item do jardim visualmente
        const itemDiv = document.getElementById(itemId);
        if (itemDiv) {
          itemDiv.classList.add("revealed");
          const img = itemDiv.querySelector("img");
          if (img) img.style.opacity = "0"; // Garante que fique invisível
        }

        // 2. Acende o item na HUD lá em cima
        const hudTarget = document.querySelector(
          `.hud-item[data-target="${itemId}"]`
        );
        if (hudTarget) {
          hudTarget.classList.add("found");
        }
      }
    });

    // Se já tinha vencido antes, atualiza a variável local
    if (gameData.jardimCompleto) {
      jardim = true;
    }
  }
})();

// --- CONTROLE DO MODAL ---
function openGame() {
  // [SAVE] Bloqueia se já venceu
  if (gameData && gameData.jardimCompleto) {
    console.log("Minigame já finalizado.");
    return;
  }
  document.getElementById("gameModal").style.display = "flex";
}

function closeGame() {
  document.getElementById("gameModal").style.display = "none";
}

// =================================================================
// LÓGICA DE INPUT (MOUSE E TOUCH)
// =================================================================

function startHold(e) {
  // Se clicar num item já revelado, ignora
  if (e.target.classList.contains("revealed") || e.target.closest(".revealed"))
    return;

  // Evita scroll e comportamentos padrão no celular
  if (e.cancelable) e.preventDefault();

  isHolding = true;

  // Unifica coordenadas de Mouse e Touch
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  updateLoaderPosition(clientX, clientY);
  loader.style.display = "block";

  // Reinicia animação do loader
  loaderCircle.style.transition = "none";
  loaderCircle.setAttribute("stroke-dasharray", "0, 100");

  // Pequeno delay pro navegador processar
  setTimeout(() => {
    if (isHolding) {
      loaderCircle.style.transition = `stroke-dasharray ${HOLD_TIME}ms linear`;
      loaderCircle.setAttribute("stroke-dasharray", "100, 100");
    }
  }, 10);

  // Inicia o timer
  holdTimer = setTimeout(() => {
    finishHold(e.target, clientX, clientY);
  }, HOLD_TIME);
}

function cancelHold() {
  if (!isHolding) return;
  isHolding = false;
  clearTimeout(holdTimer);
  loader.style.display = "none";
  loaderCircle.setAttribute("stroke-dasharray", "0, 100");
}

function finishHold(targetElement, x, y) {
  isHolding = false;
  loader.style.display = "none";

  // Verifica se o que foi segurado é um item válido
  const item = targetElement.closest(".hidden-item");

  if (item && !item.classList.contains("revealed")) {
    // ACERTOU!
    revealItem(item);
  } else {
    // ERROU!
    showError(x, y);
  }
}

function updateLoaderPosition(x, y) {
  const rect = gameContainer.getBoundingClientRect();
  loader.style.left = x - rect.left + "px";
  loader.style.top = y - rect.top + "px";
}

function showError(x, y) {
  // if (typeof tocarEfeito === "function") tocarEfeito('erro');
  const rect = gameContainer.getBoundingClientRect();
  errorMarker.style.left = x - rect.left + "px";
  errorMarker.style.top = y - rect.top + "px";

  // Adiciona a classe que dispara a nova animação
  errorMarker.classList.add("animate");

  // Remove a classe depois que a animação acaba pra poder usar de novo
  setTimeout(() => {
    errorMarker.classList.remove("animate");
  }, 600); // 600ms = tempo da animação no CSS
}

// =================================================================
// ANIMAÇÃO E VITÓRIA (AQUI ESTÃO OS SEUS PONTOS)
// =================================================================

function revealItem(itemDiv) {
  // [1] TRAVA O BOTÃO FECHAR (Fica cinza e não clica)
  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn) closeBtn.classList.add("disabled");
  // -------------------------------------------------------

  if (typeof tocarEfeito === "function") tocarEfeito();

  const itemId = itemDiv.id;

  // [SAVE]
  if (typeof gameData !== "undefined") {
    gameData.itensJardim[itemId] = true;
  }

  itemDiv.classList.add("revealed");

  // Cria o clone voador
  const startRect = itemDiv.getBoundingClientRect();
  const imgSrc = itemDiv.querySelector("img").src;

  const flyer = document.createElement("div");
  flyer.classList.add("flying-item");
  flyer.innerHTML = `<img src="${imgSrc}">`;

  flyer.style.left = startRect.left + "px";
  flyer.style.top = startRect.top + "px";
  flyer.style.width = startRect.width + "px";
  flyer.style.height = startRect.height + "px";

  document.body.appendChild(flyer);

  requestAnimationFrame(() => {
    // Estágio 1: Vai pro centro
    flyer.style.top = "50%";
    flyer.style.left = "50%";
    flyer.style.transform = "translate(-50%, -50%)";
    flyer.style.width = "150px";
    flyer.style.height = "150px";

    // Estágio 2: Espera 3s
    setTimeout(() => {
      const hudTarget = document.querySelector(
        `.hud-item[data-target="${itemId}"]`
      );

      if (hudTarget) {
        const targetRect = hudTarget.getBoundingClientRect();

        // Estágio 3: Voa pra HUD
        flyer.style.transform = "translate(0, 0)";
        flyer.style.left = targetRect.left + "px";
        flyer.style.top = targetRect.top + "px";
        flyer.style.width = targetRect.width + "px";
        flyer.style.height = targetRect.height + "px";
        flyer.style.border = "none";

        // Estágio 4: Finaliza
        setTimeout(() => {
          flyer.remove();
          hudTarget.classList.add("found");

          // [2] DESTRAVA O BOTÃO FECHAR (Volta ao normal)
          if (closeBtn) closeBtn.classList.remove("disabled");
          // -------------------------------------------------------

          checkVictory();
        }, 800);
      } else {
        flyer.remove();
        if (closeBtn) closeBtn.classList.remove("disabled"); // Segurança
      }
    }, 3000);
  });
}

// =================================================================
// POPUP DE VITÓRIA (Estilo Presilha)
// =================================================================
function showWinPopup(imgSrc, title, subtitle = "", description = "") {
  // Cria o elemento do popup
  const popup = document.createElement("div");
  popup.className = "win-popup";

  popup.innerHTML = `
        <img src="${imgSrc}" class="win-popup-img" alt="${title}">
        <p class="win-popup-title">${title}</p>
        ${subtitle ? `<p class="win-popup-subtitle">${subtitle}</p>` : ""}
        ${description ? `<p class="win-popup-desc">${description}</p>` : ""}
    `;

  document.body.appendChild(popup);

  // Anima a entrada
  requestAnimationFrame(() => {
    popup.classList.add("show");
  });

  // Remove depois de 4 segundos
  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hide");
    setTimeout(() => popup.remove(), 400);
  }, 4000);
}

function checkVictory() {
  itemsFoundCount++;

  if (itemsFoundCount >= TOTAL_ITEMS) {
    // Espera 1s pra animação final acabar antes de dar o aviso
    setTimeout(() => {
      // [2] LOCAL PARA TOCAR O SOM DE VITÓRIA FINAL E VARIAVEL

      if (typeof tocarEfeito === "function") {
        tocarEfeito("win3");
      }

      // >>> POPUP DE VITÓRIA <<<
      showWinPopup(
        "/assets/img/Honey.png", // <-- COLOQUE SUA IMAGEM AQUI
        "Jardim Completo!",
        "VOCÊ CONSEGUIU! 🎉",
        "Todos os itens foram encontrados!"
      );

      mudarCenario(personagens.lily, "final");

      jardim = true; // <--- VARIAVEL ATIVADA AQUI
      console.log("Variável jardim = true");

      // [SAVE] Salva a vitória no sistema global
      if (typeof gameData !== "undefined") {
        gameData.jardimCompleto = true;

        // Se quiser achievement, descomente:

      gameData.incubadora.hasJelly = true;
          }

      closeGame(); // Fecha o modal ao vencer
    }, 1000);
  }
}

// --- EVENT LISTENERS ---
gameContainer.addEventListener("mousedown", startHold);
window.addEventListener("mouseup", cancelHold);

gameContainer.addEventListener("touchstart", startHold, { passive: false });
window.addEventListener("touchend", cancelHold);
window.addEventListener("touchcancel", cancelHold);

gameContainer.addEventListener("contextmenu", (e) => e.preventDefault());

function perguntarAntesDeAbrir() {
  // 1. Verificação de segurança (pra não perguntar se já zerou)
  if (typeof gameData !== "undefined" && gameData.jardimCompleto) {
    alert("Você já completou o jardim!");
    return;
  }

  // 2. Chama o seu modal novo
  // Parametro 1: O Texto
  // Parametro 2: A função que roda no YES (sem os parênteses)
  ConfirmModal.ask("Deseja entrar no Jardim Secreto?", openGame);
}

// =================================================================
// 🐛 DEBUG - REMOVER EM PRODUÇÃO
// =================================================================
function debugWin() {
  // Força o contador para o máximo menos 1
  itemsFoundCount = TOTAL_ITEMS - 1;

  // Marca todos os itens como encontrados visualmente
  document.querySelectorAll(".hidden-item").forEach((item) => {
    item.classList.add("revealed");
    const img = item.querySelector("img");
    if (img) img.style.opacity = "0";

    // Salva no gameData
    if (typeof gameData !== "undefined") {
      gameData.itensJardim[item.id] = true;
    }
  });

  // Acende todos na HUD
  document.querySelectorAll(".hud-item").forEach((hud) => {
    hud.classList.add("found");
  });

  // Dispara a vitória
  checkVictory();

  console.log("🐛 DEBUG: Vitória forçada!");
}
