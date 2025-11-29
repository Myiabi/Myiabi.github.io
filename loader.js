// loader.js — versão final corrigida e compatível com o script.js do minigame

const scripts = [
  "/core/global.js",
  "/core/caixa_dialogo/falas.js",
  // "/core/save/script.js",
  "/core/achievements/script.js",
  "/core/loading/script.js",
  "/core/popup/script.js",
  "/core/sound/script.js",
  "/core/caixa_dialogo/script.js",
  "/core/menu_interativo/script.js",
  "/devmod.js"
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

  const projectScriptUrl = new URL("script.js", document.location.href).href;
  const allScripts = [...scripts];

  // verifica se script.js já existe no DOM
  const found = Array.from(document.getElementsByTagName("script")).some(s => {
    try {
      return (
        s.src &&
        new URL(s.src, document.location.href).href === projectScriptUrl
      );
    } catch (e) {
      return false;
    }
  });

  if (!found) {
    console.log("script.js não estava no DOM — adicionando via loader.");
    allScripts.push(projectScriptUrl);
  } else {
    console.log("script.js já estava no DOM — loader não vai duplicar.");
  }

  // lê o atributo data-no="menu,popup"
  const body = document.body;
  let blocked = [];

  if (body?.dataset?.no) {
    blocked = body.dataset.no.split(",").map(s => s.trim());
    console.log("Scripts bloqueados neste HTML:", blocked);
  }

  // =========================
  // CARREGAMENTO SEQUENCIAL
  // =========================
  for (const src of allScripts) {

    // verifica se este script está na lista do BODY
    const shouldBlock = blocked.some(key => BLOCK_MAP[key] === src);

    if (shouldBlock) {
      console.log(`🔒 Script bloqueado: ${src}`);
      continue; // pulado
    }

    await new Promise(resolve => {
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
