// ========== DISTRIBUIÇÃO DO PASSE DROPMOON (MOON) AO ENTRAR NA FLORESTA ==========
// Se não venceu ainda, ganha o passe (permite tentar de novo se perdeu)
(function () {
  if (localStorage.getItem("dropmoon_completo") !== "true") {
    sessionStorage.setItem("acesso_dropmoon", "autorizado");
  }
})();

// Espera o loader terminar de carregar os scripts antes de tocar a trilha
function esperarETocar() {
  if (typeof tocarTrilha === "function") {
    tocarTrilha("celt");
  } else {
    setTimeout(esperarETocar, 50);
  }
}
esperarETocar();