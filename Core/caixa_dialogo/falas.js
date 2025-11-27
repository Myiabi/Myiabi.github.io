//------------------CITY-------------//

window.personagens = {

  aiko: {
    nome: "Aiko",
    lado: "direita",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      neutra: "url('/assets/img/NPC_Warrior-guard.png')",
      sorrindo: "url('/assets/img/npc-cientist2.png')",
      triste: "url('/assets/img/npc-cientist.png')"
    },
    falas: {
      introducao: [
        { texto: "Ah, veja ali na minha mesa...", expressao: "neutra" },
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
    lado: "direita",
    fonte: "'Courier New', monospace",
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

// ------------ TEMPLO -------------//


// ------------ BAR -------------//


// ------------ MARKET -------------//



