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
            <td>${vuelo.origen} - ${vuelo.destino}</td>
            <td>${vuelo.fecha} | ${vuelo.hora}</td>
            <td>${numPasajeros} pasajero(s)</td>
            <td style="display: flex; gap: 10px;">
                <button class="btn-editar" data-id="${vuelo.id}">Editar Asientos</button>
                <button class="btn-cancelar" data-id="${vuelo.id}" style="background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s;">Cancelar</button>
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
                sessionStorage.clear();
                sessionStorage.setItem('claveReserva', reserva.id);
                sessionStorage.setItem('vueloOrigen', reserva.origen);
                sessionStorage.setItem('vueloDestino', reserva.destino);
                sessionStorage.setItem('vueloHora', reserva.hora);
                sessionStorage.setItem('vueloFecha', reserva.fecha);
                sessionStorage.setItem('pasajerosData', JSON.stringify(reserva.pasajeros));
                if (reserva.asientosAleatorios) {
                    sessionStorage.setItem('asientosAleatorios', JSON.stringify(reserva.asientosAleatorios));
                }
                
                // Redirigir a editar asientos
                window.location.href = 'reservaciones.html';
            }
        });
    });

    document.querySelectorAll('.btn-cancelar').forEach(btn => {
        btn.addEventListener('click', function () {
            let bookingId = this.dataset.id;
            if (confirm("¿Estás seguro de que deseas cancelar este vuelo? Esta acción no se puede deshacer.")) {
                let misVuelosActualizados = misVuelos.filter(v => v.id !== bookingId);
                localStorage.setItem('misVuelos', JSON.stringify(misVuelosActualizados));
                window.location.reload();
            }
        });
    });

    const btnPrivacidad = document.getElementById('privacidad');
    const modalPrivacidad = document.getElementById('modal-privacidad');
    const btnCerrarPrivacidad = document.getElementById('cerrar-privacidad');

    if (btnPrivacidad && modalPrivacidad) {
        btnPrivacidad.addEventListener('click', (e) => {
            e.preventDefault();
            modalPrivacidad.showModal();
        });
        if (btnCerrarPrivacidad) {
            btnCerrarPrivacidad.addEventListener('click', () => {
                modalPrivacidad.close();
            });
        }
        modalPrivacidad.addEventListener('click', (e) => {
            if (e.target === modalPrivacidad) {
                modalPrivacidad.close();
            }
        });
    }

    const btnTerminos = document.getElementById('terminos');
    const modalTerminos = document.getElementById('modal-terminos');
    const btnCerrarTerminos = document.getElementById('cerrar-terminos');

    if (btnTerminos && modalTerminos) {
        btnTerminos.addEventListener('click', (e) => {
            e.preventDefault();
            modalTerminos.showModal();
        });
        if (btnCerrarTerminos) {
            btnCerrarTerminos.addEventListener('click', () => {
                modalTerminos.close();
            });
        }
        modalTerminos.addEventListener('click', (e) => {
            if (e.target === modalTerminos) {
                modalTerminos.close();
            }
        });
    }
});
