// ========== VERIFICAÇÃO DE DESAFIOS JÁ COMPLETADOS ==========

if (typeof unlockAchievement === "function") {
  unlockAchievement("boss");
}

document.querySelectorAll(".back").forEach((p) => {
  p.addEventListener("click", () => {
    // VERIFICAÇÃO DE JOGO JÁ ZERADO (bloqueio permanente)
    if (
      p.dataset.destino.includes("dropmoon") &&
      localStorage.getItem("dropmoon_completo") === "true"
    ) {
      alert("Você já completou esse desafio!");
      return;
    }
    if (
      p.dataset.destino.includes("wendigo") &&
      localStorage.getItem("wendigo_completo") === "true"
    ) {
      alert("Você já completou esse desafio!");
      return;
    }

    // Segue o baile
    window.location.replace(p.dataset.destino);
  });
});

// neve //
function criarNeve() {
  // 1. Cria o container se não existir
  let container = document.getElementById("snow-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "snow-container";
    document.body.appendChild(container); // Ou dentro do #scene se preferir
  }

  // 2. Configurações
  const quantidadeFlocos = 50; // Aumente para nevasca, diminua para garoa leve

  for (let i = 0; i < quantidadeFlocos; i++) {
    const flake = document.createElement("div");
    flake.classList.add("snowflake");

    // --- ALEATORIEDADE (O segredo da beleza) ---

    // Posição horizontal (0 a 100vw)
    flake.style.left = Math.random() * 100 + "vw";

    // Tamanho (entre 2px e 5px) - Cria profundidade
    const size = Math.random() * 3 + 2 + "px";
    flake.style.width = size;
    flake.style.height = size;

    // FIX MOBILE: Força cor branca inline (alguns browsers mobile ignoram CSS)
    flake.style.backgroundColor = "#ffffff";
    flake.style.background = "#ffffff";

    // Opacidade (alguns mais transparentes que outros)
    flake.style.opacity = Math.random() * 0.9 + 0.6;

    // Duração da queda (entre 5s e 15s) - Uns caem rápido, outros planam
    const duration = Math.random() * 10 + 5 + "s";
    const animValue = `snowfall ${duration} linear infinite`;
    flake.style.animation = animValue;
    flake.style.webkitAnimation = animValue; // FIX: Prefixo para Safari/iOS

    // Atraso inicial (pra não caírem todos juntos no load da página)
    const delay = Math.random() * 5 + "s";
    flake.style.animationDelay = delay;
    flake.style.webkitAnimationDelay = delay; // FIX: Prefixo para Safari/iOS

    container.appendChild(flake);
  }
}

// 🔥 CHAMA A FUNÇÃO PRA NEVAR
criarNeve();

// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("city");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();
