


//button back//
document.getElementById("btn-back").addEventListener("click", () => {
  window.location.replace("/city.html");
});


// Seu script de interação (provavelmente no final do body ou arquivo separado)

const boxEl = document.getElementById("box"); // Mudei o nome pra não conflitar
const cobraEl = document.getElementById("cobra4");

let clicks = 0;
let clickTimer = null;
const delayCobra = 2000;

// Se carregar a página e já estiver salvo que sumiu, garante a classe hidden visualmente
if (window.gameData.visualState.boxSumiu) boxEl.classList.add("hidden");
if (window.gameData.visualState.cobraSumiu) cobraEl.classList.add("hidden");

// ---- sistema de clicks ----
boxEl.addEventListener("pointerdown", (e) => {
  // Previne comportamentos estranhos no touch
  e.preventDefault(); 
  
  clicks++;
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => clicks = 0, 1000);

  if (clicks >= 7) {
    // 1. Efeito visual imediato
    boxEl.classList.add("hidden");
    
    // 2. SALVAR NO GLOBAL (Isso ativa o Proxy e o salvarJogo)
    // O nome da propriedade TEM que bater com o case do switch no script.js
    window.gameData.visualState.boxSumiu = true; 
    
    setTimeout(() => {
      
      // 1. Inicia a animação visual (Fade Out)
      // Como você já configurou o transition no CSS, isso vai demorar 0.5s
      cobraEl.style.opacity = "0"; 
      
      // 2. Cria um novo tempo de espera EXATAMENTE do tamanho da sua animação (500ms)
      setTimeout(() => {
          // Só agora, que o visual terminou, a gente mata o objeto e salva
          window.gameData.visualState.cobraSumiu = true; 
          window.gameData.visualState.kofongoVisivel = true; 
      }, 500); // 500ms = 0.5s do seu CSS
      
    }, delayCobra);
  }
});

// ... resto do código da tremida ...

// ---- tremidinha ocasional ----
function tremerBox() {
  if (!box.classList.contains("hidden")) {
    box.classList.add("shake");

    setTimeout(() => {
      box.classList.remove("shake");
    }, 200); // tira a classe após a animação
  }

  // intervalo aleatório entre 3 e 10 segundos
  const proximo = Math.floor(Math.random() * 20000) + 5000;

  setTimeout(tremerBox, proximo);
}

// iniciar o loop
tremerBox();


//Cadeado

// =====================================================
// ESTADO GLOBAL → mantém o que o jogador deixou sempre
// =====================================================
let initialCurrent = null;

// =====================================================
// FUNÇÃO QUE ABRE O LOCK GAME
// =====================================================
function abrirLockGame() {

    // ====== ÍCONES COMO PNG ======
    const icons = [
        "/assets/img/Locker-symbol-1.png",
        "/assets/img/Locker-symbol-2.png",
        "/assets/img/Locker-symbol-3.png",
        "/assets/img/Locker-symbol-4.png",
        "/assets/img/Locker-symbol-5.png",
        "/assets/img/Locker-symbol-6.png",
        "/assets/img/Locker-symbol-7.png"
    ];

    // ====== SENHA DEFINIDA POR VOCÊ ======
    const secretCode = [6, 5, 2, 0];

    // ====== DEFINE O ESTADO INICIAL SE FOR A PRIMEIRA VEZ ======
    if (!initialCurrent) {
        // Agora começa fixo em [0, 0, 0, 0] (ou os ícones que você quiser)
        // A senha é [6, 5, 2, 0], então aqui tá seguro!
        initialCurrent = [0, 1, 3, 5];
    }

    // AGORA current APONTA PARA O MESMO ARRAY
    const current = initialCurrent;

    // =====================================================
    // MODAL
    // =====================================================
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.background = "rgba(0,0,0,0.4)";
    modal.style.zIndex = "3000";
    document.body.appendChild(modal);

    // Fecha ao clicar fora
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // =====================================================
    // WRAPPER DO CADEADO
    // =====================================================
    const lockWrapper = document.createElement("div");
    lockWrapper.style.width = "40vw";
    lockWrapper.style.maxWidth = "240px";
    lockWrapper.style.aspectRatio = "1/1.4";
    lockWrapper.style.position = "relative";

    lockWrapper.style.backgroundImage = "url('/assets/img/Locker.png')";
    lockWrapper.style.backgroundSize = "contain";
    lockWrapper.style.backgroundRepeat = "no-repeat";
    lockWrapper.style.backgroundPosition = "center";
    lockWrapper.style.zIndex = "3000";

    modal.appendChild(lockWrapper);

    // =====================================================
    // ÁREA DOS DÍGITOS
    // =====================================================
    const digitsArea = document.createElement("div");
    digitsArea.style.position = "absolute";
    digitsArea.style.width = "90%";
    digitsArea.style.height = "30%";
    digitsArea.style.top = "42%";
    digitsArea.style.left = "3.2%";
    digitsArea.style.display = "flex";
    digitsArea.style.justifyContent = "center";
    digitsArea.style.alignItems = "center";
    digitsArea.style.gap = "8.6%";

    lockWrapper.appendChild(digitsArea);

    const slots = [];

    // =====================================================
    // SLOTS (4)
    // =====================================================
    for (let i = 0; i < 4; i++) {

        const slot = document.createElement("div");

        slot.style.width = "12%";
        slot.style.aspectRatio = "1 / 1";
        slot.style.height = "26%";
        slot.style.cursor = "pointer";

        // Imagem inicial (PEGANDO O ESTADO SALVO!)
        slot.style.backgroundImage = `url("${icons[current[i]]}")`;
        slot.style.backgroundSize = "contain";
        slot.style.backgroundRepeat = "no-repeat";
        slot.style.backgroundPosition = "center";

        // Delay
        slot.blocked = false;

        slot.onclick = () => {
            if (slot.blocked) return;

            slot.blocked = true;
            setTimeout(() => (slot.blocked = false), 200);

            // Avança em SEQUÊNCIA
            current[i] = (current[i] + 1) % icons.length;

            // Atualiza visual
            slot.style.backgroundImage = `url("${icons[current[i]]}")`;

            checkWin();
        };

        digitsArea.appendChild(slot);
        slots.push(slot);
    }

    // =====================================================
    // VERIFICA SE GANHOU
    // =====================================================
    function checkWin() {
        if (current.every((v, i) => v === secretCode[i])) {
            win();
        }
    }

    // =====================================================
    // VITÓRIA
    // =====================================================
    function win() {
        tocarEfeito("whoosh")
        gameData.visualState.minigame1 = true
        mudarCenario(personagens.myopic, 'segunda');

        // desativa todos os slots imediatamente ao vencer
    slots.forEach(slot => {
    slot.style.pointerEvents = "none";
});


        // esconde botão do cadeado se existir
        const btn = document.getElementById("padlock");
        if (btn) btn.style.display = "none";

        // SALVA estado como senha correta
        // (assim se abrir de novo, fica "desbloqueado")
        initialCurrent = [...secretCode];

        // Fecha com delay
        setTimeout(() => {
            modal.remove();
        }, 3000);
    }
}
