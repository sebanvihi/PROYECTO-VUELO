document.addEventListener('DOMContentLoaded', function () {
    const tablaCuerpo = document.getElementById('cuerpo-tabla-mis-vuelos');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    const tablaCompleta = document.getElementById('tabla-mis-vuelos');

    let misVuelos = JSON.parse(localStorage.getItem('misVuelos')) || [];

    if (misVuelos.length === 0) {
        tablaCompleta.style.display = 'none';
        mensajeVacio.style.display = 'block';
        return;
    }

    misVuelos.forEach((vuelo) => {
        let tr = document.createElement('tr');
        
        let numPasajeros = vuelo.pasajeros ? vuelo.pasajeros.length : 0;
        
        tr.innerHTML = `
            <td><strong>${vuelo.id}</strong></td>
            <td>${vuelo.origen} - ${vuelo.destino}</td>
            <td>${vuelo.fecha} | ${vuelo.hora}</td>
            <td>${numPasajeros} pasajero(s)</td>
            <td>
                <button class="btn-editar" data-id="${vuelo.id}">Editar Asientos</button>
            </td>
        `;
        tablaCuerpo.appendChild(tr);
    });

    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', function () {
            let bookingId = this.dataset.id;
            let reserva = misVuelos.find(v => v.id === bookingId);
            if (reserva) {
                // Cargar datos en sessionStorage para el módulo de reservaciones
                sessionStorage.setItem('claveReserva', reserva.id);
                sessionStorage.setItem('vueloOrigen', reserva.origen);
                sessionStorage.setItem('vueloDestino', reserva.destino);
                sessionStorage.setItem('vueloHora', reserva.hora);
                sessionStorage.setItem('vueloFecha', reserva.fecha);
                sessionStorage.setItem('pasajerosData', JSON.stringify(reserva.pasajeros));
                
                // Redirigir a editar asientos
                window.location.href = 'reservaciones.html';
            }
        });
    });
});
