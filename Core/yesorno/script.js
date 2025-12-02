const ConfirmModal = {
    // 1. Cria o HTML e injeta na página (roda sozinho ao iniciar)
    init() {
        if (document.querySelector('.modal-overlay')) return; // Já existe? Para.

        const html = `
            <div class="modal-overlay" id="customModal">
                <div class="modal-box">
                    <h3 id="modalText">Tem certeza?</h3>
                    <div class="modal-buttons">
                        <button class="modal-btn btn-yes" id="btnYes">YES</button>
                        <button class="modal-btn btn-no" id="btnNo">NO</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Evento pra fechar no NÃO
        document.getElementById('btnNo').addEventListener('click', () => {
            this.close();
        });
    },

    // 2. Função para abrir o modal
    // texto: A pergunta que vai aparecer
    // acaoConfirmar: A FUNÇÃO que vai rodar se der YES
    ask(texto, acaoConfirmar) {
        const modal = document.getElementById('customModal');
        const titulo = document.getElementById('modalText');
        const btnYes = document.getElementById('btnYes');

        // Atualiza o texto
        titulo.innerText = texto;

        // Limpa eventos anteriores do botão YES (para não acumular funções velhas)
        const novoBtnYes = btnYes.cloneNode(true);
        btnYes.parentNode.replaceChild(novoBtnYes, btnYes);

        // Adiciona a nova função ao clicar YES
        novoBtnYes.addEventListener('click', () => {
            acaoConfirmar(); // Executa o que você pediu
            this.close();    // Fecha o modal
        });

        // Mostra o modal
        modal.style.display = 'flex';
    },

    // 3. Fecha o modal
    close() {
        document.getElementById('customModal').style.display = 'none';
    }
};

// Inicializa a estrutura assim que o script carregar
ConfirmModal.init();