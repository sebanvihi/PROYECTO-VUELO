document.addEventListener('DOMContentLoaded', () => {
    const btnReservar = document.querySelector('.reservar');

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