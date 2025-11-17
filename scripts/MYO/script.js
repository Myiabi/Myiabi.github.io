/* =====================
   CONFIGURAÇÃO
===================== */

const TRAITS = {
  base: ["/assets/img/chibi.png"],
  eyes: ["https://i.imgur.com/YOUR_EYES_1.png","https://i.imgur.com/YOUR_EYES_2.png"],
  hair: ["https://i.imgur.com/YOUR_HAIR_1.png","https://i.imgur.com/YOUR_HAIR_2.png"],
  clothes: ["https://i.imgur.com/YOUR_CLOTHES_1.png","https://i.imgur.com/YOUR_CLOTHES_2.png"],
  horn: ["https://i.imgur.com/YOUR_HORN_1.png","https://i.imgur.com/YOUR_HORN_2.png"]
};

const CURRENT = {};
Object.keys(TRAITS).forEach(t => CURRENT[t] = 0);

let PLAYER_NPC = null;

const ROOT = document.getElementById("creatorRoot");


/* =============================
      CRIAR INTERFACE
============================= */

function createInterface(){

  ROOT.innerHTML = "";

  const box = document.createElement("div");
  box.className = "creatorBox";

  const close = document.createElement("button");
  close.textContent = "X";
  close.className = "closeBtn";
  close.onclick = () => ROOT.style.display = "none";
  box.appendChild(close);


  /* MENU */
  const menu = document.createElement("div");
  menu.className = "menu";

  const order = ["eyes","hair","clothes","horn"];

  order.forEach(trait => {
    const item = document.createElement("div");
    item.className = "traitItem";

    const prev = document.createElement("button");
    prev.textContent = "<";
    prev.onclick = () => changeTrait(trait, -1);

    const label = document.createElement("span");
    label.textContent = trait[0].toUpperCase() + trait.slice(1);

    const next = document.createElement("button");
    next.textContent = ">";
    next.onclick = () => changeTrait(trait, 1);

    const container = document.createElement("div");
    container.className = "traitControls";
    container.appendChild(prev);
    container.appendChild(label);
    container.appendChild(next);

    item.appendChild(container);
    menu.appendChild(item);
  });


  /* =============================
       BOTÃO QTE (SVG)
============================== */

  const qteWrapper = document.createElement("div");
  qteWrapper.style.width = "100%";
  qteWrapper.style.display = "flex";
  qteWrapper.style.justifyContent = "center";
  qteWrapper.style.marginTop = "20px";

  const SIZE = 90;
  const STROKE = 6;
  const RADIUS = (SIZE/2) - (STROKE/2);
  const CIRC = 2 * Math.PI * RADIUS;
  const HOLD_TIME = 3000; // 3s

  const qteBtn = document.createElement("div");
  qteBtn.style.width = SIZE + "px";
  qteBtn.style.height = SIZE + "px";
  qteBtn.style.position = "relative";
  qteBtn.style.borderRadius = "50%";
  qteBtn.style.cursor = "pointer";
  qteBtn.style.background = "transparent";   // <<< IMPORTANTE!
  qteBtn.style.display = "flex";
  qteBtn.style.alignItems = "center";
  qteBtn.style.justifyContent = "center";

  // MIOLINHO interno para manter o fundo verde
  const center = document.createElement("div");
  center.style.width = "70%";
  center.style.height = "70%";
  center.style.borderRadius = "50%";
  center.style.background = "#50fa7b";
  center.style.display = "flex";
  center.style.justifyContent = "center";
  center.style.alignItems = "center";
  center.style.fontWeight = "700";
  center.style.color = "#000";
  center.textContent = "Hold";

  // SVG do efeito circular
  const svgns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgns,"svg");
  svg.setAttribute("width", SIZE);
  svg.setAttribute("height", SIZE);
  svg.style.position = "absolute";
  svg.style.left = "0";
  svg.style.top = "0";
  svg.style.transform = "rotate(-90deg)";

  const bg = document.createElementNS(svgns,"circle");
  bg.setAttribute("cx", SIZE/2);
  bg.setAttribute("cy", SIZE/2);
  bg.setAttribute("r", RADIUS);
  bg.setAttribute("stroke", "rgba(255,255,255,0.25)");
  bg.setAttribute("stroke-width", STROKE);
  bg.setAttribute("fill", "transparent");

  const prog = document.createElementNS(svgns,"circle");
  prog.setAttribute("cx", SIZE/2);
  prog.setAttribute("cy", SIZE/2);
  prog.setAttribute("r", RADIUS);
  prog.setAttribute("stroke", "#00ff95");
  prog.setAttribute("stroke-width", STROKE);
  prog.setAttribute("fill", "transparent");
  prog.setAttribute("stroke-linecap", "round");
  prog.setAttribute("stroke-dasharray", CIRC);
  prog.setAttribute("stroke-dashoffset", CIRC);

  svg.appendChild(bg);
  svg.appendChild(prog);
  qteBtn.appendChild(svg);
  qteBtn.appendChild(center);
  qteWrapper.appendChild(qteBtn);
  menu.appendChild(qteWrapper);


  /* HOLD SYSTEM */
  let raf = null;
  let startTime = 0;
  let holding = false;

  function updateProgress(p){
    const offset = CIRC * (1 - p);
    prog.setAttribute("stroke-dashoffset", offset);
  }

  function startHold(){
    if(holding) return;
    holding = true;
    center.textContent = "";
    updateProgress(0);
    startTime = performance.now();
    tick();
  }

  function stopHold(cancel = true){
    if(!holding) return;
    holding = false;
    if(raf) cancelAnimationFrame(raf);

    if(cancel){
      updateProgress(0);
      center.textContent = "Hold";
    }
  }

  function tick(){
    raf = requestAnimationFrame(now => {
      if(!holding) return;
      let p = (now - startTime) / HOLD_TIME;
      updateProgress(Math.min(p,1));

      if(p >= 1){
        holding = false;
        center.textContent = "OK";
        finalizeCharacter();
        return;
      }
      tick();
    });
  }

  qteBtn.addEventListener("mousedown", startHold);
  document.addEventListener("mouseup", ()=> stopHold(true));
  qteBtn.addEventListener("mouseleave", ()=> stopHold(true));

  qteBtn.addEventListener("touchstart", e=>{
    e.preventDefault();
    startHold();
  },{passive:false});

  qteBtn.addEventListener("touchend", ()=> stopHold(true));


  /* PREVIEW */
  const previewArea = document.createElement("div");
  previewArea.className = "previewArea";

  const preview = document.createElement("div");
  preview.className = "preview";
  preview.id = "preview";

  Object.keys(TRAITS).forEach(trait=>{
    const img = document.createElement("img");
    img.className = "layer";
    img.id = "layer-"+trait;
    preview.appendChild(img);
  });

  previewArea.appendChild(preview);

  box.appendChild(menu);
  box.appendChild(previewArea);
  ROOT.appendChild(box);

  renderAll();
}


/* =====================================
   TRAITS
===================================== */

function changeTrait(trait, dir){
  const arr = TRAITS[trait];
  CURRENT[trait] = (CURRENT[trait] + dir + arr.length) % arr.length;
  renderAll();
}

function renderAll(){
  Object.keys(TRAITS).forEach(trait=>{
    const img = document.getElementById("layer-"+trait);
    if(img) img.src = TRAITS[trait][CURRENT[trait]];
  });
}


/* =====================================
   FINALIZAR — NPC SIMPLES (SEM CANVAS)
===================================== */

function finalizeCharacter(){
  const preview = document.getElementById("preview");
  const clone = preview.cloneNode(true);

  clone.style.position = "absolute";
  clone.style.left = "0px";
  clone.style.top = "0px";

  PLAYER_NPC = {
    id: "npc_"+Date.now(),
    element: clone
  };

  ROOT.style.display = "none";

  const open = document.getElementById("openCreator");
  if(open) open.style.display = "none";

  console.log("NPC criado:", PLAYER_NPC);
}


/* =====================================
   SPAWN EM QUALQUER MAPA
===================================== */

function spawnPlayerNPC(x,y){
  if(!PLAYER_NPC) return;
  const npc = PLAYER_NPC.element.cloneNode(true);
  npc.style.position = "absolute";
  npc.style.left = x+"px";
  npc.style.top = y+"px";

  document.getElementById("gameArea").appendChild(npc);
}


/* abrir */
document.getElementById("openCreator").onclick = ()=>{
  createInterface();
  ROOT.style.display = "flex";
};
