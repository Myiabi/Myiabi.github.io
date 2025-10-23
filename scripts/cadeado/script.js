const senha = ["🎃","🕸️","🧛‍♂️","🔥"];

// Inicializa primeiro emote
document.querySelectorAll(".cadeado-digit").forEach(d => {
  d.querySelector("span").classList.add("active");
});

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
    active.classList.add("opaco")

    setTimeout (() => {
   active.classList.remove("opaco")
    }, 300)
    
    
    checkSenha();
  }, 300);
}

function checkSenha() {
  const digits = document.querySelectorAll(".cadeado-digit");
  const current = Array.from(digits).map(d => d.querySelector("span.active").textContent);
  if (current.join("") === senha.join("")) {
    alert("💀 Win! Senha correta!");
  }
}


// ABRIR MODAL

function abrirModal(id) {
  document.getElementById(id).style.display = "block";
}

function fecharModal(id) {
  document.getElementById(id).style.display = "none";
}

// fecha ao clicar fora do modal
window.onclick = function(event) {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}
