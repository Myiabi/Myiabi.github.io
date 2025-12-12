/* fishing.js */

(() => {
  const root = document.getElementById('fishing-root');
  const rodButton = document.getElementById('rodButton');

  // --- 🛠️ CONFIG ---
  const DEBUG_CONFIG = {
    forceLegendary: false,
    forceUnique: false,
    maxSize: 3000
  };

  const ESPECIES = [
    { nome: 'Catfish', raridadeBase: 'comum', img: '/assets/img/Fish-catfish.png' },
    { nome: 'Carp', raridadeBase: 'comum', img: '/assets/img/Fish-Carp.png' },
    { nome: 'Rainbow Trout', raridadeBase: 'comum', img: '/assets/img/Fish-Rainbow-trout.png' },
    { nome: 'Pond Smelt', raridadeBase: 'comum', img: '/assets/img/Fish-pond-smelt.png' },
    { nome: 'Legendary Fish', raridadeBase: 'lendario', img: '/assets/img/Fish-Legendary.png' },
    { nome: 'Star Hair Clip', raridadeBase: 'unico', img: '/assets/img/Star-hairpin.png', isUnique: true }
  ];

  let sessionActive = false;
  window.RECORDE_ATUAL_PESO = 0; 
  const randInt = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;

  // --- LÓGICA DE DROP ---
  function pickPeixeBase(){
    if(DEBUG_CONFIG.forceUnique) return ESPECIES.find(e => e.nome === 'Star Hair Clip');
    if(DEBUG_CONFIG.forceLegendary) return ESPECIES.find(e => e.nome === 'Legendary Fish');

    const r = Math.random(); 
    const gameData = window.gameData;
    
    const jaPegouClip = gameData && gameData.fishing && gameData.fishing.uniqueItems['Star Hair Clip'];
    const jaPegouLendario = gameData && gameData.fishing && gameData.fishing.stats && gameData.fishing.stats.legendaryCount > 0;

    if(r > 0.95 && !jaPegouClip) return ESPECIES.find(e => e.nome === 'Star Hair Clip');
    if(r > 0.90 && r <= 0.95 && !jaPegouLendario) return ESPECIES.find(e => e.nome === 'Legendary Fish');

    const comuns = ESPECIES.filter(e => e.raridadeBase === 'comum');
    return comuns[Math.floor(Math.random() * comuns.length)];
  }

  function generatePeixe(){
    const base = pickPeixeBase();
    let size = null;

    if(base.raridadeBase !== 'unico'){
      if(base.nome === 'Pond Smelt') {
          size = randInt(5, 25);
      } else if(base.raridadeBase === 'lendario') {
         size = randInt(2500, DEBUG_CONFIG.maxSize);
      } else {
         // --- AJUSTE DE DIFICULDADE AQUI ---
         const roll = Math.random();
         
         if(roll < 0.80) {
            // 80% Comum (Pequeno/Médio)
            size = randInt(30, 1000);
         } else if (roll < 0.95) {
            // 15% Grande (1m - 2m)
            size = randInt(1001, 2000);
         } else if (roll < 0.99) {
            // 4% Gigante (2m - 2.8m)
            size = randInt(2001, 2800);
         } else {
            // 1% MONSTRO (2.8m - 3m)
            size = randInt(2801, DEBUG_CONFIG.maxSize);
         }
      }
    }
    return { ...base, size };
  }

  // --- POPUP ---
  function showResultPopup(peixe, tamanho, isRecord = false){
    const p=document.createElement('div');
    p.className='result-popup';
    
    if(peixe.raridadeBase === 'lendario') p.classList.add('species-legendary');
    if(peixe.raridadeBase === 'unico') p.style.color = '#ff79c6';

    p.style.opacity="0";
    p.style.transform="translate(-50%, -20px) scale(0.8)"; 
    
    p.innerHTML = `
      <img src="${peixe.img}" style="width:45px;height:45px;border-radius:6px; object-fit:contain;">
      <div>
        <div style="font-size:15px;">${peixe.nome}</div>
        ${tamanho ? `<div style="font-size:13px;opacity:0.7">${tamanho}cm</div>` : ''}
        ${peixe.isUnique ? `<div style="font-size:11px;color:#ffb86c">ITEM ÚNICO!</div>` : ''}
        ${isRecord ? `<div style="font-size:11px;color:#50fa7b;font-weight:bold">NOVO RECORDE! 🏆</div>` : ''}
      </div>
    `;

    document.body.appendChild(p);

    requestAnimationFrame(()=>{
      p.style.opacity="1";
      p.style.transform="translate(-50%, 0) scale(1)"; 
    });

    setTimeout(()=>{
      p.style.opacity="0";
      p.style.transform="translate(-50%, -20px) scale(0.8)";
      setTimeout(()=>p.remove(),300);
    }, 3500);
  }

  function buildOverlay(){
    const o=document.createElement('div');
    o.className='fishing-overlay';
    o.innerHTML=`
      <div class="fishing-modal">
        <div class="header">
          <div class="emote" id="emote">🎣</div>
          <div class="status" id="status"></div>
        </div>

        <div class="action-area" id="actionArea">
          <div class="gesture-label" id="gestureLabel">Tap</div>
          <div class="pulse"></div>
        </div>

        <div class="hint" id="hint"></div>

        <button class="cancel-btn" id="cancelBtn">Cancelar</button>
      </div>
    `;
    return o;
  }

  function startSession(){
    if(sessionActive) return;
    sessionActive = true;

    const peixe = generatePeixe();
    const overlay = buildOverlay();
    root.appendChild(overlay);

    const emote  = overlay.querySelector('#emote');
    const status = overlay.querySelector('#status');
    const area   = overlay.querySelector('#actionArea');
    const label  = overlay.querySelector('#gestureLabel');
    const hint   = overlay.querySelector('#hint');
    const cancel = overlay.querySelector('#cancelBtn');

    cancel.onclick = () => {
      sessionActive = false;
      endSession();
    };

    status.textContent = 'Casting...';
    hint.textContent   = 'Aguardando fisgada (3s)';

    setTimeout(()=>{
      if(!sessionActive) return;

      area.classList.add('show');
      emote.textContent = '❗';
      status.textContent = 'Hooked!';
      hint.textContent = 'Fish hooked!';

      runPhases(area, label, peixe).then(ok=>{
        if(!sessionActive) return;

        if(ok){
            let isRecord = false;

            // --- ESPECIAIS ---
            if(peixe.isUnique) {
               console.log("PEGOU PRESILHA!"); 
               // >>> SUAS VARIAVEIS AQUI <<<
            }
            if(peixe.raridadeBase === 'lendario') {
               console.log("PEGOU LENDÁRIO!");
               // >>> SUAS VARIAVEIS AQUI <<<
            }

            // --- SAVE ---
            if(window.gameData && window.gameData.fishing){
                const gd = window.gameData.fishing;

                const novoPeixe = { 
                    nome: peixe.nome, 
                    raridade: peixe.raridadeBase, 
                    tamanho: peixe.size,
                    data: new Date().toISOString()
                };
                gd.inventory = [...gd.inventory, novoPeixe];

                if(peixe.isUnique) gd.uniqueItems['Star Hair Clip'] = true;

                if(gd.stats) {
                    gd.stats.totalCatches++;
                    if(peixe.raridadeBase === 'lendario') gd.stats.legendaryCount++;
                }

                if(peixe.size !== null && peixe.raridadeBase !== 'lendario'){
                    if(!gd.biggestFish) gd.biggestFish = { size: 0, name: "None" };
                    if(peixe.size > gd.biggestFish.size){
                        gd.biggestFish = { name: peixe.nome, size: peixe.size };
                        window.RECORDE_ATUAL_PESO = peixe.size; 
                        isRecord = true;
                    } else {
                        window.RECORDE_ATUAL_PESO = gd.biggestFish.size;
                    }
                }
            }
            showResultPopup(peixe, peixe.size, isRecord);
        } else {
            showResultPopup({nome:'Escapou...', img:'img/escape.png', raridadeBase:'comum'}, null);
        }
        endSession();
      });

    }, 3000);

    function endSession(){
      root.innerHTML='';
      sessionActive=false;
    }
  }

  // --- MECÂNICA ---
  function runPhases(area, label, peixe){
    return new Promise((resolve)=>{

      const size = peixe.size ?? 100;
      let sizeFactor = size / DEBUG_CONFIG.maxSize; 
      sizeFactor = Math.max(0.1, sizeFactor);
      if(peixe.raridadeBase === 'unico') sizeFactor = 0.7;

      const PHASES=['tap','hold','spin'];
      let cur=0;

      const tapTarget = Math.floor(4 + (20 * sizeFactor));
      const holdTargetSec = Math.floor(2 + (6 * sizeFactor));
      const spinTargetDeg = Math.floor(720 + (1800 * sizeFactor));
      const phaseLimit = 5000 + (5000 * sizeFactor);

      let tapCount = 0;
      let holdAccum = 0;
      let holding = false;
      let holdStart = 0;
      let holdLocked = false;
      const HOLD_DELAY_MS = 300;

      let spinAccum = 0;
      let lastAngle = null;
      let raf = null;
      let phaseElapsed = 0;
      let lastTime = 0;

      area.addEventListener('pointerdown', () => {
        holding = true;
        if (PHASES[cur] === 'tap') tapCount++;
        if (PHASES[cur] === 'hold') {
          holdStart = performance.now();
          holdLocked = false;
        }
      });

      area.addEventListener('pointerup', () => {
        holding = false;
        holdStart = 0;
        holdLocked = false;
      });

      area.addEventListener('pointermove', e=>{
        if(!holding || PHASES[cur] !== 'spin') return;

        const r = area.getBoundingClientRect();
        const cx = r.left + r.width/2;
        const cy = r.top + r.height/2;
        const x = e.clientX - cx;
        const y = e.clientY - cy;

        const dist = Math.sqrt(x*x + y*y);
        if(dist < 50) return; 

        const angle = Math.atan2(y,x) * 180 / Math.PI;

        if(lastAngle === null) lastAngle = angle;
        let diff = angle - lastAngle;
        
        if(diff > 180) diff -= 360;
        if(diff < -180) diff += 360;

        if(Math.abs(diff) > 60) {
            lastAngle = angle; 
            return;
        }

        spinAccum += diff;
        
        if(Math.abs(diff) > 5) {
             if(typeof tocarEfeito === 'function') {
                 // tocarEfeito(); 
             }
        }
        
        lastAngle = angle;
      });

      function nextPhase(){
        cur++;
        tapCount=0; holdAccum=0; spinAccum=0;
        holding=false; holdStart=0; holdLocked = false;
        lastAngle=null; phaseElapsed=0;

        if(cur >= PHASES.length){
          return resolve(true);
        }
        run();
      }

      function fail(){
        cancelAnimationFrame(raf);
        resolve(false);
      }

      function run(){
        const phase = PHASES[cur];
        lastTime = performance.now();
        raf = requestAnimationFrame(loop);

        function loop(){
          if(!sessionActive) return;

          const now = performance.now();
          const dt = now - lastTime;
          lastTime = now;

          if(!(phase==='hold' && holding)) phaseElapsed += dt;

          if(phase === 'tap'){
            label.textContent = `Tap (${tapCount}/${tapTarget})`;
            if(tapCount >= tapTarget) return nextPhase();
          }

          if(phase === 'hold'){
            label.textContent = `Hold (${holdAccum.toFixed(1)}s/${holdTargetSec}s)`;
            if(holding && holdStart){
              const pressDuration = now - holdStart;
              if(!holdLocked){
                if(pressDuration >= HOLD_DELAY_MS) holdLocked = true;
              }
              if(holdLocked) holdAccum += dt/1000;
            }
            if(holdAccum >= holdTargetSec) return nextPhase();
          }

          if(phase === 'spin'){
            const currentSpin = Math.abs(spinAccum);
            label.textContent = `Spin (${Math.round(currentSpin)}°/${spinTargetDeg}°)`;
            if(currentSpin >= spinTargetDeg) return nextPhase();
          }

          if(phaseElapsed >= phaseLimit){
            return fail();
          }

          raf = requestAnimationFrame(loop);
        }
      }

      run();
    });
  }

  let clicks = 0;
  let dblTimer = null;

  rodButton.addEventListener('click', ()=>{
    if(sessionActive) return;

    clicks++;
    if(clicks === 1){
      dblTimer = setTimeout(()=> clicks = 0, 350);
    } else {
      clearTimeout(dblTimer);
      clicks = 0;
      startSession();
    }
  });

})();