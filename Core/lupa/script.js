// ---------------------------
// Cria menu secundário
// ---------------------------
const menu = document.createElement('div');
menu.id = 'menu-secundario';
document.body.appendChild(menu);

const itens = [
  { nome: '🌕', id: 'item-lupa', func: 'revelar' },
  { nome: '🔥', id: 'item-fogo', func: null }
];

itens.forEach(it => {
  const div = document.createElement('div');
  div.className = 'menu-item';
  div.id = it.id;
  div.textContent = it.nome;
  div.style.touchAction = 'none';
  menu.appendChild(div);
});

// ---------------------------
// Cria a lupa pelo JS
// ---------------------------
const loupe = document.createElement('div');
loupe.className = 'loupe';
document.body.appendChild(loupe);

// ---------------------------
// Variáveis globais
// ---------------------------
const containers = document.querySelectorAll('.mapa'); // todas as divs mapa
const topLayers = document.querySelectorAll('.layer.top');
let isDragging = false;
let pendingDrag = false;
let pendingItem = null;
let currentItem = null;
let dragClone = null;
const RADIUS = 8; // vw responsivo
const START_THRESHOLD = 6; // px
const RADIUS_DETECT = 80; // px, área de detecção ampliada

let startX = 0, startY = 0;

// ---------------------------
// Alvos individuais
// ---------------------------
const targets = [];
const revealTimers = new WeakMap(); // timer de cada alvo
const revealedFlags = new WeakMap(); // flag de cada alvo

function addTarget(el) {
  targets.push({ el});
  revealedFlags.set(el, false);
}

// ---------------------------
// Função de detecção
// ---------------------------
function checkReveal(x, y) {
  targets.forEach(target => {
    const rect = target.el.getBoundingClientRect();
    if (
      x >= rect.left - RADIUS_DETECT &&
      x <= rect.right + RADIUS_DETECT &&
      y >= rect.top - RADIUS_DETECT &&
      y <= rect.bottom + RADIUS_DETECT
    ) {
      if (!revealTimers.has(target.el)) {
        const timer = setTimeout(() => {
          revealedFlags.set(target.el, true);
          tocarEfeito('whoosh')
          target.el.closest('.mapa').style.display = 'none';
        }, 500);
        revealTimers.set(target.el, timer);
      }
    } else {
      if (revealTimers.has(target.el)) {
        clearTimeout(revealTimers.get(target.el));
        revealTimers.delete(target.el);
      }
    }
  });
}

// ---------------------------
// Funções de posição e clip
// ---------------------------
function getXY(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function setClip(x, y, topLayer, r = RADIUS) {
  if (!topLayer) return;
  const clip = `circle(${r}vw at ${x}px ${y}px)`;
  topLayer.style.clipPath = clip;
  topLayer.style.webkitClipPath = clip;
}

function showLoupe() { loupe.style.display = 'block'; }
function hideLoupe() {
  loupe.style.display = 'none';
  topLayers.forEach(topLayer => {
    topLayer.style.clipPath = 'circle(0px at 0 0)';
    topLayer.style.webkitClipPath = 'circle(0px at 0 0)';
  });
}

function returnToMenu(elClone, menuItem) {
  const rect = menuItem.getBoundingClientRect();
  elClone.style.transition = 'all 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
  elClone.style.left = rect.left + rect.width / 2 + 'px';
  elClone.style.top = rect.top + rect.height / 2 + 'px';
  elClone.addEventListener('transitionend', () => {
    elClone.remove();
    menuItem.style.visibility = 'visible';
  }, { once: true });
}

function startRealDrag(it, x, y) {
  if (isDragging) return;
  isDragging = true;
  currentItem = it;

  const el = document.getElementById(it.id);
  if (el) el.style.visibility = 'hidden';

  dragClone = document.createElement('div');
  dragClone.className = 'menu-item';
  dragClone.textContent = it.nome;
  dragClone.style.position = 'fixed';
  dragClone.style.pointerEvents = 'none';
  dragClone.style.opacity = '0.7';
  dragClone.style.zIndex = '1500';
  dragClone.style.fontSize = '2vw';
  dragClone.style.transform = 'translate(-50%, -50%)';
  dragClone.style.left = x + 'px';
  dragClone.style.top = y + 'px';
  document.body.appendChild(dragClone);
}

// ---------------------------
// Pointer handlers
// ---------------------------
function onPointerDown(e) {
  const target = e.target;
  if (!target || !target.classList.contains('menu-item')) return;
  e.preventDefault();
  if (isDragging) return;

  pendingDrag = true;
  pendingItem = itens.find(it => it.id === target.id) || null;
  const coords = getXY(e);
  startX = coords.x;
  startY = coords.y;
}

function onPointerMove(e) {
  if (!pendingDrag && !isDragging) return;

  const { x, y } = getXY(e);

  if (pendingDrag && !isDragging) {
    const dx = Math.abs(x - startX);
    const dy = Math.abs(y - startY);
    if (dx + dy >= START_THRESHOLD) {
      startRealDrag(pendingItem, x, y);
      pendingDrag = false;
      pendingItem = null;
    } else return;
  }

  if (isDragging && dragClone) {
    dragClone.style.left = x + 'px';
    dragClone.style.top = y + 'px';

    if (currentItem && currentItem.func === 'revelar') {
      loupe.style.left = x + 'px';
      loupe.style.top = y + 'px';
      showLoupe();

      containers.forEach((container, i) => {
        const rect = container.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          setClip(x - rect.left, y - rect.top, topLayers[i]);
        }
      });

      // Checagem do timer de revelação
      checkReveal(x, y);
    }
  }
}

function onPointerUp(e) {
  if (!pendingDrag && !isDragging) return;

  const { x, y } = getXY(e);
  const menuItem = currentItem ? document.getElementById(currentItem.id) : null;

  if (pendingDrag && !isDragging) {
    pendingDrag = false;
    pendingItem = null;
    return;
  }

  if (isDragging) {
    isDragging = false;

    hideLoupe();

    let isOutsideAll = true;
    containers.forEach(container => {
      const rect = container.getBoundingClientRect();
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        isOutsideAll = false;
      }
    });

    // Cancela timers ao soltar
    targets.forEach(target => {
      if (revealTimers.has(target.el)) {
        clearTimeout(revealTimers.get(target.el));
        revealTimers.delete(target.el);
      }
    });

    if (dragClone) {
      if (isOutsideAll) {
        returnToMenu(dragClone, menuItem);
      } else {
        dragClone.remove();
        if (menuItem) menuItem.style.visibility = 'visible';
      }
      dragClone = null;
    }

    currentItem = null;
  }
}

// ---------------------------
// Liga eventos pointer
// ---------------------------
document.addEventListener('pointerdown', onPointerDown, { passive: false });
document.addEventListener('pointermove', onPointerMove, { passive: false });
document.addEventListener('pointerup', onPointerUp, { passive: false });


// ---------------------------
// Exemplos de alvos
// ---------------------------
const capetinha = document.querySelector('.capetinha');
addTarget(capetinha);

// Futuramente você pode adicionar mais assim:
// const meuGato = document.querySelector('.gato');
// addTarget(meuGato, 'Gatinho');
