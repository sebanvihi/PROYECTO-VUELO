document.addEventListener('DOMContentLoaded', () => {
    const btnReservar = document.querySelector('.reservar');
    const btnTerminos = document.getElementById('terminos');
    const modalTerminos = document.getElementById('modal-terminos');
    const btnCerrarTerminos = document.getElementById('cerrar-terminos');

    btnTerminos.addEventListener('click', (e) => {
        e.preventDefault();
        modalTerminos.showModal();
    });

    btnCerrarTerminos.addEventListener('click', () => {
        modalTerminos.close();
    });

    modalTerminos.addEventListener('click', (e) => {
        if (e.target === modalTerminos) {
            modalTerminos.close();
        }
    });

    btnReservar.addEventListener('click', () => {
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;
        
        if (origen === "" || destino === "") {
            alert("Por favor, selecciona tanto un origen como un destino para buscar.");
            return;
        }

        if (origen === destino) {
            alert("El origen y el destino no pueden ser la misma ciudad.");
            return;
        }

        window.location.href = `vuelos.html?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`;
    });
});