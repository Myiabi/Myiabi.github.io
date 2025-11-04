// File: game.js
/* PATH: game.js
   Implementação completa: minigame de cortar inimigos, sem canvas.
*/

/* =========== Config =========== */
const CONFIG = {
  arenaPadding: 40,
  boss: {
    img: '/assets/img/One-Piece-Anime-PNG-Download-Image.png',      // troque pela sua imagem
    size: 200,
    hp: 100,              // HP considerável
    speed: 0.008,         // entre 0.004 - 0.02 (pos lerp speed)
    teleportInterval: [2000, 4000], // ms
    castTime: 3000,       // ms para completar cast
    hitsToCancel: 2,      // golpes necessários para cancelar cast
    damageToPlayer: 20,
    hitDamage: 18
  },
  minion: {
    img: '/assets/img/npc-cientist2.png',    // troque pela sua imagem
    size: 80,
    hp: 50,
    speed: 0.004,
    teleportInterval: [2500, 4500],
    castTime: 3500,
    hitsToCancel: 1,
    damageToPlayer: 8,
    hitDamage: 12
  },
  playerHp: 120,
  sliceMinSpeed: 0.25, // px/ms minimal for a "slice"
  trailLifetime: 500,  // ms
  hitCooldown: 350,    // ms per enemy to avoid double hitting many times in same slice
};

/* =========== DOM =========== */
const arena = document.getElementById('arena');
const enemiesWrap = document.getElementById('enemies');
const trailsSvg = document.getElementById('trails');
const playerHpBar = document.getElementById('player-hp-bar');
const bossHpBar = document.getElementById('boss-hp-bar');
const restartBtn = document.getElementById('restart');

/* =========== State =========== */
let state = {
  playerHp: CONFIG.playerHp,
  enemies: [],
  running: true,
  pointerDown: false,
  prevPointer: null,
  hasSpawnedMinions: false
};

/* =========== Utilities =========== */
function rand(min, max){ return Math.random()*(max-min)+min; }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function now(){ return performance.now(); }

/* distance from point to segment */
function distPointToSegment(px,py, x1,y1,x2,y2){
  const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
  const dot = A*C + B*D;
  const len2 = C*C + D*D;
  let t = len2 ? dot / len2 : -1;
  t = clamp(t, 0, 1);
  const projx = x1 + C*t, projy = y1 + D*t;
  const dx = px - projx, dy = py - projy;
  return Math.hypot(dx,dy);
}

/* =========== Enemy class =========== */
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
    this.damageToPlayer = opts.damageToPlayer;
    this.hitDamage = opts.hitDamage;
    this.imgSrc = opts.img;
    this.x = 0; this.y = 0; // top-left
    this.targetX = 0; this.targetY = 0;
    this.castProgress = 0;
    this.casting = false;
    this.hitsDuringCast = 0;
    this.lastHitAt = 0;
    this.element = this.createElement();
    this.spawn();
    this.scheduleTeleport();
    this.castTimer = null;
    this.castStartAt = 0;
    this.updateCast = this.updateCast.bind(this);
  }

  createElement(){
    const el = document.createElement('div');
    el.className = 'enemy' + (this.isMinion? ' minion':'');
    el.style.width = this.size+'px';
    el.style.height = this.size+'px';
    el.innerHTML = `
      <div class="hp-small"><div class="fill" style="width:100%"></div></div>
      <div class="cast-bar"><div class="fill"></div></div>
      <img src="${this.imgSrc}" draggable="false" alt="enemy">
    `;
    enemiesWrap.appendChild(el);
    this.el = el;
    this.hpFill = el.querySelector('.hp-small .fill');
    this.castFill = el.querySelector('.cast-bar .fill');
    return el;
  }

  spawn(){
    const pad = CONFIG.arenaPadding;
    const aw = arena.clientWidth - pad*2 - this.size;
    const ah = arena.clientHeight - pad*2 - this.size;
    this.x = pad + Math.random()*aw;
    this.y = pad + Math.random()*ah;
    this.setPos(this.x, this.y, true);
    // choose initial target
    this.pickTarget();
    // start occasional casting loop
    this.scheduleCast();
  }

  setPos(x,y,noTransform){
    this.x = clamp(x, 0, arena.clientWidth - this.size);
    this.y = clamp(y, 0, arena.clientHeight - this.size);
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
    if(!noTransform){
      // random rotate for liveliness
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
    const delay = rand(minT, maxT);
    clearTimeout(this.teleportTimeout);
    this.teleportTimeout = setTimeout(()=>{
      // teleport: pick random pos and jump instantly
      const pad = CONFIG.arenaPadding;
      const aw = arena.clientWidth - pad*2 - this.size;
      const ah = arena.clientHeight - pad*2 - this.size;
      const tx = pad + Math.random()*aw;
      const ty = pad + Math.random()*ah;
      this.setPos(tx,ty);
      this.pickTarget();
      this.scheduleTeleport();
    }, delay);
  }

  scheduleCast(){
    // start cast after a random delay
    const delay = rand(800, 2200);
    clearTimeout(this.castScheduleTimeout);
    this.castScheduleTimeout = setTimeout(()=>{
      this.startCast();
    }, delay);
  }

  startCast(){
    if(this.hp<=0) return;
    this.casting = true;
    this.castStartAt = now();
    this.castProgress = 0;
    this.hitsDuringCast = 0;
    this.updateCast();
    // if not cancelled, will hit player
  }

  updateCast(){
    if(!this.casting) return;
    const elapsed = now() - this.castStartAt;
    this.castProgress = clamp(elapsed / this.castTime, 0, 1);
    this.castFill.style.width = `${this.castProgress*100}%`;
    if(this.castProgress >= 1){
      this.finishCast();
    } else {
      // continue
      this.castTimer = requestAnimationFrame(this.updateCast);
    }
  }

  finishCast(){
    this.casting = false;
    this.castFill.style.width = `0%`;
    this.scheduleCast();
    // check if canceled by hits
    if(this.hitsDuringCast >= this.hitsToCancel){
      // cancelled
      this.flash('cancel');
    } else {
      // hit player
      damagePlayer(this.damageToPlayer);
      this.flash('cast');
    }
  }

  cancelCastByHit(){
    this.hitsDuringCast++;
    if(this.hitsDuringCast >= this.hitsToCancel){
      // stop cast immediately
      this.casting = false;
      cancelAnimationFrame(this.castTimer);
      this.castFill.style.width = `0%`;
      this.scheduleCast();
      this.flash('cancel');
    }
  }

  moveStep(dt){
    // lerp towards target
    const lerp = this.speed * dt;
    this.x += (this.targetX - this.x) * lerp;
    this.y += (this.targetY - this.y) * lerp;
    this.setPos(this.x, this.y, true);
    // if close to target, pick another
    if(Math.hypot(this.targetX - this.x, this.targetY - this.y) < 10){
      this.pickTarget();
    }
  }

  takeHit(dmg){
    const t = now();
    if(t - this.lastHitAt < CONFIG.hitCooldown) return false;
    this.lastHitAt = t;
    this.hp -= dmg;
    this.hp = Math.max(0, this.hp);
    this.hpFill.style.width = `${(this.hp/this.maxHp)*100}%`;
    this.el.classList.add('hit');
    setTimeout(()=> this.el.classList.remove('hit'), 140);
    // if was casting, register hit
    if(this.casting) this.cancelCastByHit();
    if(this.hp<=0) this.die();
    return true;
  }

  die(){
    clearTimeout(this.teleportTimeout);
    clearTimeout(this.castScheduleTimeout);
    cancelAnimationFrame(this.castTimer);
    // remove element
    this.el.animate([{opacity:1, transform: 'scale(1)'},{opacity:0, transform:'scale(0.6)'}], {duration:300, easing:'ease', fill:'forwards'});
    setTimeout(()=> {
      try{ enemiesWrap.removeChild(this.el); } catch(e){}
    }, 320);
    // remove from state list handled externally
  }

  flash(type){
    // small visual effect can be extended
    // type: 'cast' or 'cancel'
    const orig = this.el.style.filter;
    this.el.style.filter = (type==='cast')? 'drop-shadow(0 0 14px rgba(255,140,0,0.95))' : 'drop-shadow(0 0 14px rgba(100,220,220,0.95))';
    setTimeout(()=> this.el.style.filter = orig, 220);
  }

}

/* =========== Game functions =========== */
function spawnEnemy(isMinion=false){
  const cfg = isMinion ? CONFIG.minion : CONFIG.boss;
  const e = new Enemy({
    isMinion,
    size: cfg.size,
    hp: cfg.hp,
    speed: cfg.speed,
    teleportInterval: cfg.teleportInterval || cfg.teleportInterval,
    castTime: cfg.castTime,
    hitsToCancel: cfg.hitsToCancel,
    damageToPlayer: cfg.damageToPlayer,
    hitDamage: cfg.hitDamage,
    img: cfg.img
  });
  state.enemies.push(e);
  updateBossHpBar();
  return e;
}

function damagePlayer(dmg){
  state.playerHp = Math.max(0, state.playerHp - dmg);
  playerHpBar.style.width = `${(state.playerHp / CONFIG.playerHp)*100}%`;
  // flash arena
  arena.animate([{boxShadow:'0 0 0 0 rgba(255,0,0,0.0)'},{boxShadow:'0 0 48px 8px rgba(255,0,0,0.08)'}], {duration:260, easing:'ease-out'});
  if(state.playerHp<=0){
    gameOver();
  }
}

function updateBossHpBar(){
  // boss HP shown is sum of bosses? show main boss first
  const boss = state.enemies.find(e=>!e.isMinion);
  if(boss){
    bossHpBar.style.width = `${(boss.hp / boss.maxHp)*100}%`;
  } else {
    bossHpBar.style.width = '0%';
  }
}

/* =========== Input / slice detection =========== */
let trailIdCounter = 0;
function startPointer(e){
  state.pointerDown = true;
  const pt = getPointerPos(e);
  state.prevPointer = {x:pt.x, y:pt.y, t: now()};
  // create fresh trail path
  createTrail(pt.x, pt.y);
}
function movePointer(e){
  if(!state.pointerDown) {
    // but still show small faint trail for pointer hovering? skip
    return;
  }
  const pt = getPointerPos(e);
  const cur = {x:pt.x, y:pt.y, t: now()};
  const dt = Math.max(1, cur.t - state.prevPointer.t);
  const dx = cur.x - state.prevPointer.x;
  const dy = cur.y - state.prevPointer.y;
  const speed = Math.hypot(dx,dy)/dt; // px per ms

  // update trail
  extendTrail(cur.x, cur.y);

  if(speed > CONFIG.sliceMinSpeed){
    // this is a slice segment: check intersection with enemies
    checkSliceHit(state.prevPointer.x, state.prevPointer.y, cur.x, cur.y, Math.max(18, Math.min(46, speed*24)));
  }
  state.prevPointer = cur;
}
function endPointer(e){
  state.pointerDown = false;
  state.prevPointer = null;
  // fade/remove trail
  finishTrail();
}

function getPointerPos(e){
  const rect = arena.getBoundingClientRect();
  return {
    x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
    y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top
  };
}

/* trail with SVG paths */
let currentTrail = null;
function createTrail(x,y){
  const id = `trail-${trailIdCounter++}`;
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d', `M ${x} ${y}`);
  path.setAttribute('stroke', 'rgba(255,255,255,0.85)');
  path.setAttribute('id', id);
  trailsSvg.appendChild(path);
  currentTrail = {el:path, points:[{x,y,t:now()}]};
  // fade out after lifetime
  setTimeout(()=> {
    if(currentTrail && currentTrail.el === path) finishTrail();
  }, CONFIG.trailLifetime);
}
function extendTrail(x,y){
  if(!currentTrail) return;
  currentTrail.points.push({x,y,t:now()});
  const d = currentTrail.points.map((p,i)=> (i===0? `M ${p.x} ${p.y}`: `L ${p.x} ${p.y}`)).join(' ');
  currentTrail.el.setAttribute('d', d);
  // dynamic stroke width by speed between last points
  if(currentTrail.points.length>=2){
    const a = currentTrail.points[currentTrail.points.length-2];
    const b = currentTrail.points[currentTrail.points.length-1];
    const speed = Math.hypot(b.x-a.x,b.y-a.y) / Math.max(1, b.t-a.t);
    const sw = clamp(22 - speed*20, 4, 24);
    currentTrail.el.style.strokeWidth = sw;
    currentTrail.el.style.stroke = 'rgba(255,255,255,0.9)';
    currentTrail.el.style.opacity = 0.95;
  }
}
function finishTrail(){
  if(!currentTrail) return;
  const path = currentTrail.el;
  path.animate([{opacity:1},{opacity:0}], {duration:CONFIG.trailLifetime, easing:'ease-out', fill:'forwards'});
  setTimeout(()=> { try{ trailsSvg.removeChild(path); } catch(e){} }, CONFIG.trailLifetime+50);
  currentTrail = null;
}

/* slice hit detection: segment vs enemy circle (center at element center) */
function checkSliceHit(x1,y1,x2,y2, radius){
  // radius is 'effective blade width'
  for(const e of state.enemies.slice()){
    if(e.hp<=0) continue;
    const cx = e.x + e.size/2;
    const cy = e.y + e.size/2;
    const r = e.size/2 * 0.9; // enemy radius
    const d = distPointToSegment(cx,cy, x1,y1,x2,y2);
    if(d <= r + radius*0.4){
      // hit
      const applied = e.takeHit(e.hitDamage);
      if(applied){
        // small extra effect: knockback target a bit
        e.targetX += (cx - x2) * 0.12;
        e.targetY += (cy - y2) * 0.12;
        // update boss HP UI if required
        updateBossHpBar();
        // spawn minions if boss fell below 50% and not spawned yet
        const boss = state.enemies.find(x=>!x.isMinion);
        if(boss && !state.hasSpawnedMinions && boss.hp <= boss.maxHp*0.5){
          state.hasSpawnedMinions = true;
          // boss speeds up
          boss.speed *= 1.6;
          // spawn 2 minions
          setTimeout(()=> {
            spawnEnemy(true);
            spawnEnemy(true);
          }, 300);
        }
      }
    }
  }
  // cleanup dead enemies from state
  state.enemies = state.enemies.filter(en => en.hp > 0);
}

/* =========== Game loop =========== */
let lastFrame = now();
function frame(){
  const t = now();
  const dt = t - lastFrame;
  lastFrame = t;
  // move enemies
  for(const e of state.enemies){
    e.moveStep(dt);
  }
  // update HUD
  updateBossHpBar();
  if(state.running) requestAnimationFrame(frame);
}

/* =========== Game over / restart =========== */
function gameOver(){
  state.running = false;
  // show overlay or message
  const msg = document.createElement('div');
  msg.textContent = 'Você morreu — Reinicie para jogar novamente';
  Object.assign(msg.style, {position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', background:'rgba(0,0,0,0.6)', padding:'18px 24px', borderRadius:'10px', zIndex:9999});
  arena.appendChild(msg);
}

function resetGame(){
  // clear existing enemies
  for(const e of state.enemies){
    try{ enemiesWrap.removeChild(e.el); }catch(e){}
    clearTimeout(e.teleportTimeout);
  }
  state.enemies = [];
  state.playerHp = CONFIG.playerHp;
  playerHpBar.style.width = '100%';
  state.hasSpawnedMinions = false;
  state.running = true;
  lastFrame = now();
  // spawn boss
  const boss = spawnEnemy(false);
  // set boss image defaults if not provided
  // ensure images exist; if not, use data URLs placeholder
  const imgs = [
    boss.el.querySelector('img')
  ];
  // spawn initial minion? no
  requestAnimationFrame(frame);
}

/* =========== Init and events =========== */
function init(){
  // pointer events
  arena.addEventListener('pointerdown', (e)=> {
    arena.setPointerCapture(e.pointerId);
    startPointer(e);
  });
  window.addEventListener('pointermove', (e)=> movePointer(e));
  window.addEventListener('pointerup', (e)=> {
    endPointer(e);
  });
  // prevent context menu on long press
  arena.addEventListener('contextmenu', e=> e.preventDefault());

  // Resize handling
  window.addEventListener('resize', ()=> {
    // reposition enemies inside bounds
    for(const e of state.enemies){
      e.setPos(e.x, e.y, true);
    }
  });

  restartBtn.addEventListener('click', ()=>{
    // remove overlay messages
    const overlays = arena.querySelectorAll('[data-overlay]');
    for(const ov of overlays) ov.remove();
    resetGame();
  });

  resetGame();
}

init();
