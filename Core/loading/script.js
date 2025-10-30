// loader.js
(function () {
  // Cria o overlay de loading
  const loading = document.createElement('div');
  loading.id = 'global-loading';
  loading.style.position = 'fixed';
  loading.style.top = 0;
  loading.style.left = 0;
  loading.style.width = '100vw';
  loading.style.height = '100vh';
  loading.style.background = '#000'; // fundo preto básico
  loading.style.display = 'flex';
  loading.style.justifyContent = 'center';
  loading.style.alignItems = 'center';
  loading.style.flexDirection = 'column';
  loading.style.zIndex = 99999;
  loading.style.transition = 'opacity 0.5s ease';
  loading.style.color = '#fff';
  loading.style.fontFamily = 'sans-serif';
  loading.style.fontSize = '2rem';
  loading.style.letterSpacing = '2px';

  // Adiciona o texto "Loading..."
  const text = document.createElement('div');
  text.textContent = 'Loading...';
  loading.appendChild(text);

  // Adiciona o overlay ao body
  document.body.appendChild(loading);

  // Espera o carregamento completo de tudo (imagens, sons, scripts, etc)
  window.addEventListener('load', () => {
    setTimeout(() => {
      loading.style.opacity = '0';
      setTimeout(() => loading.remove(), 500);
    }, 300);
  });
})();
