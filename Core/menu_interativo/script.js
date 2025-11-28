// ==========================================================
// loader.js - Sistema Lua + Sol + Aura de Fogo (Com Imagens e Voo On-Drag)
// ==========================================================

// ---------------------------
// Cria menu
// ---------------------------
const menu = document.createElement("div");
menu.id = "menu-secundario";
document.body.appendChild(menu);

// !!! ATENÇÃO: COLOQUE AQUI AS SUAS URLS DE IMAGEM !!!
const itens = [
  {
    id: "item-lupa",
    func: "revelar",
    nome: "Lua",
    img: "/assets/img/Droplet-Moon.png", // <--- SUAS IMAGENS MANTIDAS
  },
  {
    id: "item-fogo",
    func: "sol",
    nome: "Sol",
    img: "/assets/img/Droplet-Sun.png", // <--- SUAS IMAGENS MANTIDAS
  },
];

itens.forEach((it) => {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.id = it.id; // CRIAÇÃO DA IMAGEM NO MENU
  const imgElement = document.createElement("img");
  imgElement.src = it.img;
  imgElement.draggable = false; // evita drag nativo do browser
  div.appendChild(imgElement);

  div.style.touchAction = "none";
  menu.appendChild(div);
});

// ---------------------------
// Lupa + aura da lua
// ---------------------------
const loupe = document.createElement("div");
loupe.className = "loupe";
loupe.style.pointerEvents = "none";
loupe.style.display = "none";
loupe.style.position = "fixed";
loupe.style.zIndex = "1600";
document.body.appendChild(loupe);

// ---------------------------
// DOM e Variáveis de Controle
// ---------------------------
const containers = Array.from(document.querySelectorAll(".mapa"));
const topLayers = containers.map((c) => c.querySelector(".layer.top"));

let isDragging = false;
let pendingDrag = false;
let pendingItem = null;
let currentItem = null;
let dragClone = null;

// 🔥 Aura do fogo
let auraFogo = null;

const RADIUS = 8;
const START_THRESHOLD_VW = 0.5;
const RADIUS_DETECT_VW = 8;

let startX = 0,
  startY = 0;

// utils
function vwToPx(vw) {
  return window.innerWidth * (vw / 100);
}
function getXY(e) {
  if (e.touches?.length)
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function setClip(x, y, topLayer, r = RADIUS) {
  if (!topLayer) return;
  const rect = topLayer.getBoundingClientRect();
  const xp = ((x - rect.left) / rect.width) * 100;
  const yp = ((y - rect.top) / rect.height) * 100;
  const clip = `circle(${r}vw at ${xp}% ${yp}%)`;

  topLayer.style.clipPath = clip;
  topLayer.style.webkitClipPath = clip;
}

function clearClipAll() {
  topLayers.forEach((t) => {
    t.style.clipPath = "circle(0% at 0 0)";
    t.style.webkitClipPath = "circle(0% at 0 0)";
  });
}

function showLoupe() {
  loupe.style.display = "block";
}
function hideLoupe() {
  loupe.style.display = "none";
  clearClipAll();
}

// ======================================================
// 🌙 L U A   (revelar targets individuais)
// ======================================================
const targets = [];
const revealTimers = new WeakMap();

function addTarget(el, options = {}) {
  if (!el) return;
  targets.push({ el, options });
}

function checkReveal(x, y) {
  const detectPx = vwToPx(RADIUS_DETECT_VW);

  targets.forEach((target) => {
    const rect = target.el.getBoundingClientRect();

    const inside =
      x >= rect.left - detectPx &&
      x <= rect.right + detectPx &&
      y >= rect.top - detectPx &&
      y <= rect.bottom + detectPx;

    if (inside) {
      if (!revealTimers.has(target.el)) {
        const timer = setTimeout(() => {
          const mapa = target.el.closest(".mapa");
          if (mapa) {
            const layerTop = mapa.querySelector(".layer.top");
            if (layerTop) layerTop.style.display = "none";

            if (target.options?.sound) tocarEfeito(target.options.sound); // Certifique-se que essa função existe ou remova se não usar
            mapa.style.display = "none";
          }
        }, target.options?.delay ?? 2000);

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

// ======================================================
// 🔥 S O L   (independente)
// ======================================================
const sunTargets = [];
const sunTimers = new WeakMap();
const sunOptions = new WeakMap();

function addSunTarget(el, options = {}) {
  if (!el) return;
  sunTargets.push({ el });
  sunOptions.set(el, Object.assign({ action: "hide", delayMs: 350 }, options));
}

function checkSun(x, y) {
  sunTargets.forEach((target) => {
    const el = target.el;
    const rect = el.getBoundingClientRect();
    const opt = sunOptions.get(el);

    const inside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (inside) {
      if (!sunTimers.has(el)) {
        const timer = setTimeout(() => {
          // if(opt.sound) tocarEfeito(opt.sound);

          if (opt.action === "hide") el.style.display = "none";
          else if (opt.action === "swap") el.innerHTML = opt.newImage;
        }, opt.delayMs);

        sunTimers.set(el, timer);
      }
    } else {
      if (sunTimers.has(el)) {
        clearTimeout(sunTimers.get(el));
        sunTimers.delete(el);
      }
    }
  });
}

// ======================================================
// D R A G
// ======================================================

function criarAuraFogo() {
  auraFogo = document.createElement("div");
  auraFogo.className = "fogo-aura";
  auraFogo.style.position = "fixed";
  auraFogo.style.width = "10vw";
  auraFogo.style.height = "10vw";
  auraFogo.style.pointerEvents = "none";
  auraFogo.style.transform = "translate(-50%, -50%)";
  auraFogo.style.zIndex = "1499";
  auraFogo.style.display = "none";
  document.body.appendChild(auraFogo);
}

criarAuraFogo();

function returnToMenu(clone, menuItem) {
  if (!menuItem) {
    clone.remove();
    return;
  }

  // 🔴 MUDANÇA 2: Remove a animação antes de retornar
  clone.classList.remove("drag-clone-float");

  const r = menuItem.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  clone.style.transition = "all .8s cubic-bezier(.25,1,.5,1)";
  clone.style.left = (cx / window.innerWidth) * 100 + "vw";
  clone.style.top = (cy / window.innerHeight) * 100 + "vh";

  clone.addEventListener(
    "transitionend",
    () => {
      clone.remove();
      menuItem.style.visibility = "visible";
    },
    { once: true }
  );
}

function startRealDrag(item, x, y) {
  isDragging = true;
  currentItem = item;

  const el = document.getElementById(item.id);
  if (el) el.style.visibility = "hidden";

  dragClone = document.createElement("div"); // 🔴 MUDANÇA 1: Adiciona a classe de animação aqui
  dragClone.className = "menu-item drag-clone-float"; // ATUALIZAÇÃO: Usa a imagem como background do clone arrastável
  dragClone.style.backgroundImage = `url('${item.img}')`;
  dragClone.style.backgroundSize = "80%";
  dragClone.style.backgroundPosition = "center";
  dragClone.style.backgroundRepeat = "no-repeat";
  dragClone.style.backgroundColor = "rgba(255,255,255,0.2)"; // Bolinha sutil

  dragClone.style.position = "fixed";
  dragClone.style.opacity = "0.9";
  dragClone.style.pointerEvents = "none";
  dragClone.style.zIndex = "1500";
  dragClone.style.width = "5vw"; // tamanho fixo em vw igual ao CSS
  dragClone.style.height = "5vw";
  dragClone.style.borderRadius = "50%";
  dragClone.style.transform = "translate(-50%,-50%)";
  dragClone.style.left = (x / window.innerWidth) * 100 + "vw";
  dragClone.style.top = (y / window.innerHeight) * 100 + "vh";

  document.body.appendChild(dragClone); // 🔥 ativar aura do fogo

  if (item.func === "sol") {
    auraFogo.style.display = "block";
    auraFogo.style.left = dragClone.style.left;
    auraFogo.style.top = dragClone.style.top;
  } // 🌙 ativar aura da lua (loupe)

  if (item.func === "revelar") {
    showLoupe();
  }
}

function onPointerDown(e) {
  // Permite clicar na imagem ou na div
  const target = e.target.closest(".menu-item");
  if (!target) return;

  e.preventDefault();
  if (isDragging) return;

  pendingDrag = true;
  pendingItem = itens.find((i) => i.id === target.id);

  const c = getXY(e);
  startX = c.x;
  startY = c.y;
}

function onPointerMove(e) {
  if (!pendingDrag && !isDragging) return;

  const { x, y } = getXY(e);

  if (pendingDrag && !isDragging) {
    const dx = Math.abs(x - startX);
    const dy = Math.abs(y - startY);
    const thresh = vwToPx(START_THRESHOLD_VW);

    if (dx + dy >= thresh) {
      startRealDrag(pendingItem, x, y);
      pendingDrag = false;
      pendingItem = null;
    } else return;
  }

  if (isDragging && dragClone) {
    dragClone.style.left = (x / window.innerWidth) * 100 + "vw";
    dragClone.style.top = (y / window.innerHeight) * 100 + "vh"; // 🔥 move aura do fogo

    if (currentItem?.func === "sol") {
      auraFogo.style.left = dragClone.style.left;
      auraFogo.style.top = dragClone.style.top;
    } // 🌙 LUA

    if (currentItem && currentItem.func === "revelar") {
      loupe.style.left = dragClone.style.left;
      loupe.style.top = dragClone.style.top;

      let insideMap = false;
      let activeIndex = null;

      for (let i = 0; i < containers.length; i++) {
        const rect = containers[i].getBoundingClientRect();
        if (
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom
        ) {
          insideMap = true;
          activeIndex = i;
          break;
        }
      }

      if (insideMap) {
        setClip(x, y, topLayers[activeIndex]);
      } else {
        clearClipAll(); // SAIR DO MAPA → limpar efeito
      }

      checkReveal(x, y);
    } // SOL (não mexer)

    if (currentItem && currentItem.func === "sol") {
      checkSun(x, y);
    }
  }
}

function onPointerUp(e) {
  if (!pendingDrag && !isDragging) return;

  const { x, y } = getXY(e);
  const menuItem = currentItem ? document.getElementById(currentItem.id) : null;

  if (pendingDrag) {
    pendingDrag = false;
    pendingItem = null;
    return;
  }

  if (isDragging) {
    isDragging = false;
    hideLoupe(); // desliga aura da lua

    auraFogo.style.display = "none"; // desliga aura do fogo

    let outside = true;
    containers.forEach((cont) => {
      const r = cont.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        outside = false;
    });

    targets.forEach((t) => {
      if (revealTimers.has(t.el)) {
        clearTimeout(revealTimers.get(t.el));
        revealTimers.delete(t.el);
      }
    });

    sunTargets.forEach((t) => {
      if (sunTimers.has(t.el)) {
        clearTimeout(sunTimers.get(t.el));
        sunTimers.delete(t.el);
      }
    });

    if (dragClone) {
      // 🔴 MUDANÇA 3: Remove a animação ao soltar
      dragClone.classList.remove("drag-clone-float");

      if (outside) returnToMenu(dragClone, menuItem);
      else {
        dragClone.remove();
        if (menuItem) menuItem.style.visibility = "visible";
      }
      dragClone = null;
    }

    currentItem = null;
  }
}

document.addEventListener("pointerdown", onPointerDown, { passive: false });
document.addEventListener("pointermove", onPointerMove, { passive: false });
document.addEventListener("pointerup", onPointerUp, { passive: false });

// ==========================================================
// Registra ALVOS LUA
// ==========================================================
addTarget(document.querySelector(".capetinha"), {
  delay: 2000,
  sound: "woosh",
});

addTarget(document.querySelector(".rage"), {
  delay: 2000,
  sound: "woosh2",
});

addTarget(document.querySelector("#hidel"), {
  delay: 2000,
  sound: "whoosh",
});

// ==========================================================
// Sol
// ==========================================================
addSunTarget(document.querySelector(".gelo-alvo"), {
  action: "swap",
  newImage: "",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector(".bola-alvo"), {
  action: "swap",
  newImage: "",
  sound: "whoosh",
  delayMs: 350,
});
