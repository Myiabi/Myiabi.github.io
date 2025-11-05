const myStyle = "color: gold;font-size: 16px; font-weight: bold; animation: bounce 0.5s infinite;";

/**
 * Cria um tooltip flutuante acima de um elemento.
 * @param {string} elementId - ID do elemento alvo
 * @param {string} content - HTML ou texto a exibir
 * @param {number} offsetX - deslocamento horizontal
 * @param {number} offsetY - deslocamento vertical
 * @param {string} style - CSS inline opcional
 * @param {boolean} hover - se true, aparece ao passar o mouse
 */
function createFloatingTooltip(elementId, content, offsetX = 0, offsetY = -10, style = "", hover = false) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const tooltip = document.createElement('div');
  tooltip.className = 'floating-tooltip';
  tooltip.innerHTML = content;
  tooltip.style.position = 'absolute';
  tooltip.style.pointerEvents = 'none'; // não bloqueia clique
  tooltip.style.cssText += style;
  document.body.appendChild(tooltip);

  let animationFrame;

  function updatePosition() {
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + window.scrollX + offsetX + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight + window.scrollY + offsetY + 'px';
    animationFrame = requestAnimationFrame(updatePosition);
  }

  function show(duration = 2000) {
    tooltip.classList.add('show');
    updatePosition();
    setTimeout(() => {
      tooltip.classList.remove('show');
      cancelAnimationFrame(animationFrame);
    }, duration);
  }

  // Hover automático opcional
  if (hover) {
    element.addEventListener('mouseenter', () => {
      tooltip.classList.add('show');
      updatePosition();
    });
    element.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
      cancelAnimationFrame(animationFrame);
    });
  }

  return { show, element, tooltip };
}

// ----------------------
// EXEMPLOS

// Tooltip manual (tipo emote ou fala)
const questTooltip = createFloatingTooltip('personagem', '🧙‍♂️ Mago Falante', 0, -10, myStyle);
questTooltip.show(500);

// Tooltip automática (hover)
createFloatingTooltip('botao', '💡 Clique para abrir o menu!', 0, -10, myStyle, true);
