{/* <div id="npc" style="display:none;">
  <img src="npc.png">
</div>
 */}
<script>
  // gameData já existe globalmente no seu projeto.
  // Aqui só usamos.
  // gameData.npcApareceu = false;  // você já define no dataDefault.

  // Probabilidade de 1 em 20
  function randomNPC() {
    return Math.floor(Math.random() * 20) + 1 === 1;
  }

  function entrarNoLocal() {
    const npc = document.getElementById("npc");

    // Só executa o random SE ainda não tiver aparecido
    if (!gameData.npcApareceu) {
      const apareceu = randomNPC();
      if (apareceu) {
        gameData.npcApareceu = true;  // marca como apareceu
      }
    }

    // Exibir baseado no estado atual
    npc.style.display = gameData.npcApareceu ? "block" : "none";
  }

  // Quando entrar no local (evento do seu jogo)
  entrarNoLocal();
</script>
