window.personagens = {
  
  marin: {
    nome: "Marin",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Marin1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Marin2.png')"
    },
    falas: {
      inicio: [
        { texto: "I came here with my wife and my sextuplets but  they all ended up getting lost in the city. I don't know from where to start the search for them..", expressao: "normal" },
        { texto: "They're all good hunters and know how to hide their presence, maybe if you find them in their own play, they will agree to back here and behave.", expressao: "pensativo" }
      ],
      kofongo: [
        { texto: "Kofongo is a mischievous girl who have lots of energy. For sure she found a fun place to play and went to there.", expressao: "pensativo" },
      ],
      pollux: [
        { texto: "Pollux is a lonely child who always is searching big preys and is the strongest of his siblings. I am sure my wife is missing his presence already.", expressao: "pensativo" },
      ],
      sirius: [
        { texto: "Sirius spend lots of time reading his books and he is not so good at hunting but he is very smart.", expressao: "pensativo" },
      ],
      aldebaran: [
        { texto: "Alde is very shy and usually don't talk at all, but he always is a good child.", expressao: "pensativo" },
      ],
      rigel: [
        { texto: "Rigel is a quirky child who can be a rebel sometimes--He still is getting used to his powers.", expressao: "pensativo" },
      ],
      capella: [
        { texto: "Capra is always seen with kofongo but sometimes he can't resist the smell of a good treat.", expressao: "normal" },
      ],
      final: [
        { texto: "", expressao: "pensativo"},
      ],
    }
  },

felicia: {
    nome: "Felicia",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Felicia1.png')",
      seria: "url('/assets/img/NPC_portrait-Felicia2.png')"
    },
    falas: {
      inicio: [
        { texto: "Estou sentindo uma presença inquieta nesse lugar...", expressao: "normal" },
      
      ],
      estatua: [
        { texto: "", expressao: "normal" },
        { texto: "", expressao: "pensativo" }
      ]
    }
  },
lily: {
    nome: "Lily",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Lily.png')",
      
    },
    falas: {
      inicio: [
        { texto: "Não consigo plantar nada nesse frio. Estranhamente essa é a unica parte quentinha da cidade. Apesar disso ninguém se aproxima dela.", expressao: "normal" },
        { texto: "Alguma coisa estranha está acontecendo nessa caverna, se eu pudesse ter essa fonte de calor, conseguiria plantar algo e aumentar a vida nessa cidade.", expressao: "normal" }
      ],
      depoisDoTreinamento: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },
  cat: {
    nome: "Cat",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_Cat.png')",
    },
    falas: {
      inicio: [
        { texto: "Miau myah myu nyah nyeh?", expressao: "normal" },
      ],
      depoisDoTreinamento: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

  day25: {
      nome: "Day25",
      lado: "esquerda",
      fonte: "'Wild Words', sans-serif",
      expressoes: {
        normal: "url('/assets/img/NPC_portrait-Day-25.png')",
        pensativo: "url('/assets/img/NPC_Marin.png')"
      },
      falas: {
        inicio: [
          { texto: "Eu estou sempre preso no dia 25, já vivi o dia de hoje ínumeras vezes, sei de tudo que já aconteceu (acontecerá)", expressao: "normal" },
          { texto: "E olha... você foi incrível! Me emocionei no final.", expressao: "normal" },
          { texto: "Pera. Você não vai desistir do jogo na metade né? né???", expressao: "normal" }
        ],
        depoisDoTreinamento: [
          { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
          { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
        ]
      }
    },

  forest: {
    nome: "Pine Forest",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Pine-forest.png')",
    },
    falas: {
      inicial: [
        { texto: "Essa cidade é bem populosa, com centenas de moradores. Mas está tão frio que a maioria não sai mais de casa.", expressao: "normal" },
        { texto: "Até os postes de fogo não se aguentam mais acesos, qualquer fogo normal apaga no primeiro vento.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Está tão quentinho! Como você conseguiu acender os postes? ", expressao: "normal" },

        
        { texto: "Day-25 é meu melhor amigo, eu sei da situação dele, então eu me esforço para todo dia falar algo diferente.", expressao: "normal" },
        //code aqui//
      ]
    }
  },
ballerina: {
    nome: "Ballerina",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Ballerina.png')",
      pensativo: "url('/assets/img/NPC_Marin.png')"
    },
    falas: {
      inicio: [
        { texto: "No gelo eu consigo expressar 100% da minha dança", expressao: "normal" },
      ],
      depoisDoTreinamento: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

mint: {
    nome: "Mint",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Mint.png')",
    },
    falas: {
      inicio: [
        { texto: "Todos ficam reclamando sobre o quão está frio. Já eu saio de casa todos os dias, eu não sinto nada mesmo.", expressao: "normal" },
      ],
      depoisDoTreinamento: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        
      ]
    }
  },


// ------------ TEMPLO -------------//

aiko: {
    nome:"aiko",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Leader1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Leader2.png')"
    },
    falas: {
      inicio: [
        { texto: "Hmm... será que devo confiar nela?", expressao: "pensativo" },
        { texto: "Bom, não tenho muita escolha agora.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

  nana: {
    nome:"Gwenan",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Nan1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Nan2.png.png')"
    },
    falas: {
      inicio: [
        { texto: "Hmm... será que devo confiar nela?", expressao: "normal" },
        { texto: "Bom, não tenho muita escolha agora.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

  nodata: {
    nome:"     ",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Nodata1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Nodata2.png')"
    },
    falas: {
      inicio: [
        { texto: "Hmm... será que devo confiar nela?", expressao: "pensativo" },
        { texto: "Bom, não tenho muita escolha agora.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },


// ------------ BAR -------------//

barman: {
    nome:"Barman",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Barman.png')",
    },
    falas: {
      inicio: [
        { texto: "Hmm... será que devo confiar nela?", expressao: "normal" },
        { texto: "Bom, não tenho muita escolha agora.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

assistant: {
    nome:"Waiter",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Assistent.png')",
    },
    falas: {
      inicio: [
        { texto: "Hmm... será que devo confiar nela?", expressao: "normal" },
        { texto: "Bom, não tenho muita escolha agora.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

maid: {
    nome:"Red Snapper Maid",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/7-06.png')",
    },
    falas: {
      inicio: [
        { texto: "Como está lotado hoje!!!", expressao: "normal" },
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

  felicia2: {
    nome:"Felicia",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Felicia1.png')",
      sorrindo: "url('/assets/img/NPC_portrait-Felicia2.png')",
    },
    falas: {
      inicio: [
        { texto: "Esse vento frio todo me deu calor. Chefe!!! desce um sorvete trincando!", expressao: "sorrindo" },
        { texto: "", expressao: "sorrindo" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

  cobra5: {
    nome:"Capella",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        { texto: "Couldn't resist the sweet scent of the food here! Everything seems so yummy!♥"},
      ],
    }
  },



// ------------ MARKET -------------//

wayway: {
    nome:"Wayway",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Wayway1.png')",
      furioso: "url('/assets/img/NPC_portrait-Wayway2.png')"
    },
    falas: {
      inicio: [
        { texto: "Seja Bem-vindo! Estamos nos estabelecendo para as festas de final de ano. Nós trouxemos mercadorias que podem ajudar a população nesse frio intenso. Mas nossa... quando falaram que era frio, foram bonzinhos.", expressao: "normal" },
        { texto: "Ainda estamos arrumando tudo, então se precisar de alguma coisa pode falar comigo.", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

myopic: {
    nome:"Myopic",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Myopic1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Myopic2.png')"
    },
    falas: {
      inicio: [
        { texto: "Ahhh! Estamos abrindo a loja, mas as melhores mercadorias estão nessa baú protegido com um cadeado de runas!!!", expressao: "normal" },
        { texto: "Pra piorar as coisas, eu deixei meus óculos cairem dentro do baú e fechei o cadeado, agora não enxergo mais nada!", expressao: "normal" },
        { texto: "Eu tenho certeza que eu anotei a senha no computador da loja, mas por mais que eu olhe não enxergo nada!!!", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  },

  wendigo: {
    nome:"Wendigo Warrior",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Warrior.png')",
      
    },
    falas: {
      inicio: [
        { texto: "Ahhh! Estamos abrindo a loja, mas as melhores mercadorias estão nessa baú protegido com um cadeado de runas!!!", expressao: "normal" },
        { texto: "Pra piorar as coisas, eu deixei meus óculos cairem dentro do baú e fechei o cadeado, agora não enxergo mais nada!", expressao: "normal" },
        { texto: "Eu tenho certeza que eu anotei a senha no computador da loja, mas por mais que eu olhe não enxergo nada!!!", expressao: "normal" }
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        { texto: "Mas ainda tenho um longo caminho pela frente.", expressao: "pensativo" }
      ]
    }
  }

};

//city//
// O símbolo '?' abaixo faz o código ignorar o elemento se ele não existir na página atual.
document.getElementById("marin")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.marin);
});
document.getElementById("felicia")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.felicia);
});
document.getElementById("lily")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.lily);
});
document.getElementById("day25")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.day25);
});
document.getElementById("cat")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cat);
});
document.getElementById("ballerina")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.ballerina);
});
document.getElementById("forest")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.forest);
});
document.getElementById("mint")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.mint);
});

//market//

document.getElementById("wayway")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.wayway);
});

document.getElementById("myopic")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.myopic);
});

// bar //

document.getElementById("barman")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.barman);
});

document.getElementById("assistant")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.assistant);
});

document.getElementById("maid")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.maid);
});

document.getElementById("felicia2")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.felicia2);
});

document.getElementById("cobra5")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra5);
});

// templo //

document.getElementById("nana")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.nana);
});

document.getElementById("nodata")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.nodata);
});

document.getElementById("leader")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.aiko);
});

//cave //

document.getElementById("wendigo")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.wendigo);
});