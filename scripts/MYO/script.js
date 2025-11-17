// script.js
const openBtn = document.querySelector("#openCreator");
const menu = document.querySelector("#menu");

let finalCharacter = null;
let modalOpen = false;

// ----------------------------------------------
// ASSETS (substitua pelos seus caminhos reais)
// ----------------------------------------------
const assets = {
    hair: ["./img/hair1.png","./img/hair2.png","./img/hair3.png"],
    eyes: ["./img/eyes1.png","./img/eyes2.png","./img/eyes3.png"],
    clothes: ["./img/cloth1.png","./img/cloth2.png","./img/cloth3.png"],
    crystal: ["./img/crystal1.png","./img/crystal2.png","./img/crystal3.png"],
};

const baseImg = {
    masc: "./img/base_masc.png",
    fem:  "./img/base_fem.png"
};

const index = { hair:0, eyes:0, clothes:0, crystal:0 };

// ----------------------------------------------
// ABRIR MODAL (APENAS UM)
// ----------------------------------------------
openBtn.addEventListener("click", () => {
    if (modalOpen) return; // evita abrir mais de um modal
    openCreator();
});

function openCreator() {
    modalOpen = true;

    const modalBg = document.createElement("div");
    modalBg.className = "modal-bg";

    modalBg.innerHTML = `
        <div class="modal">

            <!-- MENU À ESQUERDA -->
            <div class="left-menu" id="leftMenu">
                <h2>Montar Personagem</h2>

                <div class="row">
                    <button id="masc">Masc</button>
                    <button id="fem">Fem</button>
                </div>

                ${buildRow("hair", "Cabelo")}
                ${buildRow("eyes", "Olhos")}
                ${buildRow("clothes", "Roupa")}
                ${buildRow("crystal", "Cristal")}

                <button id="doneBtn">PRONTO</button>
            </div>

            <!-- ÁREA DO PERSONAGEM À DIREITA -->
            <div class="right-area" id="rightArea">
                <div class="creator-area" id="creator">
                    <img id="base" class="layer show" src="${baseImg.masc}">
                    <img id="hair" class="layer">
                    <img id="eyes" class="layer">
                    <img id="clothes" class="layer">
                    <img id="crystal" class="layer">
                </div>
            </div>

        </div>
    `;

    document.body.appendChild(modalBg);

    // Força posicionamento do container à direita (60% width)
    const modalEl = modalBg.querySelector(".modal");
    const leftMenu = modalBg.querySelector("#leftMenu");
    const rightArea = modalBg.querySelector("#rightArea");
    const creator = modalBg.querySelector("#creator");

    // Ajustes via JS pra garantir comportamento independente do CSS externo
    leftMenu.style.width = "40%";
    leftMenu.style.display = "flex";
    leftMenu.style.flexDirection = "column";
    leftMenu.style.gap = "12px";

    rightArea.style.width = "60%";
    rightArea.style.display = "flex";
    rightArea.style.justifyContent = "flex-end"; // mantém o container à direita
    rightArea.style.alignItems = "center";

    creator.style.width = "60%"; // o body do personagem dentro da right area
    creator.style.maxWidth = "100%";

    // Inicializa camadas
    loadAllLayers(modalBg);

    // Eventos base masc/fem
    modalBg.querySelector("#masc").onclick = () =>
        modalBg.querySelector("#base").src = baseImg.masc;

    modalBg.querySelector("#fem").onclick = () =>
        modalBg.querySelector("#base").src = baseImg.fem;

    // Botões next/prev já delegados globalmente (window.next/window.prev)
    // Botão PRONTO
    modalBg.querySelector("#doneBtn").onclick = () => finalizeCharacter(modalBg);
}

// ----------------------------------------------
// HELPERS: monta uma linha de controle
// ----------------------------------------------
function buildRow(type, label){
    return `
    <div class="row">
        <button onclick="prev('${type}')">◀</button>
        <button onclick="next('${type}')">▶</button>
        <span>${label}</span>
    </div>`;
}

// ----------------------------------------------
// ATUALIZA CAMADAS (usa IDs no modal criado)
// ----------------------------------------------
function loadAllLayers(modalRoot){
    // se modalRoot não passado, busca globalmente (segurança)
    const root = modalRoot || document;
    const types = ["hair","eyes","clothes","crystal"];
    types.forEach(t => {
        const el = root.getElementById ? root.getElementById(t) : root.querySelector(`#${t}`);
        if (el) {
            el.src = assets[t][index[t]];
            el.classList.add("show");
        }
    });
}

function update(type) {
    // Busca o elemento no documento (está no modal)
    const el = document.getElementById(type);
    if (!el) return;

    el.classList.remove("show");
    setTimeout(() => {
        el.src = assets[type][index[type]];
        el.classList.add("show");
    }, 80);
}

// expõe next/prev pro onclick inline
window.next = function(type){
    index[type] = (index[type] + 1) % assets[type].length;
    update(type);
};

window.prev = function(type){
    index[type] = (index[type] - 1 + assets[type].length) % assets[type].length;
    update(type);
};

// ----------------------------------------------
// FINALIZAÇÃO: esconde TUDO AO REDOR, mantém o personagem no MESMO LUGAR (lado direito)
// ----------------------------------------------
function finalizeCharacter(modalBg){
    const area = modalBg.querySelector("#creator");

    // captura o que tá sendo mostrado nas camadas
    html2canvas(area, { backgroundColor: null }).then(canvas => {

        finalCharacter = canvas.toDataURL("image/png");

        // Oculta o menu (left) e mantém apenas a imagem do personagem no layout original
        const leftMenu = modalBg.querySelector("#leftMenu");
        const rightArea = modalBg.querySelector("#rightArea");
        const modalEl = modalBg.querySelector(".modal");

        // Esconde somente os controles
        if (leftMenu) leftMenu.style.display = "none";

        // Mantém a rightArea visível, mas força o modal a empurrar a rightArea para a borda direita
        modalEl.style.justifyContent = "flex-end";

        // Substitui o conteúdo interno do creator pela imagem final (mantendo o mesmo tamanho/posição)
        const imgTag = document.createElement("img");
        imgTag.src = finalCharacter;
        imgTag.style.width = "100%";
        imgTag.style.height = "100%";
        imgTag.style.objectFit = "contain";
        imgTag.className = "layer show";
        // limpa e injeta
        const creator = modalBg.querySelector("#creator");
        creator.innerHTML = "";
        creator.appendChild(imgTag);

        // Atualiza a miniatura no menu (substitui se já existir)
        menu.innerHTML = `<h3>Personagem Criado:</h3><img src="${finalCharacter}" alt="avatar">`;

        // Mantém flag modal aberto (mas sem controles)
        // Se quiser fechar o modal automaticamente, chama modalBg.remove(); modalOpen = false;
    }).catch(err => {
        console.error("Erro ao gerar imagem:", err);
    });
}
