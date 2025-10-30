function abrirModal(minigameId) {
  // Cria overlay se não existir
  let overlay = document.getElementById('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    document.body.appendChild(overlay);
  }

  // Encontra o minigame
  const minigame = document.getElementById(minigameId);
  if (!minigame) return console.error(`Minigame "${minigameId}" não encontrado.`);

  minigame.style.display = 'block';
  overlay.appendChild(minigame);

  // Cria botão de fechar
  let fecharBtn = document.createElement('button');
  fecharBtn.textContent = '✖';
  fecharBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: #000000aa;
    color: white;
    border: none;
    font-size: 1.2rem;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 8px;
    z-index: 10000;
  `;
  
  // Função de fechar
  fecharBtn.onclick = () => {
    minigame.style.display = 'none';       // esconde minigame
    document.body.appendChild(minigame);   // devolve pro body
    overlay.remove();                       // remove overlay do DOM
  };

  overlay.appendChild(fecharBtn);
}
