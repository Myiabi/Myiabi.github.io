// loader.js - versão mínima
const scripts = [
 "/core/popup/script.js",
  "/core/sound/script.js",
  "/core/achievements/script.js",
  "/core/caixa_dialogo/script.js",
  "/core/global.js"
];

// Função que cria o <script> e retorna uma Promise que resolve quando carregar
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.async = false; // garante execução na ordem
    s.onload = () => {
      console.log(`${src} carregado`);
      resolve();
    };
    s.onerror = () => {
      console.error(`Erro ao carregar ${src}`);
      reject();
    };
    document.body.appendChild(s);
  });
}

// Carrega todos os scripts na ordem
(async () => {
  for (const src of scripts) {
    try {
      await loadScript(src);
    } catch (e) {
      console.error(e);
    }
  }
  console.log("Todos os scripts base foram carregados");
})();
