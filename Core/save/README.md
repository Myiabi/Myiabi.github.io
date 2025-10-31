# Sistema Global de Save

- Sistema de save simples usando `localStorage`.
- Suporta variáveis globais do jogo e minigames.
- Bloqueia automaticamente botões de minigames já vencidos.

## Estrutura do gameData

- `nomeJogador`: string, nome do jogador.  
- `nivel`: number, nível atual do jogador.  
- `moedas`: number, quantidade de moedas.  
- `progresso`: number, progresso geral do jogo.  
- `minigameX`: boolean, indica se cada minigame foi vencido.

_Obs: Novos minigames podem ser adicionados diretamente no objeto `gameData`._

## Funções principais

- `salvarJogo()`
  - Salva o `gameData` no `localStorage`.
  - Exibe mensagem no console de sucesso ou erro.

- `carregarJogo()`
  - Lê os dados salvos do `localStorage`.
  - Atualiza `gameData`.
  - Desabilita automaticamente botões de minigames já vencidos.
  
- `apagarSave()`
  - Remove o save do `localStorage`.
  
- `venceuMinigame(id)`
  - Recebe o id do minigame vencido.
  - Marca como `true` no `gameData`.
  - Salva automaticamente.
  - Desabilita o botão correspondente no HTML.

## Uso

- HTML: atribuir **id do botão igual ao nome da variável** do minigame:

  ```html
  <button id="minigame1" onclick="abrirMinigame(1)">MiniGame 1</button>
