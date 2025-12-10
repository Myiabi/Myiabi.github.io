const ConfirmModal = {
    // 1. Cria o HTML com nomes ÚNICOS
    _ensureModalExists() {
        // IDs novos para não conflitar
        const existingOverlay = document.getElementById('yesnoModal');
        const existingText = document.getElementById('yesnoText');

        // Auto-reparo: se achar algo velho ou quebrado com esse ID, remove
        if (existingOverlay && !existingText) {
            existingOverlay.remove();
        }

        if (document.getElementById('yesnoModal')) return;

        // HTML com classes e IDs exclusivos 'yesno-'
        const html = `
            <div class="yesno-overlay" id="yesnoModal">
                <div class="yesno-box">
                    <h3 id="yesnoText">Confirma?</h3>
                    <div class="yesno-buttons">
                        <button class="yesno-btn btn-yes-unique" id="yesnoBtnYes">YES</button>
                        <button class="yesno-btn btn-no-unique" id="yesnoBtnNo">NO</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        
        // Configura o botão NO
        document.getElementById('yesnoBtnNo').addEventListener('click', () => {
            this.close();
        });
    },

    ask(texto, acaoConfirmar) {
        this._ensureModalExists();

        // Busca pelos IDs novos
        const modal = document.getElementById('yesnoModal');
        const titulo = document.getElementById('yesnoText');
        const btnYes = document.getElementById('yesnoBtnYes');

        titulo.innerText = texto;

        // Truque do cloneNode para limpar eventos antigos
        const novoBtnYes = btnYes.cloneNode(true);
        btnYes.parentNode.replaceChild(novoBtnYes, btnYes);

        novoBtnYes.addEventListener('click', () => {
            this.close();
            acaoConfirmar();
        });

        modal.style.display = 'flex';
    },

    close() {
        const modal = document.getElementById('yesnoModal');
        if (modal) modal.style.display = 'none';
    }
};