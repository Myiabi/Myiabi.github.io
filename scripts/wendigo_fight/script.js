// File: game.js
// Versão atualizada: Dark HUD, colisões de círculo com partículas, cast rules ajustados,
// inimigos somem ao game over, velocidades aumentadas.

// ======== CONFIG ========
const CONFIG = {
  arenaPadding: 36,
  boss: {
    img: '/assets/img/One-Piece-Anime-PNG-Download-Image.png',    // troque
    size: 140,
    hp: 20,
    speed: 0.45,        // px/ms (mais rápido)
    teleportInterval: [1500, 3000],
    castTime: 2800,
    hitsToCancel: 3,    // boss precisa de 3 cortes para cancelar
    damageHearts: 1,    // quantos corações perde por cast bem-sucedido
    hitDamage: 24
  },
  minion: {
    img: '/assets/img/npc-cientist2.png',
    size: 84,
    hp: 200,
    speed: 0.34,
    teleportInterval: [2500, 3800],
    castTime: 2600,
    hitsToCancel: 1,    // minion cancela com 1 golpe
    damageHearts: 1,
    hitDamage: 12
  },
  playerHearts: 6,
  sliceMinSpeed: 0.25,
  trailLifetime: 450,   // rastro maior para detecção de círculo
  hitCooldown: 280,
  circleDamageMultiplier: 2.6
};

// ======== DOM ========
const arena = document.getElementById('arena');
const enemiesWrap = document.getElementById('enemies');
const trailsSvg = document.getElementById('trails');
const particlesWrap = document.getElementById('particles');
const bossBarFill = document.getElementById('boss-bar-fill');
const overlayContainer = document.getElementById('overlay-container');
const heartsWrap = document.getElementById('hearts');
const restartBtn = document.getElementById('restart');

// ======== STATE ========
let state = {
  running: true,
  enemies: [],
  playerHearts: CONFIG.playerHearts,
  pointerDown: false,
  prevPointer: null,
  triggers: { spawnedAt65:false, spawnedAt30:false },
  currentTrail: null,
  lastFrame: performance.now()
};

// ======== Util ========
const now = ()=> performance.now();
const rand = (a,b)=> Math.random()*(b-a)+a;
const clamp = (v,a,b)=> Math.max(a, Math.min(b, v));

function distPointToSegment(px,py, x1,y1,x2,y2){
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A*C + B*D;
  const len2 = C*C + D*D;
  let t = len2 ? dot / len2 : -1;
  t = clamp(t,0,1);
  const projx = x1 + C*t, projy = y1 + D*t;
  const dx = px - projx, dy = py - projy;
  return Math.hypot(dx,dy);
}

// ======== Enemy class ========
class Enemy {
  constructor(opts){
    this.id = Math.random().toString(36).slice(2,9);
    this.isMinion = !!opts.isMinion;
    this.size = opts.size;
    this.hp = opts.hp;
    this.maxHp = opts.hp;
    this.speed = opts.speed;
    this.teleportRange = opts.teleportInterval;
    this.castTime = opts.castTime;
    this.hitsToCancel = opts.hitsToCancel;
    this.damageHearts = opts.damageHearts || 1;
    this.hitDamage = opts.hitDamage;
    this.imgSrc = opts.img;
    this.x = 0; this.y = 0;
    this.targetX = 0; this.targetY = 0;
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

  createElement(){
    const el = document.createElement('div');
    el.className = 'enemy' + (this.isMinion ? ' minion' : '');
    el.style.width = this.size + 'px';
    el.style.height = this.size + 'px';
    el.innerHTML = `
      <div class="hp-small"><div class="fill" style="width:100%"></div></div>
      <div class="cast-bar"><div class="fill"></div></div>
      <img src="${this.imgSrc}" draggable="false" alt="enemy">
    `;
    enemiesWrap.appendChild(el);
    this.el = el;
    this.hpFill = el.querySelector('.hp-small .fill');
    this.castFill = el.querySelector('.cast-bar .fill');
    // by design: cast / hp small are hidden until needed (user requested)
  }

  spawn(){
    const pad = CONFIG.arenaPadding;
    const aw = arena.clientWidth - pad*2 - this.size;
    const ah = arena.clientHeight - pad*2 - this.size;
    this.x = pad + Math.random()*aw;
    this.y = pad + Math.random()*ah;
    this.setPos(this.x,this.y,true);
    this.pickTarget();
  }

  setPos(x,y,noTransform){
    this.x = clamp(x, 0, arena.clientWidth - this.size);
    this.y = clamp(y, 0, arena.clientHeight - this.size);
    this.el.style.left = this.x + 'px';
    this.el.style.top  = this.y + 'px';
    if(!noTransform){
      const rot = (Math.random()-0.5)*16;
      this.el.style.transform = `rotate(${rot}deg)`;
    }
  }

  pickTarget(){
    const pad = CONFIG.arenaPadding;
    const aw = arena.clientWidth - pad*2 - this.size;
    const ah = arena.clientHeight - pad*2 - this.size;
    this.targetX = pad + Math.random()*aw;
    this.targetY = pad + Math.random()*ah;
  }

  scheduleTeleport(){
    const [minT,maxT] = this.teleportRange;
    clearTimeout(this.teleportTimeout);
    this.teleportTimeout = setTimeout(()=>{
      if(!this.active || !state.running || this.hidden){ this.scheduleTeleport(); return; }
      const pad = CONFIG.arenaPadding;
      const aw = arena.clientWidth - pad*2 - this.size;
      const ah = arena.clientHeight - pad*2 - this.size;
      const tx = pad + Math.random()*aw;
      const ty = pad + Math.random()*ah;
      this.setPos(tx,ty);
      this.pickTarget();
      this.scheduleTeleport();
    }, rand(minT,maxT));
  }

  scheduleCast(){
    clearTimeout(this.castScheduleTimeout);
    this.castScheduleTimeout = setTimeout(()=>{
      if(!this.active || !state.running || this.hidden) { this.scheduleCast(); return; }
      this.startCast();
    }, rand(700,2200));
  }

  startCast(){
    if(!this.active || this.hidden) return;
    this.casting = true;
    this.hitsDuringCast = 0;
    this.castStartAt = now();
    // reveal cast bar while casting
    this.el.querySelector('.cast-bar').style.display = 'block';
    this.updateCast();
  }

  updateCast(){
    if(!this.casting) return;
    const elapsed = now() - this.castStartAt;
    const prog = clamp(elapsed / this.castTime, 0, 1);
    this.castFill.style.width = (prog*100) + '%';
    if(prog >= 1){
      this.finishCast();
    } else {
      this.castTimer = requestAnimationFrame(this.updateCastBound);
    }
  }

  finishCast(){
    // hide cast bar
    this.casting = false;
    this.castFill.style.width = '0%';
    this.el.querySelector('.cast-bar').style.display = 'none';
    this.scheduleCast();
    if(this.hitsDuringCast >= this.hitsToCancel){
      // cancelled
      this.flash('cancel');
    } else {
      // hit player hearts
      damagePlayerHearts(this.damageHearts);
      this.flash('cast');
    }
  }

  cancelCastByHitImmediate(){
    // for minions or boss circle
    if(!this.casting) return;
    this.casting = false;
    cancelAnimationFrame(this.castTimer);
    this.castFill.style.width = '0%';
    this.el.querySelector('.cast-bar').style.display = 'none';
    this.flash('cancel');
    this.scheduleCast();
  }

  moveStep(dt){
    if(!this.active || this.hidden) return;
    const dx = this.targetX - this.x, dy = this.targetY - this.y;
    const dist = Math.hypot(dx,dy);
    const step = this.speed * dt;
    if(dist <= step){
      this.setPos(this.targetX, this.targetY, true);
      this.pickTarget();
    } else {
      const nx = dx / dist, ny = dy / dist;
      this.setPos(this.x + nx*step, this.y + ny*step, true);
    }
  }

  takeHit(dmg, opts = {circle:false}){
    const t = now();
    if(t - this.lastHitAt < CONFIG.hitCooldown) return false;
    this.lastHitAt = t;
    this.hp = Math.max(0, this.hp - dmg);
    this.hpFill.style.width = ((this.hp/this.maxHp)*100) + '%';
    this.el.classList.add('hit');
    setTimeout(()=> this.el.classList.remove('hit'), 140);

    // cast cancel logic:
    if(this.casting){
      if(this.isMinion){
        // minion loses concentration with 1 hit
        this.cancelCastByHitImmediate();
      } else {
        // boss: circle cancels immediately, cuts increment counters
        if(opts.circle){
          this.cancelCastByHitImmediate();
        } else {
          this.hitsDuringCast++;
          if(this.hitsDuringCast >= CONFIG.boss.hitsToCancel){
            this.cancelCastByHitImmediate();
          }
        }
      }
    }

    if(this.hp <= 0) this.die();
    return true;
  }

  die(){
    this.active = false;
    clearTimeout(this.teleportTimeout);
    clearTimeout(this.castScheduleTimeout);
    cancelAnimationFrame(this.castTimer);
    // remove visually
    this.el.animate([{opacity:1, transform:'scale(1)'},{opacity:0, transform:'scale(0.6)'}], {duration:300, easing:'ease', fill:'forwards'});
    setTimeout(()=> {
      try{ enemiesWrap.removeChild(this.el); } catch(e){}
    }, 320);
  }

  hide(){
    this.hidden = true;
    this.casting = false;
    clearTimeout(this.castScheduleTimeout);
    cancelAnimationFrame(this.castTimer);
    this.el.style.visibility = 'hidden';
  }

  reveal(){
    this.hidden = false;
    this.el.style.visibility = 'visible';
    this.pickTarget();
    this.scheduleTeleport();
    this.scheduleCast();
  }

  flash(type){
    this.el.style.filter = (type==='cast')? 'drop-shadow(0 0 16px rgba(255,140,0,0.95))' : 'drop-shadow(0 0 16px rgba(90,220,220,0.95))';
    setTimeout(()=> this.el.style.filter = '', 240);
  }
}

// ======== Game functions ========
function spawnEnemy(isMinion=false){
  if(!state.running) return null;
  const cfg = isMinion ? CONFIG.minion : CONFIG.boss;
  const e = new Enemy({
    isMinion,
    size: cfg.size,
    hp: cfg.hp,
    speed: cfg.speed,
    teleportInterval: cfg.teleportInterval,
    castTime: cfg.castTime,
    hitsToCancel: cfg.hitsToCancel,
    damageHearts: cfg.damageHearts,
    hitDamage: cfg.hitDamage,
    img: cfg.img
  });
  state.enemies.push(e);
  updateBossBar();
  return e;
}

function removeAllEnemiesImmediate(){
  state.enemies.forEach(e=>{
    e.active = false;
    clearTimeout(e.teleportTimeout);
    clearTimeout(e.castScheduleTimeout);
    cancelAnimationFrame(e.castTimer);
    try{ enemiesWrap.removeChild(e.el); } catch(_){}
  });
  state.enemies = [];
}

function damagePlayerHearts(n){
  if(state.playerHearts <= 0) return;
  for(let i=0;i<n;i++){
    if(state.playerHearts <= 0) break;
    const idx = state.playerHearts - 1;
    const heart = heartsWrap.children[idx];
    if(heart) heart.classList.add('lost');
    state.playerHearts--;
  }
  // heart shake effect
  heartsWrap.style.animation = 'heart-shake 420ms ease';
  setTimeout(()=> heartsWrap.style.animation = '', 440);
  if(state.playerHearts <= 0) {
    gameOver();
  }
}

function updateBossBar(){
  const boss = state.enemies.find(e => !e.isMinion && e.active);
  if(boss){
    const w = ((boss.hp / boss.maxHp) * 100);
    bossBarFill.style.width = w + '%';
  } else {
    bossBarFill.style.width = '0%';
  }
}

// ======== Input / trails / slices ========
function startPointer(e){
  state.pointerDown = true;
  const pt = getPointerPos(e);
  state.prevPointer = {x:pt.x, y:pt.y, t: now()};
  createTrail(pt.x, pt.y);
}
function movePointer(e){
  if(!state.pointerDown) return;
  const pt = getPointerPos(e);
  const cur = {x:pt.x, y:pt.y, t: now()};
  const dt = Math.max(1, cur.t - state.prevPointer.t);
  const dx = cur.x - state.prevPointer.x, dy = cur.y - state.prevPointer.y;
  const speed = Math.hypot(dx,dy) / dt;
  extendTrail(cur.x, cur.y);
  if(speed > CONFIG.sliceMinSpeed){
    checkSliceHit(state.prevPointer.x, state.prevPointer.y, cur.x, cur.y, Math.max(18, Math.min(46, speed*26)));
  }
  state.prevPointer = cur;
}
function endPointer(e){
  state.pointerDown = false;
  state.prevPointer = null;
  finishTrailAndEvaluateCircle();
}

function getPointerPos(e){
  const rect = arena.getBoundingClientRect();
  const cx = (e.clientX !== undefined) ? e.clientX : (e.touches && e.touches[0].clientX);
  const cy = (e.clientY !== undefined) ? e.clientY : (e.touches && e.touches[0].clientY);
  return { x: cx - rect.left, y: cy - rect.top };
}

// Trails (SVG)
let trailId = 0;
function createTrail(x,y){
  const id = `trail-${trailId++}`;
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d', `M ${x} ${y}`);
  path.setAttribute('stroke', 'rgba(255,255,255,0.9)');
  path.setAttribute('id', id);
  trailsSvg.appendChild(path);
  state.currentTrail = {el:path, points:[{x,y,t:now()}]};
  // auto finish later if user holds
  setTimeout(()=> {
    if(state.currentTrail && state.currentTrail.el === path) finishTrailAndEvaluateCircle();
  }, CONFIG.trailLifetime);
}
function extendTrail(x,y){
  if(!state.currentTrail) return;
  const pts = state.currentTrail.points;
  pts.push({x,y,t:now()});
  const d = pts.map((p,i)=> i===0? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`).join(' ');
  state.currentTrail.el.setAttribute('d', d);
  if(pts.length >= 2){
    const a = pts[pts.length-2], b = pts[pts.length-1];
    const speed = Math.hypot(b.x-a.x,b.y-a.y) / Math.max(1, b.t-a.t);
    const sw = clamp(22 - speed*20, 4, 24);
    state.currentTrail.el.style.strokeWidth = sw;
    state.currentTrail.el.style.stroke = 'rgba(255,255,255,0.92)';
  }
}
function finishTrail(){
  if(!state.currentTrail) return;
  const path = state.currentTrail.el;
  path.animate([{opacity:1},{opacity:0}], {duration:CONFIG.trailLifetime, easing:'ease-out', fill:'forwards'});
  setTimeout(()=> { try{ trailsSvg.removeChild(path); } catch(e){} }, CONFIG.trailLifetime+60);
  state.currentTrail = null;
}

// Slice collision (segment vs enemy)
function checkSliceHit(x1,y1,x2,y2, radius){
  for(const e of state.enemies.slice()){
    if(!e.active || e.hidden || e.hp<=0) continue;
    const cx = e.x + e.size/2, cy = e.y + e.size/2;
    const r = e.size/2 * 0.9;
    const d = distPointToSegment(cx,cy, x1,y1,x2,y2);
    if(d <= r + radius*0.4){
      // normal cut
      const applied = e.takeHit(e.hitDamage, {circle:false});
      if(applied){
        // slight knockback
        e.targetX += (cx - x2) * 0.12;
        e.targetY += (cy - y2) * 0.12;
        updateBossBar();
        runTriggersAfterDamage();
      }
    }
  }
  // cleanup dead
  state.enemies = state.enemies.filter(en => en.hp > 0 && en.active);
}

// Evaluate circle (coverage) on trail finish
function finishTrailAndEvaluateCircle(){
  if(!state.currentTrail) { finishTrail(); return; }
  const pts = state.currentTrail.points.slice();
  for(const e of state.enemies.slice()){
    if(!e.active || e.hidden || e.hp<=0) continue;
    const cx = e.x + e.size/2, cy = e.y + e.size/2;
    const angles = [];
    for(const p of pts){
      const dx = p.x - cx, dy = p.y - cy;
      const dist = Math.hypot(dx,dy);
      // ignore points too close to center (stroke crossing center)
      if(dist < Math.max(e.size*0.45, 20)) continue;
      angles.push(Math.atan2(dy,dx));
    }
    if(angles.length < 6) continue;
    angles.sort((a,b)=>a-b);
    // max gap
    let maxGap = 0;
    for(let i=0;i<angles.length-1;i++) maxGap = Math.max(maxGap, angles[i+1]-angles[i]);
    const wrapGap = (angles[0] + Math.PI*2) - angles[angles.length-1];
    maxGap = Math.max(maxGap, wrapGap);
    const coverage = Math.PI*2 - maxGap;
    if(coverage >= Math.PI){ // >= 180deg -> consider circle
      const dmg = Math.round(e.hitDamage * CONFIG.circleDamageMultiplier);
      const applied = e.takeHit(dmg, {circle:true});
      if(applied){
        // particles + feedback
        spawnParticlesAt(cx, cy, Math.min(18, Math.round(12 + dmg/4)));
        // boss special: if boss was hidden (during 65% phase), circle still affects (optional)
        updateBossBar();
        runTriggersAfterDamage();
      }
    }
  }
  finishTrail();
  state.currentTrail = null;
  // cleanup dead
  state.enemies = state.enemies.filter(en => en.hp > 0 && en.active);
}

// ======== Particles for circle hits ========
function spawnParticlesAt(x,y,count){
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.round(rand(6,12));
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = (x - size/2) + 'px';
    p.style.top  = (y - size/2) + 'px';
    particlesWrap.appendChild(p);
    const angle = rand(0, Math.PI*2);
    const dist = rand(18, 72);
    const tx = Math.cos(angle)*dist, ty = Math.sin(angle)*dist;
    p.animate([{transform:'translate(0,0) scale(1)', opacity:1},{transform:`translate(${tx}px,${ty}px) scale(0.6)`, opacity:0}], {duration: 700 + Math.random()*400, easing:'cubic-bezier(.2,.8,.2,1)', fill:'forwards'});
    setTimeout(()=> { try{ particlesWrap.removeChild(p); } catch(_){} }, 1200);
  }
}

// ======== Triggers & phases ========
function runTriggersAfterDamage(){
  const boss = state.enemies.find(e => !e.isMinion && e.active);
  if(!boss) return;
  // 65%: hide boss and spawn 4 minions (once)
  if(!state.triggers.spawnedAt65 && boss.hp <= boss.maxHp * 0.65){
    state.triggers.spawnedAt65 = true;
    for(let i=0;i<4;i++) spawnEnemy(true);
    boss.hide();
    monitorMinionsForReveal(boss);
  }
  // 30%: spawn 4 minions but boss stays
  if(!state.triggers.spawnedAt30 && boss.hp <= boss.maxHp * 0.30){
    state.triggers.spawnedAt30 = true;
    for(let i=0;i<4;i++) spawnEnemy(true);
  }
}

function monitorMinionsForReveal(boss){
  const check = ()=>{
    if(!state.running) return;
    const alive = state.enemies.filter(e => e.isMinion && e.active);
    if(alive.length === 0){
      boss.reveal();
    } else {
      setTimeout(check, 420);
    }
  };
  setTimeout(check, 420);
}

// ======== Game loop ========
function frame(){
  if(!state.running) return;
  const t = now();
  const dt = t - state.lastFrame;
  state.lastFrame = t;
  for(const e of state.enemies) e.moveStep(dt);
  updateBossBar();
  requestAnimationFrame(frame);
}

// ======== Game Over & reset ========
function gameOver(){
  state.running = false;
  // fade out enemies and clear
  state.enemies.forEach(e=>{
    e.active = false;
    clearTimeout(e.teleportTimeout);
    clearTimeout(e.castScheduleTimeout);
    cancelAnimationFrame(e.castTimer);
    if(e.el) e.el.animate([{opacity:1},{opacity:0}], {duration:400, fill:'forwards'});
  });
  // clear state.enemies after small timeout
  setTimeout(()=> {
    try{ enemiesWrap.innerHTML = ''; } catch(_) {}
    state.enemies = [];
  }, 420);

  // overlay message
  overlayContainer.innerHTML = '';
  const msg = document.createElement('div');
  restartBtn.style.display = 'block';
  msg.className = 'overlay-msg';
  msg.textContent = 'Você morreu — Reinicie para jogar novamente';
  overlayContainer.appendChild(msg);

}

function clearOverlay(){
  overlayContainer.innerHTML = '';
}

function resetGame(){
  // clear overlay and particles
  clearOverlay();
  particlesWrap.innerHTML = '';
  // clear trails
  try{ trailsSvg.innerHTML = ''; } catch(_){}
  // cleanup enemies
  state.enemies.forEach(e=>{
    clearTimeout(e.teleportTimeout);
    clearTimeout(e.castScheduleTimeout);
    cancelAnimationFrame(e.castTimer);
    try{ enemiesWrap.removeChild(e.el); } catch(_) {}
  });
  state.enemies = [];
  // reset state
  state.running = true;
  state.playerHearts = CONFIG.playerHearts;
  state.triggers = { spawnedAt65:false, spawnedAt30:false };
  state.currentTrail = null;
  state.lastFrame = now();
  // rebuild hearts UI
  buildHeartsUI();
  // spawn boss
  spawnEnemy(false);
  requestAnimationFrame(frame);
}

// ======== Hearts UI ========
function buildHeartsUI(){
  heartsWrap.innerHTML = '';
  for(let i=0;i<CONFIG.playerHearts;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    h.innerHTML = '❤';
    heartsWrap.appendChild(h);
  }
}

// ======== Init & events ========
function init(){
  // pointer
  arena.addEventListener('pointerdown', (e)=> { arena.setPointerCapture(e.pointerId); startPointer(e); });
  window.addEventListener('pointermove', (e)=> movePointer(e));
  window.addEventListener('pointerup', (e)=> endPointer(e));
  arena.addEventListener('contextmenu', e=> e.preventDefault());
  window.addEventListener('resize', ()=> {
    state.enemies.forEach(e=> e.setPos(e.x,e.y,true));
  });
  restartBtn.addEventListener('click', ()=> resetGame());
  buildHeartsUI();
  resetGame();
}


// ======== Boss Defeat / Victory Logic ========

// Função chamada automaticamente quando o boss morre
function onBossDefeated() {
console.log("✅ Boss derrotado — adicione aqui sua lógica pós-vitória.");
unlockAchievement('itemMoeda');
  // Exemplo: tocar som, mostrar botão, mudar tela, etc.
  // Ex: window.location.href = '/next-level.html';
}

// Hooka a morte do boss
const originalDie = Enemy.prototype.die;
Enemy.prototype.die = function() {
  const wasBoss = !this.isMinion;
  originalDie.apply(this, arguments);
  if (wasBoss) {
    handleBossDefeat();
  }
};

function handleBossDefeat() {
  state.running = false;

  // Mata todos os minions instantaneamente
  state.enemies.forEach(e => {
    if (e.isMinion) {
      e.active = false;
      e.canDamage = false;
      e.casting = false;
      e.hp = 0;

      // Remove do DOM imediatamente
      if (e.el && e.el.parentNode) {
        e.el.style.transition = "opacity 0.3s ease";
        e.el.style.opacity = "0";
        setTimeout(() => {
          try { enemiesWrap.removeChild(e.el); } catch (_) {}
        }, 300);
      }
    }
  });

  // Remove da lista global
  state.enemies = state.enemies.filter(e => !e.isMinion);

  // Mostra mensagem de vitória
  overlayContainer.innerHTML = '';
  const msg = document.createElement('div');
  msg.className = 'overlay-msg';
  msg.textContent = 'Você venceu!';
  overlayContainer.appendChild(msg);

  // Chama hook customizável
  onBossDefeated();
}




init();
