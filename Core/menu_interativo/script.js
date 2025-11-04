// ---------------------------
// Cria menu secundário
// ---------------------------
const menu = document.createElement("div");
menu.id = "menu-secundario";
document.body.appendChild(menu);

const itens = [
  { nome: "🌕", id: "item-lupa", func: "revelar" },
  { nome: "🔥", id: "item-fogo", func: null },
];

itens.forEach((it) => {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.id = it.id;
  div.textContent = it.nome;
  div.style.touchAction = "none";
  menu.appendChild(div);
});

// ---------------------------
// Cria a lupa pelo JS
// ---------------------------
const loupe = document.createElement("div");
loupe.className = "loupe";
document.body.appendChild(loupe);

// ---------------------------
// Variáveis globais
// ---------------------------
const containers = Array.from(document.querySelectorAll(".mapa")); // todas as divs mapa
// Para garantir associação correta, buscamos a camada top dentro de cada container
const topLayers = containers.map((c) => c.querySelector(".layer.top") || null);

let isDragging = false;
let pendingDrag = false;
let pendingItem = null;
let currentItem = null;
let dragClone = null;
const RADIUS = 8; // raio em vw (responsivo)
const START_THRESHOLD_VW = 0.5; // limiar para iniciar drag, em vw (convertido internamente)
const RADIUS_DETECT_VW = 8; // área de detecção em vw (convertido internamente)

let startX = 0,
  startY = 0;

// ---------------------------
// Alvos individuais
// ---------------------------
const targets = [];
const revealTimers = new WeakMap(); // timer de cada alvo
const revealedFlags = new WeakMap(); // flag de cada alvo

function addTarget(el) {
  if (!el) return;
  targets.push({ el });
  revealedFlags.set(el, false);
}

// ---------------------------
// Função de detecção
// ---------------------------
function vwToPx(vw) {
  return window.innerWidth * (vw / 100);
}
function vhToPx(vh) {
  return window.innerHeight * (vh / 100);
}

function checkReveal(x, y) {
  const detectPx = vwToPx(RADIUS_DETECT_VW);
  targets.forEach((target) => {
    const rect = target.el.getBoundingClientRect();
    if (
      x >= rect.left - detectPx &&
      x <= rect.right + detectPx &&
      y >= rect.top - detectPx &&
      y <= rect.bottom + detectPx
    ) {
      if (!revealTimers.has(target.el)) {
        const timer = setTimeout(() => {
          revealedFlags.set(target.el, true);
          if (typeof tocarEfeito === "function") tocarEfeito("whoosh");
          const mapa = target.el.closest(".mapa");
          if (mapa) mapa.style.display = "none";
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
  if (e.touches && e.touches.length)
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function setClip(x, y, topLayer, r = RADIUS) {
  // x,y: coordenadas do cliente em pixels; convertimos para % dentro do elemento
  if (!topLayer) return;
  const rect = topLayer.getBoundingClientRect();
  const xPercent = ((x - rect.left) / rect.width) * 100;
  const yPercent = ((y - rect.top) / rect.height) * 100;
  // Usamos raio em vw (responsivo) e posições em percentuais relativos ao elemento
  const clip = `circle(${r}vw at ${xPercent}% ${yPercent}%)`;
  topLayer.style.clipPath = clip;
  topLayer.style.webkitClipPath = clip;
}

function showLoupe() {
  loupe.style.display = "block";
}
function hideLoupe() {
  loupe.style.display = "none";
  topLayers.forEach((topLayer) => {
    if (!topLayer) return;
    topLayer.style.clipPath = "circle(0% at 0 0)";
    topLayer.style.webkitClipPath = "circle(0% at 0 0)";
  });
}

function returnToMenu(elClone, menuItem) {
  if (!menuItem) {
    elClone.remove();
    return;
  }
  const rect = menuItem.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const centerXvw = (centerX / window.innerWidth) * 100;
  const centerYvh = (centerY / window.innerHeight) * 100;
  elClone.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
  elClone.style.left = centerXvw + "vw";
  elClone.style.top = centerYvh + "vh";
  elClone.addEventListener(
    "transitionend",
    () => {
      elClone.remove();
      menuItem.style.visibility = "visible";
    },
    { once: true }
  );
}

function startRealDrag(it, x, y) {
  if (isDragging) return;
  isDragging = true;
  currentItem = it;

  const el = document.getElementById(it.id);
  if (el) el.style.visibility = "hidden";

  dragClone = document.createElement("div");
  dragClone.className = "menu-item";
  dragClone.textContent = it.nome;
  dragClone.style.position = "fixed";
  dragClone.style.pointerEvents = "none";
  dragClone.style.opacity = "0.7";
  dragClone.style.zIndex = "1500";
  dragClone.style.fontSize = "2vw";
  dragClone.style.transform = "translate(-50%, -50%)";
  // posicionamos em vw/vh para ser responsivo
  dragClone.style.left = (x / window.innerWidth) * 100 + "vw";
  dragClone.style.top = (y / window.innerHeight) * 100 + "vh";
  document.body.appendChild(dragClone);
}

// ---------------------------
// Pointer handlers
// ---------------------------
function onPointerDown(e) {
  const target = e.target;
  if (!target || !target.classList.contains("menu-item")) return;
  e.preventDefault();
  if (isDragging) return;

  pendingDrag = true;
  pendingItem = itens.find((it) => it.id === target.id) || null;
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
    // convertemos limiar em vw para px para comparação com coords em px
    const startThresholdPx = vwToPx(START_THRESHOLD_VW);
    if (dx + dy >= startThresholdPx) {
      startRealDrag(pendingItem, x, y);
      pendingDrag = false;
      pendingItem = null;
    } else return;
  }

  if (isDragging && dragClone) {
    dragClone.style.left = (x / window.innerWidth) * 100 + "vw";
    dragClone.style.top = (y / window.innerHeight) * 100 + "vh";

    if (currentItem && currentItem.func === "revelar") {
      // posicionamos a lupa em vw/vh para não usar px
      loupe.style.left = (x / window.innerWidth) * 100 + "vw";
      loupe.style.top = (y / window.innerHeight) * 100 + "vh";
      showLoupe();

      containers.forEach((container, i) => {
        const rect = container.getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          // passamos coordenadas em cliente (px) para setClip, que faz a conversão
          setClip(x, y, topLayers[i]);
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
    containers.forEach((container) => {
      const rect = container.getBoundingClientRect();
      if (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      ) {
        isOutsideAll = false;
      }
    });

    // Cancela timers ao soltar
    targets.forEach((target) => {
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
        if (menuItem) menuItem.style.visibility = "visible";
      }
      dragClone = null;
    }

    currentItem = null;
  }
}

// ---------------------------
// Liga eventos pointer
// ---------------------------
document.addEventListener("pointerdown", onPointerDown, { passive: false });
document.addEventListener("pointermove", onPointerMove, { passive: false });
document.addEventListener("pointerup", onPointerUp, { passive: false });

// ---------------------------
// Bloqueio de gestos padrão (pinch/zoom/double-tap)
// - touchmove com passive:false para permitir preventDefault
// - gesturestart para iOS Safari
// - proteção contra double-tap zoom
// OBS: isto desabilita rolagem e zoom nativos — só faça se realmente quiser bloquear gestures
// ---------------------------
try {
  // impede pinch/zoom em alguns navegadores
  document.addEventListener(
    "gesturestart",
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
} catch (err) {
  // gesturestart não existe em alguns browsers — ignore
}

// impede touchmove padrão (scroll/pan) — importante: passive:false
document.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);

// evita double-tap zoom
let __lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (e) {
    const now = Date.now();
    if (now - __lastTouchEnd <= 300) {
      e.preventDefault();
    }
    __lastTouchEnd = now;
  },
  false
);


// ---------------------------
// Exemplos de alvos
// ---------------------------
const capetinha = document.querySelector(".capetinha");
addTarget(capetinha);

// Futuramente você pode adicionar mais assim:
// const meuGato = document.querySelector('.gato');
// addTarget(meuGato, 'Gatinho');
