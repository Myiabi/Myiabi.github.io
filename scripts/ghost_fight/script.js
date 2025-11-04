// fight.js — v10: flash vermelho no teleporte + teleporte aleatório mais raro

const enemy = document.getElementById("enemy");
const emoji = document.getElementById("enemy-emoji");
const growthText = document.getElementById("growth");
const timerText = document.getElementById("timer");
const lua = document.getElementById("lua");

// === CONFIG ===
const START_TIMER = 45;
const GROWTH_RATE_WHEN_HIDDEN = 8;
const REGRESS_RATE_WHEN_REVEALED = 20;
const TELEPORT_AFTER_FOCUS = 7; // s focado
const RANDOM_TELEPORT_INTERVAL_MIN = 9; // ↓ teleporte mais raro
const RANDOM_TELEPORT_INTERVAL_MAX = 18;
const FOCUS_RATIO = 1.0;
const EDGE_BUFFER = 60;
const BASE_SPEED = 6;
const MAX_SPEED = 30;
const ESCAPE_STRENGTH = 4.0;
const DRIBBLE_INTENSITY = 4.5;
const MAX_SCALE = 2.5;

// === STATE ===
let growth = 0;
let timer = START_TIMER;
let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let dir = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
let speed = BASE_SPEED;
let lastTime = null;
let focusAccum = 0;
let gameOver = false;
let revealed = false;
let nextRandomTeleport = 0;

// === LUA ===
let luaX = window.innerWidth / 2;
let luaY = window.innerHeight / 2;
let luaRadius = lua.offsetWidth / 2;

function setLuaPos(x, y) {
  luaX = x;
  luaY = y;
  lua.style.left = `${x}px`;
  lua.style.top = `${y}px`;
}

window.addEventListener("mousemove", (e) => setLuaPos(e.clientX, e.clientY));
window.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  if (t) setLuaPos(t.clientX, t.clientY);
}, { passive: false });
window.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  if (t) setLuaPos(t.clientX, t.clientY);
}, { passive: false });
window.addEventListener("resize", () => {
  luaRadius = lua.offsetWidth / 2;
});

function normalizeDir() {
  const len = Math.hypot(dir.x, dir.y) || 1;
  dir.x /= len;
  dir.y /= len;
}

function randomInterval(min, max) {
  return Math.random() * (max - min) + min;
}

// cria flash vermelho no ponto do teleporte
function spawnFlash(x, y) {
  const flash = document.createElement("div");
  flash.className = "flash";
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 300);
}

// teleporte demoníaco
function teleportEnemy() {
  spawnFlash(pos.x, pos.y); // flash no ponto de saída

  const w = window.innerWidth;
  const h = window.innerHeight;
  pos.x = EDGE_BUFFER + Math.random() * (w - 2 * EDGE_BUFFER);
  pos.y = EDGE_BUFFER + Math.random() * (h - 2 * EDGE_BUFFER);
  dir.x = Math.random() * 2 - 1;
  dir.y = Math.random() * 2 - 1;
  normalizeDir();
  focusAccum = 0;
  speed = BASE_SPEED;
  enemy.style.opacity = "0";

  spawnFlash(pos.x, pos.y); // flash no ponto de chegada

  // agenda novo teleporte aleatório
  nextRandomTeleport = performance.now() / 1000 + randomInterval(RANDOM_TELEPORT_INTERVAL_MIN, RANDOM_TELEPORT_INTERVAL_MAX);
}

function endGame(win) {
  if (gameOver) return;
  gameOver = true;
  const msg = document.createElement("div");
  msg.textContent = win ? "🌕 Você venceu!" : "👹 O inimigo venceu!";
  Object.assign(msg.style, {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    fontSize: "3vw",
    color: "#fff",
    textShadow: "0 0 1vw #000",
    zIndex: 9999,
  });
  document.body.appendChild(msg);
}

// === LOOP ===
function update(dt, nowSec) {
  if (gameOver) return;

  // teleporte aleatório espontâneo
  if (nowSec >= nextRandomTeleport) teleportEnemy();

  // ruído direcional
  if (Math.random() < 0.03) {
    dir.x += (Math.random() - 0.5) * 0.8;
    dir.y += (Math.random() - 0.5) * 0.8;
  }

  normalizeDir();
  pos.x += dir.x * speed;
  pos.y += dir.y * speed;

  // bordas → vira e acelera
  if (pos.x < EDGE_BUFFER || pos.x > window.innerWidth - EDGE_BUFFER ||
      pos.y < EDGE_BUFFER || pos.y > window.innerHeight - EDGE_BUFFER) {
    dir.x = Math.random() * 2 - 1;
    dir.y = Math.random() * 2 - 1;
    normalizeDir();
    speed = Math.min(speed * 1.4, MAX_SPEED);
    pos.x = Math.min(Math.max(pos.x, EDGE_BUFFER + 10), window.innerWidth - EDGE_BUFFER - 10);
    pos.y = Math.min(Math.max(pos.y, EDGE_BUFFER + 10), window.innerHeight - EDGE_BUFFER - 10);
  }

  // foco
  const dx = pos.x - luaX;
  const dy = pos.y - luaY;
  const dist = Math.hypot(dx, dy);
  const inside = dist < luaRadius * FOCUS_RATIO;

  if (inside) {
    revealed = true;
    focusAccum += dt;
    growth -= REGRESS_RATE_WHEN_REVEALED * dt;
    growth = Math.max(growth, 0);

    // aceleração exponencial
    const accelFactor = Math.pow(1.8, focusAccum);
    speed = Math.min(BASE_SPEED * accelFactor, MAX_SPEED);

    // evasão driblando
    const angle = Math.atan2(dy, dx);
    const evadeAngle = angle + (Math.random() - 0.5) * DRIBBLE_INTENSITY;
    dir.x = Math.cos(evadeAngle);
    dir.y = Math.sin(evadeAngle);
    dir.x += (dx / (dist || 1)) * ESCAPE_STRENGTH * dt * 3;
    dir.y += (dy / (dist || 1)) * ESCAPE_STRENGTH * dt * 3;
    normalizeDir();

    if (focusAccum >= TELEPORT_AFTER_FOCUS) teleportEnemy();
  } else {
    revealed = false;
    growth += GROWTH_RATE_WHEN_HIDDEN * dt;
    growth = Math.min(growth, 100);
    speed = BASE_SPEED;
    focusAccum = 0;
  }

  enemy.style.opacity = revealed ? "1" : "0";

  // aparência
  let scale = 1 + growth / 100;
  if (scale > MAX_SCALE) scale = MAX_SCALE;
  const redness = Math.min(Math.max((growth - 50) / 50, 0), 1);
  emoji.style.filter = `drop-shadow(0 0 ${0.5 + redness}vw rgba(255,40,40,${0.3 + redness * 0.6}))`;

  enemy.style.transform = `translate(-50%, -50%) translate(${pos.x - window.innerWidth / 2}px, ${pos.y - window.innerHeight / 2}px) scale(${scale})`;
  growthText.textContent = `${Math.round(growth)}%`;

  if (growth >= 100) endGame(false);
}

function gameLoop(ts) {
  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;
  const nowSec = ts / 1000;
  update(dt, nowSec);
  if (!gameOver) requestAnimationFrame(gameLoop);
}

function startTimer() {
  timerText.textContent = `${timer}s`;
  const interval = setInterval(() => {
    if (gameOver) {
      clearInterval(interval);
      return;
    }
    timer -= 1;
    timerText.textContent = `${timer}s`;
    if (timer <= 0) {
      clearInterval(interval);
      endGame(true);
    }
  }, 1000);
}

// === START ===
normalizeDir();
teleportEnemy(); // inicia e agenda primeiro teleporte
requestAnimationFrame(gameLoop);
startTimer();
