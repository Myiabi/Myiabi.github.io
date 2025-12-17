# Mini Game Interativo de Mapas e Itens Dragáveis

## Visão Geral
Este projeto cria um **menu secundário** com itens arrastáveis (como lupa 🌕 e fogo 🔥) que interagem com **mapas** na tela.  
A lupa revela conteúdos escondidos nos mapas, e cada item pode ter uma função própria ao ser usado sobre alvos específicos.  

### Funcionalidades:
- Menu fixo no canto da tela com itens arrastáveis.
- Lupa segue o mouse e revela áreas debaixo do layer superior.
- Alvos configuráveis que podem disparar funções quando a lupa ou outros itens interagem.
- Sistema de múltiplos mapas e múltiplos alvos.
- Compatível com **mouse e touch**.
- Fácil de adicionar novos itens ou alvos.

## Estrutura do Código
### HTML
- Cada mapa deve ser uma div com **classes `container mapa`**.
- O conteúdo revelável deve estar dentro de `.layer.top`.
- Exemplo:

```html
<div class="container mapa capeta">
  <div class="layer bottom">
    <div class="text">
      Conteúdo de fundo
    </div>
  </div>
  <div class="layer top">
    <div class="text capetinha">👹</div>
  </div>
</div>
