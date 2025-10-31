// ---------------------------
// Sistema Global de Save
// ---------------------------

// Objeto principal com os dados do jogo
// Aqui você vai adicionando as variáveis novas
const gameData = {
  nomeJogador: "Desconhecido",
  nivel: 1,
  moedas: 0,
  progresso: 0,
};

// Chave usada no localStorage
const SAVE_KEY = "meuSaveDoJogo";

// ---------------------------
// Funções principais
// ---------------------------

// Salvar o progresso
function salvarJogo() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
    console.log("💾 Jogo salvo com sucesso!");
  } catch (e) {
    console.error("Erro ao salvar:", e);
  }
}

// Carregar o progresso salvo
function carregarJogo() {
  const data = localStorage.getItem(SAVE_KEY);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      Object.assign(gameData, parsed);
      console.log("✅ Save carregado com sucesso!");
    } catch (e) {
      console.error("Erro ao carregar save:", e);
    }
  } else {
    console.log("⚠️ Nenhum save encontrado, iniciando novo jogo.");
  }
}

// Apagar o save
function apagarSave() {
  localStorage.removeItem(SAVE_KEY);
  console.log("🗑️ Save apagado.");
}

// ---------------------------
// Inicialização automática
// ---------------------------
carregarJogo();

// Expor globalmente (pra acessar de qualquer script)
window.gameData = gameData;
window.salvarJogo = salvarJogo;
window.apagarSave = apagarSave;
