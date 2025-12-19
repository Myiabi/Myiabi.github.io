// ---------------- Criação automática do HTML + CSS ----------------
function ensureDialogElements() {
  try {
    if (!document.getElementById("dialogStyle")) {
      const style = document.createElement("style");
      style.id = "dialogStyle";
      style.textContent = `
body {
  color: #fff;
  font-family: 'Wild Words', sans-serif;
  overflow: hidden;
}

.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.1);
  display: none;
  justify-content: center;
  align-items: flex-end;
  z-index: 4000;
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
  transform: translateX(0%);
  z-index: -1;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.fade-out { opacity: 0; }
.fade-in { opacity: 1; }

.dialog-box {
  display: flex;
  align-items: flex-start;
  background: rgba(0,0,0,0.85);
  border-radius: 10px;
  padding: 2vh 2vw;
  width: 75%;
  min-height: 30vh;
  margin-bottom: 4vh;
  position: relative;
  box-shadow: 0 0 1.5vh rgba(0,0,0,0.6);
  transition: opacity 0.3s;
  flex-wrap: wrap;
  overflow: hidden;
  height: calc(3 * 1.5rem + 2vh);
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
  margin-bottom: 2vh;
  font-size: 2vw;
}

.text {
  white-space: pre-line;
  /* Mínimo 16px, Tenta ser 2.5% da largura da tela, Máximo 28px */
  font-size: clamp(16px, 1.7vw, 28px); 
  font-weight: bold;
  min-height: 6vh;
  line-height: 1.3;
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

.dialog-overlay.show { opacity: 1; }
.dialog-box.show { opacity: 1; }
#portrait.show { opacity: 1; }

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
  } catch (e) {
    console.error("ensureDialogElements error:", e);
  }
}

// ---------------- Variáveis globais ----------------
let atual = null;
let indiceFala = 0;
let digitando = false;
let intervaloTexto = null;
let fechandoDialogo = false;
let fimDialogoCallback = null;

// ---------------- Função init ----------------
function init() {
  try {
    ensureDialogElements();

    const overlay = document.getElementById("dialogOverlay");
    const dialogBox = document.getElementById("dialogBox");
    const portrait = document.getElementById("portrait");
    const nameTag = document.getElementById("name");
    const text = document.getElementById("text");
    const indicator = document.getElementById("indicator");
    const btn = document.getElementById("btnPersonagem1");

    if (overlay) overlay.classList.remove("show");
    if (dialogBox) dialogBox.classList.remove("show");
    if (portrait) portrait.classList.remove("show");
    if (indicator) indicator.style && (indicator.style.display = "none");

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
      try {
        if (!portrait) return;
        const rect = portrait.getBoundingClientRect();
        const offsetX = -110;
        const offsetY = -20;
        emoteDiv.innerHTML = emote;
        setTimeout(() => {
          const left = rect.left || 0;
          const width = rect.width || 0;
          const top = rect.top || 0;
          emoteDiv.style.left =
            left + width / 2 - (emoteDiv.offsetWidth || 0) / 2 + offsetX + "px";
          emoteDiv.style.top =
            top - (emoteDiv.offsetHeight || 0) + offsetY + "px";
          emoteDiv.style.opacity = 1;
          setTimeout(() => (emoteDiv.style.opacity = 0), duration);
        }, 10);
      } catch (e) {
        console.warn("showEmote falhou:", e);
      }
    }

    function getCenarioEFalas(personagem, cenarioPreferido) {
      try {
        if (!personagem) return null;

        const falasDisponiveis =
          personagem.falas && typeof personagem.falas === "object"
            ? Object.keys(personagem.falas)
            : [];

        let cenarioAtual = null;

        if (
          cenarioPreferido &&
          personagem.falas &&
          personagem.falas[cenarioPreferido]
        ) {
          cenarioAtual = cenarioPreferido;
        } else {
          const nomeKey = personagem.nome
            ? String(personagem.nome).toLowerCase()
            : null;
          const salvo = nomeKey ? window.gameData?.dialogos?.[nomeKey] : null;
          if (salvo && personagem.falas && personagem.falas[salvo]) {
            cenarioAtual = salvo;
          } else if (falasDisponiveis.length > 0) {
            cenarioAtual = falasDisponiveis[0];
          }
        }

        if (!cenarioAtual || !personagem.falas) return null;

        const falas = personagem.falas[cenarioAtual];
        if (!Array.isArray(falas) || falas.length === 0) return null;

        return { cenarioAtual, falasAtuais: falas };
      } catch (e) {
        console.warn("getCenarioEFalas erro:", e);
        return null;
      }
    }

    function abrirDialogo(personagem, aoTerminar = null, cenario = null) {
      try {
        // Se a trava manual estava ativa, a gente limpa ela agora
        if (window.dialogo && window.dialogo._manterOverlay) {
          window.dialogo._manterOverlay = false;
        }

        // Limpa opacidade forçada (caso estivesse travado)
        if (dialogBox) dialogBox.style.opacity = "";
        if (portrait) portrait.style.opacity = "";

        fimDialogoCallback = aoTerminar;

        if (intervaloTexto) clearInterval(intervaloTexto);
        atual = personagem;
        indiceFala = 0;
        nameTag && (nameTag.textContent = atual?.nome || "");
        if (text)
          text.style.fontFamily = atual?.fonte || "'Wild Words', sans-serif";

        const pacote = getCenarioEFalas(personagem, cenario);

        if (!pacote) {
          if (overlay) overlay.style.display = "flex";
          setTimeout(() => {
            overlay && overlay.classList && overlay.classList.add("show");
            dialogBox && dialogBox.classList && dialogBox.classList.add("show");
          }, 10);
          const fallbackText =
            typeof personagem?.texto === "string"
              ? personagem.texto
              : "(nada para dizer)";
          if (text) text.textContent = fallbackText;
          if (indicator) indicator.style && (indicator.style.display = "none");
          return;
        }

        const { cenarioAtual, falasAtuais } = pacote;
        const falaInicial = falasAtuais[0] || { texto: "(vazio)" };

        if (typeof falaInicial.executar === "function") {
          try {
            falaInicial.executar();
          } catch (e) {
            console.error("Erro no executar:", e);
          }
        }

        const expressaoInicial = atual?.expressoes?.[falaInicial.expressao];
        if (portrait) portrait.style.backgroundImage = expressaoInicial || "";

        if (personagem?.lado === "direita") {
          if (portrait) {
            portrait.style.left = "auto";
            portrait.style.right = "0";
            portrait.style.backgroundPosition = "bottom right";
            portrait.style.transform = "translateX(35%) scaleX(-1)";
          }
        } else {
          if (portrait) {
            portrait.style.left = "0";
            portrait.style.right = "auto";
            portrait.style.backgroundPosition = "bottom left";
            portrait.style.transform = "translateX(0%) scaleX(1)";
          }
        }

        if (overlay) overlay.style.display = "flex";
        setTimeout(() => {
          overlay && overlay.classList && overlay.classList.add("show");
          dialogBox && dialogBox.classList && dialogBox.classList.add("show");
          portrait && portrait.classList && portrait.classList.add("show");
        }, 10);

        if (indicator) indicator.style && (indicator.style.display = "none");
        try {
          if (personagem) {
            personagem.__falasAtuaisTemp = falasAtuais;
            personagem.__cenarioAtivoTemp = cenarioAtual;
          }
        } catch (e) {}
        digitarTexto(String(falaInicial.texto ?? "(vazio)"), falaInicial.emote);
      } catch (e) {
        console.error("abrirDialogo erro:", e);
      }
    }

    // Proteção: bloqueia cliques no overlay durante transições
    overlay &&
      overlay.addEventListener &&
      overlay.addEventListener(
        "pointerdown",
        (e) => {
          // Se a trava está ativa, bloqueia QUALQUER interação
          if (window.dialogo && window.dialogo._manterOverlay) {
            e.stopPropagation();
            e.preventDefault();
            return;
          }
        },
        true
      ); // 'true' = capture phase, pega antes de qualquer outro listener

    dialogBox &&
      dialogBox.addEventListener &&
      dialogBox.addEventListener("pointerdown", () => {
        try {
          // Se a trava está ativa, ignora cliques
          if (window.dialogo && window.dialogo._manterOverlay) return;

          if (!atual) return;

          const falasAtuais = atual.__falasAtuaisTemp || null;
          if (
            !falasAtuais ||
            !Array.isArray(falasAtuais) ||
            falasAtuais.length === 0
          ) {
            fecharDialogo();
            return;
          }

          if (typeof indiceFala !== "number" || indiceFala < 0) {
            fecharDialogo();
            return;
          }

          // 1. Se estiver digitando, completa o texto e para.
          if (digitando) {
            if (intervaloTexto) clearInterval(intervaloTexto);
            const current = falasAtuais[indiceFala];
            if (text) text.innerHTML = String(current?.texto ?? "(vazio)");
            digitando = false;
            if (indiceFala < falasAtuais.length - 1 && indicator)
              indicator.style && (indicator.style.display = "block");
            return;
          }

          // 2. Se já terminou de digitar, processa a saída da fala atual.
          let manterOverlayAtivo = false;
          const falaAtualParaSair = falasAtuais[indiceFala];

          if (
            falaAtualParaSair &&
            typeof falaAtualParaSair.aofechar === "function"
          ) {
            try {
              // Reseta a flag antes de executar o callback
              if (window.dialogo) window.dialogo._manterOverlay = false;

              const retorno = falaAtualParaSair.aofechar();

              // Verifica se o callback ativou _manterOverlay (ex: dialogo.agendar())
              // OU se retornou true OU se é uma Promise
              if (
                (window.dialogo && window.dialogo._manterOverlay) ||
                retorno === true ||
                (retorno && typeof retorno.then === "function")
              ) {
                manterOverlayAtivo = true;

                // Se for Promise, espera resolver e depois libera
                if (retorno && typeof retorno.then === "function") {
                  retorno
                    .then(() => {
                      // Só libera se ainda estiver travado por este callback
                      if (window.dialogo && window.dialogo._manterOverlay) {
                        window.dialogo._manterOverlay = false;
                      }
                    })
                    .catch((e) => {
                      console.error("Erro no aofechar async:", e);
                      if (window.dialogo) window.dialogo._manterOverlay = false;
                    });
                }
              }
            } catch (e) {
              console.error("Erro no aofechar:", e);
              if (window.dialogo) window.dialogo._manterOverlay = false;
            }
          }

          // 3. Verifica se tem próxima fala
          if (indiceFala < falasAtuais.length - 1) {
            indiceFala++;
            if (indicator)
              indicator.style && (indicator.style.display = "none");
            const novaFala = falasAtuais[indiceFala] || { texto: "(vazio)" };

            if (typeof novaFala.executar === "function") {
              try {
                novaFala.executar();
              } catch (e) {
                console.error("Erro no executar:", e);
              }
            }

            const novaExpressao = atual?.expressoes?.[novaFala.expressao];
            if (text)
              text.style.fontFamily =
                novaFala.fonte || atual?.fonte || "'Wild Words', sans-serif";

            if (novaExpressao && portrait) {
              portrait.style.backgroundImage = novaExpressao;
              if (!portrait.classList.contains("show")) {
                portrait.classList.add("show");
              }
            }

            digitarTexto(String(novaFala.texto ?? "(vazio)"), novaFala.emote);
          } else {
            // 4. FIM DO DIALOGO
            if (manterOverlayAtivo) {
              // Ativa a proteção manualmente e esconde a caixa visualmente
              window.dialogo.manterOverlay();
            } else {
              fecharDialogo();
            }
          }
        } catch (e) {
          console.error("dialogBox pointerdown handler erro:", e);
          try {
            fecharDialogo();
          } catch (er) {}
        }
      });

    // Parser simples para extrair texto visível e mapear posições para tags HTML
    function parseFormatacao(str) {
      // Tags suportadas: <b>, <strong>, <i>, <em>, <u>, <s>, <mark>, <span ...>
      const tagRegex = /<\/?(?:b|strong|i|em|u|s|mark|span)[^>]*>/gi;
      const resultado = [];
      let textoLimpo = "";
      let posicaoTexto = 0;
      let ultimoIndex = 0;
      let match;

      while ((match = tagRegex.exec(str)) !== null) {
        // Adiciona texto antes da tag
        const textoAntes = str.slice(ultimoIndex, match.index);
        textoLimpo += textoAntes;
        posicaoTexto += textoAntes.length;

        // Registra a tag na posição atual do texto visível
        resultado.push({ posicao: posicaoTexto, tag: match[0] });
        ultimoIndex = match.index + match[0].length;
      }

      // Adiciona texto restante
      textoLimpo += str.slice(ultimoIndex);

      return { textoLimpo, tags: resultado };
    }

    function construirHTMLAteIndice(textoLimpo, tags, indice) {
      let html = "";
      let tagIndex = 0;

      for (let i = 0; i <= indice && i < textoLimpo.length; i++) {
        // Insere todas as tags que devem aparecer nesta posição
        while (tagIndex < tags.length && tags[tagIndex].posicao === i) {
          html += tags[tagIndex].tag;
          tagIndex++;
        }
        html += escapeHTML(textoLimpo[i]);
      }

      // Insere tags que vêm após o último caractere (tags de fechamento no final)
      while (tagIndex < tags.length && tags[tagIndex].posicao <= indice + 1) {
        html += tags[tagIndex].tag;
        tagIndex++;
      }

      return html;
    }

    function escapeHTML(char) {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return map[char] || char;
    }

    function digitarTexto(str, emote = null) {
      try {
        if (intervaloTexto) clearInterval(intervaloTexto);
        digitando = true;
        if (indicator) indicator.style && (indicator.style.display = "none");
        if (text) text.innerHTML = "";
        if (emote) showEmote(emote, 1500);
        if (typeof str !== "string") {
          if (text) text.innerHTML = String(str ?? "(vazio)");
          digitando = false;
          if (indicator) indicator.style && (indicator.style.display = "block");
          return;
        }

        // Parse do texto para suportar formatação HTML
        const { textoLimpo, tags } = parseFormatacao(str);

        let i = 0;
        if (textoLimpo.length === 0) {
          if (text) text.innerHTML = "";
          digitando = false;
          if (indicator) indicator.style && (indicator.style.display = "block");
          return;
        }
        intervaloTexto = setInterval(() => {
          try {
            if (i >= textoLimpo.length) {
              clearInterval(intervaloTexto);
              intervaloTexto = null;
              digitando = false;
              if (indicator)
                indicator.style && (indicator.style.display = "block");
              return;
            }
            // Reconstrói o HTML até o índice atual
            if (text)
              text.innerHTML = construirHTMLAteIndice(textoLimpo, tags, i);
            i++;
            if (i >= textoLimpo.length) {
              clearInterval(intervaloTexto);
              intervaloTexto = null;
              digitando = false;
              if (indicator)
                indicator.style && (indicator.style.display = "block");
            }
          } catch (e) {
            console.warn("digitarTexto inner erro:", e);
            clearInterval(intervaloTexto);
            intervaloTexto = null;
            digitando = false;
            if (indicator)
              indicator.style && (indicator.style.display = "block");
          }
        }, 35);
      } catch (e) {
        console.error("digitarTexto erro:", e);
        digitando = false;
        if (indicator) indicator.style && (indicator.style.display = "block");
      }
    }

    function fecharDialogo() {
      try {
        if (fechandoDialogo) return;

        // --- TRAVA DE SEGURANÇA ---
        if (window.dialogo && window.dialogo._manterOverlay) {
          // Força opacidade zero para sumir visualmente, mas o overlay fica
          if (dialogBox) {
            dialogBox.classList.remove("show");
            dialogBox.style.opacity = "0";
          }
          if (portrait) {
            portrait.classList.remove("show");
            portrait.style.opacity = "0";
          }

          digitando = false;
          if (intervaloTexto) clearInterval(intervaloTexto);
          return; // <--- Interrompe aqui.
        }
        // --------------------------

        fechandoDialogo = true;
        if (intervaloTexto) clearInterval(intervaloTexto);

        // Remove classes visuais
        overlay && overlay.classList && overlay.classList.remove("show");
        dialogBox && dialogBox.classList && dialogBox.classList.remove("show");
        portrait && portrait.classList && portrait.classList.remove("show");

        setTimeout(() => {
          try {
            overlay && (overlay.style.display = "none");
            fechandoDialogo = false;

            // Limpezas de variáveis
            if (atual) {
              try {
                delete atual.__falasAtuaisTemp;
                delete atual.__cenarioAtivoTemp;
              } catch (e) {}
            }
            if (fimDialogoCallback) {
              try {
                fimDialogoCallback();
              } catch (e) {
                console.warn("fimDialogoCallback erro:", e);
              }
            }
            fimDialogoCallback = null;
          } catch (e) {
            console.warn("fecharDialogo timeout erro:", e);
          }
        }, 400);

        atual = null;
        indiceFala = 0;
        digitando = false;
        if (text) text.textContent = "";
        if (indicator) indicator.style && (indicator.style.display = "none");
      } catch (e) {
        console.error("fecharDialogo erro:", e);
      }
    }

    window.mudarCenario = function (personagem, novoCenario) {
      try {
        if (!window.gameData) window.gameData = {};
        if (!window.gameData.dialogos) window.gameData.dialogos = {};
        if (!personagem || !personagem.nome) return;
        window.gameData.dialogos[personagem.nome.toLowerCase()] = novoCenario;
        if (window.salvarJogo) {
          try {
            window.salvarJogo();
          } catch (e) {
            console.warn("salvarJogo erro:", e);
          }
        }
        console.log(
          `📖 ${personagem.nome} agora está no cenário: ${novoCenario}`
        );
      } catch (e) {
        console.warn("mudarCenario erro:", e);
      }
    };

    // --- OBJETO DIALOGO ATUALIZADO ---
    window.dialogo = {
      abrir: abrirDialogo,
      fechar: fecharDialogo,

      // Ativa trava manual
      manterOverlay: function () {
        this._manterOverlay = true;
        // Esconde visualmente na hora
        const db = document.getElementById("dialogBox");
        const pt = document.getElementById("portrait");
        if (db) {
          db.classList.remove("show");
          db.style.opacity = "0";
        }
        if (pt) {
          pt.classList.remove("show");
          pt.style.opacity = "0";
        }

        if (intervaloTexto) clearInterval(intervaloTexto);
        digitando = false;
      },

      // Destrava tudo e fecha
      liberar: function () {
        this._manterOverlay = false;
        const db = document.getElementById("dialogBox");
        const pt = document.getElementById("portrait");
        if (db) db.style.opacity = "";
        if (pt) pt.style.opacity = "";
        fecharDialogo();
      },

      // Agendar atualizado para usar a lógica nova
      agendar: function (personagem, cenario, tempoMs = 1000) {
        this.manterOverlay(); // Trava

        setTimeout(() => {
          // Quando o tempo acaba, destrava (internamente) e abre o próximo
          this._manterOverlay = false;
          const db = document.getElementById("dialogBox");
          const pt = document.getElementById("portrait");
          if (db) db.style.opacity = "";
          if (pt) pt.style.opacity = "";

          abrirDialogo(personagem, null, cenario);
        }, tempoMs);
      },

      abrirAsync(personagem, cenario = null, delayAposMs = 0) {
        return new Promise((resolve) => {
          abrirDialogo(
            personagem,
            () => {
              // Proteção: trava overlay durante transição async
              this._manterOverlay = true;
              const db = document.getElementById("dialogBox");
              const pt = document.getElementById("portrait");
              const ov = document.getElementById("dialogOverlay");
              if (db) {
                db.classList.remove("show");
                db.style.opacity = "0";
              }
              if (pt) {
                pt.classList.remove("show");
                pt.style.opacity = "0";
              }
              // Mantém overlay visível mas transparente para bloquear cliques
              if (ov) {
                ov.style.display = "flex";
                ov.style.background = "transparent";
              }

              const liberarEResolver = () => {
                this._manterOverlay = false;
                if (db) db.style.opacity = "";
                if (pt) pt.style.opacity = "";
                if (ov) {
                  ov.style.background = "";
                  ov.style.display = "none"; // ESCONDE O OVERLAY COMPLETAMENTE
                  ov.classList.remove("show");
                }
                resolve();
              };

              if (delayAposMs > 0) {
                setTimeout(liberarEResolver, delayAposMs);
              } else {
                // Pequeno delay para garantir que cliques rápidos não passem
                setTimeout(liberarEResolver, 50);
              }
            },
            cenario
          );
        });
      },

      // Versão protegida do esperar para cutscenes
      esperarProtegido(ms) {
        return new Promise((resolve) => {
          this._manterOverlay = true;
          const ov = document.getElementById("dialogOverlay");
          if (ov) {
            ov.style.display = "flex";
            ov.style.background = "transparent";
          }

          setTimeout(() => {
            this._manterOverlay = false;
            if (ov) ov.style.background = "";
            resolve();
          }, ms);
        });
      },
    };

    try {
      if (btn)
        btn.addEventListener("pointerdown", () =>
          abrirDialogo(personagens?.aiko)
        );
    } catch (e) {
      console.warn("btn listener erro:", e);
    }
  } catch (e) {
    console.error("dialogo.init erro:", e);
  }
}

window.esperar = (ms) => new Promise((r) => setTimeout(r, ms));

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  Promise.resolve().then(init);
}
