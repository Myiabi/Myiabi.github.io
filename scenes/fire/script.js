// carrega o preset no tsParticles
loadFirePreset(tsParticles);

// garante que o DOM já carregou
document.addEventListener("DOMContentLoaded", () => {
  tsParticles.load("fire-background", {
    preset: "fire"
  });
});


