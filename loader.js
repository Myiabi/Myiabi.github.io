// loader.js - versão melhorada
const scripts = [
  "/core/global.js",
  "/core/achievements/script.js",
  "/core/loading/script.js",
  "/core/popup/script.js",
  "/core/sound/script.js",
  "/core/caixa_dialogo/script.js",
  "/core/modal/script.js",
];

// Garante de forma idempotente que o <body> terá oncontextmenu="return false;"
// Aplica imediatamente se o body já existir, caso contrário aguarda DOMContentLoaded.
function disableContextMenuOnBody() {
  const apply = () => {
    try {
      const b = document.body;
      if (!b) return;
      // evita sobrescrever se já houver um handler personalizado
      if (
        !b.hasAttribute("oncontextmenu") ||
        b.getAttribute("oncontextmenu") !== "return false;"
      ) {
        b.setAttribute("oncontextmenu", "return false;");
      }
    } catch (e) {
      // não falha se por algum motivo o acesso ao DOM der problema
      console.warn(
        "disableContextMenuOnBody: não foi possível ajustar body",
        e
      );
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true });
  } else {
    // já carregado
    apply();
  }
}

// Executa imediatamente ao carregar este loader
disableContextMenuOnBody();

(async function loadAllScripts() {
  // Determina a URL absoluta do script do projeto (script.js) com base no documento
  const projectScriptUrl = new URL("script.js", document.location.href).href;

  // Monta lista: scripts core + script do projeto (se ainda não existir no DOM)
  const allScripts = [...scripts];
  const found = Array.from(document.getElementsByTagName("script")).some(
    (s) => {
      try {
        return (
          s.src &&
          new URL(s.src, document.location.href).href === projectScriptUrl
        );
      } catch (e) {
        return false;
      }
    }
  );

  if (!found) {
    allScripts.push(projectScriptUrl);
  } else {
    console.log(
      "script.js já presente no documento; pulando carregamento automático."
    );
  }

  for (const src of allScripts) {
    // Carrega sequencialmente; em caso de erro registra e continua (não aborta a fila inteira)
    await new Promise((resolve) => {
      const s = document.createElement("script");
      s.async = false; // tentar preservar ordem de execução
      s.onload = () => {
        console.log(`${src} carregado`);
        resolve();
      };
      s.onerror = () => {
        console.error(`Erro ao carregar ${src}`);
        // não rejeitamos para garantir que os próximos scripts ainda sejam carregados
        resolve();
      };
      s.src = src;
      document.body.appendChild(s);
    });
  }

  console.log("Todos os scripts foram processados");
})();
