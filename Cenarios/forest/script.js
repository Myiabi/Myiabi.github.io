const btnBack = document.getElementById('btn-back');
    
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            const destino = btnBack.getAttribute('data-destino');
            if (destino) window.location.href = destino;
        });
    }
