document.querySelectorAll(".back").forEach(p => {
  p.addEventListener("click", () => {
    
    // VERIFICAÇÃO DE JOGO ZERADO
    if (p.dataset.destino.includes('dropmoon')) {
        
        // Pergunta pra memória: "Esse cara já venceu?"
        if (localStorage.getItem('dropmoon_completo') === 'true') {
            alert("Você já completou esse desafio!"); 
            return; // ⛔ PARA TUDO AQUI. Não dá token, não muda de página.
        }

        // Se não venceu, libera a pulseira vip
        sessionStorage.setItem('acesso_dropmoon', 'autorizado');
    }

    // Segue o baile (se não tiver caído no return acima)
    window.location.replace(p.dataset.destino);
  });
});

// Passe para Minigames

function irParaDropmoon() {
    // 1. Cria o crachá de permissão
    sessionStorage.setItem('acesso_dropmoon', 'autorizado');
  
}