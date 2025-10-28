const senha = ["🎃","🕸️","🧛‍♂️","🔥"];

// Espera o DOM carregar
document.addEventListener('DOMContentLoaded', () => {

  // Inicializa primeiro emote
  document.querySelectorAll(".cadeado-digit").forEach(d => {
    d.querySelector("span").classList.add("active");
  });

  // Função pra passar pro próximo dígito
  function nextDigit(container) {
    if (container.classList.contains("animate")) return;

    const spans = container.querySelectorAll("span");
    let activeIndex = Array.from(spans).findIndex(s => s.classList.contains("active"));
    let nextIndex = (activeIndex + 1) % spans.length;

    const active = spans[activeIndex];
    const next = spans[nextIndex];

    next.classList.add("next");
    container.classList.add("animate");

    setTimeout(() => {
      active.classList.remove("active");
      next.classList.remove("next");
      next.classList.add("active");
      container.classList.remove("animate");
      active.classList.add("opaco");

      setTimeout(() => {
        active.classList.remove("opaco");
      }, 300);

      checkSenha();
    }, 300);
  }

  // Checa se a senha está correta
  function checkSenha() {
    const digits = document.querySelectorAll(".cadeado-digit");
    const current = Array.from(digits).map(d => d.querySelector("span.active").textContent);

    if (current.join("") === senha.join("")) {
    unlockAchievement('itemMoeda');     
    }
  }

  // Evento para cada dígito
  document.querySelectorAll(".cadeado-digit").forEach(container => {
    container.addEventListener('click', () => nextDigit(container));
  });

  // ABRIR MODAL
  window.abrirModal = function(id) {
    document.getElementById(id).style.display = "block";
  };

  window.fecharModal = function(id) {
    document.getElementById(id).style.display = "none";
  };

  // Fecha modal clicando fora
  window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  };

});

