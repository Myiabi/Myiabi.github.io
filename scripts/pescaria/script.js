/* script.js — fase HOLD agora pausa o timer enquanto o jogador segura */
(() => {
  const root = document.getElementById('fishing-root');
  const rodButton = document.getElementById('rodButton');

  const ESPECIES = [
    { nome: 'Bass', raridade: 'comum', cor: '#0b3a66' },
    { nome: 'Salmon', raridade: 'raro', cor: '#b23a3a' },
    { nome: 'Blue Marlin', raridade: 'lendario', cor: '#d4af37' },
    { nome: 'Trash', raridade: 'comum', cor: '#444' }
  ];

  let sessionActive = false;
  const randInt = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pickPeixe = ()=>{const r=Math.random();if(r<0.06)return ESPECIES[2];if(r<0.25)return ESPECIES[1];if(r<0.92)return ESPECIES[0];return ESPECIES[3];};
  const randomSize = ()=>randInt(10,2000);

  function showResultPopup(text,isLegendary=false){
    const p=document.createElement('div');
    p.className='result-popup'+(isLegendary?' gold':'');
    p.textContent=text;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3000);
  }

  function buildOverlay(){
    const o=document.createElement('div');
    o.className='fishing-overlay';
    o.innerHTML=`
      <div class="fishing-modal">
        <div class="header"><div class="emote" id="emote">🎣</div><div class="status" id="status">Casting...</div></div>
        <div class="action-area" id="actionArea"><div class="gesture-label" id="gestureLabel">Tap</div></div>
        <div class="hint" id="hint">Aguarde a fisgada...</div>
        <button class="cancel-btn" id="cancelBtn">Cancelar</button>
      </div>`;
    return o;
  }

  function startSession(){
    if(sessionActive)return;
    sessionActive=true;

    const peixe=pickPeixe();
    const tamanho=peixe.nome==='Trash'?null:randomSize();
    const overlay=buildOverlay();
    root.appendChild(overlay);

    const emote=overlay.querySelector('#emote');
    const status=overlay.querySelector('#status');
    const area=overlay.querySelector('#actionArea');
    const label=overlay.querySelector('#gestureLabel');
    const hint=overlay.querySelector('#hint');
    const cancel=overlay.querySelector('#cancelBtn');
    cancel.onclick=()=>end(false);

    status.textContent='Casting...';
    hint.textContent='Aguardando fisgada (3s)';
    setTimeout(()=>{
      emote.textContent='❗';
      status.textContent=peixe.nome+(tamanho?` (${tamanho}cm)`:'');
      hint.textContent='Fish hooked! Siga o gesto';
      area.classList.add('show');
      runPhases(area,label,peixe,tamanho).then(ok=>{
        if(ok)showResultPopup(`${peixe.nome} obtido${tamanho?` (${tamanho}cm)`:''}`,peixe.raridade==='lendario');
        else showResultPopup('O peixe escapou...');
        end();
      });
    },3000);

    function end(){
      root.innerHTML='';
      sessionActive=false;
    }
  }

  function runPhases(area,label,peixe,tamanho){
    return new Promise(resolve=>{
      const PHASES=['tap','hold','spin'];
      let cur=0,active=true;
      const sizeScale=tamanho?Math.min(2,Math.max(0.5,tamanho/800)):1;
      const tapTarget=Math.max(3,Math.round(5*(peixe.raridade==='lendario'?1.6:peixe.raridade==='raro'?1.2:1)*sizeScale));
      const holdTargetSec=Math.max(3,Math.round(3*(peixe.raridade==='lendario'?1.6:peixe.raridade==='raro'?1.2:1)*sizeScale));
      const spinTargetDeg=Math.max(360,Math.round(480*(peixe.raridade==='lendario'?1.6:peixe.raridade==='raro'?1.2:1)*sizeScale));
      const phaseLimit=3000; // 3s p/ teste
      let tapCount=0,holdAccum=0,holding=false,holdStart=0,spinAccum=0,lastAngle=null,raf=null,phaseElapsed=0,lastTime=0;

      area.addEventListener('pointerdown',e=>{
        if(e.button&&e.button!==0)return;
        area.setPointerCapture?.(e.pointerId);
        holding=true;
        if(PHASES[cur]==='tap')tapCount++;
        if(PHASES[cur]==='hold')holdStart=performance.now();
      });
      area.addEventListener('pointerup',()=>{
        holding=false;
        if(PHASES[cur]==='hold'&&holdStart){
          holdAccum+=(performance.now()-holdStart)/1000;
          holdStart=0;
        }
      });
      area.addEventListener('pointermove',e=>{
        if(!holding||PHASES[cur]!=='spin')return;
        const r=area.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
        const x=e.clientX-cx,y=e.clientY-cy,angle=Math.atan2(y,x)*180/Math.PI;
        if(lastAngle===null)lastAngle=angle;
        let diff=angle-lastAngle;
        if(diff>180)diff-=360;if(diff<-180)diff+=360;
        spinAccum+=Math.abs(diff);lastAngle=angle;
      });

      function nextPhase(){cur++;tapCount=0;holdAccum=0;spinAccum=0;holding=false;holdStart=0;lastAngle=null;phaseElapsed=0;if(cur>=PHASES.length)return resolve(true);run();}
      function fail(){active=false;cancelAnimationFrame(raf);resolve(false);}

      function run(){
        const phase=PHASES[cur];
        lastTime=performance.now();
        raf=requestAnimationFrame(loop);
        function loop(){
          const now=performance.now(),dt=now-lastTime;lastTime=now;
          if(!active)return;
          // HOLD -> pausa tempo quando segurando
          if(!(phase==='hold'&&holding))phaseElapsed+=dt;
          // hold acumula quando segurando
          if(phase==='hold'&&holding)holdAccum=(holdAccum+dt/1000);
          // updates visuais
          if(phase==='tap')label.textContent=`Tap (${tapCount}/${tapTarget})`;
          else if(phase==='hold')label.textContent=`Hold (${holdAccum.toFixed(1)}s/${holdTargetSec}s)`;
          else label.textContent=`Spin (${Math.round(spinAccum)}°/${spinTargetDeg}°)`;

          // checks
          if(phase==='tap'&&tapCount>=tapTarget)return nextPhase();
          if(phase==='hold'&&holdAccum>=holdTargetSec)return nextPhase();
          if(phase==='spin'&&spinAccum>=spinTargetDeg)return nextPhase();

          // fail só se passou tempo E não está segurando
          if(phaseElapsed>=phaseLimit&&!holding)return fail();

          raf=requestAnimationFrame(loop);
        }
      }
      run();
    });
  }

  let clicks=0,timer=null;
  rodButton.addEventListener('click',()=>{
    if(sessionActive)return;
    clicks++;
    if(clicks===1)timer=setTimeout(()=>clicks=0,400);
    else if(clicks===2){clearTimeout(timer);clicks=0;startSession();}
  });
})();
