document.addEventListener('DOMContentLoaded', () => {
    const btnReservar = document.querySelector('.reservar');
    const btnTerminos = document.getElementById('terminos');
    const modalTerminos = document.getElementById('modal-terminos');
    const btnCerrarTerminos = document.getElementById('cerrar-terminos');

    function mostrarAlerta(mensaje) {
        const modal = document.getElementById('modal-alerta');
        document.getElementById('mensaje-alerta').textContent = mensaje;
        modal.showModal();
        
        document.getElementById('cerrar-alerta').onclick = () => modal.close();
        document.getElementById('btn-entendido-alerta').onclick = () => modal.close();
    }

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
            mostrarAlerta("Por favor, selecciona tanto un origen como un destino para buscar.");
            return;
        }

        if (origen === destino) {
            mostrarAlerta("El origen y el destino no pueden ser la misma ciudad.");
            return;
        }

        window.location.href = `vuelos.html?origen=${encodeURIComponent(origen)}&destino=${encodeURIComponent(destino)}`;
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
});