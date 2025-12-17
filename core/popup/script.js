// tooltip.js

// NOVO myStyle com efeito de Balão de Fala (Speech Bubble)
const myStyle = `
  color: #333333; 
  background: #FFFFCC; 
  border: 2px solid #333333; 
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.4); 
  padding: 8px 15px; 
  border-radius: 20px 20px 20px 4px; 
  font-size: 16px; 
  font-weight: bold; 
  animation: bounce 0.5s infinite;
`;

/**
 * Cria um tooltip flutuante.
 * @param {string} elementId - ID do elemento alvo
 * @param {string} content - Texto ou HTML
 * @param {number} offsetX - deslocamento horizontal
 * @param {number} offsetY - deslocamento vertical
 * @param {string} style - CSS inline opcional
 * @param {boolean} hover - se true, aparece ao passar o mouse.
 * @param {number} touchDuration - (NOVO) Tempo em ms que fica aberto ao clicar/tocar. Padrão: 2500.
 */
function createFloatingTooltip(elementId, content, offsetX = 0, offsetY = -10, style = "", hover = false, touchDuration = 2500) {
  const element = document.getElementById(elementId);
  if (!element) return console.warn(`Elemento com ID '${elementId}' não encontrado.`);

  const tooltip = document.createElement('div');
  tooltip.id = `tooltip-for-${elementId}`; 
  tooltip.className = 'floating-tooltip';
  tooltip.innerHTML = content;
  tooltip.style.position = 'absolute';
  tooltip.style.pointerEvents = 'none'; // não bloqueia clique
  
  // Aplica o style opcional
  tooltip.style.cssText = `${tooltip.style.cssText} ${style}`; 
  document.body.appendChild(tooltip);

  let animationFrame;
  let visible = false;

  function updatePosition() {
    if (!visible) return;
    const rect = element.getBoundingClientRect();
    
    // CÁLCULO PARA CENTRALIZAÇÃO HORIZONTAL
    const left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + window.scrollX + offsetX;
    
    // CÁLCULO PARA POSICIONAMENTO VERTICAL (ACIMA)
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

  // Hover automático opcional (Mouse e Toque)
  if (hover) {
    // 1. Eventos de Mouse (Desktop)
    element.addEventListener('mouseenter', () => {
      visible = true;
      tooltip.classList.add('show');
      updatePosition();
    });
    element.addEventListener('mouseleave', hide);
    
    // 2. Evento de Toque/Clique (Mobile/Tablet e Desktop)
    element.addEventListener('click', (e) => {
      e.preventDefault(); 
      show(touchDuration); // <--- USA O PARÂMETRO NOVO AQUI
    });
  }

  return { show, element, tooltip };
}

// ----------------------
// EXEMPLOS

// Tooltip manual (sem hover, só chama via script)
const cityTooltip = createFloatingTooltip('personagem', '🏰 CIDADE DE AURELIA 🏰', 0, -50, myStyle); 
// cityTooltip.show(3000); 

// EXEMPLO 1: Tooltip hover/toque com tempo padrão (2500ms no click)
createFloatingTooltip('botao', '💡 Clique para abrir o menu!', 0, -10, myStyle, true);

// EXEMPLO 2: Tooltip hover/toque com tempo personalizado (5000ms no click)
createFloatingTooltip('botao-lento', '⏳ Fico 5 segundos!', 0, -10, myStyle, true, 5000);