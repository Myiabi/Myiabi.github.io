const box = document.getElementById("box");
const cobra = document.getElementById("cobra4");

let clicks = 0;
let timer = null;

const delayCobra = 2000;

// ---- sistema de clicks ----
box.addEventListener("pointerdown", () => {
  clicks++;

  clearTimeout(timer);
  timer = setTimeout(() => clicks = 0, 1000);

  if (clicks >= 7) {
    box.classList.add("hidden");

    setTimeout(() => {
      cobra.classList.add("hidden");
    }, delayCobra);
  }
});

// ---- tremidinha ocasional ----
function tremerBox() {
  if (!box.classList.contains("hidden")) {
    box.classList.add("shake");

    setTimeout(() => {
      box.classList.remove("shake");
    }, 200); // tira a classe após a animação
  }

  // intervalo aleatório entre 3 e 10 segundos
  const proximo = Math.floor(Math.random() * 7000) + 3000;

  setTimeout(tremerBox, proximo);
}

// iniciar o loop
tremerBox();
