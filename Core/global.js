// Bloqueia Ctrl + Scroll
window.addEventListener('wheel', e => {
  if (e.ctrlKey) e.preventDefault();
}, { passive: false });

// Bloqueia Ctrl + + e Ctrl + -
window.addEventListener('keydown', e => {
  if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '=')) {
    e.preventDefault();
  }
});


// Plugin. Precisa ser adicionado apenas uma vez
(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

// Uso do plugin smartresize com a solução de J. Bruni
$(window).smartresize(function(){
  if (screen.height > screen.width) {
    $('body').addClass('virado');
  } else {
    $('body').removeClass('virado');
  }
});

// desabilitar context
          
janela . addEventListener ( "contextmenu" , e => e . preventDefault ( ) ) ;  


// global.js

(function () {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: #000;
    color: #fff;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 9999;
    padding: 2rem;
    transition: opacity 0.3s ease;
  `;
  overlay.textContent = "Por favor, gire o celular para a posição horizontal (paisagem).";

  function checkOrientation() {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    if (isPortrait) {
      if (!document.body.contains(overlay)) document.body.appendChild(overlay);
    } else {
      if (document.body.contains(overlay)) overlay.remove();
    }
  }

  // Tentativa de travar orientação (quando suportado)
  async function lockLandscape() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock("landscape");
        console.log("🔒 Orientação travada em paisagem");
      }
    } catch (err) {
      console.warn("⚠️ Falha ao travar orientação:", err);
    }
  }

  window.addEventListener("orientationchange", checkOrientation);
  window.addEventListener("resize", checkOrientation);

  document.addEventListener("DOMContentLoaded", () => {
    checkOrientation();
    lockLandscape();
  });
})();
