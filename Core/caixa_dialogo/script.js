// ---------------- Personagens ----------------
const personagens = {
  personagem1: {
    nome: "Aiko",
    expressoes: {
      neutra: "url('/assets/img/npc-cientist.png')",
      sorrindo: "url('/assets/img/npc-cientist2.png')",
      triste: "url('/assets/img/npc-cientist.png')"
    },
    falas: [
      { texto: "Ah, veja ali na minha mesa...", expressao: "neutra" },
      { texto: "Tem algo que pode te interessar.", expressao: "sorrindo", emote: "❗" },
      { texto: "Mas cuidado com o que você tocar!", expressao: "triste", emote: "🤔" }
    ]
  },
  personagem2: {
    nome: "Aiko2",
    expressoes: {
      neutra: "url('https://i.imgur.com/Bb5rMtC.png')",
      serio: "url('https://i.imgur.com/8z1nSTZ.png')"
    },
    falas: [
      { texto: "Ela sempre fala essas coisas...", expressao: "neutra" },
      { texto: "Mas talvez dessa vez seja sério.", expressao: "serio", emote: "❓" }
    ]
  }
};

// ---------------- Variáveis globais ----------------
let atual = null;
let indiceFala = 0;
let digitando = false;
let intervaloTexto = null;
let fechandoDialogo = false; // bloqueio apenas para fechar diálogo

// ---------------- Função init ----------------
function init() {
  const overlay = document.getElementById("dialogOverlay");
  const dialogBox = document.getElementById("dialogBox");
  const portrait = document.getElementById("portrait");
  const nameTag = document.getElementById("name");
  const text = document.getElementById("text");
  const indicator = document.getElementById("indicator");
  const btn = document.getElementById("btnPersonagem1");

  if (!overlay || !dialogBox || !portrait || !nameTag || !text || !indicator || !btn) {
    console.error("Elementos do diálogo não encontrados. Verifique IDs no HTML.");
    return;
  }

  overlay.classList.remove("show");
  dialogBox.classList.remove("show");
  portrait.classList.remove("show");
  indicator.style.display = "none";

  // ---------------- Tooltip de emote ----------------
  const offsetX = -portrait.offsetWidth * 0.12; // mais pra esquerda
  const offsetY = 30; // sobe proporcional à altura do portrait
  const emoteTooltip = createFloatingTooltip(
    'portrait', // alvo
    '',         // conteúdo inicial vazio
    offsetX, offsetY,    // offset para cima da cabeça
    "font-size: 54px; color: yellow; font-weight: bold;", 
    false       // não é hover
  );

  // ---------------- Botão para abrir diálogo ----------------
  btn.addEventListener("pointerdown", () => {
    abrirDialogo(personagens.personagem1);
    tocarEfeito("vitoria")
  });

  // ---------------- Abrir diálogo ----------------
  function abrirDialogo(personagem) {
    if (intervaloTexto) clearInterval(intervaloTexto);

    atual = personagem;
    indiceFala = 0;
    nameTag.textContent = atual.nome;

    const falaInicial = atual.falas[0];
    const expressaoInicial = atual.expressoes[falaInicial.expressao];
    portrait.style.backgroundImage = expressaoInicial || "";

    overlay.style.display = "flex";
    setTimeout(() => {
      overlay.classList.add("show");
      dialogBox.classList.add("show");
      portrait.classList.add("show");
    }, 10);

    indicator.style.display = "none";
    digitarTexto(falaInicial.texto, falaInicial.emote);
  }

  // ---------------- Avançar diálogo ----------------
  dialogBox.addEventListener("pointerdown", () => {
    if (!atual) return;

    if (digitando) {
      clearInterval(intervaloTexto);
      text.textContent = atual.falas[indiceFala].texto;
      digitando = false;
      if (indiceFala < atual.falas.length - 1) indicator.style.display = "block";
      return;
    }

    if (indiceFala < atual.falas.length - 1) {
      indiceFala++;
      indicator.style.display = "none";

      const novaFala = atual.falas[indiceFala];
      const novaExpressao = atual.expressoes[novaFala.expressao];

      if (novaExpressao) {
        portrait.classList.remove("show");
        setTimeout(() => {
          portrait.style.backgroundImage = novaExpressao;
          portrait.classList.add("show");
        }, 150);
      }

      digitarTexto(novaFala.texto, novaFala.emote);
    } else {
      fecharDialogo();
      
    }
  });

  // ---------------- Função digitar texto ----------------
  function digitarTexto(str, emote = null) {
    if (intervaloTexto) clearInterval(intervaloTexto);

    digitando = true;
    indicator.style.display = "none";
    text.textContent = "";

    // Dispara o emote (se existir) **uma vez**
    if (emote) {
      emoteTooltip.tooltip.innerHTML = emote;
      emoteTooltip.show(1500); // aparece 1,5s
    }

    let i = 0;
    intervaloTexto = setInterval(() => {
      text.textContent += str[i];
      i++;

      if (i >= str.length) {
        clearInterval(intervaloTexto);
        intervaloTexto = null;
        digitando = false;
        if (indiceFala < atual.falas.length - 1) indicator.style.display = "block";
      }
    }, 35);
  }

  // ---------------- Fechar diálogo ----------------
  function fecharDialogo() {
    if (fechandoDialogo) return; // bloqueio apenas aqui
    fechandoDialogo = true;

    if (intervaloTexto) clearInterval(intervaloTexto);

    overlay.classList.remove("show");
    dialogBox.classList.remove("show");
    portrait.classList.remove("show");

    setTimeout(() => {
      overlay.style.display = "none";
      fechandoDialogo = false; // libera clique depois do fade
    }, 400);

    atual = null;
    indiceFala = 0;
    digitando = false;
    text.textContent = "";
    indicator.style.display = "none";
  }
}

// ---------------- Inicialização ----------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
