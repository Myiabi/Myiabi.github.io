// --------------------
// GERENCIADOR DE SONS COM BOTÃO DE ÍCONE
// --------------------
const Sons = {
  trilhas: {
    cidade: new Audio("/assets/sounds/trilhas/city.mp3"),
    predio: new Audio("/assets/sounds/trilhas/predio.mp3")
  },
  efeitos: {
    vitoria: "/assets/sounds/efeitos/tuturu_1.mp3",
    click: "/assets/sounds/efeitos/tuturu_1.mp3",
    whoosh: "/assets/sounds/efeitos/whooshfogo.mp3"
  },
  trilhaAtual: null
};

// Configura todas as trilhas
for (let key in Sons.trilhas) {
  Sons.trilhas[key].loop = true;
  Sons.trilhas[key].volume = 0.3;
}

// --------------------
// FUNÇÕES DE TRILHA
// --------------------
function tocarTrilha(nome) {
  const novaTrilha = Sons.trilhas[nome];
  if (!novaTrilha) return;

  if (Sons.trilhaAtual && Sons.trilhaAtual !== novaTrilha) {
    Sons.trilhaAtual.pause();
    Sons.trilhaAtual.currentTime = 0;
  }

  novaTrilha.play().catch(() => {
    mostrarOverlayParaLiberarAudio(nome);
  });

  Sons.trilhaAtual = novaTrilha;
}

function pausarTrilha() {
  if (Sons.trilhaAtual) Sons.trilhaAtual.pause();
}

function resumirTrilha() {
  if (Sons.trilhaAtual) Sons.trilhaAtual.play().catch(() => {});
}

function tocarEfeito(nome, volume = 0.5) {
  const caminho = Sons.efeitos[nome];
  if (!caminho) return;
  const som = new Audio(caminho);
  som.volume = volume;
  som.play().catch(()=>{});
}

// --------------------
// OVERLAY PARA AUTOPLAY
// --------------------
function mostrarOverlayParaLiberarAudio(trilha) {
  if(document.getElementById('audio-overlay')) return;

  const ov = document.createElement('div');
  ov.id = 'audio-overlay';
  ov.innerText = 'Toque para ativar o som';
  Object.assign(ov.style, {
    position:'fixed', bottom:'10px', right:'10px',
    background:'rgba(0,0,0,0.6)', color:'#fff',
    padding:'8px 12px', borderRadius:'6px',
    cursor:'pointer', zIndex:9999
  });
  document.body.appendChild(ov);

  const liberar = () => {
    tocarTrilha(trilha);
    ov.remove();
    window.removeEventListener('pointerdown', liberar);
    window.removeEventListener('keydown', liberar);
  };

  window.addEventListener('pointerdown', liberar, { once: true });
  window.addEventListener('keydown', liberar, { once: true });
}

// --------------------
// BOTÃO DE PAUSA/PLAY COM ÍCONE
// --------------------
function criarBotaoMusica() {
  const btn = document.createElement('div');
  btn.id = 'btn-musica';
  btn.innerText = '🎵';
  Object.assign(btn.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    cursor: 'pointer',
    zIndex: 9999,
    fontSize: '20px',
    userSelect: 'none'
  });

  let pausado = false;

  btn.addEventListener('click', () => {
    if (!Sons.trilhaAtual) return;

    if (pausado) {
      resumirTrilha();
      pausado = false;
      btn.innerText = '🎵';
      btn.style.background = 'rgba(0,0,0,0.6)';
    } else {
      pausarTrilha();
      pausado = true;
      btn.innerText = '🔇';
      btn.style.background = 'rgba(43, 193, 238, 1)';
    }
  });

  document.body.appendChild(btn);
}

// --------------------
// INICIALIZAÇÃO
// --------------------
window.addEventListener('load', () => {
  //tocarTrilha('cidade');
  
  criarBotaoMusica();
  
});

document.getElementById("vitoriaBtn").addEventListener("click", () => {
  tocarEfeito("vitoria", 0.5);
  
});

