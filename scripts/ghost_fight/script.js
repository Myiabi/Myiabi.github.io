// fight.js — v14: adiciona botão de restart ao perder e hooks ao vencer

const enemy = document.getElementById("enemy");
const emoji = document.getElementById("enemy-emoji");
const growthText = document.getElementById("growth");
const timerText = document.getElementById("timer");
const lua = document.getElementById("lua");

/* CONFIG */
const START_TIMER = 45;
const GROWTH_RATE_WHEN_HIDDEN = 8;
const REGRESS_RATE_WHEN_REVEALED = 20;
const TELEPORT_AFTER_FOCUS = 7;
const RANDOM_TELEPORT_INTERVAL_MIN = 9;
const RANDOM_TELEPORT_INTERVAL_MAX = 18;
const FOCUS_RATIO = 1.0;
const EDGE_BUFFER = 60;
const BASE_SPEED = 6;
const MAX_SPEED = 30;
const ESCAPE_STRENGTH = 4.0;
const DRIBBLE_INTENSITY = 4.5;
const MAX_SCALE = 2.5;
const HINT_THRESHOLD = 20;
const HINT_OPACITY = 0.3;
const HINT_DURATION = 2.0;

/* STATE */
let growth, timer, pos, dir, speed, lastTime, focusAccum, gameOver, revealed, nextRandomTeleport;
let hiddenGrowthSinceSeen, hintedFlag, lastGrowth;
let luaX, luaY, luaRadius;
let restartButton, endMsg;

/* INIT */
function resetGame() {
  growth = 0;
  timer = START_TIMER;
  pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  dir = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
  speed = BASE_SPEED;
  lastTime = null;
  focusAccum = 0;
  gameOver = false;
  revealed = false;
  nextRandomTeleport = 0;
  hiddenGrowthSinceSeen = 0;
  hintedFlag = false;
  lastGrowth = growth;

  luaX = window.innerWidth / 2;
  luaY = window.innerHeight / 2;
  luaRadius = lua.offsetWidth / 2;

  enemy.style.opacity = "0";
  if (endMsg) endMsg.remove();
  if (restartButton) restartButton.remove();

  normalizeDir();
  teleportEnemy();
  requestAnimationFrame(gameLoop);
  startTimer();
}

/* LUA FOLLOW */
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
window.addEventListener("resize", () => { luaRadius = lua.offsetWidth / 2; });

function normalizeDir() {
  const len = Math.hypot(dir.x, dir.y) || 1;
  dir.x /= len;
  dir.y /= len;
}
function randomInterval(min, max) { return Math.random() * (max - min) + min; }

function spawnFlash(x, y, color = "red", size = 100) {
  const flash = document.createElement("div");
  flash.className = "flash";
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;
  flash.style.width = `${size}px`;
  flash.style.height = `${size}px`;
  flash.style.background = color === "red"
    ? "radial-gradient(circle, rgba(255,0,0,0.9) 0%, rgba(255,0,0,0) 70%)"
    : "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)";
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 300);
}

/* TELEPORT */
function teleportEnemy() {
  spawnFlash(pos.x, pos.y, "white", 60);

  // PONTO PARA SOM: coloque aqui (teleportSound)
  // const teleportSound = new Audio('teleport.mp3'); teleportSound.play();

  const w = window.innerWidth, h = window.innerHeight;
  pos.x = EDGE_BUFFER + Math.random() * (w - 2 * EDGE_BUFFER);
  pos.y = EDGE_BUFFER + Math.random() * (h - 2 * EDGE_BUFFER);
  dir.x = Math.random() * 2 - 1; dir.y = Math.random() * 2 - 1;
  normalizeDir();
  focusAccum = 0;
  speed = BASE_SPEED;
  enemy.style.opacity = "0";
  hiddenGrowthSinceSeen = 0;
  hintedFlag = false;
  lastGrowth = growth;

  spawnFlash(pos.x, pos.y, "red", 120);
  nextRandomTeleport = performance.now() / 1000 + randomInterval(RANDOM_TELEPORT_INTERVAL_MIN, RANDOM_TELEPORT_INTERVAL_MAX);
}

/* END GAME (WIN / LOSE) */
function endGame(win) {
  if (gameOver) return;
  gameOver = true;

  // remove elementos anteriores se houver
  if (endMsg) endMsg.remove();
  if (restartButton) restartButton.remove();

  endMsg = document.createElement("div");
  Object.assign(endMsg.style, {
    position: "fixed",
    top: "45%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "3vw",
    color: "#fff",
    textShadow: "0 0 1vw #000",
    zIndex: 9999,
    textAlign: "center",
  });

  if (win) {
    endMsg.textContent = "🌕 Você venceu!";
    document.body.appendChild(endMsg);

    /* 🔧 ESPAÇO PARA LÓGICA DE FINALIZAÇÃO 🔧
       - Variáveis de progresso
       - Efeitos sonoros
       - Redirecionamentos
    */

  } else {
    endMsg.textContent = "👹 O inimigo venceu!";
    document.body.appendChild(endMsg);

    // botão de restart tipo jogo mobile
    restartButton = document.createElement("button");
      Object.assign(restartButton.style, {
      position: "fixed",
      top: "60%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "70px",
      height: "70px",
      cursor: "pointer",
      zIndex: 10000,
      transition: "transform 0.2s ease",
    });
    restartButton.onmouseenter = () => (restartButton.style.transform = "translate(-50%, -50%) scale(1.1)");
    restartButton.onmouseleave = () => (restartButton.style.transform = "translate(-50%, -50%) scale(1)");
    restartButton.onclick = resetGame;
    document.body.appendChild(restartButton);
  }
}

/* HINT */
function showHintFade() {
  if (hintedFlag || revealed || gameOver) return;
  hintedFlag = true;
  enemy.style.transition = `opacity ${HINT_DURATION}s ease-in-out`;
  enemy.style.opacity = `${HINT_OPACITY}`;
  setTimeout(() => {
    if (!revealed && !gameOver) enemy.style.opacity = "0";
    setTimeout(() => { enemy.style.transition = ""; }, 300);
  }, HINT_DURATION * 1000);
}

/* UPDATE FRAME */
function update(dt, nowSec) {
  if (gameOver) return;
  if (nowSec >= nextRandomTeleport) teleportEnemy();

  if (Math.random() < 0.03) {
    dir.x += (Math.random() - 0.5) * 0.8;
    dir.y += (Math.random() - 0.5) * 0.8;
  }

  normalizeDir();
  pos.x += dir.x * speed;
  pos.y += dir.y * speed;

  if (pos.x < EDGE_BUFFER || pos.x > window.innerWidth - EDGE_BUFFER ||
      pos.y < EDGE_BUFFER || pos.y > window.innerHeight - EDGE_BUFFER) {
    dir.x = Math.random() * 2 - 1; dir.y = Math.random() * 2 - 1;
    normalizeDir();
    speed = Math.min(speed * 1.4, MAX_SPEED);
    pos.x = Math.min(Math.max(pos.x, EDGE_BUFFER + 10), window.innerWidth - EDGE_BUFFER - 10);
    pos.y = Math.min(Math.max(pos.y, EDGE_BUFFER + 10), window.innerHeight - EDGE_BUFFER - 10);
  }

  const dx = pos.x - luaX, dy = pos.y - luaY;
  const dist = Math.hypot(dx, dy);
  const inside = dist < luaRadius * FOCUS_RATIO;

  const growthDelta = growth - (lastGrowth || growth);
  lastGrowth = growth;

  if (inside) {
    revealed = true;
    hintedFlag = false;
    hiddenGrowthSinceSeen = 0;
    enemy.style.transition = "";
    enemy.style.opacity = "1";

    focusAccum += dt;
    growth -= REGRESS_RATE_WHEN_REVEALED * dt;
    growth = Math.max(growth, 0);
    speed = Math.min(BASE_SPEED * Math.pow(1.8, focusAccum), MAX_SPEED);
    const angle = Math.atan2(dy, dx);
    const evadeAngle = angle + (Math.random() - 0.5) * DRIBBLE_INTENSITY;
    dir.x = Math.cos(evadeAngle); dir.y = Math.sin(evadeAngle);
    dir.x += (dx / (dist || 1)) * ESCAPE_STRENGTH * dt * 3;
    dir.y += (dy / (dist || 1)) * ESCAPE_STRENGTH * dt * 3;
    normalizeDir();

    if (focusAccum >= TELEPORT_AFTER_FOCUS) teleportEnemy();
  } else {
    revealed = false;
    focusAccum = 0;
    growth += GROWTH_RATE_WHEN_HIDDEN * dt;
    growth = Math.min(growth, 100);
    speed = BASE_SPEED;
    if (growthDelta > 0) hiddenGrowthSinceSeen += growthDelta;
    if (hiddenGrowthSinceSeen >= HINT_THRESHOLD && !hintedFlag) showHintFade();
  }

  if (!revealed && !hintedFlag) enemy.style.opacity = "0";

  let scale = 1 + growth / 100;
  if (scale > MAX_SCALE) scale = MAX_SCALE;
  const redness = Math.min(Math.max((growth - 50) / 50, 0), 1);
  emoji.style.filter = `drop-shadow(0 0 ${0.5 + redness}vw rgba(255,40,40,${0.3 + redness * 0.6}))`;
  enemy.style.transform = `translate(-50%, -50%) translate(${pos.x - window.innerWidth/2}px, ${pos.y - window.innerHeight/2}px) scale(${scale})`;
  growthText.textContent = `${Math.round(growth)}%`;
  if (growth >= 100) endGame(false);
}

/* GAME LOOP */
function gameLoop(ts) {
  if (!lastTime) lastTime = ts;
  const dt = (ts - lastTime) / 1000;
  lastTime = ts;
  const nowSec = ts / 1000;
  update(dt, nowSec);
  if (!gameOver) requestAnimationFrame(gameLoop);
}

/* TIMER */
function startTimer() {
  timerText.textContent = `${timer}s`;
  const interval = setInterval(() => {
    if (gameOver) { clearInterval(interval); return; }
    timer -= 1;
    timerText.textContent = `${timer}s`;
    if (timer <= 0) { clearInterval(interval); endGame(true); }
  }, 1000);
}

/* START */
resetGame();
