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

// neve //
function criarNeve() {
    // 1. Cria o container se não existir
    let container = document.getElementById("snow-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "snow-container";
        document.body.appendChild(container); // Ou dentro do #scene se preferir
    }

    // 2. Configurações
    const quantidadeFlocos = 50; // Aumente para nevasca, diminua para garoa leve

    for (let i = 0; i < quantidadeFlocos; i++) {
        const flake = document.createElement("div");
        flake.classList.add("snowflake");

        // --- ALEATORIEDADE (O segredo da beleza) ---
        
        // Posição horizontal (0 a 100vw)
        flake.style.left = Math.random() * 100 + "vw";
        
        // Tamanho (entre 2px e 5px) - Cria profundidade
        const size = Math.random() * 3 + 2 + "px";
        flake.style.width = size;
        flake.style.height = size;
        
        // Opacidade (alguns mais transparentes que outros)
        flake.style.opacity = Math.random() * 0.9 + 0.6;

        // Duração da queda (entre 5s e 15s) - Uns caem rápido, outros planam
        const duration = Math.random() * 10 + 5 + "s";
        flake.style.animation = `snowfall ${duration} linear infinite`;

        // Atraso inicial (pra não caírem todos juntos no load da página)
        flake.style.animationDelay = Math.random() * 5 + "s";

        container.appendChild(flake);
    }
}

// 🔥 CHAMA A FUNÇÃO PRA NEVAR
criarNeve();