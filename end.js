// Função auxiliar para esperar
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// === CITY SCENE (Final) ===
// Criar neve na city scene
function criarNeveCity() {
  let container = document.getElementById("city-snow-container");
  if (!container) return;

  const quantidadeFlocos = 50;

  for (let i = 0; i < quantidadeFlocos; i++) {
    const flake = document.createElement("div");
    flake.classList.add("city-snowflake");

    flake.style.left = Math.random() * 100 + "vw";

    const size = Math.random() * 3 + 2 + "px";
    flake.style.width = size;
    flake.style.height = size;

    flake.style.opacity = Math.random() * 0.9 + 0.6;

    const duration = Math.random() * 10 + 5 + "s";
    flake.style.animation = `city-snowfall ${duration} linear infinite`;

    flake.style.animationDelay = Math.random() * 5 + "s";

    container.appendChild(flake);
  }
}

// Inicia a cena quando a página carregar
window.addEventListener("load", () => {
  const cityScene = document.getElementById("city-scene");

  // Mostra cidade
  cityScene.classList.add("visible");
  criarNeveCity();

  console.log("City Scene iniciada!");

  // Configurar os tooltips
  setupEndTooltips();

  // Muda o cenário de aiko para "final"
  if (
    typeof mudarCenario === "function" &&
    typeof personagens !== "undefined"
  ) {
    mudarCenario(personagens.aiko, "final");
  }
});

// Função para criar todos os tooltips dos personagens
function setupEndTooltips() {
  const tooltipStyle = `
    color: #fff; 
    background: linear-gradient(135deg, #2c3e50 0%, #1a252f 100%); 
    border: 2px solid #3498db; 
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4); 
    padding: 8px 15px; 
    border-radius: 12px; 
    font-size: 14px; 
    font-weight: bold; 
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
    text-align: center;
  `;

  // NPCs principais
  createFloatingTooltip(
    "marinend",
    "Now stay quiet my children!",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip("nanaend", "Thank you!", 0, -10, tooltipStyle, true);
  createFloatingTooltip(
    "nodataend",
    "Finally together with my husband.",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip("aiko", "hey!", 0, -10, tooltipStyle, true);
  createFloatingTooltip(
    "barend",
    "Come celebrate at the Bar.",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "assisend",
    "Was all this happening?",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "maidend",
    "I finished my work!",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "felend",
    "I liked the cold.",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "wendend",
    "I knew I could do it.",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "wayend",
    "Come back here Hitachi!",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "myopend",
    "What a pleasant day!",
    0,
    -10,
    tooltipStyle,
    true
  );

  // Cobras/Snakes
  createFloatingTooltip("kofongoend", "tehee~", 0, -10, tooltipStyle, true);
  createFloatingTooltip("aldebaranend", "...", 0, -10, tooltipStyle, true);
  createFloatingTooltip(
    "capellaend",
    "[Pulls Kofongo's tail]",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "pollux-city",
    "I'll stay here with my parents",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "rigelonend",
    "So many people...",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "siriusend",
    "I'm going to write about this!",
    0,
    -10,
    tooltipStyle,
    true
  );

  // Outros personagens
  createFloatingTooltip(
    "mintend",
    "I thought I'd be the only one left.",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "lilyend",
    "My flowers will be born beautiful",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip(
    "day25end",
    "It was... a different ending than what I saw.",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip("ballerinaend", "/spin", 0, -10, tooltipStyle, true);
  createFloatingTooltip(
    "pineend",
    "Day-25 told me I said something different!!!",
    0,
    -10,
    tooltipStyle,
    true
  );
  createFloatingTooltip("catend", "Meow", 0, -10, tooltipStyle, true);
}

// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("intro");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();
