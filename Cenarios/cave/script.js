// ======================================================
// 1. INICIALIZAÇÃO GERAL
// ======================================================

// O caminho base das suas imagens. Mude se necessário.
const CHAR_BASE_PATH = '/assets/img/MYO/'; 

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Botão Voltar (Correção) ---
    const btnBack = document.getElementById('btn-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            const destino = btnBack.getAttribute('data-destino');
            if (destino) window.location.href = destino;
        });
    }

    // --- Inicializa Partículas de Fogo ---
    if (typeof tsParticles !== 'undefined') {
        // Tenta carregar o preset se a função existir
        if (typeof loadFirePreset === 'function') {
            loadFirePreset(tsParticles);
        }
        
        // Carrega as partículas no ID 'fire-background'
        tsParticles.load("fire-background", {
            preset: "fire",
            fullScreen: { enable: false }, // Garante que respeite a div
            background: { color: "#000000" } // Fundo preto caso falhe
        });
    }

    // --- Inicializa Menu do Criador ---
    // Só roda se o modal existir no HTML (evita erros em outras páginas)
    const controlsList = document.getElementById('controlsList');
    if (controlsList) {
        initCharCreator();
        setupFinishButton();
        
        // Tenta carregar personagem salvo com um pequeno delay para garantir o load do Save
        setTimeout(() => {
            if (typeof gameData !== 'undefined' && gameData.customCharacter) {
                renderSavedCharacter(gameData.customCharacter);
            }
        }, 100);
    }
});

// ======================================================
// 2. SISTEMA DE SAVE (Game Data)
// ======================================================

const defaultData = {
  itemMoeda: false,
  salaSecreta: false,
  minigameWon: false,
  dialogos: { aiko: "introducao", czar: "inicio" },
  mesas: { 1: false, 2: false, 3: false, 4: false },
  visualState: {}, 
  jardimCompleto: false, 
  itensJardim: {},       
  
  // --- PERSONAGEM CRIADO ---
  customCharacter: null, // Guarda { traits: {}, x: '...', y: '...' }
  // -------------------------

  unlockedAchievements: {}
};

const SAVE_KEY = "meuSaveDoJogo";

// Carrega o save ou usa o padrão se não existir
let gameData = JSON.parse(localStorage.getItem(SAVE_KEY)) || defaultData;

// Função para salvar sempre que mudar algo
function salvarJogo() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
        // console.log("Jogo salvo.");
    } catch (e) {
        console.error("Erro ao salvar:", e);
    }
}

// Expõe globalmente para outros scripts ou console
window.gameData = gameData;
window.salvarJogo = salvarJogo;


// ======================================================
// 3. LÓGICA DO CRIADOR (CHAR ENGINE)
// ======================================================

const charConfig = {
    body:      { label: 'Base',       max: 4,  current: 1, min: 1, filename: 'BASE' },
    eyes:      { label: 'Eyes',       max: 8,  current: 1, min: 1 }, 
    eyebrows:  { label: 'Eyebrows',   max: 4,  current: 0 }, 
    mouth:     { label: 'Mouth',      max: 10, current: 0 },
    hairStyle: { label: 'Hair Style', max: 20, current: 0 },
    hairColor: { label: 'Hair Color', type: 'color', current: 0, 
                 options: ['Black', 'Blue', 'Brown', 'Green', 'Pink', 'Purple', 'Red', 'White', 'Yellow'] },
    horns:     { label: 'Horns',      max: 3,  current: 1, min: 1 },
    claws:     { label: 'Claws',      max: 3,  current: 1, min: 1 },
    marks:     { label: 'Marks',      max: 5,  current: 0 },
    tail:      { label: 'Tail',       max: 3,  current: 1, min: 1 },
    cloth:     { label: 'Cloth',      max: 16, current: 0 },
    accessory: { label: 'Accessory',  max: 9,  current: 0 }
};

const menuOrder = ['body', 'eyes', 'eyebrows', 'mouth', 'hairStyle', 'hairColor', 'horns', 'claws', 'marks', 'tail', 'cloth', 'accessory'];

// --- Funções de Interface (UI) ---

function openGame() { document.getElementById('charCreatorModal').style.display = 'flex'; }
function closeGame() { document.getElementById('charCreatorModal').style.display = 'none'; }

function initCharCreator() {
    const controlsList = document.getElementById('controlsList');
    controlsList.innerHTML = ''; // Limpa antes de criar

    menuOrder.forEach(key => {
        const item = charConfig[key];
        const div = document.createElement('div');
        div.className = 'control-row';
        let displayVal = getDisplayValue(key, item);
        
        div.innerHTML = `
            <button class="nav-btn" onclick="changeCharItem('${key}', -1)">&#10094;</button>
            <div class="control-label">${item.label}<span class="control-value" id="val-${key}">${displayVal}</span></div>
            <button class="nav-btn" onclick="changeCharItem('${key}', 1)">&#10095;</button>
        `;
        controlsList.appendChild(div);
    });
    updateAllLayers();
}

function changeCharItem(key, direction) {
    const item = charConfig[key];
    
    if (item.type === 'color') {
        let newIndex = item.current + direction;
        if (newIndex < 0) newIndex = item.options.length - 1;
        if (newIndex >= item.options.length) newIndex = 0;
        item.current = newIndex;
    } else {
        const min = item.min || 0; 
        let newIndex = item.current + direction;
        // Loop infinito das opções
        if (newIndex > item.max) newIndex = min;
        if (newIndex < min) newIndex = item.max;
        item.current = newIndex;
    }
    
    // Atualiza texto e imagem
    document.getElementById(`val-${key}`).innerText = getDisplayValue(key, item);
    updateLayer(key);
}

function getDisplayValue(key, item) {
    if (item.type === 'color') return item.options[item.current];
    if (item.current === 0) return "None";
    return `Option ${item.current}`;
}

function updateAllLayers() {
    Object.keys(charConfig).forEach(key => { 
        if(key !== 'hairColor') updateLayer(key); 
    });
}

function updateLayer(key) {
    if (key === 'hairStyle' || key === 'hairColor') { updateHair(); return; }
    
    const item = charConfig[key];
    const imgEl = document.getElementById(`img-${key}`); // Procura a tag <img> com esse ID
    if (!imgEl) return;

    // Lógica Z-Index Dinâmico para Acessório
    if (key === 'accessory') { 
        imgEl.style.zIndex = (item.current === 2 || item.current === 4) ? "55" : "49"; 
    }

    if (item.current === 0) {
        imgEl.style.display = 'none'; 
        imgEl.src = '';
    } else {
        const filePrefix = item.filename ? item.filename : capitalize(key);
        imgEl.src = `${CHAR_BASE_PATH}${filePrefix}-${item.current}.png`;
        imgEl.style.display = 'block';
        imgEl.onerror = function() { this.style.display = 'none'; };
    }
}

function updateHair() {
    const style = charConfig.hairStyle.current;
    const colorIndex = charConfig.hairColor.current;
    const colorName = charConfig.hairColor.options[colorIndex];
    const imgEl = document.getElementById('img-hair');
    
    if (style === 0) { 
        imgEl.style.display = 'none'; 
        imgEl.src = ''; 
    } else {
        imgEl.style.display = 'block';
        imgEl.src = `${CHAR_BASE_PATH}Hair${style}-${colorName}.png`;
    }
}

// --- Helpers ---
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function getcurrentTraits() {
    const traits = {};
    Object.keys(charConfig).forEach(key => { traits[key] = charConfig[key].current; });
    return traits;
}

// --- Randomizer ---
function randomizeCharacter() {
    Object.keys(charConfig).forEach(key => {
        const item = charConfig[key];
        if (item.type === 'color') {
            item.current = Math.floor(Math.random() * item.options.length);
        } else {
            const min = item.min || 0;
            const max = item.max;
            item.current = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        // Atualiza a UI se o elemento existir
        const valueDisplay = document.getElementById(`val-${key}`);
        if(valueDisplay) valueDisplay.innerText = getDisplayValue(key, item);
        
        updateLayer(key);
    });
}

// --- Download ---
function downloadCharacter() {
    return new Promise((resolve, reject) => {
        // Cria um clone temporário para o download (garante 500x800 e sem sombras extras)
        const tempWrapper = createCharacterElement(getcurrentTraits(), '500px');
        
        tempWrapper.style.position = 'absolute';
        tempWrapper.style.left = '-9999px'; 
        tempWrapper.style.top = '0';
        tempWrapper.style.width = '500px'; 
        tempWrapper.style.height = '800px';
        tempWrapper.style.aspectRatio = 'unset';
        tempWrapper.style.filter = 'none'; // Remove drop-shadow para o PNG
        tempWrapper.style.transform = 'none';
        
        document.body.appendChild(tempWrapper);

        html2canvas(tempWrapper, { 
            backgroundColor: null, 
            scale: 2, 
            logging: false, 
            useCORS: true 
        }).then(canvas => {
            const imageURL = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = imageURL; 
            a.download = 'Personagem_Magma.png';
            document.body.appendChild(a); 
            a.click();
            document.body.removeChild(a); 
            document.body.removeChild(tempWrapper);
            resolve();
        }).catch(err => {
            console.error(err);
            if(tempWrapper.parentNode) document.body.removeChild(tempWrapper);
            reject(err);
        });
    });
}

// --- Botão Finish (Lógica de Hold/Segurar) ---
function setupFinishButton() {
    const finishBtn = document.getElementById('finishBtn');
    const finishContainer = document.getElementById('finishContainer');
    const confirmBox = document.getElementById('confirmBox');
    
    if(!finishBtn) return;
    let holdTimer = null;

    function startHold(e) {
        // e.preventDefault() aqui pode bloquear clique normal, usamos condicional
        if(e.type === 'touchstart') e.preventDefault(); 
        finishContainer.classList.add('is-holding');
        holdTimer = setTimeout(() => { 
            confirmBox.classList.add('active'); 
            cancelHold(); 
        }, 3000); // 3 segundos para ativar
    }

    function cancelHold() { 
        clearTimeout(holdTimer); 
        finishContainer.classList.remove('is-holding'); 
    }

    finishBtn.addEventListener('mousedown', startHold);
    finishBtn.addEventListener('touchstart', startHold);
    finishBtn.addEventListener('mouseup', cancelHold);
    finishBtn.addEventListener('mouseleave', cancelHold);
    finishBtn.addEventListener('touchend', cancelHold);
}

function closeConfirmBox() { document.getElementById('confirmBox').classList.remove('active'); }

// Função chamada pelo botão SIM da confirmação
async function finalizeAndDownload() {
    closeConfirmBox();
    const finishBtn = document.getElementById('finishBtn');
    const oldText = finishBtn.innerText;
    
    finishBtn.innerText = 'Baixando...';
    finishBtn.disabled = true;

    try { 
        await downloadCharacter(); // Espera o download
        finalizeCharacter();       // Salva e fecha
    } 
    catch (error) { 
        console.error("Erro download:", error); 
        finalizeCharacter(); // Salva mesmo se falhar download
    } 
    finally { 
        finishBtn.innerText = oldText; 
        finishBtn.disabled = false; 
    }
}

function finalizeCharacter() {
    const characterInfo = {
        traits: getcurrentTraits(),
        x: '50%', // Posição X inicial (meio da tela)
        y: '60%'  // Posição Y inicial
    };

    // Salva no objeto global e no localStorage
    if (window.gameData) {
        window.gameData.customCharacter = characterInfo;
        salvarJogo();
    }

    renderSavedCharacter(characterInfo);
    closeGame();
}

// --- Factory: Renderiza Personagem Salvo no Body ---
function renderSavedCharacter(charInfo) {
    const openBtn = document.getElementById('openCreatorBtn');
    if(openBtn) openBtn.style.display = 'none'; // Esconde botão de criar

    // Remove anterior se existir para não duplicar
    const existing = document.getElementById('saved-char-display');
    if(existing) existing.remove();

    // Cria o boneco visual
    const boneco = createCharacterElement(charInfo.traits, '180px');
    boneco.id = 'saved-char-display';
    boneco.style.position = 'absolute';
    boneco.style.left = charInfo.x;
    boneco.style.top = charInfo.y;
    boneco.style.transform = 'translate(-50%, -50%)'; // Centraliza no ponto X,Y
    boneco.style.zIndex = '100';

    document.body.appendChild(boneco);
}

// --- Factory: Cria a DIV com as imagens (Usado no Criador e no Save) ---
function createCharacterElement(data, width = '200px') {
    const container = document.createElement('div');
    container.style.width = width;
    container.style.height = 'auto'; 
    container.style.aspectRatio = '500 / 800'; 
    container.style.position = 'relative'; 
    container.style.display = 'inline-block'; 
    // Sombra branca suave para destacar do fundo escuro
    container.style.filter = 'drop-shadow(0 0 2px rgba(255,255,255,0.5))';

    Object.keys(data).forEach(key => {
        if(key === 'hairColor') return; 
        const currentVal = data[key];
        if(!currentVal || currentVal === 0) return; 

        const img = document.createElement('img');
        img.style.position = 'absolute'; img.style.top = '0'; img.style.left = '0';
        img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'contain';
        
        let zIndex = 0;
        if(key === 'body') zIndex = 0;
        else if(key === 'claws') zIndex = 5;
        else if(key === 'marks') zIndex = 10;
        else if(key === 'tail') zIndex = 15;
        else if(key === 'mouth') zIndex = 20;
        else if(key === 'eyes') zIndex = 25;
        else if(key === 'eyebrows') zIndex = 30;
        else if(key === 'cloth') zIndex = 35;
        else if(key === 'hairStyle') zIndex = 45;
        else if(key === 'horns') zIndex = 50;
        else if(key === 'accessory') { zIndex = (currentVal === 2 || currentVal === 4) ? 55 : 49; }
        img.style.zIndex = zIndex;

        const itemConfig = charConfig[key]; 
        if (key === 'hairStyle') {
            const colorIndex = data['hairColor'] || 0;
            const colorName = charConfig.hairColor.options[colorIndex];
            img.src = `${CHAR_BASE_PATH}Hair${currentVal}-${colorName}.png`;
        } else {
            const filePrefix = itemConfig.filename ? itemConfig.filename : capitalize(key);
            img.src = `${CHAR_BASE_PATH}${filePrefix}-${currentVal}.png`;
        }
        container.appendChild(img);
    });
    return container;
}

// Expõe funções necessárias para o HTML (Botões onClick)
window.openGame = openGame;
window.closeGame = closeGame;
window.changeCharItem = changeCharItem;
window.randomizeCharacter = randomizeCharacter;
window.downloadCharacter = downloadCharacter;
window.closeConfirmBox = closeConfirmBox;
window.finalizeAndDownload = finalizeAndDownload;