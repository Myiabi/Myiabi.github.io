const container = document.getElementById('mapa');
const topLayer = document.querySelector('.layer.top');
const loupe = document.querySelector('.loupe');
const itemLupa = document.getElementById('item-lupa');

let isDragging = false;
let RADIUS = 80;

function setClip(x, y, r = RADIUS) {
  const clip = `circle(${r}px at ${x}px ${y}px)`;
  topLayer.style.clipPath = clip;
  topLayer.style.webkitClipPath = clip;
  loupe.style.left = `${x}px`;
  loupe.style.top = `${y}px`;
}

function showLoupe() {
  loupe.style.display = 'block';
}

function hideLoupe() {
  loupe.style.display = 'none';
  topLayer.style.clipPath = `circle(0px at 0 0)`;
  topLayer.style.webkitClipPath = `circle(0px at 0 0)`;
}

// quando começa a segurar o item
itemLupa.addEventListener('mousedown', (e) => {
  isDragging = true;
  itemLupa.style.visibility = 'hidden';
});

// quando solta o mouse
document.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    itemLupa.style.visibility = 'visible';
    hideLoupe();
  }
});

// movimento do mouse
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const rect = container.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // só ativa a lupa se estiver dentro do container
  if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
    setClip(x, y);
    showLoupe();
  } else {
    hideLoupe();
  }
});
