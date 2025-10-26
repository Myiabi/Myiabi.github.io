// --------------------
// GERENCIADOR DE SONS
// --------------------


const Sons = {
  trilhas: {
    cidade: new Audio("/assets/sounds/trilhas/city.mp3"),
    predio: new Audio("sounds/predio.mp3")
  },
  efeitos: {
    vitoria: "sounds/vitoria.mp3",
    click: "sounds/click.mp3"
  },
  trilhaAtual: null  // guarda a trilha que está tocando no momento
};

// Configura todas as trilhas
for (let key in Sons.trilhas) {
  Sons.trilhas[key].loop = true;
  Sons.trilhas[key].volume = 0.3;
}

// --------------------
// FUNÇÕES
// --------------------

// Troca de trilha (pausa a antiga e toca a nova)
function tocarTrilha(nome) {
  const novaTrilha = Sons.trilhas[nome];
  if (!novaTrilha) return;

  // pausa trilha atual
  if (Sons.trilhaAtual && Sons.trilhaAtual !== novaTrilha) {
    Sons.trilhaAtual.pause();
    Sons.trilhaAtual.currentTime = 0; // opcional: reinicia do começo
  }

  // toca nova trilha
  novaTrilha.play();
  Sons.trilhaAtual = novaTrilha;
}

// Pausar trilha atual
function pausarTrilha() {
  if (Sons.trilhaAtual) {
    Sons.trilhaAtual.pause();
  }
}

// Efeitos sonoros (cada efeito cria um novo Audio)
function tocarEfeito(nome, volume = 0.5) {
  const caminho = Sons.efeitos[nome];
  if (!caminho) return;
  const som = new Audio(caminho);
  som.volume = volume;
  som.play();
}

// --------------------
// EVENTOS DE TESTE
// --------------------
document.getElementById("cidadeBtn").addEventListener("click", () => {
  tocarTrilha("cidade");
});

document.getElementById("predioBtn").addEventListener("click", () => {
  tocarTrilha("predio");
});

document.getElementById("vitoriaBtn").addEventListener("click", () => {
  tocarEfeito("vitoria", 0.7);
});

tocarTrilha("cidade");



