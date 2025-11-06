// tooltip.js

const myStyle = "color: gold; font-size: 18px; font-weight: bold; animation: bounce 0.5s infinite;";

/**
 * Cria um tooltip flutuante acima e centralizado de um elemento.
 * @param {string} elementId - ID do elemento alvo
 * @param {string} content - Texto ou HTML
 * @param {number} offsetX - deslocamento horizontal
 * @param {number} offsetY - deslocamento vertical
 * @param {string} style - CSS inline opcional
 * @param {boolean} hover - se true, aparece ao passar o mouse
 */
function createFloatingTooltip(elementId, content, offsetX = 0, offsetY = -10, style = "", hover = false) {
  const element = document.getElementById(elementId);
  if (!element) return console.warn(`Elemento com ID '${elementId}' não encontrado.`);

  const tooltip = document.createElement('div');
  tooltip.className = 'floating-tooltip';
  tooltip.innerHTML = content;
  tooltip.style.position = 'absolute';
  tooltip.style.pointerEvents = 'none'; // não bloqueia clique
  tooltip.style.cssText = `${tooltip.style.cssText}; ${style}`;
  document.body.appendChild(tooltip);

  let animationFrame;
  let visible = false;

  function updatePosition() {
    if (!visible) return;
    const rect = element.getBoundingClientRect();
    const left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + window.scrollX + offsetX;
    const top = rect.top - tooltip.offsetHeight + window.scrollY + offsetY;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    animationFrame = requestAnimationFrame(updatePosition);
  }

  function hide() {
    tooltip.classList.remove('show');
    visible = false;
    if (animationFrame) cancelAnimationFrame(animationFrame);
  }

  function show(duration = 2000) {
    visible = true;
    tooltip.classList.add('show');
    updatePosition();
    setTimeout(hide, duration);
  }

  // Hover automático opcional
  if (hover) {
    element.addEventListener('mouseenter', () => {
      visible = true;
      tooltip.classList.add('show');
      updatePosition();
    });
    element.addEventListener('mouseleave', hide);
  }

  return { show, element, tooltip };
}

// ----------------------
// EXEMPLOS

// Tooltip tipo "fala", "nome da cidade", "pensamento", etc.
const cityTooltip = createFloatingTooltip('personagem', '🏰 CIDADE DE AURELIA 🏰', 0, -20, myStyle);
cityTooltip.show(3000);

// Tooltip hover (dica)
createFloatingTooltip('botao', '💡 Clique para abrir o menu!', 0, -10, myStyle, true);
