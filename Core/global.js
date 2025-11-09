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


