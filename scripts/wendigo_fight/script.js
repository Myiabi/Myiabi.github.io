// ========== SISTEMA DE PASSE ÚNICO ==========
(function () {
  const token = sessionStorage.getItem("acesso_wendigo");
  sessionStorage.removeItem("acesso_wendigo"); // Remove IMEDIATAMENTE (uso único)

  // Se não tinha permissão OU já venceu antes → chuta pra cave
  if (
    token !== "autorizado" ||
    localStorage.getItem("wendigo_completo") === "true"
  ) {
    window.location.replace("/cenarios/cave/index.html");
    return;
  }
})();

if (typeof tsParticles !== "undefined") {
  tsParticles.load("fire-background", {
    preset: "fire",
    fullScreen: { enable: false },
    background: { color: "#000000" },
  });
}

// Detecta se é mobile
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

// Mobile = 55% da velocidade do PC
const MOBILE_SPEED_MULTIPLIER = 0.55;

// ======== CONFIG ========
// AGORA EM PORCENTAGEM (0 a 100 relativa a tela do jogo)
const CONFIG = {
  arenaPadding: 36, // Padding em pixels ainda é seguro para bordas
  boss: {
    img: "/assets/img/NPC_Warrior-attack.png",
    widthPct: 40, // 40% da largura da tela
    heightPct: 35, // 35% da altura da tela
    hp: 2000,
    speed: isMobile ? 0.55 * MOBILE_SPEED_MULTIPLIER : 0.55,
    teleportInterval: isMobile ? [2000, 4000] : [1500, 3000], // Mobile teleporta menos
    castTime: 2500,
    hitsToCancel: 3,
    damageHearts: 1,
    hitDamage: 24,
  },
  minion: {
    img: "/assets/img/NPC_Minion.png",
    widthPct: 18, // 18% da largura da tela
    heightPct: 18, // 18% da altura da tela
    hp: 250,
    speed: isMobile ? 0.44 * MOBILE_SPEED_MULTIPLIER : 0.44,
    teleportInterval: isMobile ? [3000, 4500] : [2500, 3800], // Mobile teleporta menos
    castTime: 2400,
    hitsToCancel: 1,
    damageHearts: 1,
    hitDamage: 12,
  },
  playerHearts: 6,
  sliceMinSpeed: 0.25,
  trailLifetime: 450,
  hitCooldown: 280,
  circleDamageMultiplier: 2.6,
};

// ======== DOM ========
const arena = document.getElementById("arena");
const enemiesWrap = document.getElementById("enemies");
const trailsSvg = document.getElementById("trails");
const particlesWrap = document.getElementById("particles");
const bossBarFill = document.getElementById("boss-bar-fill");
const overlayContainer = document.getElementById("overlay-container");
const heartsWrap = document.getElementById("hearts");

// ======== STATE ========
let state = {
  running: true,
  enemies: [],
  playerHearts: CONFIG.playerHearts,
  pointerDown: false,
  prevPointer: null,
  triggers: { spawnedAt65: false, spawnedAt30: false },
  currentTrail: null,
  lastFrame: performance.now(),
};

// ======== Util ========
const now = () => performance.now();
const rand = (a, b) => Math.random() * (b - a) + a;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function distPointToSegment(px, py, x1, y1, x2, y2) {
  const A = px - x1,
    B = py - y1,
    C = x2 - x1,
    D = y2 - y1;
  const dot = A * C + B * D;
  const len2 = C * C + D * D;
  let t = len2 ? dot / len2 : -1;
  t = clamp(t, 0, 1);
  const projx = x1 + C * t,
    projy = y1 + D * t;
  const dx = px - projx,
    dy = py - projy;
  return Math.hypot(dx, dy);
}

// ======== Enemy class ========
class Enemy {
  constructor(opts) {
    this.id = Math.random().toString(36).slice(2, 9);
    this.isMinion = !!opts.isMinion;

    // Configurações visuais em %
    this.wPct = opts.widthPct;
    this.hPct = opts.heightPct;

    // Calcula pixels reais iniciais
    this.updateDimensions();

    this.hp = opts.hp;
    this.maxHp = opts.hp;
    this.speed = opts.speed;
    this.teleportRange = opts.teleportInterval;
    this.castTime = opts.castTime;
    this.hitsToCancel = opts.hitsToCancel;
    this.damageHearts = opts.damageHearts || 1;
    this.hitDamage = opts.hitDamage;
    this.imgSrc = opts.img;
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.casting = false;
    this.hitsDuringCast = 0;
    this.lastHitAt = 0;
    this.active = true;
    this.hidden = false;
    this.createElement();
    this.spawn();
    this.scheduleTeleport();
    this.scheduleCast();
    this.updateCastBound = this.updateCast.bind(this);
  }

  // Recalcula pixels baseado na % e no tamanho atual da tela
  updateDimensions() {
    const arenaW = arena.clientWidth;
    const arenaH = arena.clientHeight;

    this.wPx = arenaW * (this.wPct / 100);
    this.hPx = arenaH * (this.hPct / 100);

    // "Size" vira uma média para a colisão circular funcionar +/- bem
    this.size = (this.wPx + this.hPx) / 2;

    // Atualiza visual se o elemento já existir
    if (this.el) {
      this.el.style.width = this.wPct + "%";
      this.el.style.height = this.hPct + "%";
      // Re-aplica posição para garantir que não saiu da tela no resize
      this.setPos(this.x, this.y, true);
    }
  }

  createElement() {
    const el = document.createElement("div");
    el.className = "enemy" + (this.isMinion ? " minion" : "");
    // Aplica % no CSS
    el.style.width = this.wPct + "%";
    el.style.height = this.hPct + "%";
    el.style.position = "absolute"; // Garante absolute

    el.innerHTML = `
      <div class="hp-small"><div class="fill" style="width:100%"></div></div>
      <div class="cast-bar"><div class="fill"></div></div>
      <img src="${this.imgSrc}" draggable="false" alt="enemy" style="width:100%; height:100%; object-fit:contain;">
    `;
    enemiesWrap.appendChild(el);
    this.el = el;
    this.hpFill = el.querySelector(".hp-small .fill");
    this.castFill = el.querySelector(".cast-bar .fill");
  }

  spawn() {
    const pad = CONFIG.arenaPadding;
    const aw = arena.clientWidth - pad * 2 - this.wPx;
    const ah = arena.clientHeight - pad * 2 - this.hPx;
    this.x = pad + Math.random() * aw;
    this.y = pad + Math.random() * ah;
    this.setPos(this.x, this.y, true);
    this.pickTarget();
  }

  setPos(x, y, noTransform) {
    // Clamp usando largura/altura em pixels atuais
    this.x = clamp(x, 0, arena.clientWidth - this.wPx);
    this.y = clamp(y, 0, arena.clientHeight - this.hPx);

    this.el.style.left = this.x + "px";
    this.el.style.top = this.y + "px";

    if (!noTransform) {
      const rot = (Math.random() - 0.5) * 10; // Reduzi a rotação pra não bugar layouts retangulares
      this.el.style.transform = `rotate(${rot}deg)`;
    }
  }

  pickTarget() {
    const pad = CONFIG.arenaPadding;
    const aw = arena.clientWidth - pad * 2 - this.wPx;
    const ah = arena.clientHeight - pad * 2 - this.hPx;
    this.targetX = pad + Math.random() * aw;
    this.targetY = pad + Math.random() * ah;
  }

  scheduleTeleport() {
    const [minT, maxT] = this.teleportRange;
    clearTimeout(this.teleportTimeout);
    this.teleportTimeout = setTimeout(() => {
      if (!this.active || !state.running || this.hidden) {
        this.scheduleTeleport();
        return;
      }
      const pad = CONFIG.arenaPadding;
      const aw = arena.clientWidth - pad * 2 - this.wPx;
      const ah = arena.clientHeight - pad * 2 - this.hPx;
      const tx = pad + Math.random() * aw;
      const ty = pad + Math.random() * ah;
      this.setPos(tx, ty);
      this.pickTarget();
      this.scheduleTeleport();
    }, rand(minT, maxT));
  }

  scheduleCast() {
    clearTimeout(this.castScheduleTimeout);
    this.castScheduleTimeout = setTimeout(() => {
      if (!this.active || !state.running || this.hidden) {
        this.scheduleCast();
        return;
      }
      this.startCast();
    }, rand(700, 2200));
  }

  startCast() {
    if (!this.active || this.hidden) return;
    this.casting = true;
    this.hitsDuringCast = 0;
    this.castStartAt = now();
    this.el.querySelector(".cast-bar").style.display = "block";
    this.updateCast();
  }

  updateCast() {
    if (!this.casting) return;
    const elapsed = now() - this.castStartAt;
    const prog = clamp(elapsed / this.castTime, 0, 1);
    this.castFill.style.width = prog * 100 + "%";
    if (prog >= 1) {
      this.finishCast();
    } else {
      this.castTimer = requestAnimationFrame(this.updateCastBound);
    }
  }

  finishCast() {
    this.casting = false;
    this.castFill.style.width = "0%";
    this.el.querySelector(".cast-bar").style.display = "none";
    this.scheduleCast();

    if (this.hitsDuringCast >= this.hitsToCancel) {
      this.flash("cancel");
    } else {
      // ======== ATAQUE COMPLETO (DANO) ========
      damagePlayerHearts(this.damageHearts);
      this.flash("cast");

      // 🔊 ADICIONE O SOM DE ATAQUE AQUI
      if (this.isMinion) {
        tocarEfeito("fire");
        console.log("🔊 Som Minion Atacou");
      } else {
        // Exemplo: new Audio('assets/sfx/boss-attack.mp3').play();
        tocarEfeito("whoosh");
      }
    }
  }

  cancelCastByHitImmediate() {
    if (!this.casting) return;
    this.casting = false;
    cancelAnimationFrame(this.castTimer);
    this.castFill.style.width = "0%";
    this.el.querySelector(".cast-bar").style.display = "none";
    this.flash("cancel");
    this.scheduleCast();
  }

  moveStep(dt) {
    if (!this.active || this.hidden) return;
    const dx = this.targetX - this.x,
      dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);
    const step = this.speed * dt;
    if (dist <= step) {
      this.setPos(this.targetX, this.targetY, true);
      this.pickTarget();
    } else {
      const nx = dx / dist,
        ny = dy / dist;
      this.setPos(this.x + nx * step, this.y + ny * step, true);
    }
  }

  takeHit(dmg, opts = { circle: false }) {
    const t = now();
    if (t - this.lastHitAt < CONFIG.hitCooldown) return false;
    this.lastHitAt = t;
    this.hp = Math.max(0, this.hp - dmg);
    this.hpFill.style.width = (this.hp / this.maxHp) * 100 + "%";
    this.el.classList.add("hit");
    setTimeout(() => this.el.classList.remove("hit"), 140);

    if (this.casting) {
      if (this.isMinion) {
        this.cancelCastByHitImmediate();
      } else {
        if (opts.circle) {
          this.cancelCastByHitImmediate();
        } else {
          this.hitsDuringCast++;
          if (this.hitsDuringCast >= CONFIG.boss.hitsToCancel) {
            this.cancelCastByHitImmediate();
          }
        }
      }
    }

    if (this.hp <= 0) this.die();
    return true;
  }

  die() {
    this.active = false;
    clearTimeout(this.teleportTimeout);
    clearTimeout(this.castScheduleTimeout);
    cancelAnimationFrame(this.castTimer);
    this.el.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.6)" },
      ],
      { duration: 300, easing: "ease", fill: "forwards" }
    );
    setTimeout(() => {
      try {
        enemiesWrap.removeChild(this.el);
      } catch (e) {}
    }, 320);
  }

  hide() {
    this.hidden = true;
    this.casting = false;
    clearTimeout(this.castScheduleTimeout);
    cancelAnimationFrame(this.castTimer);
    this.el.style.visibility = "hidden";
  }

  reveal() {
    this.hidden = false;
    this.el.style.visibility = "visible";
    this.pickTarget();
    this.scheduleTeleport();
    this.scheduleCast();
  }

  flash(type) {
    this.el.style.filter =
      type === "cast"
        ? "drop-shadow(0 0 16px rgba(255,140,0,0.95))"
        : "drop-shadow(0 0 16px rgba(90,220,220,0.95))";
    setTimeout(() => (this.el.style.filter = ""), 240);
  }
}

// ======== Game functions ========
function spawnEnemy(isMinion = false) {
  if (!state.running) return null;
  const cfg = isMinion ? CONFIG.minion : CONFIG.boss;
  const e = new Enemy({
    isMinion,
    widthPct: cfg.widthPct, // Passando %
    heightPct: cfg.heightPct, // Passando %
    hp: cfg.hp,
    speed: cfg.speed,
    teleportInterval: cfg.teleportInterval,
    castTime: cfg.castTime,
    hitsToCancel: cfg.hitsToCancel,
    damageHearts: cfg.damageHearts,
    hitDamage: cfg.hitDamage,
    img: cfg.img,
  });
  state.enemies.push(e);
  updateBossBar();
  return e;
}

function removeAllEnemiesImmediate() {
  state.enemies.forEach((e) => {
    e.active = false;
    clearTimeout(e.teleportTimeout);
    clearTimeout(e.castScheduleTimeout);
    cancelAnimationFrame(e.castTimer);
    try {
      enemiesWrap.removeChild(e.el);
    } catch (_) {}
  });
  state.enemies = [];
}

function damagePlayerHearts(n) {
  if (state.playerHearts <= 0) return;
  for (let i = 0; i < n; i++) {
    if (state.playerHearts <= 0) break;
    const idx = state.playerHearts - 1;
    const heart = heartsWrap.children[idx];
    if (heart) heart.classList.add("lost");
    state.playerHearts--;
  }
  heartsWrap.style.animation = "heart-shake 420ms ease";
  setTimeout(() => (heartsWrap.style.animation = ""), 440);
  if (state.playerHearts <= 0) {
    gameOver();
  }
}

function updateBossBar() {
  const boss = state.enemies.find((e) => !e.isMinion && e.active);
  if (boss) {
    const w = (boss.hp / boss.maxHp) * 100;
    bossBarFill.style.width = w + "%";
  } else {
    bossBarFill.style.width = "0%";
  }
}

// ======== Input / trails / slices ========
function startPointer(e) {
  state.pointerDown = true;
  const pt = getPointerPos(e);
  state.prevPointer = { x: pt.x, y: pt.y, t: now() };
  createTrail(pt.x, pt.y);
}
function movePointer(e) {
  if (!state.pointerDown) return;
  const pt = getPointerPos(e);
  const cur = { x: pt.x, y: pt.y, t: now() };
  const dt = Math.max(1, cur.t - state.prevPointer.t);
  const dx = cur.x - state.prevPointer.x,
    dy = cur.y - state.prevPointer.y;
  const speed = Math.hypot(dx, dy) / dt;
  extendTrail(cur.x, cur.y);
  if (speed > CONFIG.sliceMinSpeed) {
    checkSliceHit(
      state.prevPointer.x,
      state.prevPointer.y,
      cur.x,
      cur.y,
      Math.max(18, Math.min(46, speed * 26))
    );
  }
  state.prevPointer = cur;
}
function endPointer(e) {
  state.pointerDown = false;
  state.prevPointer = null;
  finishTrailAndEvaluateCircle();
}

function getPointerPos(e) {
  const rect = arena.getBoundingClientRect();
  const cx =
    e.clientX !== undefined ? e.clientX : e.touches && e.touches[0].clientX;
  const cy =
    e.clientY !== undefined ? e.clientY : e.touches && e.touches[0].clientY;
  return { x: cx - rect.left, y: cy - rect.top };
}

// Trails (SVG)
let trailId = 0;
function createTrail(x, y) {
  const id = `trail-${trailId++}`;
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", `M ${x} ${y}`);
  path.setAttribute("stroke", "rgba(255,255,255,0.9)");
  path.setAttribute("id", id);
  trailsSvg.appendChild(path);
  state.currentTrail = { el: path, points: [{ x, y, t: now() }] };
  setTimeout(() => {
    if (state.currentTrail && state.currentTrail.el === path)
      finishTrailAndEvaluateCircle();
  }, CONFIG.trailLifetime);
}
function extendTrail(x, y) {
  if (!state.currentTrail) return;
  const pts = state.currentTrail.points;
  pts.push({ x, y, t: now() });
  const d = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");
  state.currentTrail.el.setAttribute("d", d);
  if (pts.length >= 2) {
    const a = pts[pts.length - 2],
      b = pts[pts.length - 1];
    const speed = Math.hypot(b.x - a.x, b.y - a.y) / Math.max(1, b.t - a.t);
    const sw = clamp(22 - speed * 20, 4, 24);
    state.currentTrail.el.style.strokeWidth = sw;
    state.currentTrail.el.style.stroke = "rgba(255,255,255,0.92)";
  }
}
function finishTrail() {
  if (!state.currentTrail) return;
  const path = state.currentTrail.el;
  path.animate([{ opacity: 1 }, { opacity: 0 }], {
    duration: CONFIG.trailLifetime,
    easing: "ease-out",
    fill: "forwards",
  });
  setTimeout(() => {
    try {
      trailsSvg.removeChild(path);
    } catch (e) {}
  }, CONFIG.trailLifetime + 60);
  state.currentTrail = null;
}

// Slice collision (segment vs enemy)
function checkSliceHit(x1, y1, x2, y2, radius) {
  for (const e of state.enemies.slice()) {
    if (!e.active || e.hidden || e.hp <= 0) continue;
    // Pega o centro baseado no tamanho atual (pixels)
    const cx = e.x + e.wPx / 2;
    const cy = e.y + e.hPx / 2;
    // Raio de colisão = metade do menor lado ou média
    const r = (Math.min(e.wPx, e.hPx) / 2) * 0.9;

    const d = distPointToSegment(cx, cy, x1, y1, x2, y2);
    if (d <= r + radius * 0.4) {
      const applied = e.takeHit(e.hitDamage, { circle: false });
      if (applied) {
        e.targetX += (cx - x2) * 0.12;
        e.targetY += (cy - y2) * 0.12;
        updateBossBar();
        runTriggersAfterDamage();
      }
    }
  }
  state.enemies = state.enemies.filter((en) => en.hp > 0 && en.active);
}

// Evaluate circle
function finishTrailAndEvaluateCircle() {
  if (!state.currentTrail) {
    finishTrail();
    return;
  }
  const pts = state.currentTrail.points.slice();
  for (const e of state.enemies.slice()) {
    if (!e.active || e.hidden || e.hp <= 0) continue;
    const cx = e.x + e.wPx / 2;
    const cy = e.y + e.hPx / 2;
    const angles = [];
    for (const p of pts) {
      const dx = p.x - cx,
        dy = p.y - cy;
      const dist = Math.hypot(dx, dy);
      // Ajuste na detecção de proximidade com base no tamanho atual
      const minSize = Math.min(e.wPx, e.hPx);
      if (dist < Math.max(minSize * 0.45, 20)) continue;
      angles.push(Math.atan2(dy, dx));
    }
    if (angles.length < 6) continue;
    angles.sort((a, b) => a - b);
    let maxGap = 0;
    for (let i = 0; i < angles.length - 1; i++)
      maxGap = Math.max(maxGap, angles[i + 1] - angles[i]);
    const wrapGap = angles[0] + Math.PI * 2 - angles[angles.length - 1];
    maxGap = Math.max(maxGap, wrapGap);
    const coverage = Math.PI * 2 - maxGap;
    if (coverage >= Math.PI) {
      const dmg = Math.round(e.hitDamage * CONFIG.circleDamageMultiplier);
      const applied = e.takeHit(dmg, { circle: true });
      if (applied) {
        spawnParticlesAt(cx, cy, Math.min(18, Math.round(12 + dmg / 4)));
        updateBossBar();
        runTriggersAfterDamage();
      }
    }
  }
  finishTrail();
  state.currentTrail = null;
  state.enemies = state.enemies.filter((en) => en.hp > 0 && en.active);
}

// ======== Particles ========
function spawnParticlesAt(x, y, count) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.round(rand(6, 12));
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = x - size / 2 + "px";
    p.style.top = y - size / 2 + "px";
    particlesWrap.appendChild(p);
    const angle = rand(0, Math.PI * 2);
    const dist = rand(18, 72);
    const tx = Math.cos(angle) * dist,
      ty = Math.sin(angle) * dist;
    p.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${tx}px,${ty}px) scale(0.6)`, opacity: 0 },
      ],
      {
        duration: 700 + Math.random() * 400,
        easing: "cubic-bezier(.2,.8,.2,1)",
        fill: "forwards",
      }
    );
    setTimeout(() => {
      try {
        particlesWrap.removeChild(p);
      } catch (_) {}
    }, 1200);
  }
}

// ======== Triggers & phases ========
function runTriggersAfterDamage() {
  const boss = state.enemies.find((e) => !e.isMinion && e.active);
  if (!boss) return;
  if (!state.triggers.spawnedAt65 && boss.hp <= boss.maxHp * 0.65) {
    state.triggers.spawnedAt65 = true;
    for (let i = 0; i < 4; i++) spawnEnemy(true);
    boss.hide();
    monitorMinionsForReveal(boss);
  }
  if (!state.triggers.spawnedAt30 && boss.hp <= boss.maxHp * 0.3) {
    state.triggers.spawnedAt30 = true;
    for (let i = 0; i < 5; i++) spawnEnemy(true);
  }
}

function monitorMinionsForReveal(boss) {
  const check = () => {
    if (!state.running) return;
    const alive = state.enemies.filter((e) => e.isMinion && e.active);
    if (alive.length === 0) {
      boss.reveal();
    } else {
      setTimeout(check, 420);
    }
  };
  setTimeout(check, 420);
}

// ======== Game loop ========
function frame() {
  if (!state.running) return;
  const t = now();
  const dt = t - state.lastFrame;
  state.lastFrame = t;
  for (const e of state.enemies) e.moveStep(dt);
  updateBossBar();
  requestAnimationFrame(frame);
}

// ======== Game Over & reset ========
function gameOver() {
  state.running = false;
  state.enemies.forEach((e) => {
    e.active = false;
    clearTimeout(e.teleportTimeout);
    clearTimeout(e.castScheduleTimeout);
    cancelAnimationFrame(e.castTimer);
    if (e.el)
      e.el.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 400,
        fill: "forwards",
      });
  });
  setTimeout(() => {
    try {
      enemiesWrap.innerHTML = "";
    } catch (_) {}
    state.enemies = [];
  }, 420);

  overlayContainer.innerHTML = "";
  const msg = document.createElement("div");
  msg.textContent = "You have been defeated!";
  overlayContainer.appendChild(msg);

  setTimeout(() => {
    window.location.replace("/cenarios/cave/index.html");
  }, 5000);
}

function clearOverlay() {
  overlayContainer.innerHTML = "";
}

function resetGame() {
  clearOverlay();
  particlesWrap.innerHTML = "";
  try {
    trailsSvg.innerHTML = "";
  } catch (_) {}
  state.enemies.forEach((e) => {
    clearTimeout(e.teleportTimeout);
    clearTimeout(e.castScheduleTimeout);
    cancelAnimationFrame(e.castTimer);
    try {
      enemiesWrap.removeChild(e.el);
    } catch (_) {}
  });
  state.enemies = [];
  state.running = true;
  state.playerHearts = CONFIG.playerHearts;
  state.triggers = { spawnedAt65: false, spawnedAt30: false };
  state.currentTrail = null;
  state.lastFrame = now();
  buildHeartsUI();
  spawnEnemy(false);
  requestAnimationFrame(frame);
}

function buildHeartsUI() {
  heartsWrap.innerHTML = "";
  for (let i = 0; i < CONFIG.playerHearts; i++) {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerHTML = "❤";
    heartsWrap.appendChild(h);
  }
}

// ======== Boss Defeat / Victory Logic ========
function onBossDefeated() {
  console.log("✅ Boss derrotado");

  // A TATUAGEM ETERNA: Marca que esse minigame já foi vencido
  localStorage.setItem("wendigo_completo", "true");

  gameData.visualState.solON = true;
  gameData.visualState.minigame4 = true;
  gameData.visualState.pedraLiberada = true;
  mudarCenario(personagens.cat, "segunda");
  mudarCenario(personagens.nana, "power");

  // Delay de 2.5s para mostrar mensagem de vitória antes de redirecionar
  setTimeout(() => {
    window.location.replace("/cenarios/cave/index.html");
  }, 2500);
}

const originalDie = Enemy.prototype.die;
Enemy.prototype.die = function () {
  const wasBoss = !this.isMinion;
  originalDie.apply(this, arguments);
  if (wasBoss) {
    handleBossDefeat();
  }
};

function handleBossDefeat() {
  state.running = false;
  state.enemies.forEach((e) => {
    if (e.isMinion) {
      e.active = false;
      e.canDamage = false;
      e.casting = false;
      e.hp = 0;
      if (e.el && e.el.parentNode) {
        e.el.style.transition = "opacity 0.3s ease";
        e.el.style.opacity = "0";
        setTimeout(() => {
          try {
            enemiesWrap.removeChild(e.el);
          } catch (_) {}
        }, 300);
      }
    }
  });
  state.enemies = state.enemies.filter((e) => !e.isMinion);

  overlayContainer.innerHTML = "";
  const msg = document.createElement("div");
  msg.className = "overlay-msg";
  msg.textContent = "YOU WIN!";
  overlayContainer.appendChild(msg);

  onBossDefeated();
}

// ======== Init & events ========
function init() {
  arena.addEventListener("pointerdown", (e) => {
    arena.setPointerCapture(e.pointerId);
    startPointer(e);
  });
  window.addEventListener("pointermove", (e) => movePointer(e));
  window.addEventListener("pointerup", (e) => endPointer(e));
  arena.addEventListener("contextmenu", (e) => e.preventDefault());

  // Resize agora recalcula os pixels dos inimigos
  window.addEventListener("resize", () => {
    state.enemies.forEach((e) => e.updateDimensions());
  });

  buildHeartsUI();
  resetGame();
}

init();

// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("sun");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();
