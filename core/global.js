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
// FORÇAR FULLSCREEN NO MOBILE
// =========================
(function setupMobileFullscreen() {
    // 1. Verifica se é celular (Android ou iPhone)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Se não for mobile, não faz nada
    if (!isMobile) return;

    // 2. Cria o HTML do overlay na marra
    const overlayHTML = `
        <div id="mobile-fullscreen-overlay" style="display: flex;">
            <div class="icon">👆</div>
            <br>
            <h2>Toque para Iniciar</h2>
            <p style="font-size: 0.8rem; color: #888;">Modo Tela Cheia</p>
        </div>
    `;

    // Injeta no corpo da página
    document.body.insertAdjacentHTML('beforeend', overlayHTML);

    const overlay = document.getElementById('mobile-fullscreen-overlay');

    // 3. A Função que Ativa a Tela Cheia
    function goFullScreen() {
        const elem = document.documentElement;
        
        // Tenta todos os métodos de navegadores diferentes
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }

        // Some com o overlay suavemente
        overlay.style.transition = "opacity 0.5s";
        overlay.style.opacity = "0";
        setTimeout(() => overlay.remove(), 500);
    }

    // 4. Espera o toque do usuário
    overlay.addEventListener('click', goFullScreen);
    overlay.addEventListener('touchstart', goFullScreen);

})();