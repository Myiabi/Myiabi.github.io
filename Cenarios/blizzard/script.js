const TOTAL_NUM_FLAKES = 380;
const SNOW_SYMBOLS = ["•"];

const LAYERS = [
  {
    layer: 1,
    sizeMin: 18,
    sizeMax: 34,
    speedFactor: 0.25,
    swayAmpMin: 2,
    swayAmpMax: 6,
    opacity: 1,
    blur: 0,
    colorVariationMin: 245,
    colorVariationMax: 255,
    symbols: ["•"],
    zIndex: 6,
  },
  {
    layer: 2,
    sizeMin: 14,
    sizeMax: 26,
    speedFactor: 0.22,
    swayAmpMin: 1,
    swayAmpMax: 5,
    opacity: 0.95,
    blur: 0,
    colorVariationMin: 240,
    colorVariationMax: 255,
    symbols: ["•"],
    zIndex: 5,
  },
  {
    layer: 3,
    sizeMin: 12,
    sizeMax: 20,
    speedFactor: 0.18,
    swayAmpMin: 0,
    swayAmpMax: 4,
    opacity: 0.9,
    blur: 0,
    colorVariationMin: 235,
    colorVariationMax: 250,
    symbols: ["•"],
    zIndex: 4,
  },
  {
    layer: 4,
    sizeMin: 10,
    sizeMax: 16,
    speedFactor: 0.12,
    swayAmpMin: 0,
    swayAmpMax: 3,
    opacity: 0.8,
    blur: 0,
    colorVariationMin: 220,
    colorVariationMax: 240,
    symbols: ["•"],
    zIndex: 3,
  },
  {
    layer: 5,
    sizeMin: 8,
    sizeMax: 14,
    speedFactor: 0.08,
    swayAmpMin: 0,
    swayAmpMax: 2,
    opacity: 0.65,
    blur: 0,
    colorVariationMin: 210,
    colorVariationMax: 230,
    symbols: ["•"],
    zIndex: 2,
  },
  {
    layer: 6,
    sizeMin: 6,
    sizeMax: 12,
    speedFactor: 0.06,
    swayAmpMin: 0,
    swayAmpMax: 1,
    opacity: 0.45,
    blur: 0,
    colorVariationMin: 200,
    colorVariationMax: 220,
    symbols: ["•"],
    zIndex: 1,
  },
];

class SnowLayer {
  constructor(canvasId, layerProps) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.layerProps = layerProps;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.devicePixelRatio = window.devicePixelRatio || 1;
    this.resizeCanvas();

    this.snowflakes = [];
    this.SEGMENT_WIDTH = 6;
    this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);

    this.initializeSnowPiles();
    this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = this.devicePixelRatio;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  initializeSnowPiles() {
    this.snowPileHeights = [];
    this.NUM_SEGMENTS = Math.ceil(this.width / this.SEGMENT_WIDTH);

    const base = this.height - 80;

    for (let j = 0; j < this.NUM_SEGMENTS; j++) {
      if (j === 0) {
        this.snowPileHeights[j] = base + (Math.random() * 20 - 10);
      } else {
        const prev = this.snowPileHeights[j - 1];
        let delta = Math.random() * 20 - 10;
        let newHeight = prev + delta;

        const maxHeight = this.height - 45;
        const minHeight = this.height - 150;

        if (newHeight > maxHeight) newHeight = maxHeight;
        if (newHeight < minHeight) newHeight = minHeight;

        this.snowPileHeights[j] = newHeight;
      }
    }

    this.smoothSnowPile(3);
  }

  smoothSnowPile(iterations = 1) {
    for (let iter = 0; iter < iterations; iter++) {
      const temp = [...this.snowPileHeights];
      for (let i = 1; i < this.NUM_SEGMENTS - 1; i++) {
        temp[i] =
          (this.snowPileHeights[i - 1] +
            this.snowPileHeights[i] +
            this.snowPileHeights[i + 1]) /
          3;
      }
      this.snowPileHeights = temp;
    }
  }

  createSnowflakes(num) {
    for (let i = 0; i < num; i++) this.snowflakes.push(this.createSnowflake());
  }

  createSnowflake() {
    const p = this.layerProps;
    const symbol = "•";
    const size = Math.random() * (p.sizeMax - p.sizeMin) + p.sizeMin;

    const fallSpeed = size * p.speedFactor + Math.random() * 0.6;
    const swayAmplitude =
      Math.random() * (p.swayAmpMax - p.swayAmpMin) + p.swayAmpMin;
    const swaySpeed = Math.random() * 0.015 + 0.003;

    const rotation = Math.random() * Math.PI * 2;
    const rotationSpeed = (Math.random() * 0.02 - 0.01) * (size / 20);

    const cv =
      Math.floor(
        Math.random() * (p.colorVariationMax - p.colorVariationMin + 1)
      ) + p.colorVariationMin;
    const color = `rgba(${cv},${cv},${cv},${p.opacity})`;

    return {
      x: Math.random() * this.width,
      y: Math.random() * -this.height,
      size,
      symbol,
      fallSpeed,
      swayAmplitude,
      swaySpeed,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: p.opacity,
      blur: p.blur,
      color,
      rotation,
      rotationSpeed,
    };
  }

  drawSnowPile() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.snowPileHeights[0]);

    for (let i = 1; i < this.NUM_SEGMENTS; i++) {
      this.ctx.lineTo(i * this.SEGMENT_WIDTH, this.snowPileHeights[i]);
    }

    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.fillStyle = `rgba(255,255,255,${this.layerProps.opacity})`;
    this.ctx.fill();
  }

  getSnowPileHeight(x) {
    const idx = Math.floor(x / this.SEGMENT_WIDTH);
    if (idx < 0 || idx >= this.NUM_SEGMENTS) return this.height;
    return this.snowPileHeights[idx];
  }

  animate(wind) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    this.drawSnowPile();

    const flakes = this.snowflakes;
    const wSpeed = wind.speed * wind.direction;

    for (let i = 0; i < flakes.length; i++) {
      const f = flakes[i];

      const swayX = Math.sin(f.swayOffset) * f.swayAmplitude;

      f.rotation += f.rotationSpeed;

      ctx.save();
      // Movimento suavizado pelo vento mais fraco
      ctx.translate(f.x + swayX + wSpeed * (0.5 + f.size / 40), f.y);

      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(0, 0, f.size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      f.y += f.fallSpeed;
      f.x += wSpeed * (0.6 + f.size / 45);
      f.swayOffset += f.swaySpeed;

      const groundHeight = this.getSnowPileHeight(f.x);

      if (f.y >= groundHeight - f.size) {
        f.y -= 8;
        f.opacity = 0;

        setTimeout(() => {
          f.x = Math.random() * this.width;
          f.y = Math.random() * -this.height;
          f.opacity = this.layerProps.opacity;
        }, 80);
      }

      if (f.x > this.width + 60) f.x = -60;
    }
  }

  resize() {
    this.resizeCanvas();
    this.initializeSnowPiles();
    this.snowflakes.length = 0;
    this.createSnowflakes(Math.floor(TOTAL_NUM_FLAKES / LAYERS.length));
  }
}

// --- AQUI ESTÁ A MUDANÇA DO VENTO ---
let wind = {
  direction: 1,
  speed: 3.5, // Reduzi de 8 para 3.5 (Bem mais leve)
};

setInterval(() => {
  // Agora varia entre 2 e 4.5 (antes era entre 6 e 10)
  wind.speed = 2 + Math.random() * 2.5;
}, 3000);
// ------------------------------------

const snowLayers = LAYERS.map(
  (layer) => new SnowLayer(`snow-canvas-${layer.layer}`, layer)
);

window.addEventListener("resize", () => {
  for (let layer of snowLayers) layer.resize();
});

function animate() {
  for (let layer of snowLayers) layer.animate(wind);
  requestAnimationFrame(animate);
}
animate();

const STAR_SYMBOLS = ["✦"];

function createStarSky() {
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    drawStars();
    drawMoon();
  }

  function drawStars() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    const starCount = 350;

    const maxHeight = height * 0.7;

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * maxHeight;

      const size = Math.random() * 5 + 5;
      const opacity = Math.random() * 0.7 + 0.3;

      const symbol =
        STAR_SYMBOLS[Math.floor(Math.random() * STAR_SYMBOLS.length)];

      ctx.save();
      ctx.font = `${size}px serif`;
      ctx.globalAlpha = opacity;
      ctx.fillStyle = "rgba(255,255,255,1)";

      ctx.fillText(symbol, x, y);
      ctx.restore();
    }
  }

  function drawMoon() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const moonSize = 80;
    const x = width * 0.78;
    const y = height * 0.18;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, moonSize, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,240,0.9)";
    ctx.fill();

    ctx.restore();
  }

  resize();
  window.addEventListener("resize", resize);
}

createStarSky();

// ==========================================================
// BOSS BATTLE - SISTEMA GLOBAL E INICIALIZAÇÃO
// ==========================================================
window.gameData = { visualState: {} };
let inCutscene = false; // VARIAVEL: BLOQUEIA INPUTS

// Pequena garantia para função esperar, caso não exista global
if (typeof esperar === "undefined") {
  window.esperar = (ms) => new Promise((r) => setTimeout(r, ms));
}

// ==========================================================
// DRAG & DROP SYSTEM (LUA E SOL)
// ==========================================================
console.log("script.js loaded!");

const menu = document.createElement("div");
menu.id = "menu-secundario";
document.body.appendChild(menu);

const itens = [
  {
    id: "item-lupa",
    func: "revelar",
    nome: "Moon",
    img: "/assets/img/Droplet-Moon.png",
  },
  {
    id: "item-fogo",
    func: "sol",
    nome: "Sun",
    img: "/assets/img/Droplet-Sun.png",
  },
];

itens.forEach((it) => {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.id = it.id;
  div.innerHTML = `<img src="${it.img}" draggable="false">`;
  div.style.touchAction = "none";
  menu.appendChild(div);
});

const loupe = document.createElement("div");
loupe.className = "loupe";
loupe.style.pointerEvents = "none";
loupe.style.display = "none";
loupe.style.position = "fixed";
loupe.style.zIndex = "1600";
document.body.appendChild(loupe);

const containers = Array.from(document.querySelectorAll(".mapa"));
const topLayers = containers.map((c) => c.querySelector(".layer.top"));

let isDragging = false;
let pendingDrag = false;
let pendingItem = null;
let currentItem = null;
let dragClone = null;
let auraFogo = null;

const RADIUS = 7.6;
const START_THRESHOLD_VW = 0.5;
let startX = 0,
  startY = 0;

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
    if (t) {
      t.style.clipPath = "circle(0% at 0 0)";
      t.style.webkitClipPath = "circle(0% at 0 0)";
    }
  });
}

function showLoupe() {
  loupe.style.display = "block";
}
function hideLoupe() {
  loupe.style.display = "none";
  clearClipAll();
}

const targets = [];
const revealTimers = new WeakMap();

function addTarget(el, options = {}) {
  if (!el) return;
  targets.push({ el, options });
}

function checkReveal(x, y) {
  const LUPA_RAIO_PX = vwToPx(2.5);

  targets.forEach((target) => {
    const mapa = target.el;
    if (!mapa) return;
    if (window.getComputedStyle(mapa).display === "none") return;

    let alvoInterno = mapa.querySelector(".cuff-img");
    if (!alvoInterno) {
      alvoInterno = mapa.querySelector(".eye-glow");
    }
    if (!alvoInterno) return;

    const rect = alvoInterno.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = x - centerX;
    const dy = y - centerY;
    const distancia = Math.sqrt(dx * dx + dy * dy);

    const MARGEM_CONTATO_PX = 10;
    const distanciaMinima = LUPA_RAIO_PX + MARGEM_CONTATO_PX;

    if (distancia < distanciaMinima) {
      if (!revealTimers.has(mapa)) {
        const timer = setTimeout(() => {
          if (mapa) {
            const layerTop = mapa.querySelector(".layer.top");
            if (layerTop) layerTop.style.display = "none";

            if (
              target.options.onComplete &&
              typeof target.options.onComplete === "function"
            ) {
              target.options.onComplete(mapa);
            }

            if (mapa.id !== "boss-eyes-container") {
              mapa.style.display = "none";
            }
          }
          revealTimers.delete(mapa);
        }, target.options?.delay ?? 2000);
        revealTimers.set(mapa, timer);
      }
    } else {
      if (revealTimers.has(mapa)) {
        clearTimeout(revealTimers.get(mapa));
        revealTimers.delete(mapa);
      }
    }
  });
}

const sunTargets = [];
const sunTimers = new WeakMap();
const sunOptions = new WeakMap();

function addSunTarget(el, options = {}) {
  if (!el) return;
  const opt = Object.assign({ action: "hide", delayMs: 350, uses: 1 }, options);
  sunOptions.set(el, opt);
  const exists = sunTargets.find((t) => t.el === el);
  if (!exists)
    sunTargets.push({ el, disabled: false, uses: options.uses || 999 });
}

function checkSun(x, y) {
  sunTargets.forEach((target) => {
    if (target.disabled) return;
    const el = target.el;
    if (!document.body.contains(el)) {
      target.disabled = true;
      return;
    }
    if (el.offsetParent === null) return;

    const rect = el.getBoundingClientRect();
    const opt = sunOptions.get(el);
    if (!opt) return;

    const inside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (inside) {
      if (!sunTimers.has(el)) {
        const timer = setTimeout(() => {
          if (opt.action === "hide") {
            el.style.display = "none";
          }

          if (opt.onComplete && typeof opt.onComplete === "function") {
            opt.onComplete(el);
          }

          if (opt.uses === 999) {
            // Infinito
          } else if (typeof opt.uses === "number") {
            opt.uses = opt.uses - 1;
            if (opt.uses <= 0) {
              target.disabled = true;
              sunOptions.delete(target.el);
            } else {
              sunOptions.set(target.el, opt);
            }
          }
          sunTimers.delete(el);
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

  dragClone = document.createElement("div");
  dragClone.className = "menu-item drag-clone-float";
  dragClone.style.backgroundImage = `url('${item.img}')`;
  dragClone.style.backgroundSize = "80%";
  dragClone.style.backgroundPosition = "center";
  dragClone.style.backgroundRepeat = "no-repeat";
  dragClone.style.backgroundColor = "rgba(255,255,255,0.2)";
  dragClone.style.position = "fixed";
  dragClone.style.opacity = "0.9";
  dragClone.style.pointerEvents = "none";
  dragClone.style.zIndex = "1500";
  dragClone.style.width = "5vw";
  dragClone.style.height = "5vw";
  dragClone.style.borderRadius = "50%";
  dragClone.style.transform = "translate(-50%,-50%)";
  dragClone.style.left = (x / window.innerWidth) * 100 + "vw";
  dragClone.style.top = (y / window.innerHeight) * 100 + "vh";
  document.body.appendChild(dragClone);

  if (item.func === "sol") {
    auraFogo.style.display = "block";
    auraFogo.style.left = dragClone.style.left;
    auraFogo.style.top = dragClone.style.top;
  }
  if (item.func === "revelar") {
    showLoupe();
  }
}

function onPointerDown(e) {
  if (inCutscene) return;

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
    const currentYOffset =
      ((Math.sin((performance.now() / 4000) * Math.PI) * vwToPx(1.5)) /
        window.innerHeight) *
      100;

    dragClone.style.left = (x / window.innerWidth) * 100 + "vw";
    dragClone.style.top =
      (y / window.innerHeight) * 100 + currentYOffset + "vh";

    if (currentItem?.func === "sol") {
      auraFogo.style.left = dragClone.style.left;
      auraFogo.style.top = dragClone.style.top;
    }
    if (currentItem && currentItem.func === "revelar") {
      loupe.style.left = dragClone.style.left;
      loupe.style.top = dragClone.style.top;
      let insideMap = false;
      let activeIndex = null;
      for (let i = 0; i < containers.length; i++) {
        if (window.getComputedStyle(containers[i]).display === "none") continue;
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
        clearClipAll();
      }
      checkReveal(x, y);
    }
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
    hideLoupe();
    auraFogo.style.display = "none";

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
      dragClone.classList.remove("drag-clone-float");
      returnToMenu(dragClone, menuItem);
      dragClone = null;
    }
    currentItem = null;
  }
}

document.addEventListener("pointerdown", onPointerDown, { passive: false });
document.addEventListener("pointermove", onPointerMove, { passive: false });
document.addEventListener("pointerup", onPointerUp, { passive: false });

// ==========================================================
// CENA DRAMÁTICA (TRANSIÇÃO DE FASE)
// ==========================================================
async function cenaTutorial() {
  if (typeof dialogo !== "undefined") {
    await dialogo.abrirAsync({
      nome: "Narrador",
      texto: "Tudo congelou....",
    });

    await esperar(2500);

    if (typeof personagens !== "undefined") {
      await dialogo.abrirAsync(personagens.wayway, "final");
      await dialogo.abrirAsync(personagens.wendigo, "final");
    } else {
      console.warn("Objeto 'personagens' não encontrado!");
    }
  } else {
    console.warn("Sistema de dialogo não carregado!");
    await esperar(2000);
  }

  console.log("Cena finalizada!");
}

async function startDramaticScene() {
  inCutscene = true;

  for (let i = 0; i < els.postes.length; i++) {
    const p = els.postes[i];

    if (!p.classList.contains("poste-apagado")) {
      p.src = "/assets/img/Pole-turned-off.png";
      p.classList.add("poste-apagado");

      await esperar(150);
    }
  }

  await cenaTutorial();

  inCutscene = false;
  iniciarFase2();
}

// ==========================================================
// BOSS.JS - LÓGICA DO CHEFÃO
// ==========================================================
const BOSS_CONFIG = {
  cuffRegenTime: 2000,
  handMaxHits: 1,
  castSpeedHand: 0.105,
  castSpeedEye: 0.105,
  regenSpeedEye: 0.04,
  totalPostes: 8,
};

const gameState = {
  hpLeftHand: BOSS_CONFIG.handMaxHits,
  hpRightHand: BOSS_CONFIG.handMaxHits,
  isLeftCuffActive: true,
  isRightCuffActive: true,
  castLeft: 0,
  castRight: 0,
  castEyes: 0,
  eyesRegen: 0,
  phase: 1,
  eyesStunned: false,
  necromancyMode: false,
  postesVivos: 8,
  gameOver: false,
};

const els = {
  leftWrapper: document.getElementById("wrapper-left"),
  rightWrapper: document.getElementById("wrapper-right"),
  leftCuff: document.getElementById("cuff-left"),
  rightCuff: document.getElementById("cuff-right"),
  leftHandImg: document.querySelector("#hand-left img"),
  rightHandImg: document.querySelector("#hand-right img"),
  fillLeft: document.getElementById("fill-left"),
  fillRight: document.getElementById("fill-right"),
  eyesContainer: document.getElementById("boss-eyes-container"),
  eyesCastBar: document.getElementById("cast-eyes"),
  eyesFill: document.querySelector("#cast-eyes .cast-bar-fill"),
  eyesRegenBar: document.getElementById("regen-eyes"),
  eyesRegenFill: document.querySelector("#regen-eyes .cast-bar-fill"),
  msg: document.getElementById("game-message"),
  postes: Array.from(document.querySelectorAll(".poste-vida")),
};

function gameLoop() {
  if (gameState.gameOver) return;

  if (gameState.phase === 1) {
    // Mão Esquerda
    if (gameState.hpLeftHand > 0) {
      gameState.castLeft += BOSS_CONFIG.castSpeedHand;
      if (gameState.castLeft >= 100) {
        dispararMagia("left");
        gameState.castLeft = 0;
      }
      els.fillLeft.style.width = gameState.castLeft + "%";
    }
    // Mão Direita
    if (gameState.hpRightHand > 0) {
      gameState.castRight += BOSS_CONFIG.castSpeedHand;
      if (gameState.castRight >= 100) {
        dispararMagia("right");
        gameState.castRight = 0;
      }
      els.fillRight.style.width = gameState.castRight + "%";
    }
    // Vitória Fase 1
    if (gameState.hpLeftHand <= 0 && gameState.hpRightHand <= 0) {
      gameState.phase = "transition";

      setTimeout(() => {
        startDramaticScene();
      }, 2000);
    }
  } else if (gameState.phase === 2) {
    const handsAliveCount =
      (gameState.hpLeftHand > 0 ? 1 : 0) + (gameState.hpRightHand > 0 ? 1 : 0);

    if (gameState.hpLeftHand > 0) {
      gameState.castLeft += BOSS_CONFIG.castSpeedHand;
      if (gameState.castLeft >= 100) {
        dispararMagia("left");
        gameState.castLeft = 0;
      }
      els.fillLeft.style.width = gameState.castLeft + "%";
    }
    if (gameState.hpRightHand > 0) {
      gameState.castRight += BOSS_CONFIG.castSpeedHand;
      if (gameState.castRight >= 100) {
        dispararMagia("right");
        gameState.castRight = 0;
      }
      els.fillRight.style.width = gameState.castRight + "%";
    }

    if (handsAliveCount === 0) {
      gameState.necromancyMode = true;
    }
    if (handsAliveCount === 2) {
      gameState.necromancyMode = false;
    }

    if (gameState.necromancyMode) {
      els.eyesCastBar.style.display = "block";
      els.eyesRegenBar.style.display = "none";

      els.eyesFill.style.background =
        "linear-gradient(90deg, #ccffcc, #00ff00, #006600)";
      gameState.castEyes += BOSS_CONFIG.castSpeedEye;

      if (gameState.castEyes >= 100) {
        reviveOneHand();
        gameState.castEyes = 0;
      }
      els.eyesFill.style.width = gameState.castEyes + "%";
    } else {
      if (gameState.eyesStunned) {
        els.eyesCastBar.style.display = "none";
        els.eyesRegenBar.style.display = "block";

        gameState.eyesRegen += BOSS_CONFIG.regenSpeedEye;
        els.eyesRegenFill.style.width = gameState.eyesRegen + "%";

        if (gameState.eyesRegen >= 100) {
          awakenEyes();
        }
      } else {
        els.eyesCastBar.style.display = "block";
        els.eyesRegenBar.style.display = "none";

        els.eyesFill.style.background =
          "linear-gradient(90deg, #ff00cc, #333399)";
        gameState.castEyes += BOSS_CONFIG.castSpeedEye;

        if (gameState.castEyes >= 100) {
          dispararMagia("eyes");
          gameState.castEyes = 0;
        }
        els.eyesFill.style.width = gameState.castEyes + "%";
      }
    }
  }
  requestAnimationFrame(gameLoop);
}

function reviveOneHand() {
  let deadHands = [];
  if (gameState.hpLeftHand <= 0) deadHands.push("left");
  if (gameState.hpRightHand <= 0) deadHands.push("right");

  if (deadHands.length > 0) {
    const side = deadHands[Math.floor(Math.random() * deadHands.length)];

    if (side === "left") {
      gameState.hpLeftHand = BOSS_CONFIG.handMaxHits;
      els.leftWrapper.style.opacity = "1";
      els.leftWrapper.style.pointerEvents = "auto";

      gameState.castLeft = 0;
      els.fillLeft.style.width = "0%";
    } else {
      gameState.hpRightHand = BOSS_CONFIG.handMaxHits;
      els.rightWrapper.style.opacity = "1";
      els.rightWrapper.style.pointerEvents = "auto";

      gameState.castRight = 0;
      els.fillRight.style.width = "0%";
    }
    regenerarCuff(side);
    showFloatingText(els.eyesContainer, "Revive!", "#00ff00");
  }
}

function dispararMagia(origem) {
  const postesAcesos = els.postes.filter(
    (p) => !p.classList.contains("poste-apagado")
  );
  if (postesAcesos.length > 0) {
    let dano = origem === "eyes" ? 2 : 1;

    for (let i = 0; i < dano && postesAcesos.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * postesAcesos.length);
      const alvo = postesAcesos.splice(randomIndex, 1)[0];
      if (alvo) {
        apagarPoste(alvo);
      }
    }
  }
}

function apagarPoste(el) {
  if (typeof tocarEfeito === "function") tocarEfeito("ice");

  el.src = "/assets/img/Pole-turned-off.png";
  el.classList.add("poste-apagado");
  el.classList.add("shake");
  setTimeout(() => {
    el.classList.remove("shake");
  }, 500);

  addSunTarget(el, {
    action: "none",
    uses: 999,
    delayMs: 500,
    onComplete: (e) => {
      e.src = "/assets/img/Pole-turned-on.png";
      e.classList.remove("poste-apagado");
      gameState.postesVivos++;
    },
  });
  gameState.postesVivos--;
}

function setupTargetsMao(side) {
  const cuffEl = side === "left" ? els.leftCuff : els.rightCuff;
  const handEl =
    side === "left"
      ? document.getElementById("hand-left")
      : document.getElementById("hand-right");

  addTarget(cuffEl, {
    delay: 500,
    onComplete: () => {
      onCuffBroken(side);
    },
  });

  addSunTarget(handEl, {
    action: "none",
    uses: 999,
    delayMs: 500,
    onComplete: (el) => {
      tentarDarDano(side, el);
    },
  });
}

function showFloatingText(element, text, color) {
  const rect = element.getBoundingClientRect();
  const floating = document.createElement("div");
  floating.className = "floating-text";
  floating.innerText = text;
  floating.style.color = color || "#fff";
  floating.style.left = rect.left + rect.width / 2 + "px";
  floating.style.top = rect.top + rect.height / 4 + "px";
  floating.style.transform = "translate(-50%, -100%)";
  document.body.appendChild(floating);
  setTimeout(() => {
    floating.remove();
  }, 2000);
}

function onCuffBroken(side) {
  if (side === "left") gameState.isLeftCuffActive = false;
  else gameState.isRightCuffActive = false;
  const wrapper = side === "left" ? els.leftWrapper : els.rightWrapper;
  showFloatingText(wrapper, "Vulnerable!", "gold");
}

function tentarDarDano(side, handEl) {
  const isProtected =
    side === "left" ? gameState.isLeftCuffActive : gameState.isRightCuffActive;
  const wrapper = side === "left" ? els.leftWrapper : els.rightWrapper;

  if (isProtected) {
    showFloatingText(wrapper, "Shield Active!", "gray");
    return;
  }

  if (typeof tocarEfeito === "function") tocarEfeito("fire");

  if (side === "left") gameState.isLeftCuffActive = true;
  else gameState.isRightCuffActive = true;

  if (side === "left") {
    gameState.hpLeftHand--;
    gameState.castLeft = 0;
    els.fillLeft.style.width = "0%";
  } else {
    gameState.hpRightHand--;
    gameState.castRight = 0;
    els.fillRight.style.width = "0%";
  }

  const img = handEl.querySelector("img");
  img.classList.add("hand-damaged");
  setTimeout(() => img.classList.remove("hand-damaged"), 500);

  showFloatingText(wrapper, "Hit!", "orange");

  const hp = side === "left" ? gameState.hpLeftHand : gameState.hpRightHand;

  if (hp <= 0) {
    if (side === "left") {
      els.leftWrapper.style.opacity = "0";
      els.leftWrapper.style.pointerEvents = "none";
    } else {
      els.rightWrapper.style.opacity = "0";
      els.rightWrapper.style.pointerEvents = "none";
    }

    if (gameState.phase === 2) {
      const otherHandHp =
        side === "left" ? gameState.hpRightHand : gameState.hpLeftHand;

      if (otherHandHp <= 0) {
        showFloatingText(els.eyesContainer, "NECROMANCY!", "#00ff00");

        if (gameState.eyesStunned) {
          awakenEyes();
          showFloatingText(els.eyesContainer, "SHIELD RESTORED!", "cyan");
        }
        gameState.castEyes = 0;
        els.eyesFill.style.width = "0%";
      }
    }
  } else {
    setTimeout(() => regenerarCuff(side), 1500);
  }
}

function regenerarCuff(side) {
  const cuffEl = side === "left" ? els.leftCuff : els.rightCuff;
  const topLayer = cuffEl.querySelector(".layer.top");
  const handImg = side === "left" ? els.leftHandImg : els.rightHandImg;
  const wrapper = side === "left" ? els.leftWrapper : els.rightWrapper;

  cuffEl.style.display = "flex";
  topLayer.style.display = "flex";
  topLayer.style.clipPath = "circle(0% at 0 0)";

  if (typeof tocarEfeito === "function") tocarEfeito("barrier");

  if (side === "left") gameState.isLeftCuffActive = true;
  else gameState.isRightCuffActive = true;

  showFloatingText(wrapper, "Shield Up", "cyan");

  if (handImg) {
    handImg.classList.add("regenerating-glow");
    setTimeout(() => {
      handImg.classList.remove("regenerating-glow");
    }, 1800);
  }
}

function iniciarFase2() {
  els.postes.forEach((p) => {
    p.src = "/assets/img/Pole-turned-on.png";
    p.classList.remove("poste-apagado");
  });

  gameState.phase = 2;
  mostrarMensagem("PHASE 2: EYES!", "red");

  document.getElementById("boss-body").src = "/assets/img/Villain2.png";

  els.eyesContainer.style.display = "block";
  els.eyesCastBar.style.display = "block";

  gameState.hpLeftHand = BOSS_CONFIG.handMaxHits;
  gameState.hpRightHand = BOSS_CONFIG.handMaxHits;

  els.leftWrapper.style.opacity = "1";
  els.leftWrapper.style.pointerEvents = "auto";
  els.rightWrapper.style.opacity = "1";
  els.rightWrapper.style.pointerEvents = "auto";

  regenerarCuff("left");
  regenerarCuff("right");

  addTarget(els.eyesContainer, {
    delay: 3000,
    onComplete: () => {
      stunEyes();
    },
  });

  addSunTarget(els.eyesContainer, {
    action: "none",
    uses: 999,
    delayMs: 100,
    onComplete: (el) => {
      checkFinalBlow();
    },
  });
}

function checkFinalBlow() {
  const handsDead = gameState.hpLeftHand <= 0 && gameState.hpRightHand <= 0;

  if (handsDead && gameState.eyesStunned) {
    gameOver(true);
  } else {
    let msg = "";
    if (!handsDead) msg = "Destroy the Hands!";
    else if (!gameState.eyesStunned) msg = "Break the Eye Shield!";
    showFloatingText(els.eyesContainer, msg, "gray");
  }
}

function stunEyes() {
  gameState.eyesStunned = true;
  gameState.eyesRegen = 0;

  document.getElementById("boss-body").src = "/assets/img/Villain.png";

  showFloatingText(els.eyesContainer, "Stunned!", "gold");

  els.eyesContainer.querySelector(".eye-glow").style.display = "none";

  els.eyesCastBar.style.display = "none";
  els.eyesRegenBar.style.display = "block";
}

function awakenEyes() {
  gameState.eyesStunned = false;

  if (typeof tocarEfeito === "function") tocarEfeito("barrier");

  document.getElementById("boss-body").src = "/assets/img/Villain2.png";

  showFloatingText(els.eyesContainer, "Awake!", "red");

  els.eyesContainer.querySelector(".eye-glow").style.display = "block";

  els.eyesContainer.querySelector(".layer.top").style.display = "flex";
  els.eyesCastBar.style.display = "block";
  els.eyesRegenBar.style.display = "none";

  gameState.castEyes = 0;
  els.eyesFill.style.width = "0%";
}

function mostrarMensagem(texto, cor) {
  els.msg.innerText = texto;
  els.msg.style.color = cor;
  els.msg.style.display = "block";
  setTimeout(() => {
    els.msg.style.display = "none";
  }, 1500);
}

async function gameOver(vitoria) {
  gameState.gameOver = true;

  if (vitoria) {
    mostrarMensagem("...", "white");
    await esperar(3000);
  }

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = 0;
  overlay.style.background = "rgba(0,0,0,0.9)";
  overlay.style.color = "#fff";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = 9999;
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 1s ease";

  if (vitoria) {
    overlay.innerHTML = "<h1>BOSS DEFEATED!</h1><p>The city is saved.</p>";
  } else {
    overlay.innerHTML =
      "<h1>YOU LOST...</h1><p>The ice has consumed everything.</p><button onclick='location.reload()' style='padding:1rem; margin-top:1rem; cursor:pointer;'>Try Again</button>";
  }
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    overlay.style.opacity = "1";
  });
}

async function initBoss() {
  console.log("BOSS BATTLE START!");

  const arena = document.getElementById("boss-arena");

  // Bloqueia inputs durante a cutscene de entrada
  inCutscene = true;

  // Espera 1s antes de começar a descer
  await esperar(1000);

  // Toca efeito de vento ao começar a descer
  if (typeof tocarEfeito === "function") tocarEfeito("wind");

  arena.classList.add("entering");

  // Espera a animação de descida terminar
  await new Promise((resolve) => {
    arena.addEventListener("animationend", resolve, { once: true });
  });

  arena.classList.remove("entering");
  arena.classList.add("entered");

  console.log("Boss has arrived!");

  // Diálogo do Ice Emperor
  if (typeof dialogo !== "undefined") {
    await dialogo.abrirAsync({
      nome: "Ice Emperor",
      texto:
        "Então é daqui que vem esse calor... Eu estou aqui agora, podemos dormir em paz, juntos.",
    });
  } else {
    console.warn("Sistema de dialogo não carregado!");
  }

  // Toca a trilha do boss após terminar de falar
  if (typeof tocarTrilha === "function") tocarTrilha("boss");

  // Espera 1.5s antes de liberar a batalha
  await esperar(1500);

  // Libera a interação e inicia a batalha
  inCutscene = false;

  setupTargetsMao("left");
  setupTargetsMao("right");
  requestAnimationFrame(gameLoop);

  console.log("Battle begins!");
}

initBoss();
