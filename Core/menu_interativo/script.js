// loader.js - Sistema Lua + Sol

// ---------------------------
// Cria menu
// ---------------------------
const menu = document.createElement("div");
menu.id = "menu-secundario";
document.body.appendChild(menu);

const itens = [
  { nome: "🌕", id: "item-lupa", func: "revelar" },
  { nome: "🔥", id: "item-fogo", func: "sol" },
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
// Lupa
// ---------------------------
const loupe = document.createElement("div");
loupe.className = "loupe";
document.body.appendChild(loupe);

// ---------------------------
// DOM
// ---------------------------
const containers = Array.from(document.querySelectorAll(".mapa"));
const topLayers = containers.map(c => c.querySelector(".layer.top"));

let isDragging = false;
let pendingDrag = false;
let pendingItem = null;
let currentItem = null;
let dragClone = null;

const RADIUS = 8;
const START_THRESHOLD_VW = 0.5;
const RADIUS_DETECT_VW = 8;

let startX = 0, startY = 0;

// utils
function vwToPx(vw){ return window.innerWidth*(vw/100); }
function getXY(e){
  if(e.touches?.length)
    return {x:e.touches[0].clientX, y:e.touches[0].clientY};
  return {x:e.clientX, y:e.clientY};
}

function setClip(x,y,topLayer,r=RADIUS){
  if(!topLayer) return;
  const rect = topLayer.getBoundingClientRect();
  const xp = ((x - rect.left) / rect.width) * 100;
  const yp = ((y - rect.top) / rect.height) * 100;
  const clip = `circle(${r}vw at ${xp}% ${yp}%)`;

  topLayer.style.clipPath = clip;
  topLayer.style.webkitClipPath = clip;
}

function showLoupe(){ loupe.style.display = "block"; }
function hideLoupe(){
  loupe.style.display = "none";
  topLayers.forEach(t=>{
    if(t){
      t.style.clipPath = "circle(0% at 0 0)";
      t.style.webkitClipPath = "circle(0% at 0 0)";
    }
  });
}

// ---------------------------
// L U A   (revelar itens)
// ---------------------------
const targets = [];
const revealTimers = new WeakMap();

function addTarget(el){
  if(!el) return;
  targets.push({el});
}

function checkReveal(x,y){
  const detectPx = vwToPx(RADIUS_DETECT_VW);

  targets.forEach(target => {
    const rect = target.el.getBoundingClientRect();

    const inside =
      x >= rect.left - detectPx &&
      x <= rect.right + detectPx &&
      y >= rect.top - detectPx &&
      y <= rect.bottom + detectPx;

    if(inside){

      if(!revealTimers.has(target.el)){
        const timer = setTimeout(()=>{
          const mapa = target.el.closest(".mapa");
          if(mapa){
            const layerTop = mapa.querySelector(".layer.top");
            if(layerTop) layerTop.style.display = "none";
            tocarEfeito('whoosh');
          }

        },2000);

        revealTimers.set(target.el,timer);
      }

    } else {

      if(revealTimers.has(target.el)){
        clearTimeout(revealTimers.get(target.el));
        revealTimers.delete(target.el);
      }

    }
  });
}

// ---------------------------
// SOL (independente)
// ---------------------------
const sunTargets = [];
const sunTimers = new WeakMap();
const sunOptions = new WeakMap();

function addSunTarget(el,options={}){
  if(!el) return;
  sunTargets.push({el});
  sunOptions.set(el,Object.assign({action:"hide",delayMs:350},options));
}

function checkSun(x,y){
  sunTargets.forEach(target=>{
    const el = target.el;
    const rect = el.getBoundingClientRect();
    const opt = sunOptions.get(el);

    const inside = x>=rect.left && x<=rect.right && y>=rect.top && y<=rect.bottom;

    if(inside){
      if(!sunTimers.has(el)){
        const timer = setTimeout(()=>{

          if(opt.sound) console.log("Som:",opt.sound);

          if(opt.action==="hide") el.style.display="none";
          else if(opt.action==="swap") el.innerHTML = opt.newImage;

        },opt.delayMs);

        sunTimers.set(el,timer);
      }
    } else {
      if(sunTimers.has(el)){
        clearTimeout(sunTimers.get(el));
        sunTimers.delete(el);
      }
    }

  });
}

// ---------------------------
// DRAG
// ---------------------------
function returnToMenu(clone,menuItem){
  if(!menuItem){ clone.remove(); return; }

  const r = menuItem.getBoundingClientRect();
  const cx = r.left+r.width/2;
  const cy = r.top+r.height/2;

  clone.style.transition="all .8s cubic-bezier(.25,1,.5,1)";
  clone.style.left=(cx/window.innerWidth)*100+"vw";
  clone.style.top=(cy/window.innerHeight)*100+"vh";

  clone.addEventListener("transitionend",()=>{
    clone.remove();
    menuItem.style.visibility="visible";
  },{once:true});
}

function startRealDrag(item,x,y){
  isDragging=true;
  currentItem=item;

  const el=document.getElementById(item.id);
  if(el) el.style.visibility="hidden";

  dragClone=document.createElement("div");
  dragClone.className="menu-item";
  dragClone.textContent=item.nome;
  dragClone.style.position="fixed";
  dragClone.style.opacity="0.7";
  dragClone.style.pointerEvents="none";
  dragClone.style.zIndex="1500";
  dragClone.style.fontSize="2vw";
  dragClone.style.transform="translate(-50%,-50%)";
  dragClone.style.left=(x/window.innerWidth)*100+"vw";
  dragClone.style.top=(y/window.innerHeight)*100+"vh";

  document.body.appendChild(dragClone);
}

function onPointerDown(e){
  if(!e.target.classList.contains("menu-item")) return;

  e.preventDefault();
  if(isDragging) return;

  pendingDrag=true;
  pendingItem=itens.find(i=>i.id===e.target.id);

  const c=getXY(e);
  startX=c.x; startY=c.y;
}

function onPointerMove(e){
  if(!pendingDrag && !isDragging) return;

  const {x,y}=getXY(e);

  if(pendingDrag && !isDragging){
    const dx=Math.abs(x-startX);
    const dy=Math.abs(y-startY);
    const thresh=vwToPx(START_THRESHOLD_VW);

    if(dx+dy>=thresh){
      startRealDrag(pendingItem,x,y);
      pendingDrag=false;
      pendingItem=null;
    } else return;
  }

  if(isDragging && dragClone){
    dragClone.style.left=(x/window.innerWidth)*100+"vw";
    dragClone.style.top=(y/window.innerHeight)*100+"vh";

    // LUA
    if(currentItem && currentItem.func==="revelar"){
      loupe.style.left=(x/window.innerWidth)*100+"vw";
      loupe.style.top=(y/window.innerHeight)*100+"vh";
      showLoupe();

      // ❗ AGORA AQUI A LUPA ATUA APENAS NO MAPA ATIVO
      let mapaAtivo = null;

      for (let i = 0; i < containers.length; i++) {
        const rect = containers[i].getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          mapaAtivo = i;
          break;
        }
      }

      if (mapaAtivo !== null) {
        setClip(x, y, topLayers[mapaAtivo]);
      }

      checkReveal(x,y);
    }

    // SOL
    if(currentItem && currentItem.func==="sol"){
      checkSun(x,y);
    }
  }
}

function onPointerUp(e){
  if(!pendingDrag && !isDragging) return;

  const {x,y}=getXY(e);
  const menuItem=currentItem ? document.getElementById(currentItem.id) : null;

  if(pendingDrag){
    pendingDrag=false;
    pendingItem=null;
    return;
  }

  if(isDragging){
    isDragging=false;
    hideLoupe();

    let outside=true;
    containers.forEach(cont=>{
      const r=cont.getBoundingClientRect();
      if(x>=r.left && x<=r.right && y>=r.top && y<=r.bottom)
        outside=false;
    });

    targets.forEach(t=>{
      if(revealTimers.has(t.el)){
        clearTimeout(revealTimers.get(t.el));
        revealTimers.delete(t.el);
      }
    });

    sunTargets.forEach(t=>{
      if(sunTimers.has(t.el)){
        clearTimeout(sunTimers.get(t.el));
        sunTimers.delete(t.el);
      }
    });

    if(dragClone){
      if(outside) returnToMenu(dragClone,menuItem);
      else {
        dragClone.remove();
        if(menuItem) menuItem.style.visibility="visible";
      }
      dragClone=null;
    }

    currentItem=null;
  }
}

document.addEventListener("pointerdown",onPointerDown,{passive:false});
document.addEventListener("pointermove",onPointerMove,{passive:false});
document.addEventListener("pointerup",onPointerUp,{passive:false});

// ---------------------------
// Registra alvos LUA
// ---------------------------
addTarget(document.querySelector(".capetinha"));
addTarget(document.querySelector(".rage"));

// ---------------------------
// Sol
// ---------------------------
addSunTarget(document.querySelector(".gelo-alvo"),{
  action:"swap",
  newImage:"",
  sound:"/assets/sounds/efeitos/whooshfogo.mp3",
  delayMs:350
});

addSunTarget(document.querySelector(".bola-alvo"),{
  action:"swap",
  newImage:"",
  sound:"/assets/sounds/efeitos/whooshfogo.mp3",
  delayMs:350
});
