// ========== FIX MOBILE VIEWPORT (100vh bug) ==========
// Cria variável CSS --real-vh que reflete a altura real da viewport
// Necessário porque 100vh em mobile inclui a barra de endereço
(function () {
  function setRealVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--real-vh", `${vh}px`);
  }

  // Executa no load
  setRealVH();

  // Atualiza no resize (quando barra de endereço aparece/desaparece)
  window.addEventListener("resize", setRealVH);

  // Também atualiza na mudança de orientação
  window.addEventListener("orientationchange", () => {
    setTimeout(setRealVH, 100); // delay para garantir que os valores estejam corretos
  });
})();

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

// ========== PAUSAR MÍDIA AO SAIR DA ABA (Elementos no DOM) ==========
// NOTA: Para os objetos Audio do sistema de som (trilhas/loops),
// o controle é feito diretamente no core/sound/script.js
// Este código aqui só pausa elementos <audio> e <video> que estejam no DOM
(function () {
  let midiasDOMTocando = [];

  function pausarMidiasDOM() {
    const todasMidias = document.querySelectorAll("audio, video");
    midiasDOMTocando = [];

    todasMidias.forEach((midia) => {
      if (!midia.paused) {
        midiasDOMTocando.push(midia);
        midia.pause();
      }
    });
  }

  function retomarMidiasDOM() {
    midiasDOMTocando.forEach((midia) => {
      midia.play().catch(() => {});
    });
    midiasDOMTocando = [];
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pausarMidiasDOM();
    } else {
      retomarMidiasDOM();
    }
  });
})();
