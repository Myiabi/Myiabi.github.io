// ========== BLOQUEIO DO BOTÃO BACK DO NAVEGADOR ==========
// Faz o botão back do navegador ficar "preso" na mesma página
(function () {
  // Adiciona múltiplas entradas no histórico para garantir
  history.pushState(null, "", location.href);
  history.pushState(null, "", location.href);

  // Listener que sempre empurra de volta
  window.addEventListener("popstate", function (e) {
    e.preventDefault();
    history.pushState(null, "", location.href);
  });

  // Também bloqueia ao carregar a página (caso venha do cache)
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      history.pushState(null, "", location.href);
    }
  });
})();

// Bloqueia Ctrl + Scroll
window.addEventListener(
  "wheel",
  (e) => {
    if (e.ctrlKey) e.preventDefault();
  },
  { passive: false }
);

// Bloqueia Ctrl + + e Ctrl + -
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) {
    e.preventDefault();
  }
});



// desabilitar context menu
window.addEventListener("contextmenu", (e) => e.preventDefault());

// Botão voltar — usa delegação para funcionar mesmo com HTML dinâmico
document.addEventListener("click", (e) => {
  const btnBack = e.target.closest("#btn-back");
  if (btnBack) {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "/city.html";
  }
});

let midiasTocando = [];

document.addEventListener('visibilitychange', () => {
  // Pega todos os áudios e vídeos da página
  const todasMidias = document.querySelectorAll('audio, video');

  if (document.hidden) {
    // Se a aba escondeu:
    todasMidias.forEach(midia => {
      if (!midia.paused) {
        midiasTocando.push(midia); // Salva na lista quem estava tocando
        midia.pause();             // Pausa
      }
    });
  } else {
    // Se a aba voltou:
    midiasTocando.forEach(midia => midia.play()); // Dá play só em quem estava tocando
    midiasTocando = []; // Limpa a lista
  }
});