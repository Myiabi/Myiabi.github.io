// ========== DISTRIBUIÇÃO DO PASSE DROPMOON (MOON) AO ENTRAR NA FLORESTA ==========
// Se não venceu ainda, ganha o passe (permite tentar de novo se perdeu)
(function () {
  if (localStorage.getItem("dropmoon_completo") !== "true") {
    sessionStorage.setItem("acesso_dropmoon", "autorizado");
  }
})();
