# Modal de Minigames

- Função única para abrir qualquer minigame dentro de um modal.
- Overlay invisível cobre toda a tela, bloqueando cliques no fundo.
- Botão fechar único, que funciona para qualquer minigame.
- Permite abrir e fechar múltiplos minigames sem travar a interface.

## Estrutura do HTML do Minigame

- Coloque o conteúdo do minigame dentro de uma `div` com `id` único.
- Inicialmente esconda a div usando `style="display: none;"`.
- Exemplo:

<div id="minigameSequencia" style="display: none;">
  <h3>Mini Jogo Sequência</h3>
  <!-- conteúdo do minigame aqui -->
</div>


abrirModal("minigameSequencia");