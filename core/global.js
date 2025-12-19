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

// Plugin. Precisa ser adicionado apenas uma vez
(function ($, sr) {
  // Se jQuery não existir, pula
  if (typeof $ === "undefined" || typeof jQuery === "undefined") {
    console.warn("jQuery não encontrado - smartresize desativado");
    return;
  }

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
    var timeout;

    return function debounced() {
      var obj = this,
        args = arguments;
      function delayed() {
        if (!execAsap) func.apply(obj, args);
        timeout = null;
      }

      if (timeout) clearTimeout(timeout);
      else if (execAsap) func.apply(obj, args);

      timeout = setTimeout(delayed, threshold || 100);
    };
  };
  // smartresize
  jQuery.fn[sr] = function (fn) {
    return fn ? this.bind("resize", debounce(fn)) : this.trigger(sr);
  };
})(typeof jQuery !== "undefined" ? jQuery : null, "smartresize");

// Uso do plugin smartresize com a solução de J. Bruni
if (typeof $ !== "undefined") {
  $(window).smartresize(function () {
    if (screen.height > screen.width) {
      $("body").addClass("virado");
    } else {
      $("body").removeClass("virado");
    }
  });
}

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

// =========================
// PAUSA O SOM SE SAIR DA TELA (OU DESLIGAR)
// =========================
document.addEventListener("visibilitychange", () => {
  // Pega todos os sons que estão tocando (audio e video)
  const allAudios = document.querySelectorAll("audio, video");

  if (document.hidden) {
    // USUÁRIO SAIU OU DESLIGOU A TELA -> PAUSAR TUDO
    console.log("Minigame em segundo plano: Pausando sons...");
    
    allAudios.forEach(audio => {
      // Salva um "lembrete" se o áudio estava tocando de verdade
      if (!audio.paused) {
        audio.dataset.wasPlaying = "true"; // Marca com uma etiqueta
        audio.pause();
      }
    });

  } else {
    // USUÁRIO VOLTOU -> RESUMIR O QUE ESTAVA TOCANDO
    console.log("Minigame visível: Retomando sons...");
    
    allAudios.forEach(audio => {
      // Só dá play se tiver a etiqueta que a gente colou antes
      if (audio.dataset.wasPlaying === "true") {
        audio.play().catch(e => console.log("Erro ao retomar áudio:", e));
        audio.dataset.wasPlaying = "false"; // Remove a etiqueta
      }
    });
  }
});