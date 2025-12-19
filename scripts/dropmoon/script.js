// fight.js — v22: Fix Scaling + Speed + Random Teleport

// ========== SISTEMA DE PASSE ÚNICO ==========
(function () {
  const token = sessionStorage.getItem("acesso_dropmoon");
  sessionStorage.removeItem("acesso_dropmoon"); // Remove IMEDIATAMENTE (uso único)

  // Se não tinha permissão OU já venceu antes → chuta pra forest
  if (
    token !== "autorizado" ||
    localStorage.getItem("dropmoon_completo") === "true"
  ) {
    window.location.replace("/cenarios/forest/index.html");
    return;
  }
})();

const enemy = document.getElementById("enemy");
const emoji = document.getElementById("enemy-emoji");
const growthText = document.getElementById("growth");
const timerText = document.getElementById("timer");
const lua = document.getElementById("lua");

/* CONFIG */
const START_TIMER = 50;
const GROWTH_RATE_WHEN_HIDDEN = 8;
const REGRESS_RATE_WHEN_REVEALED = 18;
const TELEPORT_AFTER_FOCUS = 6;

// CONFIG DE TELEPORTE ALEATÓRIO
const RANDOM_TELEPORT_MIN = 8; // segundos
const RANDOM_TELEPORT_MAX = 15; // segundos

// Detecta se é mobile
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ||
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0;

// CONFIG DE VELOCIDADE - Mobile mais lento para compensar tela menor
const MOBILE_SPEED_MULTIPLIER = 0.55; // Mobile = 55% da velocidade do PC
const BASE_SPEED = isMobile ? 210 * MOBILE_SPEED_MULTIPLIER : 210;
const MAX_SPEED = isMobile ? 500 * MOBILE_SPEED_MULTIPLIER : 500;
const TURN_SPEED = isMobile ? 2.5 : 4.0; // Mobile vira mais devagar também

const EDGE_BUFFER = 100;
const WALL_REPULSION = 2.5;

const HINT_THRESHOLD = 25;
const HINT_DURATION = 1.5;

/* STATE */
let growth, timer, pos, velocity, speedMultiplier;
let lastTime, focusAccum, gameOver, revealed, nextRandomTeleport;
let hiddenGrowthSinceSeen, hintedFlag;
let luaX, luaY, luaRadius;
let restartButton, endMsg;
let timerInterval = null;
let wanderAngle = 0;

/* INPUT */
let targetLuaX = window.innerWidth / 2;
let targetLuaY = window.innerHeight / 2;
let isTouchMode = false;

/* --- INIT --- */
function resetGame() {
  if (timerInterval) clearInterval(timerInterval);

  growth = 0;
  timer = START_TIMER;
  pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  velocity = { x: Math.random() - 0.5, y: Math.random() - 0.5 };
  normalizeVelocity();

  speedMultiplier = 1.0;
  wanderAngle = Math.random() * Math.PI * 2;

  lastTime = null;
  focusAccum = 0;
  gameOver = false;
  revealed = false;
  hiddenGrowthSinceSeen = 0;
  hintedFlag = false;

  luaX = window.innerWidth / 2;
  luaY = window.innerHeight / 2;
  luaRadius = lua.offsetWidth / 2;

  if (endMsg) endMsg.remove();
  if (restartButton) restartButton.remove();

  teleportEnemy(); // Primeiro teleporte define o timer do proximo
  requestAnimationFrame(gameLoop);
  startTimer();
}

/* --- PHYSICS & MOVEMENT --- */
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function normalizeVelocity() {
  const len = Math.hypot(velocity.x, velocity.y) || 1;
  velocity.x /= len;
  velocity.y /= len;
}

function randomInterval(min, max) {
  return Math.random() * (max - min) + min;
}

function updatePhysics(dt) {
  const w = window.innerWidth;
  const h = window.innerHeight;

  wanderAngle += (Math.random() - 0.5) * 5 * dt;
  let targetDirX = Math.cos(wanderAngle);
  let targetDirY = Math.sin(wanderAngle);

  const dx = pos.x - luaX;
  const dy = pos.y - luaY;
  const distToLua = Math.hypot(dx, dy);
  const isFocused = distToLua < luaRadius * 0.9;

  let currentSpeed = BASE_SPEED * speedMultiplier;

  if (isFocused) {
    revealed = true;
    focusAccum += dt;
    speedMultiplier = lerp(speedMultiplier, 2.5, dt * 2);

    // Drible e Fuga
    const angleToLua = Math.atan2(dy, dx);
    const escapeAngle = angleToLua;
    const juke = Math.sin(Date.now() / 200) * 1.5;

    targetDirX = Math.cos(escapeAngle + juke);
    targetDirY = Math.sin(escapeAngle + juke);
  } else {
    revealed = false;
    focusAccum = Math.max(0, focusAccum - dt * 2);
    speedMultiplier = lerp(speedMultiplier, 1.0, dt * 1);
  }

  let wallForceX = 0;
  let wallForceY = 0;

  if (pos.x < EDGE_BUFFER) wallForceX = 1;
  if (pos.x > w - EDGE_BUFFER) wallForceX = -1;
  if (pos.y < EDGE_BUFFER) wallForceY = 1;
  if (pos.y > h - EDGE_BUFFER) wallForceY = -1;

  if (wallForceX !== 0) targetDirX += wallForceX * WALL_REPULSION;
  if (wallForceY !== 0) targetDirY += wallForceY * WALL_REPULSION;

  const turnRate = TURN_SPEED * dt;
  velocity.x = lerp(velocity.x, targetDirX, turnRate);
  velocity.y = lerp(velocity.y, targetDirY, turnRate);

  normalizeVelocity();

  pos.x += velocity.x * currentSpeed * dt;
  pos.y += velocity.y * currentSpeed * dt;

  pos.x = Math.max(20, Math.min(w - 20, pos.x));
  pos.y = Math.max(20, Math.min(h - 20, pos.y));
}

function updateGameLogic(dt) {
  // --- TELEPORTE AUTOMÁTICO (CORRIGIDO) ---
  const now = performance.now() / 1000;
  // Só teleporta se não estiver sendo visto agora
  if (now > nextRandomTeleport && !revealed) {
    teleportEnemy();
  }

  if (revealed) {
    growth -= REGRESS_RATE_WHEN_REVEALED * dt;
    enemy.style.opacity = 1;
    hiddenGrowthSinceSeen = 0;
    hintedFlag = false;
    if (focusAccum > TELEPORT_AFTER_FOCUS) teleportEnemy();
  } else {
    growth += GROWTH_RATE_WHEN_HIDDEN * dt;
    const growthDelta = GROWTH_RATE_WHEN_HIDDEN * dt;
    hiddenGrowthSinceSeen += growthDelta;
    if (hiddenGrowthSinceSeen > HINT_THRESHOLD && !hintedFlag) showHintFade();
    if (!hintedFlag) enemy.style.opacity = 0;
  }

  growth = Math.max(0, Math.min(100, growth));
  growthText.textContent = `${Math.floor(growth)}%`;

  // === LÓGICA DE TAMANHO SUAVIZADA ===
  // Math.pow(x, 1.5) faz crescer devagar no começo e rápido no fim
  // Ex: 33% -> (0.33 ^ 1.5) * 3 = 0.57 (Aumenta só 50%)
  // Ex: 100% -> (1.0 ^ 1.5) * 3 = 3.0 (Aumenta 300%)
  let growthFactor = Math.pow(growth / 100, 1.5);
  let baseScale = 1 + growthFactor * 3.0;

  // Heartbeat só depois de 80%
  let pulse = 0;
  if (growth > 80) {
    const pulseSpeed = 10 + (growth - 80);
    pulse = Math.sin(Date.now() / (2000 / pulseSpeed)) * 0.2;
  }

  let finalScale = baseScale + pulse;
  finalScale = Math.min(finalScale, 4.5);

  enemy.style.transform = `translate(-50%, -50%) scale(${finalScale})`;
  enemy.style.left = `${pos.x}px`;
  enemy.style.top = `${pos.y}px`;

  const redness = growth / 100;

  if (growth >= 100) endGame(false);
}

/* --- UTILS & EVENTS --- */
function showHintFade() {
  hintedFlag = true;
  enemy.style.transition = `opacity ${HINT_DURATION}s ease-in-out`;
  enemy.style.opacity = 0.4;
  setTimeout(() => {
    if (!revealed && !gameOver) enemy.style.opacity = 0;
    setTimeout(() => {
      enemy.style.transition = "";
    }, 500);
  }, HINT_DURATION * 1000);
}

function teleportEnemy() {
  // Flash Branco na posição VELHA (o rastro de onde saiu)
  spawnFlash(pos.x, pos.y, "white");

  const w = window.innerWidth;
  const h = window.innerHeight;
  const safeMargin = 100;

  pos.x = safeMargin + Math.random() * (w - safeMargin * 2);
  pos.y = safeMargin + Math.random() * (h - safeMargin * 2);

  // Flash Vermelho na posição NOVA (para onde foi)
  spawnFlash(pos.x, pos.y, "red");

  focusAccum = 0;
  enemy.style.opacity = 0;
  hiddenGrowthSinceSeen = 0;
  hintedFlag = false;
  wanderAngle = Math.random() * Math.PI * 2;

  // Agenda o próximo teleporte aleatório
  nextRandomTeleport =
    performance.now() / 1000 +
    randomInterval(RANDOM_TELEPORT_MIN, RANDOM_TELEPORT_MAX);
}

function spawnFlash(x, y, color) {
  const f = document.createElement("div");
  f.className = "flash";
  f.style.left = x + "px";
  f.style.top = y + "px";
  f.style.background =
    color === "red"
      ? "radial-gradient(circle, rgba(255,0,0,0.8) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)";
  document.body.appendChild(f);
  setTimeout(() => f.remove(), 400);
}

window.addEventListener("resize", () => {
  luaRadius = lua.offsetWidth / 2;
  pos.x = Math.min(pos.x, window.innerWidth - 20);
  pos.y = Math.min(pos.y, window.innerHeight - 20);
});

// Controles
window.addEventListener("mousemove", (e) => {
  if (!isTouchMode) {
    targetLuaX = e.clientX;
    targetLuaY = e.clientY;
  }
});
const touchHandler = (e) => {
  isTouchMode = true;
  if (e.touches[0]) {
    targetLuaX = e.touches[0].clientX;
    targetLuaY = e.touches[0].clientY;
  }
};
window.addEventListener("touchstart", touchHandler, { passive: false });
window.addEventListener("touchmove", touchHandler, { passive: false });

function updateLua(dt) {
  const lerpFactor = 15 * dt;
  luaX += (targetLuaX - luaX) * lerpFactor;
  luaY += (targetLuaY - luaY) * lerpFactor;
  lua.style.left = `${luaX}px`;
  lua.style.top = `${luaY}px`;
}

/* LOOP PRINCIPAL */
function gameLoop(ts) {
  if (gameOver) return;
  if (!lastTime) lastTime = ts;
  let dt = (ts - lastTime) / 1000;
  lastTime = ts;
  if (dt > 0.1) dt = 0.1;

  updatePhysics(dt);
  updateLua(dt);
  updateGameLogic(dt);

  requestAnimationFrame(gameLoop);
}

function startTimer() {
  timerText.textContent = `${timer}s`;
  timerInterval = setInterval(() => {
    timer--;
    timerText.textContent = `${timer}s`;
    if (timer <= 0) {
      clearInterval(timerInterval);
      endGame(true);
    }
  }, 1000);
}

function endGame(win) {
  gameOver = true;
  clearInterval(timerInterval);
  if (endMsg) endMsg.remove();
  if (restartButton) restartButton.remove();

  // 1. O ASSASSINO DO TOKEN: Apaga a permissão assim que o jogo acaba
  sessionStorage.removeItem("acesso_dropmoon");

  // Configurações da mensagem
  const message = win ? "You did it!!!" : "He escaped...";
  const color = win ? "#4ff" : "#f55";

  endMsg = document.createElement("div");
  endMsg.style.cssText = `position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:8vmin;color:${color};text-shadow:0 0 2vmin #000;z-index:9999;text-align:center;width:100%;font-weight:bold;font-family:'Wild Words', sans-serif;`;
  endMsg.textContent = message;
  document.body.appendChild(endMsg);

  if (win) {
    // 1. A TATUAGEM ETERNA: Grava que esse minigame já foi vencido
    localStorage.setItem("dropmoon_completo", "true"); // <--- ADICIONE ISSO

    mudarCenario(personagens.aiko, "luaMenu");
    mudarCenario(personagens.felicia, "luaWon");
    gameData.visualState.luaON = true;
  }

  // Espera 2.5 segundos para ler a mensagem e vaza
  setTimeout(() => {
    // 2. O CHUTE PERFEITO: Troquei .href por .replace
    // Isso impede que o botão "Voltar" traga o jogador de volta pra cá
    window.location.replace("/cenarios/forest/index.html");
  }, 2500);
}

// Start
resetGame();
// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("moon");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();
