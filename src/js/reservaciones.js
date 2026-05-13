document.addEventListener('DOMContentLoaded', function () {

    const mapaAsientos = document.getElementById('mapa-asientos');
    const listadoPasajeros = document.getElementById('lista-pasajeros-actual');
    const btnAsignar = document.getElementById('btn-asignar');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const modal = document.getElementById('modal-print');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    let asientoSeleccionado = null;
    let pasajeroActivo = 0;

    let pasajeros = [];
    const datosGuardados = sessionStorage.getItem('pasajerosData');
    if (datosGuardados) {
        pasajeros = JSON.parse(datosGuardados);
    } else {
        pasajeros = [
            { nombre: 'Luis', apellido: 'Pérez', sexo: 'Masculino', fecha: '1990-03-15', asiento: null, asistencia: 'No', embarazo: 'No', menor: false, representante: '', clase: 'club' },
            { nombre: 'Ana', apellido: 'Gómez', sexo: 'Femenino', fecha: '1985-10-10', asiento: null, asistencia: 'No', embarazo: 'No', menor: false, representante: '', clase: 'club' },
            { nombre: 'Carlos', apellido: 'López', sexo: 'Masculino', fecha: '2015-06-12', asiento: null, asistencia: 'No', embarazo: 'No', menor: true, representante: 'Luis Pérez', clase: 'turista' }
        ];
    }

    function mostrarAlerta(mensaje) {
        const modal = document.getElementById('modal-alerta');
        document.getElementById('mensaje-alerta').textContent = mensaje;
        modal.showModal();

        document.getElementById('cerrar-alerta').onclick = () => modal.close();
        document.getElementById('btn-entendido-alerta').onclick = () => modal.close();
    }

    function generarAvion() {
        let html = '';

        const generarFlechas = () => {
            return `
            <div class="fila-avion fila-flechas">
                <div class="bloque-izquierdo indicador-salida-izq">
                    <span>&lt;&lt;</span>
                </div>
                <span class="num-fila"></span>
                <div class="bloque-derecho indicador-salida-der">
                    <span>&gt;&gt;</span>
                </div>
            </div>`;
        };

        for (let fila = 1; fila <= 22; fila++) {

            if (fila === 1) html += generarFlechas();

            let claseSeparacion = '';
            if (fila === 3) {
                claseSeparacion = ' separacion-cabina';
            }

            if (fila === 11) html += generarFlechas();

            const esClub = (fila <= 2);
            const esEmergencia = (fila === 11);

            let asientosIzq = esClub ? ['A', 'C'] : ['A', 'B', 'C'];
            let asientosDer = esClub ? ['D', 'F'] : ['D', 'E', 'F'];

            let tipoCabina = 'turista';
            if (fila <= 10) tipoCabina = 'club';

            html += `<div class="fila-avion${claseSeparacion}">`;

            html += `<div class="bloque-izquierdo">`;
            asientosIzq.forEach(letra => {
                let clasesAsiento = `asiento ${tipoCabina}`;
                if (esEmergencia) clasesAsiento += ' emergencia';
                html += `<div class="${clasesAsiento}" data-fila="${fila}" data-letra="${letra}" data-clase="${tipoCabina}">${letra}</div>`;
            });
            html += `</div>`;

            html += `<span class="num-fila${esEmergencia ? ' fila-emergencia' : ''}">${fila}</span>`;

            html += `<div class="bloque-derecho">`;
            asientosDer.forEach(letra => {
                let clasesAsiento = `asiento ${tipoCabina}`;
                if (esEmergencia) clasesAsiento += ' emergencia';
                if (fila === 22) clasesAsiento += ' no-disponible';

                html += `<div class="${clasesAsiento}" data-fila="${fila}" data-letra="${letra}" data-clase="${tipoCabina}">${letra}</div>`;
            });
            html += `</div>`;

            html += '</div>';

            if (fila === 22) html += generarFlechas();
        }

        mapaAsientos.innerHTML = html;
    }

    function renderPasajeros() {
        listadoPasajeros.innerHTML = '';
        pasajeros.forEach((p, index) => {
            let div = document.createElement('div');
            div.className = `item-pasajero ${index === pasajeroActivo ? 'activo' : ''}`;
            div.dataset.index = index;
            let necesidades = [];
            if (p.asistencia !== 'No') necesidades.push(p.asistencia);
            if (p.embarazo === 'Si') necesidades.push('Embarazo');
            let necStr = necesidades.length > 0 ? necesidades.join('/') : 'Ninguna';
            let nombreClase = p.clase === 'club' ? 'Economy Club' : 'Turista';
            div.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong style="margin-bottom: 0;">${p.nombre} ${p.apellido}</strong>
                    <span style="font-size: 0.75rem; background: #e9ecef; color: #333; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${nombreClase}</span>
                </div>
                <small>${necStr}; ${p.fecha}</small>
                <span class="asiento-asignado">${p.asiento ? 'Asiento: ' + p.asiento : 'Sin asiento asignado'}</span>
            `;
            div.addEventListener('click', function () {
                document.querySelectorAll('.item-pasajero').forEach(el => el.classList.remove('activo'));
                this.classList.add('activo');
                pasajeroActivo = index;
                document.querySelectorAll('.asiento.seleccionado').forEach(el => el.classList.remove('seleccionado'));
                asientoSeleccionado = null;
            });
            listadoPasajeros.appendChild(div);
        });
    }

    function ocuparAsientosAleatorios() {
        let desgloseStr = sessionStorage.getItem('desgloseAsientos');
        if (!desgloseStr) return;
        let desglose = JSON.parse(desgloseStr);

        const clases = ['club', 'turista'];

        clases.forEach(clase => {
            let asientosClase = Array.from(document.querySelectorAll(`#mapa-asientos .asiento.${clase}:not(.no-disponible)`));
            
            let disponibles = clase === 'club' ? ((desglose.club || 0) + (desglose.premium || 0)) : (desglose[clase] || 0);
            
            let asientosAOcupar = asientosClase.length - disponibles;

            if (asientosAOcupar > 0) {
                // Mezclar asientos de la clase
                for (let i = asientosClase.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [asientosClase[i], asientosClase[j]] = [asientosClase[j], asientosClase[i]];
                }

                // Ocupar los primeros N
                for (let i = 0; i < asientosAOcupar; i++) {
                    asientosClase[i].classList.add('ocupado');
                }
            }
        });
    }

    generarAvion();
    ocuparAsientosAleatorios();
    renderPasajeros();

    let asientosClubTotales = document.querySelectorAll('#mapa-asientos .asiento.club:not(.no-disponible)').length;
    let asientosClubOcupados = document.querySelectorAll('#mapa-asientos .asiento.club.ocupado').length;
    if (asientosClubTotales > 0 && asientosClubTotales === asientosClubOcupados) {
        mostrarAlerta("Atención: Todos los asientos de Economy-Club están ocupados.");
    }

    mapaAsientos.addEventListener('click', function (e) {
        if (e.target.classList.contains('asiento') && !e.target.classList.contains('ocupado') && !e.target.classList.contains('no-disponible')) {
            let claseAsiento = e.target.dataset.clase;
            let pasajero = pasajeros[pasajeroActivo];
            if (pasajero && pasajero.clase && pasajero.clase !== claseAsiento) {
                mostrarAlerta(`Este asiento es de clase ${claseAsiento}, pero tu reserva es de clase ${pasajero.clase}.`);
                return;
            }
            document.querySelectorAll('.asiento.seleccionado').forEach(el => el.classList.remove('seleccionado'));
            e.target.classList.add('seleccionado');
            asientoSeleccionado = e.target.dataset;
        }
    });

    btnAsignar.addEventListener('click', function () {
        if (asientoSeleccionado && pasajeros[pasajeroActivo]) {
            let pasajero = pasajeros[pasajeroActivo];

            if (pasajero.asiento) {
                let filaAnterior = pasajero.asiento.slice(0, -1);
                let letraAnterior = pasajero.asiento.slice(-1);
                let asientoAnterior = document.querySelector(`.asiento[data-fila="${filaAnterior}"][data-letra="${letraAnterior}"]`);
                if (asientoAnterior) asientoAnterior.classList.remove('ocupado');
            }

            let fila = asientoSeleccionado.fila;
            let letra = asientoSeleccionado.letra;
            let asientoDiv = document.querySelector(`.asiento[data-fila="${fila}"][data-letra="${letra}"]`);
            asientoDiv.classList.add('ocupado');
            asientoDiv.classList.remove('seleccionado');
            pasajero.asiento = `${fila}${letra}`;
            renderPasajeros();
            asientoSeleccionado = null;
        } else {
            mostrarAlerta("Por favor, selecciona un asiento disponible primero.");
        }
    });

    btnConfirmar.addEventListener('click', function () {
        let todosAsignados = pasajeros.every(p => p.asiento !== null);
        if (!todosAsignados) {
            mostrarAlerta("Aún faltan pasajeros por asignar asiento.");
            return;
        }
        let info = `<p><strong>Vuelo:</strong> CCS // MAD</p><p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p><hr>`;
        pasajeros.forEach((p, i) => {
            info += `<p><strong>#${i + 1}:</strong> ${p.nombre} ${p.apellido} | Asiento: <strong>${p.asiento}</strong></p>`;
            info += `<hr>`;
        });
        document.getElementById('print-info').innerHTML = info;
        modal.showModal();
    });

    btnCerrar.addEventListener('click', function () {
        modal.close();
        window.location.href = 'index.html';
    });

    const modalTerminos = document.getElementById('modal-terminos');
    const btnTerminos = document.getElementById('terminos');
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