// ==========================================================
// loader.js - Sistema Lua + Sol + Aura de Fogo (Com Imagens e Voo On-Drag)
// ==========================================================

// ---------------------------
// Cria menu
// ---------------------------

console.log("script.js carregado!");

const menu = document.createElement("div");
menu.id = "menu-secundario";
document.body.appendChild(menu);

// !!! ATENÇÃO: COLOQUE AQUI AS SUAS URLS DE IMAGEM !!!
const itens = [
  {
    id: "item-lupa",
    func: "revelar",
    nome: "Lua",
    img: "/assets/img/Droplet-Moon.png",
  },
  {
    id: "item-fogo",
    func: "sol",
    nome: "Sol",
    img: "/assets/img/Droplet-Sun.png",
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

const RADIUS = 7.6;
const START_THRESHOLD_VW = 0.5;
const RADIUS_DETECT_VW = 10; // Valor razoável para a "borda" de detecção

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
  // O raio do dragClone (5vw / 2 = 2.5vw)
  const LUPA_RAIO_VW = 2.5; 
  // O raio de detecção é o tamanho da borda (RADIUS_DETECT_VW) mais o raio da lupa
  const mapaDetectionRaioPx = vwToPx(RADIUS_DETECT_VW) + vwToPx(LUPA_RAIO_VW); 

  targets.forEach((target) => {
    const el = target.el;
    const mapa = el.closest(".mapa");
    if (!mapa) return;
    
    const rect = mapa.getBoundingClientRect(); 

    // O centro da lupa (x,y) está dentro do retângulo do mapa + margem aumentada?
    // ESSA É A LÓGICA MODIFICADA
    const inside =
      x >= rect.left - mapaDetectionRaioPx && 
      x <= rect.right + mapaDetectionRaioPx &&
      y >= rect.top - mapaDetectionRaioPx &&
      y <= rect.bottom + mapaDetectionRaioPx;

    if (inside) {
      if (!revealTimers.has(el)) {
        const timer = setTimeout(() => {
          if (mapa) {
            const layerTop = mapa.querySelector(".layer.top");
            if (layerTop) layerTop.style.display = "none";

            if (typeof tocarEfeito === "function" && target.options?.sound)
              tocarEfeito(target.options.sound);
            mapa.style.display = "none";
          }
        }, target.options?.delay ?? 2000);

        revealTimers.set(el, timer);
      }
    } else {
      if (revealTimers.has(el)) {
        clearTimeout(revealTimers.get(el));
        revealTimers.delete(el);
      }
    }
  });
}

// ======================================================
// 🔥 S O L   (independente)
// ======================================================
// armazenamento
// armazenamento
const sunTargets = [];
const sunTimers = new WeakMap();
const sunOptions = new WeakMap();

// adicionar alvo (uses = número de vezes que pode ativar; padrão 1)
function addSunTarget(el, options = {}) {
  if (!el) return;
  const opt = Object.assign({ action: "hide", delayMs: 350, uses: 1 }, options);
  // se já houver um opt para esse elemento, sobrescreve (comportamento opcional)
  sunOptions.set(el, opt);

  // evita duplicar entradas do mesmo elemento no array
  const exists = sunTargets.find(t => t.el === el);
  if (!exists) sunTargets.push({ el, disabled: false });
}

// Função util pra migrar opções quando substituímos um elemento (ex: IMG -> DIV)
function migrateTargetData(oldEl, newEl) {
  const opt = sunOptions.get(oldEl);
  if (opt) {
    sunOptions.delete(oldEl);
    sunOptions.set(newEl, opt);
  }
  // atualiza referência no array de targets
  for (const t of sunTargets) {
    if (t.el === oldEl) {
      t.el = newEl;
      break;
    }
  }
}

function checkSun(x, y) {
  sunTargets.forEach((target) => {
    if (target.disabled) return;

    const el = target.el;
    if (!document.body.contains(el)) {
      target.disabled = true;
      return;
    }

    const rect = el.getBoundingClientRect();
    const opt = sunOptions.get(el);
    if (!opt) return;

    const inside =
      x >= rect.left && x <= rect.right &&
      y >= rect.top && y <= rect.bottom;

    if (inside) {
      if (!sunTimers.has(el)) {
        const timer = setTimeout(() => {
          // toca som se definido
          if (opt.sound && typeof tocarEfeito === "function") {
            tocarEfeito(opt.sound);
          }

          // Ação
          if (opt.action === "hide") {
            el.style.display = "none";

          } else if (opt.action === "swap") {
            
            if (el.tagName === "IMG") {
              const ni = String(opt.newImage || "");
              if (ni.match(/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i)) {
                el.src = ni;
              } else {
                const div = document.createElement("div");
                div.textContent = opt.newImage;
                const style = window.getComputedStyle(el);
                // preservar posição/estilo básico
                div.style.position = style.position === "static" ? "relative" : style.position;
                div.style.left = el.style.left || style.left;
                div.style.top = el.style.top || style.top;
                div.style.width = (el.width || el.clientWidth) + "px";
                div.style.height = (el.height || el.clientHeight) + "px";
                div.style.display = style.display === "inline" ? "inline-block" : style.display;
                div.style.fontSize = "2.5rem";
                div.style.textAlign = "center";
                el.replaceWith(div);
                migrateTargetData(el, div); // transfere opt e referencia
              }
            } else {
              el.innerHTML = opt.newImage;
            }
          }

          // decrementa contador direto no opt
          if (typeof opt.uses === "number") {
            opt.uses = opt.uses - 1;
            if (opt.uses <= 0) {
              // desativa esse target permanentemente
              target.disabled = true;
              sunOptions.delete(target.el);
            } else {
              // atualiza o map (não estritamente necessário pois opt é referência,
              // mas deixamos para clareza)
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
  } // CORREÇÃO ANIMAÇÃO: Remove a animação antes de retornar

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

  dragClone = document.createElement("div"); // CORREÇÃO ANIMAÇÃO: Adiciona a classe de flutuação
  dragClone.className = "menu-item drag-clone-float";

  // Chamada de som, conforme pedido anterior
  if (typeof tocarEfeito === "function") {
    if (item.func === "revelar") {
      // tocarEfeito("som_inicio_drag_lua");
    } else if (item.func === "sol") {
      // tocarEfeito("som_inicio_drag_sol");
    }
  } // ATUALIZAÇÃO: Usa a imagem como background do clone arrastável
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

    // Chamada para parar som de loop (se houver)
    // if (typeof pararEfeito === 'function') {
    //     if (currentItem?.func === "revelar") {
    //         pararEfeito("som_loop_lua");
    //     } else if (currentItem?.func === "sol") {
    //         pararEfeito("som_loop_sol");
    //     }
    // }

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
  delay: 52000,
  sound: "whoosh",
});

// ==========================================================
// Sol
// ==========================================================
addSunTarget(document.querySelector(".gelo-alvo"), {
  action: "swap",
  newImage: "🙄",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector(".bola-alvo"), {
  action: "swap",
  newImage: "",
  sound: "whoosh",
  delayMs: 350,
});


addSunTarget(document.querySelector("#poste1"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste2"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste3"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste4"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste5"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste6"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste7"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste8"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste9"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

addSunTarget(document.querySelector("#poste10"), {
  action: "swap",
  newImage: "/assets/img/Pole-turned-on.png",
  sound: "whoosh",
  delayMs: 350,
});

