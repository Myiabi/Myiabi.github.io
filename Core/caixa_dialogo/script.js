// ---------------- Personagens ----------------
const personagens = {
  aiko: {
    nome: "Aiko",
    expressoes: {
      neutra: "url('/assets/img/npc-cientist.png')",
      sorrindo: "url('/assets/img/npc-cientist2.png')",
      triste: "url('/assets/img/npc-cientist.png')"
    },
    falas: {
      introducao: [
        { texto: "Ah, veja ali na minha mesa...Ah, veja ali na minha mesa...", expressao: "neutra" },
        { texto: "Tem algo que pode te interessar.", expressao: "sorrindo", emote: "❗" },
        { texto: "Mas cuidado com o que você tocar!", expressao: "triste", emote: "🤔" }
      ],
      depoisDoMinigame: [
        { texto: "Então você conseguiu vencer, hein?", expressao: "sorrindo" },
        { texto: "Parece que você está melhorando!", expressao: "neutra", emote: "✨" }
      ]
    }
  },
  czar: {
    nome: "Czar",
    expressoes: {
      normal: "url('/assets/img/npc-czar.png')",
      pensativo: "url('/assets/img/npc-czar2.png')"
    },
    falas: {
      inicio: [
        { texto: "Hmm... será que devo confiar nela?", expressao: "pensativo" },
        { texto: "Bom, não tenho muita escolha agora.", expressao: "normal" }
      ],
      depoisDoTreinamento: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  }
};

window.personagens = personagens;

// ---------------- Criação automática do HTML + CSS ----------------
function ensureDialogElements() {
  if (!document.getElementById("dialogStyle")) {
    const style = document.createElement("style");
    style.id = "dialogStyle";
    style.textContent = `
body {
  background: #222;
  color: #fff;
  font-family: 'Wild Words', sans-serif;
  margin: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.1);
  display: none;
  justify-content: center;
  align-items: flex-end;
  z-index: 9998;
  opacity: 0;
  transition: opacity 0.4s ease;
}

#portrait {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40vw; 
  height: 70vh; 
  background-size: contain; 
  background-repeat: no-repeat;
  background-position: bottom left;
  transform: translateX(-5%); 
  z-index: 9997; 
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.dialog-box {
  display: flex;
  align-items: flex-start;
  background: rgba(0,0,0,0.85);
  border-radius: 10px;
  padding: 2vh 2vw;
  width: 70%;
  min-height: 35vh;
  margin-bottom: 4vh;
  position: relative;
  box-shadow: 0 0 1.5vh rgba(0,0,0,0.6);
  transition: opacity 0.3s;
  flex-wrap: wrap;
  overflow: hidden;
  height: calc(3 * 1.5rem + 2vh);
  z-index: 9999; /* 🔥 z-index supremo */
}

.text-area {
  flex: 1;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.name {
  font-weight: bold;
  color: #00bfff;
  margin-bottom: 0.5vh;
  font-size: 2vw;
}

.text {
  white-space: pre-line;
  font-size: clamp(1rem, 1.4rem, 3rem);
  font-weight: bold;
  min-height: 6vh;
}

.next-indicator {
  position: absolute;
  bottom: 1vh;
  right: 2vw;
  font-size: 2vw;
  animation: blink 1s infinite;
  display: none;
}

@keyframes blink {
  0%, 50% { opacity: 0; }
  51%, 100% { opacity: 1; }
}

.dialog-overlay.show {
  opacity: 1;
}

.dialog-box.show {
  opacity: 1;
}

#portrait.show {
  opacity: 1;
}

@media (orientation: portrait) {
  body {
    transform: rotate(-90deg) translateX(-100vh);
    transform-origin: top left;
    width: 100vh;
    height: 100vw;
    overflow: hidden;
  }
}
    `;
    document.head.appendChild(style);
  }

  if (document.getElementById("dialogOverlay")) return;

  const overlay = document.createElement("div");
  overlay.className = "dialog-overlay";
  overlay.id = "dialogOverlay";

  const portrait = document.createElement("div");
  portrait.id = "portrait";

  const dialogBox = document.createElement("div");
  dialogBox.className = "dialog-box";
  dialogBox.id = "dialogBox";

  const textArea = document.createElement("div");
  textArea.className = "text-area";

  const nameDiv = document.createElement("div");
  nameDiv.className = "name";
  nameDiv.id = "name";

  const textDiv = document.createElement("div");
  textDiv.className = "text";
  textDiv.id = "text";

  const indicator = document.createElement("div");
  indicator.className = "next-indicator";
  indicator.id = "indicator";
  indicator.textContent = "▼";

  textArea.appendChild(nameDiv);
  textArea.appendChild(textDiv);
  dialogBox.appendChild(textArea);
  dialogBox.appendChild(indicator);
  overlay.appendChild(portrait);
  overlay.appendChild(dialogBox);
  document.body.appendChild(overlay);
}

// ---------------- Variáveis globais ----------------
let atual = null;
let indiceFala = 0;
let digitando = false;
let intervaloTexto = null;
let fechandoDialogo = false;

// ---------------- Função init ----------------
function init() {
  ensureDialogElements();

  const overlay = document.getElementById("dialogOverlay");
  const dialogBox = document.getElementById("dialogBox");
  const portrait = document.getElementById("portrait");
  const nameTag = document.getElementById("name");
  const text = document.getElementById("text");
  const indicator = document.getElementById("indicator");
  const btn = document.getElementById("btnPersonagem1");

  if (!overlay || !dialogBox || !portrait || !nameTag || !text || !indicator) {
    console.error("❌ Elementos do diálogo não encontrados.");
    return;
  }

  overlay.classList.remove("show");
  dialogBox.classList.remove("show");
  portrait.classList.remove("show");
  indicator.style.display = "none";

  const emoteDiv = document.createElement("div");
  emoteDiv.style.position = "absolute";
  emoteDiv.style.pointerEvents = "none";
  emoteDiv.style.fontSize = "54px";
  emoteDiv.style.color = "yellow";
  emoteDiv.style.fontWeight = "bold";
  emoteDiv.style.transition = "opacity 0.3s";
  emoteDiv.style.opacity = 0;
  document.body.appendChild(emoteDiv);

  function showEmote(emote, duration = 1500) {
    const rect = portrait.getBoundingClientRect();
    const offsetX = -110;
    const offsetY = -20;
    emoteDiv.innerHTML = emote;
    emoteDiv.style.left = rect.left + rect.width / 2 - emoteDiv.offsetWidth / 2 + offsetX + "px";
    emoteDiv.style.top = rect.top - emoteDiv.offsetHeight + offsetY + "px";
    emoteDiv.style.opacity = 1;
    setTimeout(() => (emoteDiv.style.opacity = 0), duration);
  }

  function abrirDialogo(personagem, aoTerminar = null) {
    if (intervaloTexto) clearInterval(intervaloTexto);
    atual = personagem;
    indiceFala = 0;
    nameTag.textContent = atual.nome;

    const cenarioAtual = (window.gameData?.dialogos?.[atual.nome.toLowerCase()] || "introducao");
    const falasAtuais = atual.falas[cenarioAtual];

    if (!falasAtuais) {
      console.error(`❌ Cenário "${cenarioAtual}" não encontrado para ${atual.nome}.`);
      return;
    }

    const falaInicial = falasAtuais[0];
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

    dialogBox.onclick = avancarFala;

    function avancarFala() {
      if (!atual) return;
      const falasAtuais = atual.falas[cenarioAtual];

      if (digitando) {
        clearInterval(intervaloTexto);
        intervaloTexto = null;
        digitando = false;
        text.textContent = falasAtuais[indiceFala].texto;
        indicator.style.display = "block";
        return;
      }

      if (indiceFala < falasAtuais.length - 1) {
        indiceFala++;
        indicator.style.display = "none";
        const novaFala = falasAtuais[indiceFala];
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
        if (aoTerminar) aoTerminar();
      }
    }
  }

  function digitarTexto(str, emote = null) {
    if (intervaloTexto) clearInterval(intervaloTexto);
    digitando = true;
    indicator.style.display = "none";
    text.textContent = "";
    if (emote) showEmote(emote, 1500);
    let i = 0;
    intervaloTexto = setInterval(() => {
      text.textContent += str[i];
      i++;
      if (i >= str.length) {
        clearInterval(intervaloTexto);
        intervaloTexto = null;
        digitando = false;
        indicator.style.display = "block";
      }
    }, 35);
  }

  function fecharDialogo() {
    if (fechandoDialogo) return;
    fechandoDialogo = true;
    if (intervaloTexto) clearInterval(intervaloTexto);
    overlay.classList.remove("show");
    dialogBox.classList.remove("show");
    portrait.classList.remove("show");
    setTimeout(() => {
      overlay.style.display = "none";
      fechandoDialogo = false;
    }, 400);
    atual = null;
    indiceFala = 0;
    digitando = false;
    text.textContent = "";
    indicator.style.display = "none";
  }

  window.mudarCenario = function(personagem, novoCenario) {
    if (!window.gameData) window.gameData = {};
    if (!window.gameData.dialogos) window.gameData.dialogos = {};
    window.gameData.dialogos[personagem.nome.toLowerCase()] = novoCenario;
    if (window.salvarJogo) window.salvarJogo();
    console.log(`📖 ${personagem.nome} agora está no cenário: ${novoCenario}`);
  };

  // 🔥 Interface global
  window.dialogo = {
    abrir(personagemOrName, aoTerminar = null) {
      let personagem = personagemOrName;
      if (typeof personagemOrName === "string")
        personagem = window.personagens[personagemOrName];
      abrirDialogo(personagem, aoTerminar);
    },
    fechar: fecharDialogo
  };

  if (btn) btn.addEventListener("pointerdown", () => dialogo.abrir("aiko"));
}

// ---------------- Inicialização ----------------
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
