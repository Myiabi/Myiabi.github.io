// loader.js — versão final corrigida e compatível com o script.js do minigame

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
// BLOQUEIA CONTEXTO — seguro
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
  save: "/core/save/script.js", // caso volte a usar
};

// =========================
// CARREGADOR PRINCIPAL
// =========================
(async function loadAllScripts() {
  console.log("Loader iniciado.");

  const allScripts = [...scripts];

  // Adiciona o script.js local do cenário (se existir)
  const currentPath = window.location.pathname;
  // Só adiciona se estiver em uma subpasta (cenários)
  if (currentPath.includes("/cenarios/") || currentPath.includes("/scripts/")) {
    const localScript = currentPath
      .replace(/\/[^\/]*\.html$/, "/script.js")
      .replace(/\/$/, "/script.js");
    allScripts.push(localScript);
    console.log("Script local detectado:", localScript);
  }

  // lê o atributo data-no="menu,popup"
  const body = document.body;
  let blocked = [];

  if (body?.dataset?.no) {
    blocked = body.dataset.no.split(",").map((s) => s.trim());
    console.log("Scripts bloqueados neste HTML:", blocked);
  }

  // =========================
  // CARREGAMENTO SEQUENCIAL
  // =========================
  for (const src of allScripts) {
    // verifica se este script está na lista do BODY
    const shouldBlock = blocked.some((key) => BLOCK_MAP[key] === src);

    if (shouldBlock) {
      console.log(`🔒 Script bloqueado: ${src}`);
      continue; // pulado
    }

    await new Promise((resolve) => {
      const s = document.createElement("script");
      s.async = false;
      s.onload = () => {
        console.log(`${src} carregado`);
        resolve();
      };
      s.onerror = () => {
        console.error(`Erro ao carregar ${src}`);
        resolve();
      };
      s.src = src;
      document.body.appendChild(s);
    });
  }

  console.log("Todos os scripts foram processados.");

  // ==========================================
  // TENTA INICIAR O MINIGAME (drag & drop)
  // ==========================================
  if (typeof window.startMinigameLogic === "function") {
    console.log("Chamando startMinigameLogic via loader...");
    window.startMinigameLogic();
  } else {
    console.warn(
      "startMinigameLogic não encontrado no script.js! Minigame não pôde iniciar."
    );
  }
})();

// LOADING

// loader.js - Tempo mínimo garantido SEMPRE
(function () {
  // Tempo mínimo (ms)
  const minTime = 500;
  const start = Date.now();

  // Insere o loader imediatamente antes do render
  document.write(`
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
      transition: opacity 0.5s ease;
    ">
      Loading...
    </div>
  `);

  function finishLoader() {
    const loading = document.getElementById("global-loading");
    if (!loading) return;

    const elapsed = Date.now() - start;
    const wait = Math.max(0, minTime - elapsed);

    setTimeout(() => {
      loading.style.opacity = "0";
      setTimeout(() => loading.remove(), 500);
    }, wait);
  }

  // Garante que o loader finalize no load
  window.addEventListener("load", finishLoader);

  // SE o "load" já tiver acontecido antes do script rodar...
  if (document.readyState === "complete") {
    finishLoader();
  }
})();
