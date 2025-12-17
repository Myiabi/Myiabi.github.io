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
            "I came here with my wife and my sextuplets, but they all got lost in the city. I don't know where to start looking for them...",
          expressao: "normal",
        },
        {
          texto:
            "They are all good hunters and know how to hide their presence. Perhaps, if you find them in their own hideouts, they will agree to come back and behave.",
          expressao: "pensativo",
        },
      ],
      kofongo: [
        {
          texto:
            "Kofongo is a mischievous girl full of energy. She surely found a fun place to play and went there.",
          expressao: "pensativo",
        },
      ],
      pollux: [
        {
          texto:
            "Pollux is a lonely child who is always looking for big prey and is the strongest of his siblings. I'm sure my wife misses him.",
          expressao: "pensativo",
        },
      ],
      sirius: [
        {
          texto:
            "Sirius spends a lot of time reading his books and is not great at hunting, but he is very intelligent.",
          expressao: "pensativo",
        },
      ],
      aldebaran: [
        {
          texto:
            "Alde is very shy and usually doesn't say anything, but he's always been a good child.",
          expressao: "pensativo",
        },
      ],
      rigel: [
        {
          texto:
            "Rigel is a peculiar child who can sometimes be rebellious. He is still getting used to his powers.",
          expressao: "pensativo",
        },
      ],
      capella: [
        {
          texto:
            "Capella is always seen with Kofongo, but sometimes he can't resist the smell of a good treat.",
          expressao: "normal",
        },
      ],
      final: [{ texto: "Now that all of them are here, we just need to wait your Mother.", expressao: "pensativo" }],
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
            "I'm sensing an uneasy presence in this place... Could it be one of the guardian spirits?",
          expressao: "normal",
        },
        {
          texto:
            "Are you also looking for them? I can't see them... If only I had the temple's blessing. You don't seem to have the power yet.",
          expressao: "normal",
          executar: function () {
            mudarCenario(personagens.aiko, "segunda");
          },
        },
      ],
      estatua: [
        {
          texto:
            "Yes, I was right. It's the Moon Guardian who was missing. But he's out of control, he senses someone's presence???",
          expressao: "normal",
        },
        {
          texto: "We need to calm him down! You seem prepared for this.",
          expressao: "pensativo",
        },
        {
          texto:
            "[Focus the 'Magnifying Glass' on the invisible Moon Guardian to prevent him from growing. If he grows to maximum, you will lose. Hold out long enough to calm him down.]",
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
          texto: "You did it! He seems so calm now...",
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
            "I didn't think it would be so cold here. I should have trusted my books.",
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
            "I can't plant anything in this cold. Strangely, this is the only warm part of the city. Despite that, no one gets close to it.",
          expressao: "normal",
        },
        {
          texto:
            "Something strange is happening in this cave. If I could have this heat source, I could plant something and increase life in this city.",
          expressao: "normal",
        },
      ],
      jardim: [
        {
          texto:
            "I see you managed to rescue this little friend. So it was him the heat source. Now I can use my powers and open my secret garden here in the city! Do you want to see it?",
          expressao: "normal",
        },

        {
          texto:
            "Um... I know you've already helped me a lot, but my garden is a mess. I need you to locate some items for me.",
          expressao: "normal",
        },
        {
          texto:
            "[Locate the highlighted items in the garden. Click on where you think it is. Collect them all to win.]",
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
            "Hihihi now I can clean my garden. You can have this jar of honey [Jelly] as thanks.",
          expressao: "normal",
        },

        {
          texto:
            "I'm happy! If this cold passes, I'll fill this city with flowers! :3",
          expressao: "normal",
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
      inicio: [{ texto: "Meow myah myu nyah nyeh?", expressao: "normal" }],
      segunda: [
        { texto: "You understand me now? Meow", expressao: "normal" },
        {
          texto:
            "I'm an excellent fisherman in this city. The problem is it's gotten so cold that the lake surface froze and we can't even make a hole.",
          expressao: "normal",
        },
        {
          texto: "So many days without catching a single fish. I'm so hungry.",
          expressao: "normal",
        },
      ],
      terceira: [
        {
          texto:
            "The fishing hole is open! How did you do it? Now I can go back to thinking and selling fish! And also get rid of my hunger.",
          expressao: "normal",
        },
        {
          texto:
            "As thanks, you can use the rod over there. Good luck fishing.",
          expressao: "normal",
        },
        {
          texto: "[Double-click on the blue box to start fishing]",
          expressao: "normal",
          aofechar: function () {
            gameData.visualState.varaON = true;
          },
        },
      ],
      lendario: [
        {
          texto:
            "OMG! You caught the legendary of the lake. Can I... eat it? [So hungry]",
          expressao: "normal",
        },
        {
          texto: "Thank you so much Meow!",
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
            "I'm always stuck on day 25, I've lived today countless times, I know everything that has already happened (will happen).",
          expressao: "normal",
        },
        {
          texto: "And look... you were amazing! I got emotional at the end.",
          expressao: "normal",
        },
        {
          texto:
            "Wait. You're not going to quit the game in the middle, right? Right???",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "'He' is coming... are you prepared?",
          expressao: "normal",
        },
      ],
      amigo: [
        {
          texto: "(He always says the same thing, but I appreciate the effort)",
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
            "This city is very populous, with hundreds of residents. But it's so cold that most people don't leave their houses anymore.",
          expressao: "normal",
        },
        {
          texto:
            "Even the fire posts can't stay lit anymore. Any normal fire goes out in the first wind.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "It's so warm! How did you manage to light the posts?",
          expressao: "normal",
        },

        {
          texto:
            "Ah! Day-25 is my best friend. I know about his situation, so I try to say something different every day.",
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
          texto: "On ice I can express 100% of my dance.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "The heat isn't so bad either. Do you want to skate too?",
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
          texto: "I've been revealed! But... it's not like I was hiding.",
          expressao: "normal",
        },
        { texto: "I swear.", expressao: "normal" },
      ],
      revelado: [
        {
          texto:
            "Everyone is complaining about how cold it is. Not me, I go out every day. I don't feel anything at all.",
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
            "Feel free to walk around and get to know the city. If you need anything, I'll be here at the temple. Let me know if you discover any clues about the Guardians.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto: "Did you find a clue about one of the spirits!?",
          expressao: "normal",
        },
        {
          texto:
            "You'll need some protection to calm them. The temple's blessing would be perfect, but unfortunately, as a priest, I don't possess that ability. I'm sorry.",
          expressao: "pensativo",
        },
        {
          texto:
            "But there was a way to get the temple's blessing... By praying to the statues of the ancient priestesses. However, they only work if they're in the correct order.",
          expressao: "pensativo",
        },
        {
          texto:
            "But when we did a cleaning at the temple, we ended up moving them around and now we don't know the correct order! There's a note left by the old priest near the statues. If you want to try solving it, feel free.",
          expressao: "pensativo",
          aofechar: function () {
            gameData.visualState.estatuasON = true;
          },
        },
      ],

      estatuaWon: [
        {
          texto: "I see you got the blessing of the priestesses! Incredible!",
          expressao: "normal",
        },
        {
          texto:
            "Now you'll be able to face harder battles for a limited time, but it's enough.",
          expressao: "normal",
          executar: function () {
            mudarCenario(personagens.felicia, "estatua");
          },
        },
        {
          texto:
            "As well as the city's residents will be able to pray to the guardians again. I wish they had kept their faith even facing the crisis, but now we can have hope.",
          expressao: "normal",
        },
      ],

      boss: [
        {
          texto:
            "Now that you've found the two guardians, we need to tell you the complete story of the city.",
          aofechar: function () {
            dialogo.agendar(personagens.nodata, "boss", 300);
          },
          expressao: "normal",
        },
      ],
      boss1: [
        {
          texto:
            "Long ago, these lands were normal. When he arrived here, he used all of his power. It was a power of great proportions. First, he used the Moon's eye to raise his power across the entire territory.",
          expressao: "normal",
        },
        {
          texto:
            "Second, he stole all the heat from the earth, from the stones, the rivers, and the plants. Living beings had no choice but to flee.",
          expressao: "normal",
        },
        {
          texto:
            "From each wing, two guardians emerged from him, each representing his powers. Then, they wandered through every corner stealing the heat from things... When they finally froze everything... He fell asleep.",
          expressao: "normal",
        },
        {
          texto:
            "But the two guardians did not accompany him in this sleep... They were alone for a long time. Until the first pilgrims arrived, and with the 5 priestess sisters who could use their powers, together they established the city of Aislin.",
          expressao: "normal",
        },
        {
          texto:
            "They learned to love this place. However, with the warmth of the city and the living beings who are living happily here... They felt that the Emperor is waking up. At first they were happy, a reunion after so long... But soon they realized.",
          expressao: "normal",
          aofechar: function () {
            dialogo.agendar(personagens.nana, "boss1", 300);
          },
        },
      ],
      boss3: [
        {
          texto: "Are you ready???",
          expressao: "normal",
          aofechar: function () {
            ConfirmModal.ask("Challenge Ice Imperor?", () => {
              window.location.href = "/cenarios/blizzard/index.html";
              console.log("O usuário aceitou!");
            });
          },
        },
      ],

      final: [
        {
          texto:
            "We've reached the end of the game. Thank you for saving our city. Here I can send you to the final screen if you wish. As well as you can play again! Thank you!",
          expressao: "normal",
          aofechar: function () {
            ConfirmModal.ask("Ir para tela final?", () => {
              window.location.href = "/cenarios/final/index.html";
              console.log("O usuário aceitou!");
            });
          },
        },
      ],

      intro: [
        {
          texto:
            "Welcome! I'm glad you came. Was the journey very tiring? Well, I'm sorry for the rush, but this problem needs to be resolved urgently.",
          expressao: "normal",
        },
        {
          texto:
            "You must have heard that this was a very pleasant city to be in... but as you can see we're in an epic freeze. And that's why we requested your help.",
          expressao: "normal",
        },
        {
          texto:
            "In our company we have two illustrious presences, they are worried about the situation. They can explain what's been happening. But please, be careful with how you address them! They are two Queens!.",
          expressao: "normal",
        },
      ],
      intro2: [
        {
          texto:
            "The two guardians that protected this city... they lived here at the temple. But in recent days they've been very restless... Until one day they disappeared.",
          expressao: "normal",
        },
        {
          texto:
            "Their power was essential. Basically, this city's creation is due to them. What did they feel?",
          expressao: "normal",
        },
      ],
      intro3: [
        {
          texto:
            "Naturally, you will be rewarded. But please... protect the lives of this city.",
          expressao: "normal",
        },
        {
          texto: "You can start your investigation now.",
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
            "Visit Wayway's shop near the temple. He is very helpful. If you need anything, he will certainly have it.",
          expressao: "sorrindo",
        },
      ],
      power: [
        {
          texto:
            'Do you need a <span style="color: pink; font-size: 1em;">Queen\'s Power</span>?',
          expressao: "normal",
        },
        {
          texto:
            "I can give you mine. You don't need to do anything, just take it.",
          aofechar: function () {
            // Salva a recompensa
            if (typeof gameData !== "undefined") {
              gameData.incubadora.hasRainha = true;
              mudarCenario(personagens.nana, "inicio");
            }

            // Toca som de vitória se existir
            if (typeof tocarEfeito === "function") {
              tocarEfeito("win3");
            }

            // Cria o CSS do popup se não existir
            if (!document.getElementById("winPopupStyles")) {
              const style = document.createElement("style");
              style.id = "winPopupStyles";
              style.textContent = `
                .win-popup {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) scale(0.8);
                  width: auto;
                  min-width: 280px;
                  max-width: 90%;
                  padding: 25px 40px;
                  background: linear-gradient(180deg, rgba(31, 31, 42, 0.95), rgba(20, 20, 30, 0.98));
                  border-radius: 20px;
                  border: 2px solid rgba(255, 184, 108, 0.3);
                  box-shadow: 0 0 60px rgba(255, 184, 108, 0.3), 0 20px 60px rgba(2, 6, 23, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  gap: 15px;
                  font-family: "Segoe UI", sans-serif;
                  color: #f8f8f2;
                  z-index: 10000;
                  opacity: 0;
                  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .win-popup.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                .win-popup.hide { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                .win-popup-img {
                  width: 120px;
                  height: 120px;
                  border-radius: 50%;
                  object-fit: contain;
                  background: rgba(255, 255, 255, 0.05);
                  border: 3px solid rgba(255, 184, 108, 0.5);
                  box-shadow: 0 0 30px rgba(255, 184, 108, 0.4);
                  animation: popupGlow 2s ease-in-out infinite;
                }
                .win-popup-title { font-size: 22px; font-weight: 800; color: #ffb86c; text-shadow: 0 2px 10px rgba(255, 184, 108, 0.5); margin: 0; }
                .win-popup-subtitle { font-size: 14px; color: #50fa7b; font-weight: 600; margin: 0; }
                .win-popup-desc { font-size: 13px; color: #6272a4; text-align: center; margin: 0; }
                @keyframes popupGlow {
                  0%, 100% { box-shadow: 0 0 30px rgba(255, 184, 108, 0.4); }
                  50% { box-shadow: 0 0 50px rgba(255, 184, 108, 0.7); }
                }
              `;
              document.head.appendChild(style);
            }

            // Cria e mostra o popup
            const popup = document.createElement("div");
            popup.className = "win-popup";
            popup.innerHTML = `
              <img src="/assets/img/Queens-power.png" class="win-popup-img" alt="Dark Matter">
              <p class="win-popup-title">Dark Matter</p>
              <p class="win-popup-subtitle">ITEM OBTAINED! ✨</p>
              <p class="win-popup-desc">You received the Dark Matter from the Queen!</p>
            `;
            document.body.appendChild(popup);

            requestAnimationFrame(() => {
              popup.classList.add("show");
            });

            setTimeout(() => {
              popup.classList.remove("show");
              popup.classList.add("hide");
              setTimeout(() => popup.remove(), 400);
            }, 4000);
          },
          expressao: "sorrindo",
        },
      ],
      boss: [
        {
          texto:
            "He believes that the best state of things is absolute ice. That everything should freeze so everything and everyone will last forever.",
          expressao: "normal",
        },
        {
          texto:
            "I believe not out of malice, he just follows his nature. Just as we believe it's common to build cities and live in constant change, he believes the opposite.",
          expressao: "normal",
          aofechar: function () {
            dialogo.agendar(personagens.aiko, "boss1", 300);
          },
        },
      ],
      boss1: [
        {
          texto:
            "And now they're afraid that he'll wake up and decide to freeze everything again.",
          expressao: "normal",
          aofechar: function () {
            dialogo.agendar(personagens.nodata, "boss1", 300);
          },
        },
      ],
      boss2: [
        {
          texto:
            "So maybe you and the guardians can find a better outcome for this situation. We trust in you. We'll take the fight outside the city, but since it's freezing out there, wayway prepared posts with a powerful fire. Don't let the posts go out or everything will freeze.",
          expressao: "normal",
          aofechar: function () {
            dialogo.agendar(personagens.aiko, "boss3", 300);
          },
        },
      ],
      intro: [
        {
          texto:
            "There's no need to be so formal, please. After all, we are the ones in debt for your visit.",
          expressao: "sorrindo",
        },
      ],
      intro2: [
        {
          texto:
            "We need to find them! Or by the end of the night, everyone in this city will freeze!",
          expressao: "normal",
        },
        {
          texto:
            "This is the real reason we two came here. We'll try to delay the freezing as much as possible until you find the guardians.",
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
          "If you see my husband and my children around, say hi. They are a handful, but they're interesting.",
          expressao: "sorrindo",
        },
      ],
      segunda: [
        {
          texto:
            "Impressive. Although they're just children, they have precocious talent, and you managed to locate them so quickly.",
          expressao: "normal",
        },
        {
          texto:
            'Here, you can have this <span style="color: #9966ff; font-size: 1em;">Dark Matter</span> as recognition.',
          expressao: "normal",
          aofechar: function () {
            // Salva a recompensa
            if (typeof gameData !== "undefined") {
              gameData.incubadora.hasMateria = true;
              mudarCenario(personagens.nodata, "inicio");
            }

            // Toca som de vitória se existir
            if (typeof tocarEfeito === "function") {
              tocarEfeito("win3");
            }

            // Cria o CSS do popup se não existir
            if (!document.getElementById("winPopupStyles")) {
              const style = document.createElement("style");
              style.id = "winPopupStyles";
              style.textContent = `
                .win-popup {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) scale(0.8);
                  width: auto;
                  min-width: 280px;
                  max-width: 90%;
                  padding: 25px 40px;
                  background: linear-gradient(180deg, rgba(31, 31, 42, 0.95), rgba(20, 20, 30, 0.98));
                  border-radius: 20px;
                  border: 2px solid rgba(255, 184, 108, 0.3);
                  box-shadow: 0 0 60px rgba(255, 184, 108, 0.3), 0 20px 60px rgba(2, 6, 23, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  gap: 15px;
                  font-family: "Segoe UI", sans-serif;
                  color: #f8f8f2;
                  z-index: 10000;
                  opacity: 0;
                  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .win-popup.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                .win-popup.hide { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                .win-popup-img {
                  width: 120px;
                  height: 120px;
                  border-radius: 50%;
                  object-fit: contain;
                  background: rgba(255, 255, 255, 0.05);
                  border: 3px solid rgba(255, 184, 108, 0.5);
                  box-shadow: 0 0 30px rgba(255, 184, 108, 0.4);
                  animation: popupGlow 2s ease-in-out infinite;
                }
                .win-popup-title { font-size: 22px; font-weight: 800; color: #ffb86c; text-shadow: 0 2px 10px rgba(255, 184, 108, 0.5); margin: 0; }
                .win-popup-subtitle { font-size: 14px; color: #50fa7b; font-weight: 600; margin: 0; }
                .win-popup-desc { font-size: 13px; color: #6272a4; text-align: center; margin: 0; }
                @keyframes popupGlow {
                  0%, 100% { box-shadow: 0 0 30px rgba(255, 184, 108, 0.4); }
                  50% { box-shadow: 0 0 50px rgba(255, 184, 108, 0.7); }
                }
              `;
              document.head.appendChild(style);
            }

            // Cria e mostra o popup
            const popup = document.createElement("div");
            popup.className = "win-popup";
            popup.innerHTML = `
              <img src="/assets/img/Dark-matter.png" class="win-popup-img" alt="Dark Matter">
              <p class="win-popup-title">Dark Matter</p>
              <p class="win-popup-subtitle">ITEM OBTAINED! ✨</p>
              <p class="win-popup-desc">You received the Dark Matter from the Queen!</p>
            `;
            document.body.appendChild(popup);

            requestAnimationFrame(() => {
              popup.classList.add("show");
            });

            setTimeout(() => {
              popup.classList.remove("show");
              popup.classList.add("hide");
              setTimeout(() => popup.remove(), 400);
            }, 4000);
          },
        },
      ],
      boss: [
        {
          texto: "The truth is it's impossible to inhabit these lands.",
          expressao: "normal",
        },
        {
          texto:
            "A long time ago, a very powerful being arrived in this region. He possesses incredible power, manipulating the climate.",
          expressao: "normal",
          aofechar: function () {
            dialogo.agendar(personagens.nana, "boss", 300);
          },
        },
      ],
      boss1: [
        {
          texto:
            "Sorry to interrupt the story, but now he's awakened and is coming straight here.",
          expressao: "normal",
        },
        {
          texto:
            "We'll have to fight. Some of us who possess great power could defeat him. But in the process... the city could freeze. What's the point of surviving?",
          aofechar: function () {
            dialogo.agendar(personagens.nana, "boss2", 300);
          },
          expressao: "normal",
        },
      ],
      intro: [
        {
          texto: "I agree. But let's get straight to the point.",
          expressao: "normal",
        },
        {
          texto:
            "This city is going to collapse. To be more specific, it's freezing.",
          expressao: "normal",
        },
      ],
      intro2: [
        { texto: "So that's it. We're counting on you.", expressao: "normal" },
        {
          texto: "We'll be here if you need to know anything.",
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
        { texto: "Want a drink?", expressao: "normal" },
        {
          texto:
            "In recent days we had low foot traffic. We created an environment with a pleasant atmosphere and hot food to get people out of their houses. You can stay here as long as you want.",
          expressao: "normal",
        },
      ],
      sus: [{ texto: "...", expressao: "normal" }],
      final: [
        {
          texto:
            "I saw that you helped out at the bar today. Few know, but the warmth that emanates from people also heats the city.",
          expressao: "normal",
        },
        {
          texto:
            "I hope that helps with what's to come. Good luck. [He serves you a drink that when you drink it you feel warm]",
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
        { texto: "And now. What do I do...?", expressao: "normal" },
        {
          texto:
            "There are so many people today that I mixed up all the orders. I don't know who ordered what! If the boss finds out, I'm toast.",
          expressao: "normal",
        },
        {
          texto:
            "How about paying attention to the customers and figuring out who ordered each dish?",
          expressao: "normal",
        },
        {
          texto:
            "[Watch the customers to figure out what each one ordered. Click on the table to start and drag the correct food to each customer.]",
          aofechar: function () {
            gameData.visualState.mesasON = true;
            dialogo.agendar(personagens.barman, "sus", 300);
          },
        },
      ],
      segunda: [
        {
          texto:
            "Phew!!! You're great at this! Don't let the boss find out I had your help though.",
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
      inicio: [{ texto: "It's packed today!!!", expressao: "normal" }],

      finish: [
        {
          texto: "Hey! Did you just do my job?",
          expressao: "normal",
        },
      ],
      presilha: [
        { texto: "You caught a pin in the lake?", expressao: "normal" },
        {
          texto:
            "Actually... I live there with many other fish. Probably that pin belongs to one of them. If you want I can give you permission to enter.",
          expressao: "normal",
        },
        {
          texto: "[Try diving in the fishing hole (!?)]",
          expressao: "normal",
          executar: function () {
            gameData.visualState.presilha = true;
          },
        },
      ],
      final: [
        {
          texto: "We mermaids are dropzillas that weren't sold...",
          expressao: "normal",
        },
        {
          texto:
            "Oh! I'm not complaining or sad. We live happily and seriously, I had the opportunity to appear in a game, I'm famous!",
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
            "This cold wind gave me warmth. Boss!!! bring me a crunchy ice cream!",
          expressao: "sorrindo",
        },
        { texto: "", expressao: "sorrindo" },
      ],
      segunda: [
        { texto: "Heh, it wasn't that hard.", expressao: "normal" },
        {
          texto: "But I still have a long way to go.",
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
            "Welcome! We're setting up for the end-of-year festivities. We brought merchandise that can help the population through this intense cold. But man... when they said it was cold, they were being nice.",
          expressao: "normal",
        },
        {
          texto:
            "We're still setting everything up, so if you need anything, you can talk to me.",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto:
            "This fire you carry is kind. It will surely protect this city.",
          expressao: "normal",
        },
        {
          texto: "The city's posts... maybe I can restore a few more.",
          expressao: "normal",
        },
      ],

      final: [
        { texto: "Don't give up yet!", expressao: "furioso" },
        {
          texto:
            "We'll only be able to light the posts once! Take advantage of it. Don't let everything freeze.",
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
            "Ahhh! We're opening the store, but the best merchandise is in this chest protected with a rune lock!!!",
          expressao: "normal",
        },
        {
          texto:
            "To make matters worse, I dropped my glasses inside the chest and locked it. Now I can't see anything!",
          expressao: "normal",
        },
        {
          texto:
            "I'm sure I wrote the password on the store's computer, but no matter how much I look, I can't see anything!!!",
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto:
            "Now I can see everything!!! Thank you so much for the help. Better hide this lock.",
          expressao: "normal",
        },
        {
          texto: "Now I can get ready to start work.",
          expressao: "pensativo",
        },
      ],

      final: [
        {
          texto: "Have you seen Myiabi's Advent Calendar this year?",
          expressao: "normal",
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
          texto: "Hehe~ You found me.",
        },
        {
          texto: "My tail itched and I couldn't stay still. Heh",
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
          texto: "You are not allowed here! Get out!",
          expressao: "normal",
        },
        {
          texto:
            "The Sun Guardian doesn't need weak people! I'm the one who will protect these lands!",
          expressao: "normal",
        },
        {
          texto: "Don't say I didn't warn you! Fight me!",
          expressao: "normal",

          texto:
            "[Attack the Wendigo with slashing movements with the cursor/touch. Some attacks make him cancel the cast. Draw a circle around enemies to give area damage (less damage, but good to cancel cast.)]",
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
            "You defeated me.... maybe if it's you... you can prevent him...",
          expressao: "normal",
        },
        {
          texto:
            "The Sun Guardian wants to go with you. I was thinking of building an army to protect these lands, but maybe you're the best choice.",
          expressao: "normal",
        },
        {
          texto: "I'm betting my chips on you. Please... win!",
          aofechar: function () {
            gameData.visualState.incLista = true;
            salvarJogo();
          },
          expressao: "normal",
        },
      ],
      segunda: [
        {
          texto:
            "You defeated me.... maybe if it's you... you can prevent him...",
          expressao: "normal",
        },
        {
          texto:
            "The Sun Guardian wants to go with you. I was thinking of building an army to protect these lands, but maybe you're the best choice.",
          expressao: "normal",
        },
        {
          texto: "I'm betting my chips on you. Please... win!",
          aofechar: function () {
            gameData.visualState.incLista = true;
            salvarJogo();
          },
          expressao: "normal",
        },
      ],

      myo: [
        {
          texto:
            "Did you gather all the materials? They are so rare... I give you permission to use the incubator. Create a Wendigo with the appearance you want. The incubator is equipped to take photos, but when you decide to finish your Wendigo, hold the button for a few seconds.",
          expressao: "normal",
        },
        {
          texto: "Remember: He is unique, think carefully before finishing.",
          expressao: "normal",
        },
      ],
      pmyo: [
        {
          texto:
            "What a beautiful Wendigo you created! I'm sure you two will be great friends.",
          expressao: "normal",
        },
        {
          texto:
            "Please let him get used to the new body for a while. He can accompany you after you finish your mission.",
          expressao: "normal",
        },
      ],

      final: [
        {
          texto:
            "I've been analyzing it for a while. Watch the eyes now! Destroy the eye barrier and finish it!!!",
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
          texto: "We don't get visitors every day.",
        },
      ],
      segunda: [
        {
          texto: "These waters are getting so cold. When will this pass?",
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
          texto: "Poor thing. The crab caught him.",
        },
      ],
      segunda: [
        {
          texto: "Go on, little one, go back to your mother.",
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
            "I've tried to pop these bubbles, but they keep being born again. I couldn't free the child.",
        },
      ],
      segunda: [
        {
          texto:
            "Patterns in the bubbles? Never would have thought of that! You're a genius.",
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
            "Hahahaha! Want me to kill the crab for you? But I don't guarantee the boy's safety.",
        },
      ],
      segunda: [
        {
          texto: "I hate people who solve things with intelligence.",
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
