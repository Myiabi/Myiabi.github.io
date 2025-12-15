window.personagens = {
  marin: {
    nome: "Marin",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('./assets/img/NPC_portrait-Marin1.png')",
      pensativo: "url('./assets/img/NPC_portrait-Marin2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "I came here with my wife and my sextuplets but  they all ended up getting lost in the city. I don't know from where to start the search for them..",
          expressao: "normal",
        },
        {
          texto:
            "They're all good hunters and know how to hide their presence, maybe if you find them in their own play, they will agree to back here and behave.",
          expressao: "pensativo",
        },
      ],
      kofongo: [
        {
          texto:
            "Kofongo is a mischievous girl who have lots of energy. For sure she found a fun place to play and went to there.",
          expressao: "pensativo",
        },
      ],
      pollux: [
        {
          texto:
            "Pollux is a lonely child who always is searching big preys and is the strongest of his siblings. I am sure my wife is missing his presence already.",
          expressao: "pensativo",
        },
      ],
      sirius: [
        {
          texto:
            "Sirius spend lots of time reading his books and he is not so good at hunting but he is very smart.",
          expressao: "pensativo",
        },
      ],
      aldebaran: [
        {
          texto:
            "Alde is very shy and usually don't talk at all, but he always is a good child.",
          expressao: "pensativo",
        },
      ],
      rigel: [
        {
          texto:
            "Rigel is a quirky child who can be a rebel sometimes--He still is getting used to his powers.",
          expressao: "pensativo",
        },
      ],
      capella: [
        {
          texto:
            "Capra is always seen with kofongo but sometimes he can't resist the smell of a good treat.",
          expressao: "normal",
        },
      ],
      final: [{ texto: "", expressao: "pensativo" }],
    },
  },

  felicia: {
    nome: "Felicia",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Felicia1.png')",
      seria: "url('/assets/img/NPC_portrait-Felicia2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Estou sentindo uma presença inquieta nesse lugar... Será um dos espiritos guardiões?",
          expressao: "normal",
        },
        {
          texto:
            "Você também está procurando por eles? Eu não consigo enxerga-lo... Se eu pelo menos tivesse a benção do templo. Você parece não possuir o poder ainda.",
          expressao: "normal",
          executar: function () {
            mudarCenario(personagens.aiko, "segunda");
          },
        },
      ],
      estatua: [
        {
          texto:
            "Sim, eu estava certa. É o guardião da Lua que estava desaparecido. Mas ele está descontrolado, ele sente a presença de alguém???",
          expressao: "normal",
        },
        {
          texto: "Temos que acalma-lo! Você parece está preparado para isso.",
          expressao: "pensativo",
        },
        {
          texto:
            "[Foque a 'Lupa' no guardião da Lua invisível para impedir que ele cresça, se ele crescer ao máximo você perderá. Aguente o tempo suficiente para acalma-lo.]",
          aofechar: function () {
            ConfirmModal.ask("Quer enfrentar o Guardião da Lua?", () => {
              window.location.href = "/cenarios/snow/index.html";
              console.log("O usuário aceitou!");
            });
          },
        },
      ],

      luaWon: [
        {
          texto: "Você conseguiu! Ele parece tão calmo agora... ",
          expressao: "normal",
        },
      ],
    },
  },

  cobra3: {
    nome: "Sirius",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto:
            "Didn't thought here was so cold. I should had trusted on my books",
          aofechar: function () {
            gameData.visualState.siriusVisivel = true;
            mudarCenario(personagens.marin, "sirius");
            tocarEfeito("swoosh");
          },
        },
      ],
    },
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
        {
          texto:
            "Não consigo plantar nada nesse frio. Estranhamente essa é a unica parte quentinha da cidade. Apesar disso ninguém se aproxima dela.",
          expressao: "normal",
        },
        {
          texto:
            "Alguma coisa estranha está acontecendo nessa caverna, se eu pudesse ter essa fonte de calor, conseguiria plantar algo e aumentar a vida nessa cidade.",
          expressao: "normal",
        },
      ],
      jardim: [
        {
          texto:
            "Vejo que conseguiu resgatar esse amiguinho, então era ele a fonte de calor. Agora eu posso usar meus poderes e abrir meu jardim secreto aqui na cidade! Você quer vê-lo?",
          expressao: "normal",
        },

        {
          texto:
            "Erm... eu sei que você já me ajudou o bastante, mas meu jardim está uma bagunça, preciso que você localize alguns itens para mim",
          expressao: "normal",
        },
        {
          texto:
            "[Localize os itens em destaque no jardim, pressione em cima de onde você acha que ele está. Colete todos para vencer.]",
          aofechar: function () {
            ConfirmModal.ask("Ir para o Jardim?", () => {
              // Em vez de mudar de site, chamamos a função que abre o modal
              openGame();
              console.log("O usuário aceitou e o modal abriu!");
            });
          },
          expressao: "normal",
        },
      ],
      final: [
        {
          texto:
            "Hihihi agora posso limpar meu jardim. Você pode ficar com esse pote de mel [Jelly] como agradecimento.",
          expressao: "normal",
        },

        {
          texto:
            "Estou feliz! Se esse frio passar vou encher essa cidade de flores! :3",
          expressao: "normal",
          aofechar: function () {},
        },
      ],
    },
  },
  cat: {
    nome: "Cat",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_Cat.png')",
    },
    falas: {
      inicio: [{ texto: "Miau myah myu nyah nyeh?", expressao: "normal" }],
      segunda: [
        { texto: "Você consegue me entender agora? Myau", expressao: "normal" },
        {
          texto:
            "Eu sou um eximio pescador dessa cidade, o problema que ficou tão frio que a superficie do lago congelou, não conseguimos fazer um buraco sequer",
          expressao: "normal",
        },
        {
          texto: "Tantos dias sem pegar um único peixe, estou com tanta fome",
          expressao: "normal",
        },
      ],
      terceira: [
        {
          texto:
            "O buraco de pesca está aberto! Como conseguiu? Agora posso voltar pensar e vender peixes! Como também matar minha fome.",
          expressao: "normal",
        },
        {
          texto:
            "Como agradecimento você pode usar a vara que está ali do lado. Boa sorte pescando.",
          expressao: "normal",
        },
        {
          texto: "[Clique 2x na caixa azul para iniciar a pescaria]",
          expressao: "normal",
          aofechar: function () {
            gameData.visualState.varaON = true;
          },
        },
      ],
      lendario: [
        {
          texto:
            "OMG! Você pegou o lendário do lago. Eu posso... come-lo? [Muita fome]",
          expressao: "normal",
        },
        {
          texto: "Muito obrigado Nya!",
          expressao: "normal",
          aofechar: function () {
            gameData.cat = true; // Libera achievement de alimentar o gato
          },
        },
      ],
    },
  },

  day25: {
    nome: "Day25",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Day-25.png')",
      pensativo: "url('/assets/img/NPC_Marin.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Eu estou sempre preso no dia 25, já vivi o dia de hoje ínumeras vezes, sei de tudo que já aconteceu (acontecerá)",
          expressao: "normal",
        },
        {
          texto: "E olha... você foi incrível! Me emocionei no final.",
          expressao: "normal",
        },
        {
          texto: "Pera. Você não vai desistir do jogo na metade né? né???",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "'Ele' está vindo... você está preparado?",
          expressao: "normal",
        },
      ],
      amigo: [
        {
          texto: "(Ele sempre fala a mesma coisa, mas agradeço o esforço)",
          expressao: "normal",
        },
      ],
    },
  },

  pine: {
    nome: "Pine Forest",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Pine-forest.png')",
    },
    falas: {
      inicial: [
        {
          texto:
            "Essa cidade é bem populosa, com centenas de moradores. Mas está tão frio que a maioria não sai mais de casa.",
          expressao: "normal",
        },
        {
          texto:
            "Até os postes de fogo não se aguentam mais acesos, qualquer fogo normal apaga no primeiro vento.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "Está tão quentinho! Como você conseguiu acender os postes? ",
          expressao: "normal",
        },

        {
          texto:
            "Ah! Day-25 é meu melhor amigo, eu sei da situação dele, então eu me esforço para todo dia falar algo diferente.",
          expressao: "normal",
          aofechar: function () {
            dialogo.agendar(personagens.day25, "amigo", 300);
          },
        },
        //code aqui//
      ],
    },
  },
  ballerina: {
    nome: "Ballerina",
    lado: "esquerda",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Ballerina.png')",
      pensativo: "url('/assets/img/NPC_Marin.png')",
    },
    falas: {
      inicio: [
        {
          texto: "No gelo eu consigo expressar 100% da minha dança",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto:
            "O calor também não é tão ruim assim. Você quer patinar também?",
          expressao: "normal",
        },
      ],
    },
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
        {
          texto:
            "Fui revelado! Mas... Não era como que eu estivesse me escondendo.",
          expressao: "normal",
        },
        { texto: "Eu juro", expressao: "normal" },
      ],
      revelado: [
        {
          texto:
            "Todos ficam reclamando sobre o quão está frio. Já eu saio de casa todos os dias, eu não sinto nada mesmo.",
          expressao: "normal",
        },
      ],
    },
  },

  // ------------ TEMPLO -------------//

  aiko: {
    nome: "aiko",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Leader1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Leader2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Você pode se sentir a vontade pra dar uma volta e conhecer a cidade. Se precisar de alguma coisa, estarei aqui no templo. Deixe-me saber se descobrir alguma pista dos Guardiões.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "Você encontrou alguma pista sobre um dos espiritos!?",
          expressao: "normal",
        },
        {
          texto:
            "Você vai precisar de alguma proteção para conseguir acalma-los. A benção do templo seria perfeita, mas infelizmente, eu como sacerdote, não possuo esse habilidade. Sinto muito.",
          expressao: "pensativo",
        },
        {
          texto:
            "Mas havia uma forma de conseguir a benção do templo... Orando para as estatuas das sacerdotizas antigas. Porém, elas só funcionam se estiverem na ordem correta.",
          expressao: "pensativo",
        },
        {
          texto:
            "Mas quando realizamos uma limpeza no templo acabamos mudando elas de lugar e agora não sabemos a ordem certa! Tem um bilhete deixado pelo sacerdote antigo perto das estátuas, se quiser tentar resolver fique a vontade.",
          expressao: "pensativo",
          aofechar: function () {
            gameData.visualState.estatuasON = true;
          },
        },
      ],

      estatuaWon: [
        {
          texto: "Vejo que conseguiu a benção das sacerdotizas! Incrivel!",
          expressao: "normal",
        },
        {
          texto:
            "Agora você conseguirá enfrentar batalhas mais dificeis, por tempo limitado, mas é o suficiente.",
          expressao: "normal",
          executar: function () {
            mudarCenario(personagens.felicia, "estatua");
          },
        },
        {
          texto:
            "Como também os moradores da cidade poderão voltar a rezar para os guardiões. Eu queria que eles tivessem mantido a fé mesmo perante a crise, mas agora podemos ter esperança.",
          expressao: "normal",
        },
      ],

      luaMenu: [
        {
          texto: "YAY!",
          expressao: "normal",
        },
      ],

      intro: [
        {
          texto:
            "Seja bem-vindo! Que bom que você veio. A viagem foi muito cansativa? Bem, sinto muito a nossa pressa, mas esse problema precisa ser resolvido urgentemente.",
          expressao: "normal",
        },
        {
          texto:
            "Você deve ter ouvido que essa era uma cidade muito agradável de se estar... mas como pode perceber estamos numa friagem épica. E é por isso que solicitamos sua ajuda.",
          expressao: "normal",
        },
        {
          texto:
            "Em nossa companhia temos duas presenças ilustres, elas estão preocupadas com a situação. Elas podem explicar o que vem acontecendo. Mas por favor, cuidado com a forma como se dirige a elas! São duas Rainhas!.",
          expressao: "normal",
        },
      ],
      intro2: [
        {
          texto:
            "Os dois guardiões que protegiam essa cidade... eles moravam aqui no templo. Mas nos últimos dias eles ficaram muito inquietos... Até que um dia eles sumiram.",
          expressao: "normal",
        },
        {
          texto:
            "O poder deles era essencial. Basicamente a criação dessa cidade se deve a eles. O que será que eles sentiram?",
          expressao: "normal",
        },
      ],
      intro3: [
        {
          texto:
            "Naturalmente, você será recompensado. Mas por favor... proteja as vidas dessa cidade",
          expressao: "normal",
        },
        {
          texto: "Você já pode começar sua investigação.",
          expressao: "normal",
        },
      ],
    },
  },

  nana: {
    nome: "Gwenan",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Nan1.png')",
      sorrindo: "url('/assets/img/NPC_portrait-Nan2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Visite a loja do Wayway perto do templo. Ele é muito prestativo. Se precisar alguma coisa com certeza ele terá.",
          expressao: "sorrindo",
        },
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        {
          texto: "Mas ainda tenho um longo caminho pela frente.",
          expressao: "pensativo",
        },
      ],
      intro: [
        {
          texto:
            "Não tem necessidade de ser tão formal, por favor. Afinal, nós que estamos em dívida pela sua visita.",
          expressao: "sorrindo",
        },
      ],
      intro2: [
        {
          texto:
            "Precisamos encontrar eles! Ou até o fim da noite, todos nessa cidade irão congelar!",
          expressao: "normal",
        },
        {
          texto:
            "Esse é o real motivo que nós duas viemos aqui, vamos tentar adiar ao máximo o congelamento até você encontrar os guardiões.",
          expressao: "normal",
        },
      ],
    },
  },

  nodata: {
    nome: "No data",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Nodata1.png')",
      sorrindo: "url('/assets/img/NPC_portrait-Nodata2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Se vir meu marido e minhas crianças por aí, dê um Oi. Eles são díficeis mas são interessantes.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto:
            "Impressionante. Apesar de serem apenas crianças, eles tem um talento precoce, e você conseguiu localiza-los tão rápido.",
          expressao: "normal",
        },
        {
          texto: "Aqui, você pode ficar com isso como reconhecimento.",
          expressao: "normal",
          aofechar: function () {
            /* gameData.visualState.rigelVisivel = true;
              mudarCenario(personagens.marin, 'rigel');
              tocarEfeito("swoosh") */
          },
        },
      ],
      intro: [
        { texto: "Concordo. Mas vamos direto ao ponto.", expressao: "normal" },
        {
          texto:
            "Essa cidade vai colapsar. Sendo mais especifica, ela está congelando.",
          expressao: "normal",
        },
      ],
      intro2: [
        { texto: "Então é isso. Contamos com você", expressao: "normal" },
        {
          texto: "Estaremos aqui se precisar saber alguma coisa.",
          expressao: "normal",
        },
      ],
    },
  },

  cobra2: {
    nome: "Rigel",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto:
            "That's such an impressive artifact. Even my skills couldn't go against it.",
          aofechar: function () {
            gameData.visualState.rigelVisivel = true;
            mudarCenario(personagens.marin, "rigel");
            tocarEfeito("swoosh");
          },
        },
      ],
    },
  },

  // ------------ BAR -------------//

  barman: {
    nome: "Barman",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Barman.png')",
    },
    falas: {
      primeira: [
        { texto: "Quer um drink?", expressao: "normal" },
        {
          texto:
            "Nos últimos dias estavamos com baixa movimentação. Criamos um ambiente com clima agradável e comidas quentes para conseguir tirar as pessoas de casa. Você pode ficar por aqui o tempo que desejar.",
          expressao: "normal",
        },
      ],
      sus: [{ texto: "...", expressao: "normal" }],
      final: [
        {
          texto:
            "Eu vi que você ajudou hoje no bar. Poucos sabem, mas o calor que emana das pessoas também aquece a cidade.",
          expressao: "normal",
        },
        {
          texto:
            "Espero que isso ajuda no que estar por vir. Boa sorte. [Ele te serve um drink que ao tomar você se sente aquecido]",
          expressao: "normal",
        },
      ],
    },
  },

  assistant: {
    nome: "Waiter",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Assistent.png')",
    },
    falas: {
      inicio: [
        { texto: "E agora. O que eu faço...? ", expressao: "normal" },
        {
          texto:
            "Tem tanta gente hoje que misturei todas as comandas, não sei quem pediu o que! Se o chefe descobrir estarei frito.",
          expressao: "normal",
        },
        {
          texto:
            "Que tal prestar atenção nos clientes e descobrir quem pediu cada prato?",
          expressao: "normal",
        },
        {
          texto:
            "[Observe os clientes para descobrir o que cada um pediu. Clique na mesa para iniciar e arraste as comidas certas para cada cliente.]",
          aofechar: function () {
            gameData.visualState.mesasON = true;
            dialogo.agendar(personagens.barman, "sus", 300);
          },
        },
      ],
      segunda: [
        {
          texto:
            "Ufa!!! Você é muito bom nisso! Não deixe o chefe descobrir que você me ajudou hein.",
          expressao: "normal",
          aofechar: function () {
            gameData.visualState.mesasON = true;
            dialogo.agendar(personagens.maid, "finish", 300);
          },
        },
      ],
    },
  },

  maid: {
    nome: "Red Snapper Maid",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/7-06-half.png')",
    },
    falas: {
      inicio: [{ texto: "Como está lotado hoje!!!", expressao: "normal" }],

      finish: [
        {
          texto: "Hey! Você acabou de fazer o meu trabalho?",
          expressao: "normal",
        },
      ],
      presilha: [
        { texto: "Você pescou uma presilha no lago?", expressao: "normal" },
        {
          texto:
            "Na verdade... eu moro lá Com muitos outros peixes, provavelmente essa presilha é de algum deles. Se você quiser eu te dou permissão para entrar",
          expressao: "normal",
        },
        {
          texto: "[Tente mergulhar no buraco de pesca (!?)]",
          expressao: "normal",
          executar: function () {
            gameData.visualState.presilha = true;
          },
        },
      ],
      final: [
        {
          texto: "Nós sereias somos dropzillas que não foram vendidos...",
          expressao: "normal",
        },
        {
          texto:
            "Oh! Não estou reclamando nem triste. Nós vivemos felizes e fala sério, tive a oportunidade de aparecer num jogo, sou famosa!",
          expressao: "normal",
        },
      ],
    },
  },

  felicia2: {
    nome: "Felicia",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Felicia1.png')",
      sorrindo: "url('/assets/img/NPC_portrait-Felicia2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Esse vento frio todo me deu calor. Chefe!!! desce um sorvete trincando!",
          expressao: "sorrindo",
        },
        { texto: "", expressao: "sorrindo" },
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        {
          texto: "Mas ainda tenho um longo caminho pela frente.",
          expressao: "pensativo",
        },
      ],
    },
  },

  cobra5: {
    nome: "Capella",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto:
            "Couldn't resist the sweet scent of the food here! Everything seems so yummy!♥",
          aofechar: function () {
            gameData.visualState.capellaVisivel = true;
            mudarCenario(personagens.marin, "capella");
            gameData.npcApareceu = "sumiu";
            tocarEfeito("swoosh");
          },
        },
      ],
    },
  },

  // ------------ MARKET -------------//

  wayway: {
    nome: "Wayway",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Wayway1.png')",
      furioso: "url('/assets/img/NPC_portrait-Wayway2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Seja Bem-vindo! Estamos nos estabelecendo para as festas de final de ano. Nós trouxemos mercadorias que podem ajudar a população nesse frio intenso. Mas nossa... quando falaram que era frio, foram bonzinhos.",
          expressao: "normal",
        },
        {
          texto:
            "Ainda estamos arrumando tudo, então se precisar de alguma coisa pode falar comigo.",
          expressao: "normal",
        },
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        {
          texto: "Mas ainda tenho um longo caminho pela frente.",
          expressao: "pensativo",
        },
      ],

      final: [
        { texto: "Não desista ainda!", expressao: "furioso" },
        {
          texto:
            "Nós conseguimos acender os postes uma única vez! Aproveite. Não deixe tudo congelar",
          expressao: "furioso",
        },
      ],
    },
  },

  myopic: {
    nome: "Myopic",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Myopic1.png')",
      pensativo: "url('/assets/img/NPC_portrait-Myopic2.png')",
    },
    falas: {
      inicio: [
        {
          texto:
            "Ahhh! Estamos abrindo a loja, mas as melhores mercadorias estão nessa baú protegido com um cadeado de runas!!!",
          expressao: "normal",
        },
        {
          texto:
            "Pra piorar as coisas, eu deixei meus óculos cairem dentro do baú e fechei o cadeado, agora não enxergo mais nada!",
          expressao: "normal",
        },
        {
          texto:
            "Eu tenho certeza que eu anotei a senha no computador da loja, mas por mais que eu olhe não enxergo nada!!!",
          expressao: "normal",
        },
      ],
      segunda: [
        { texto: "Heh, não foi tão difícil assim.", expressao: "normal" },
        {
          texto: "Mas ainda tenho um longo caminho pela frente.",
          expressao: "pensativo",
        },
      ],
    },
  },

  cobra4: {
    nome: "kofongo",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto: "Tehee~ Você me achou.",
        },
        {
          texto: "Minha cauda coçou e não consegui ficar imovél. heh",
          aofechar: function () {
            gameData.visualState.kofongoVisivel = true;
            mudarCenario(personagens.marin, "kofongo");
            tocarEfeito("swoosh");
          },
        },
      ],
    },
  },

  // CAVE //
  wendigo: {
    nome: "Wendigo Warrior",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "url('/assets/img/NPC_portrait-Warrior.png')",
    },
    falas: {
      inicio: [
        {
          texto: "Você não é permitido aqui! Saia!",
          expressao: "normal",
        },
        {
          texto:
            "O Guardião do Sol não precisa de pessoas fracas! Sou eu quem vai proteger essas terras!",
          expressao: "normal",
        },
        {
          texto: "Não diga que eu não avisei! Lute comigo!",
          expressao: "normal",

          texto:
            "[Ataque o Wendigo com movimentos de corte com o cursor/touch. Alguns ataques fazem ele cancelar o cast. Risque um circulo ao redor dos inimigos para dar dano em area (menos dano, mas bom pra cancelar cast.)]",
          aofechar: function () {
            ConfirmModal.ask("Fight?", () => {
              window.location.href = "/scripts/wendigo_fight/index.html";
              console.log("O usuário aceitou!");
            });
          },
        },
      ],
      segunda: [
        {
          texto:
            "Você me venceu.... talvez se for você... você consiga impedir ele...",
          expressao: "normal",
        },
        {
          texto:
            "O guardião do sol quer ir com você, eu estava pensando em fazer um exercíto para proteger essas terras, mas talvez você seja a melhor escolha.",
          expressao: "normal",
        },
        {
          texto: "Vou apostar minhas fichas em você. Por favor... vença!",
          expressao: "normal",
        },
      ],

      final: [
        {
          texto:
            "Estive analisando ele por um tempo. Cuidado com os olhos agora! Destrua a barreira dos olhos e finalize-o!!!",
          expressao: "normal",
        },
      ],
    },
  },

  cobra1: {
    nome: "Pollux",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto: "I want mom and dad!!",
          aofechar: function () {
            gameData.visualState.polluxVisivel = true;
            mudarCenario(personagens.marin, "pollux");
            tocarEfeito("swoosh");
          },
        },
      ],
    },
  },

  cobra6: {
    nome: "Aldebaran",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto: ".... [hides on his own tail and run away]",
          aofechar: function () {
            gameData.visualState.aldebaranVisivel = true;
            mudarCenario(personagens.marin, "aldebaran");
            tocarEfeito("swoosh");
          },
        },
      ],
    },
  },

  // lake //

  cory: {
    nome: "Cory",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto: "Não é todo dia que recebemos visitantes.",
        },
      ],
      segunda: [
        {
          texto: "Essas aguas estão ficando tão frias, quando isso vai passar?",
        },
      ],
    },
  },

  spanish: {
    nome: "Spanish",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto: "Coitadinho. O caranguejo prendeu ele.",
        },
      ],
      segunda: [
        {
          texto: "Vai bebêzinho, volte para sua mãe",
        },
      ],
    },
  },

  paddlefish: {
    nome: "Paddlefish",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto:
            "Já tentei espocar essas bolhas, mas elas sempre nascem de novo, não consegui liberar a criança.",
        },
      ],
      segunda: [
        {
          texto: "Padrões nas bolhas? nunca pensaria nisso! Você ´um gênio.",
        },
      ],
    },
  },

  wholphin: {
    nome: "Wholphin",
    lado: "Esquerdo",
    fonte: "'Wild Words', sans-serif",
    expressoes: {
      normal: "",
      sorrindo: "",
    },
    falas: {
      inicio: [
        {
          texto:
            "Hahahaha! Quer que eu mate o caranguejo pra você? Mas não garanto a segurança do garoto.",
        },
      ],
      segunda: [
        {
          texto: "Odeio quem resolve as coisas na inteligência",
        },
      ],
    },
  },
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
document.getElementById("pine")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.pine);
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

// Cobrinhas //

document.getElementById("cobra1")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra1);
});
document.getElementById("cobra2")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra2);
});
document.getElementById("cobra3")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra3);
});
document.getElementById("cobra4")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra4);
});
document.getElementById("cobra5")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra5);
});
document.getElementById("cobra6")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cobra6);
});

// templo //

document.getElementById("nana")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.nana);
});

document.getElementById("nodata")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.nodata);
});

document.getElementById("aiko")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.aiko);
});

//cave //

document.getElementById("wendigo")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.wendigo);
});

// lake //

document.getElementById("cory")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.cory);
});
document.getElementById("spanish")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.spanish);
});
document.getElementById("paddlefish")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.paddlefish);
});
document.getElementById("wholphin")?.addEventListener("pointerdown", () => {
  dialogo.abrir(personagens.wholphin);
});
