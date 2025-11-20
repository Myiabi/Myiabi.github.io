
const container = document.getElementById('container');
let dragSrc = null;

container.addEventListener('dragstart', e => {
  if (e.target.classList.contains('item')) {
    dragSrc = e.target;
    e.dataTransfer.effectAllowed = 'move';
  }
});

container.addEventListener('dragover', e => {
  e.preventDefault();
});

container.addEventListener('dragenter', e => {
  if (e.target.classList.contains('item') && e.target !== dragSrc) {
    e.target.classList.add('over');
  }
});

container.addEventListener('dragleave', e => {
  if (e.target.classList.contains('item')) {
    e.target.classList.remove('over');
  }
});

container.addEventListener('drop', e => {
  e.preventDefault();
  if (e.target.classList.contains('item') && e.target !== dragSrc) {
    e.target.classList.remove('over');
    const srcValue = dragSrc.dataset.value;
    const tgtValue = e.target.dataset.value;
    // troca de conteúdo e data-values
    dragSrc.textContent = tgtValue;
    e.target.textContent = srcValue;
    dragSrc.dataset.value = tgtValue;
    e.target.dataset.value = srcValue;
    checkOrder();
  }
});

function checkOrder() {
  const order = Array.from(container.children).map(el => el.dataset.value).join('');
  if (order === '1234') {
    alert('✅ Sequência correta!');
  }
}

