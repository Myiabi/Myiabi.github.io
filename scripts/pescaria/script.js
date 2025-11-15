/* script.js — versão refinada com popup animado, hold real com delay, rarity por tamanho */

(() => {
  const root = document.getElementById('fishing-root');
  const rodButton = document.getElementById('rodButton');

  const ESPECIES = [
    { nome: 'Bass', raridadeBase: 'comum',  img: 'img/bass.png' },
    { nome: 'Salmon', raridadeBase: 'raro', img: 'img/salmon.png' },
    { nome: 'Blue Marlin', raridadeBase: 'lendario', img: 'img/marlin.png' },
    { nome: 'Trash', raridadeBase: 'comum', img: 'img/trash.png' }
  ];

  let sessionActive = false;
  const randInt = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;

  function pickPeixeBase(){
    const r = Math.random();
    if(r < 0.04) return ESPECIES[2];
    if(r < 0.20) return ESPECIES[1];
    if(r < 0.92) return ESPECIES[0];
    return ESPECIES[3];
  }

  function generatePeixe(){
    const base = pickPeixeBase();
    let size = base.nome === 'Trash' ? null : randInt(10,2000);

    if(size !== null){
      const chance = size / 2000; 
      const roll = Math.random();
      if(chance > roll){
        const s2 = randInt(10, Math.min(size, 500));
        size = s2;
      }
    }
    return { ...base, size };
  }

  function showResultPopup(peixe, tamanho){
    const p=document.createElement('div');
    p.className='result-popup';
    p.style.opacity="0";
    p.style.transform="scale(0.6) translateY(20px)";
    p.style.transition="opacity .25s ease, transform .25s ease";
    p.style.display="flex";
    p.style.alignItems="center";
    p.style.gap="8px";

    p.innerHTML = `
      <img src="${peixe.img}" style="width:45px;height:45px;border-radius:6px;">
      <div>
        <div style="font-size:15px;">${peixe.nome}</div>
        ${tamanho ? `<div style="font-size:13px;color:#ccc">${tamanho}cm</div>` : ''}
      </div>
    `;

    document.body.appendChild(p);

    requestAnimationFrame(()=>{
      p.style.opacity="1";
      p.style.transform="scale(1) translateY(0)";
    });

    setTimeout(()=>{
      p.style.opacity="0";
      p.style.transform="scale(0.8) translateY(-15px)";
      setTimeout(()=>p.remove(),300);
    }, 3000);
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

    // [SOM] som quando clica 2x e inicia a pescaria
    // playSound("start_fishing");

    const peixe = generatePeixe();
    const overlay = buildOverlay();
    root.appendChild(overlay);

    const emote  = overlay.querySelector('#emote');
    const status = overlay.querySelector('#status');
    const area   = overlay.querySelector('#actionArea');
    const label  = overlay.querySelector('#gestureLabel');
    const hint   = overlay.querySelector('#hint');
    const cancel = overlay.querySelector('#cancelBtn');

    cancel.onclick = endSession;

    status.textContent = 'Casting...';
    hint.textContent   = 'Aguardando fisgada (3s)';

    setTimeout(()=>{
      emote.textContent = '❗';
      status.textContent = peixe.nome;

      if(peixe.raridadeBase === 'lendario'){
        // [SOM] som especial pra peixe lendário
        // playSound("legendary_hook");
      }

      // [SOM] som quando o peixe fisga
      // playSound("fish_hooked");

      area.classList.add('show');
      hint.textContent = 'Fish hooked!';

      runPhases(area, label, peixe).then(ok=>{
        showResultPopup(
          ok ? peixe : {nome:'O peixe escapou...', img:'img/escape.png'},
          ok ? peixe.size : null
        );
        endSession();
      });

    }, 3000);

    function endSession(){
      root.innerHTML='';
      sessionActive=false;
    }
  }

  function runPhases(area, label, peixe){
    return new Promise((resolve)=>{

      const size = peixe.size ?? 100;
      let sizeFactor = size / 2000;
      sizeFactor = Math.max(0.1, sizeFactor);

      let rarityFactor = 1;
      if(peixe.raridadeBase === 'raro') rarityFactor = 1.3;
      if(peixe.raridadeBase === 'lendario') rarityFactor = 2.2;

      const difficulty = sizeFactor * rarityFactor;

      const PHASES=['tap','hold','spin'];
      let cur=0;

      const tapTarget = Math.floor(4 + 12 * difficulty);
      const holdTargetSec = Math.floor(2 + 6 * difficulty);
      const spinTargetDeg = Math.floor(800 + 5000 * difficulty);
      const phaseLimit = 5500;

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

        // [SOM] toque leve ao começar o gesto
        // playSound("touch_down");

        if (PHASES[cur] === 'tap') {
          tapCount++;
        }

        if (PHASES[cur] === 'hold') {
          holdStart = performance.now();
          holdLocked = false;
        }
      });

      area.addEventListener('pointerup', () => {
        holding = false;
        holdStart = 0;
        holdLocked = false;

        // [SOM] toque ao soltar (opcional)
        // playSound("touch_up");
      });

      area.addEventListener('pointermove', e=>{
        if(!holding || PHASES[cur] !== 'spin') return;

        const r = area.getBoundingClientRect();
        const cx = r.left + r.width/2;
        const cy = r.top + r.height/2;

        const x = e.clientX - cx;
        const y = e.clientY - cy;

        const angle = Math.atan2(y,x) * 180 / Math.PI;

        if(lastAngle === null) {
          lastAngle = angle;
        }

        let diff = angle - lastAngle;
        if(diff > 180) diff -= 360;
        if(diff < -180) diff += 360;

        if (PHASES[cur] === 'spin') {
          // [SOM] som contínuo ou tic-tic durante spin
          // playSound("spin_tick");
        }

        spinAccum += Math.abs(diff);
        lastAngle = angle;
      });

      function nextPhase(){
        // [SOM] som ao completar cada fase
        // playSound("phase_complete");

        cur++;
        tapCount=0;
        holdAccum=0;
        spinAccum=0;
        holding=false;
        holdStart=0;
        holdLocked = false;
        lastAngle=null;
        phaseElapsed=0;

        if(cur >= PHASES.length){
          // [SOM] som de sucesso ao capturar peixe
          // playSound("fish_caught");

          return resolve(true);
        }

        // [SOM] som ao iniciar nova fase
        // playSound("phase_start");

        run();
      }

      function fail(){
        // [SOM] som quando o peixe escapa
        // playSound("fish_escape");

        cancelAnimationFrame(raf);
        resolve(false);
      }

      function run(){
        const phase = PHASES[cur];
        lastTime = performance.now();
        raf = requestAnimationFrame(loop);

        function loop(){
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
                if(pressDuration >= HOLD_DELAY_MS){
                  holdLocked = true;

                  // [SOM] som quando o hold "engata"
                  // playSound("hold_engage");
                }
              }

              if(holdLocked){
                holdAccum += dt/1000;
              }
            }

            if(holdAccum >= holdTargetSec) return nextPhase();
          }

          if(phase === 'spin'){
            label.textContent = `Spin (${Math.round(spinAccum)}°/${spinTargetDeg}°)`;
            if(spinAccum >= spinTargetDeg) return nextPhase();
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

      // [SOM] som do double-click antes de iniciar
      // playSound("rod_double_click");

      startSession();
    }
  });

})();
