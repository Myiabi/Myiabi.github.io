// Sistema de Fullscreen para o jogo (Apenas no PWA)
function isRunningAsPWA() {
  // Chrome Android e navegadores Chromium
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  // iOS Safari
  if (window.navigator.standalone === true) {
    return true;
  }

  // Verifica se está em modo fullscreen já (PWA mode)
  if (window.matchMedia("(display-mode: fullscreen)").matches) {
    return true;
  }

  return false;
}

function createFullscreenButton() {
  // Só cria o botão se estiver rodando como PWA
  if (!isRunningAsPWA()) {
    console.log("Fullscreen button: Não é PWA, botão não será exibido");
    return;
  }

  // Cria o botão
  const btn = document.createElement("button");
  btn.id = "fullscreen-btn";
  btn.innerHTML = "⛶"; // Ícone de fullscreen
  btn.title = "Entrar em Fullscreen";

  // Estilos do botão
  btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.7);
    border: 2px solid rgba(255, 255, 255, 0.5);
    color: white;
    font-size: 24px;
    cursor: pointer;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    -webkit-user-select: none;
    user-select: none;
  `;

  // Hover effect
  btn.onmouseover = () => {
    btn.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    btn.style.borderColor = "rgba(255, 255, 255, 0.8)";
  };

  btn.onmouseout = () => {
    btn.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    btn.style.borderColor = "rgba(255, 255, 255, 0.5)";
  };

  // Função de fullscreen
  btn.onclick = () => {
    const elem = document.documentElement;

    // Tenta entrar em fullscreen
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  // Detecta quando sai de fullscreen
  document.addEventListener("fullscreenchange", updateButton);
  document.addEventListener("webkitfullscreenchange", updateButton);
  document.addEventListener("mozfullscreenchange", updateButton);

  function updateButton() {
    const isFullscreen =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement;

    if (isFullscreen) {
      btn.innerHTML = "⛶"; // Mesmo ícone (pode mudar se quiser)
      btn.title = "Sair de Fullscreen";
    } else {
      btn.innerHTML = "⛶";
      btn.title = "Entrar em Fullscreen";
    }
  }

  // Adiciona o botão ao body
  document.body.appendChild(btn);
  console.log("Fullscreen button: Criado com sucesso (PWA detectado)");
}

// Inicializa quando a página carrega
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", createFullscreenButton);
} else {
  createFullscreenButton();
}
