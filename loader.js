// loader.js — Versão Final Blindada

const scripts = [
  "/core/global.js",
  "/core/save/script.js",
  "/core/caixa_dialogo/falas.js",
  "/core/yesorno/script.js",
  "/core/menu_interativo/script.js",
  "/core/loading/script.js",
  "/core/popup/script.js",
  "/core/sound/script.js",
  "/core/caixa_dialogo/script.js",
  "/scripts/jardim/script.js",
  "/dev.js",
];

// =========================
// BLOQUEIA CONTEXTO
// =========================
function disableContextMenuOnBody() {
  const apply = () => {
    const b = document.body;
    if (!b) return;
    if (
      !b.hasAttribute("oncontextmenu") ||
      b.getAttribute("oncontextmenu") !== "return false;"
    ) {
      b.setAttribute("oncontextmenu", "return false;");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    apply();
  }
}

disableContextMenuOnBody();

// =========================
// MAPA DE SCRIPTS BLOQUEÁVEIS
// =========================
const BLOCK_MAP = {
  menu: "/core/menu_interativo/script.js",
  popup: "/core/popup/script.js",
  achievements: "/core/achievements/script.js",
  save: "/core/save/script.js",
};

// =========================
// INJETA O LOADING VISUAL (IMEDIATAMENTE)
// =========================
(function injectLoader() {
  // HTML do Loader
  const loaderHTML = `
    <div id="global-loading" style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      z-index: 99999;
      opacity: 1;
      font-family: sans-serif;
      font-size: 2rem;
      letter-spacing: 2px;
      transition: opacity 0.3s ease;
      pointer-events: none; /* Garante que não bloqueie cliques se bugar invisível */
    ">
      Loading...
    </div>
  `;
  
  // Insere no começo do body assim que possível
  if (document.body) {
    document.body.insertAdjacentHTML('afterbegin', loaderHTML);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('afterbegin', loaderHTML);
    });
  }
})();

// =========================
// CARREGADOR DE SCRIPTS
// =========================
(async function loadAllScripts() {
  console.log("Loader iniciado.");

  const allScripts = [...scripts];

  // Adiciona script local
  const currentPath = window.location.pathname;
  if (currentPath.includes("/cenarios/") || currentPath.includes("/scripts/")) {
    const localScript = currentPath
      .replace(/\/[^\/]*\.html$/, "/script.js")
      .replace(/\/$/, "/script.js");
    allScripts.push(localScript);
    console.log("Script local detectado:", localScript);
  }

  // Lê bloqueios
  const body = document.body;
  let blocked = [];
  if (body?.dataset?.no) {
    blocked = body.dataset.no.split(",").map((s) => s.trim());
  }

  // Carregamento Sequencial
  for (const src of allScripts) {
    const shouldBlock = blocked.some((key) => BLOCK_MAP[key] === src);

    if (shouldBlock) {
      console.log(`🔒 Script bloqueado: ${src}`);
      continue; 
    }

    await new Promise((resolve) => {
      const s = document.createElement("script");
      s.async = false;
      s.onload = resolve;
      s.onerror = () => {
        console.error(`Erro ao carregar ${src}`);
        resolve(); // Segue o jogo mesmo com erro
      };
      s.src = src;
      document.body.appendChild(s);
    });
  }

  console.log("Scripts processados.");

  // Tenta iniciar minigame
  if (typeof window.startMinigameLogic === "function") {
    window.startMinigameLogic();
  }
})();

// =========================
// GERENCIADOR DE TRANSIÇÃO (LOADING -> CENA)
// =========================
(function () {
  const minTime = 300; // Tempo mínimo de tela preta
  const start = Date.now();
  let finished = false;

  function finishLoader() {
    if (finished) return; // Evita rodar duas vezes
    finished = true;

    const loading = document.getElementById("global-loading");
    const scene = document.getElementById("scene");

    const elapsed = Date.now() - start;
    const wait = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      // 1. Some o Loading
      if (loading) {
        loading.style.opacity = "0";
      }

      // 2. Aparece a Cena (AQUI ESTAVA O PROBLEMA ANTES)
      if (scene) {
        scene.classList.add("scene-visible");
      } else {
        console.warn("Elemento #scene não encontrado pelo loader!");
      }

      // 3. Limpa o DOM
      setTimeout(() => {
        if (loading) loading.remove();
      }, 500);

    }, wait);
  }

  // Dispara quando tudo (imagens, scripts, css) carregar
  window.addEventListener("load", finishLoader);

  // Failsafe: Se o load travar por 5 segundos, libera o jogo na marra
  setTimeout(finishLoader, 5000);

  // Se já carregou antes do script rodar
  if (document.readyState === "complete") {
    finishLoader();
  }
})();