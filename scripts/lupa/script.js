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
const container = document.getElementById('mapa');
const topLayer = document.querySelector('.layer.top');
let isDragging = false;
let pendingDrag = false;
let pendingItem = null;
let currentItem = null;
let dragClone = null;
const RADIUS = 8; // vw responsivo
const START_THRESHOLD = 6; // px

let startX = 0, startY = 0;

function getXY(e) {
  if (e.touches && e.touches.length) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function setClip(x, y, r = RADIUS) {
  if (!topLayer) return;
  const clip = `circle(${r}vw at ${x}px ${y}px)`;
  topLayer.style.clipPath = clip;
  topLayer.style.webkitClipPath = clip;
}

function showLoupe() { loupe.style.display = 'block'; }
function hideLoupe() {
  loupe.style.display = 'none';
  if (topLayer) {
    topLayer.style.clipPath = 'circle(0px at 0 0)';
    topLayer.style.webkitClipPath = 'circle(0px at 0 0)';
  }
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

      if (container) {
        const rect = container.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          setClip(x - rect.left, y - rect.top);
        } else hideLoupe();
      }
    }
  }
}

function onPointerUp(e) {
  if (!pendingDrag && !isDragging) return;

  const { x, y } = getXY(e);
  const menuItem = currentItem ? document.getElementById(currentItem.id) : null;

  // cancela pending drag sem movimento suficiente
  if (pendingDrag && !isDragging) {
    pendingDrag = false;
    pendingItem = null;
    return;
  }

  // finaliza drag real
  if (isDragging) {
    isDragging = false;

    // DESATIVA clip antes de animar de volta
    hideLoupe();

    const rect = container ? container.getBoundingClientRect() : { left: -1, right: -1, top: -1, bottom: -1 };
    if (dragClone) {
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
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
