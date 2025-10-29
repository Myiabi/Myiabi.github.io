# Sistema de Achievements JS

Sistema de achievements para minigames com notificações visuais e efeitos sonoros, usando Proxy para detectar alterações no estado do jogo.

---

## Funcionalidades

- Achievements secretos que são desbloqueados automaticamente.
- Popups animados no canto inferior direito (estilo Steam).
- Sons reproduzidos **uma vez** ao desbloquear cada achievement.
- Proxy no `gameState` para detectar alterações automaticamente.
- Responsivo e fácil de integrar em qualquer minigame baseado em clicks.

---

## Modo de Usar

- proxiedGameState.itemMoeda = true;

ou

- unlockAchievement('salaSecreta');

### gameState
Para Add achievements adicionar no objeto gameState = false e adicionar suas caracacteristicas no secretAchivements.

Objeto que armazena o estado do jogo:

```js
const gameState = {
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false
};
