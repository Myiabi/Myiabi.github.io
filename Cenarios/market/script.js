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
      cobraEl.classList.add("hidden");
      // Salva que a cobra sumiu
      
      window.gameData.visualState.cobraSumiu = true; 
      window.gameData.visualState.kofongoVisivel = true; 
      
      // Se tiver achievement relacionado, libera aqui
      // unlockAchievement('acheiACobra'); 
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
  const proximo = Math.floor(Math.random() * 7000) + 5000;

  setTimeout(tremerBox, proximo);
}

// iniciar o loop
tremerBox();
