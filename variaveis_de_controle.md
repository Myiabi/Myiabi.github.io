
gameData.visualState.solON = true
gameData.visualState.luaON = true

window.gameData.incubadora.hasJelly = true;
window.gameData.incubadora.hasRainha = true;
window.gameData.incubadora.hasMateria = true;


ConfirmModal.ask("Escreva sua pergunta aqui?", () => {
window.location.href = "/cenarios/snow/index.html";    
console.log("O usuário aceitou!");
});    

executar: function() {
        gameData.visualState.minigame2 = true;
}

mudarCenario(personagens.felicia, 'estatua');
