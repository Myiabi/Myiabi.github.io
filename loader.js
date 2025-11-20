// loader.js — versão final corrigida e compatível com o script.js do minigame

const scripts = [
  "/core/global.js",
  "/core/save/script.js",
  "/core/achievements/script.js",
  "/core/loading/script.js",
  "/core/popup/script.js",
  "/core/sound/script.js",
  "/core/caixa_dialogo/script.js"
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
// CARREGADOR PRINCIPAL
// =========================
(async function loadAllScripts() {
  console.log("Loader iniciado.");

  // Garante que o script principal do projeto (script.js) também será carregado
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

  // =========================
  // CARREGAMENTO SEQUENCIAL
  // =========================
  for (const src of allScripts) {
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
