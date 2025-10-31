// loader.js - versão enxuta
const scripts = [
  "/core/save/script.js",
  "/core/loading/script.js",
  "/core/popup/script.js",
  "/core/sound/script.js",
  "/core/achievements/script.js",
  "/core/caixa_dialogo/script.js",
  "/core/global.js",
  "/core/modal/script.js",
  "script.js"
];

(async function loadAllScripts() {
  const allScripts = [...scripts, "script.js"]; // adiciona script.js no final

  for (const src of allScripts) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
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

  console.log("Todos os scripts foram carregados");
})();
