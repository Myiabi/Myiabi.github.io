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

// ========== PAUSAR MÍDIA AO SAIR DA ABA (Mobile + Desktop) ==========
(function () {
  let midiasTocando = [];
  let estaVisivel = true;

  function getAllMedia() {
    // Pega todos os áudios e vídeos, incluindo os criados dinamicamente
    return document.querySelectorAll("audio, video");
  }

  function pausarTudo() {
    if (!estaVisivel) return; // Já pausou
    estaVisivel = false;

    const todasMidias = getAllMedia();
    midiasTocando = [];

    todasMidias.forEach((midia) => {
      if (!midia.paused) {
        midiasTocando.push(midia);
        midia.pause();
      }
    });
  }

  function retomarTudo() {
    if (estaVisivel) return; // Já está tocando
    estaVisivel = true;

    midiasTocando.forEach((midia) => {
      const playPromise = midia.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    });
    midiasTocando = [];
  }

  // Método principal: visibilitychange
  document.addEventListener("visibilitychange", () => {
    if (document.hidden || document.visibilityState === "hidden") {
      pausarTudo();
    } else {
      retomarTudo();
    }
  });

  // Fallback para mobile
  window.addEventListener("blur", pausarTudo);
  window.addEventListener("focus", retomarTudo);

  // Fallback para iOS Safari
  window.addEventListener("pagehide", pausarTudo);
  window.addEventListener("pageshow", (e) => {
    retomarTudo();
  });

  // FALLBACK AGRESSIVO: Checa a cada 500ms se a página está visível
  // Isso pega casos onde os eventos não disparam (minimizar app no mobile)
  setInterval(() => {
    const deveEstarPausado =
      document.hidden ||
      document.visibilityState === "hidden" ||
      !document.hasFocus();

    if (deveEstarPausado && estaVisivel) {
      pausarTudo();
    } else if (!deveEstarPausado && !estaVisivel) {
      retomarTudo();
    }
  }, 500);
})();
