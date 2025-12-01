document.querySelectorAll(".back").forEach(p => {
  p.addEventListener("click", () => {
    window.location.replace(p.dataset.destino);
  });
});

