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

// ---------------------------
// Orientation lock em landscape com rotação ±90º
// - Se o dispositivo estiver em portrait aplicamos rotação no body para manter a UI em landscape
// - Detecta a orientação anterior (landscape left/right) e escolhe -90deg ou +90deg
// Nota: este código ajusta o style do body; se você preferir aplicar a um wrapper, diga que troco.
// ---------------------------
(function () {
  function getAngle() {
    let angle = 0;
    try {
      if (screen.orientation && typeof screen.orientation.angle === "number")
        angle = screen.orientation.angle;
      else if (typeof window.orientation === "number")
        angle = window.orientation;
    } catch (e) {}
    return ((angle % 360) + 360) % 360;
  }

  let lastAngle = getAngle();

  function applyVirado(direction) {
    document.body.classList.add("virado");
    const rotate = direction === "left" ? "-90deg" : "90deg";
    // centraliza e rotaciona
    document.body.style.position = "fixed";
    document.body.style.left = "50%";
    document.body.style.top = "50%";
    document.body.style.width = "100vh";
    document.body.style.height = "100vw";
    document.body.style.transformOrigin = "center center";
    document.body.style.transform = `translate(-50%,-50%) rotate(${rotate})`;
    document.body.style.overflow = "hidden";
  }

  function removeVirado() {
    document.body.classList.remove("virado");
    document.body.style.transform = "";
    document.body.style.position = "";
    document.body.style.left = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.height = "";
    document.body.style.transformOrigin = "";
    document.body.style.overflow = "";
  }

  function onOrient() {
    const angle = getAngle();
    const norm = angle;
    // portrait angles often 0 or 180 (device upright)
    const isPortrait = norm === 0 || norm === 180;

    if (isPortrait) {
      // decidimos a direção com base na última orientação conhecida
      if (lastAngle === 270) applyVirado("left");
      else if (lastAngle === 90) applyVirado("right");
      else {
        // sem histórico claro, escolhemos direção com base na inclinação atual (fallback)
        // tentamos detectar via evento deviceorientation (gamma) uma vez
        let decided = "right";
        const listener = function (ev) {
          try {
            if (typeof ev.gamma === "number") {
              decided = ev.gamma < 0 ? "left" : "right";
            }
          } catch (e) {}
          // garante remover o listener depois da primeira execução
          window.removeEventListener("deviceorientation", listener);
          applyVirado(decided);
        };
        window.addEventListener("deviceorientation", listener, { once: true });
        // também aplicamos imediatamente um fallback para não deixar em branco
        applyVirado(decided);
      }
    } else {
      // se estiver em landscape, removemos a rotação
      removeVirado();
    }

    lastAngle = norm;
  }

  window.addEventListener("orientationchange", onOrient);
  window.addEventListener("resize", onOrient);
  // inicializa
  onOrient();
})();
