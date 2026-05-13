document.addEventListener('DOMContentLoaded', function () {

    const mapaAsientos = document.getElementById('mapa-asientos');
    const listadoPasajeros = document.getElementById('lista-pasajeros-actual');
    const btnAsignar = document.getElementById('btn-asignar');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const modal = document.getElementById('modal-print');
    const btnCerrar = document.getElementById('btn-cerrar-modal');

    let asientoSeleccionado = null;
    let pasajeroActivo = 0;

    let pasajeros = [
        { nombre: 'Luis', apellido: 'Pérez', sexo: 'Masculino', fecha: '15/03/1990', asiento: null, asistencia: 'No', embarazo: null, menor: false, representante: null, clase: 'club' },
        { nombre: 'Ana', apellido: 'Gómez', sexo: 'Femenino', fecha: '10/10/1985', asiento: null, asistencia: 'No', embarazo: null, menor: false, representante: null, clase: 'premium' },
        { nombre: 'Carlos', apellido: 'López', sexo: 'Masculino', fecha: '12/06/2015', asiento: null, asistencia: 'No', embarazo: null, menor: true, representante: 'Luis Pérez', clase: 'turista' }
    ];

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
            if (fila <= 2) tipoCabina = 'club';
            else if (fila <= 10) tipoCabina = 'premium';

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
            let nombreClase = p.clase === 'club' ? 'Economy Club' : (p.clase === 'premium' ? 'Premium' : 'Turista');
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

    generarAvion();
    renderPasajeros();

    mapaAsientos.addEventListener('click', function (e) {
        if (e.target.classList.contains('asiento') && !e.target.classList.contains('ocupado') && !e.target.classList.contains('no-disponible')) {
            let claseAsiento = e.target.dataset.clase;
            let pasajero = pasajeros[pasajeroActivo];
            if (pasajero && pasajero.clase && pasajero.clase !== claseAsiento) {
                alert(`Este asiento es de clase ${claseAsiento}, pero tu reserva es de clase ${pasajero.clase}.`);
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
            alert("Por favor, selecciona un asiento disponible primero.");
        }
    });

    btnConfirmar.addEventListener('click', function () {
        let todosAsignados = pasajeros.every(p => p.asiento !== null);
        if (!todosAsignados) {
            alert("Aún faltan pasajeros por asignar asiento.");
            return;
        }
        let info = `<p><strong>Vuelo:</strong> CCS // MAD</p><p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p><hr>`;
        pasajeros.forEach((p, i) => {
            info += `<p><strong>#${i + 1}:</strong> ${p.nombre} ${p.apellido} | Asiento: <strong>${p.asiento}</strong></p>`;
            info += `<hr>`;
        });
        document.getElementById('print-info').innerHTML = info;
        modal.classList.remove('no-activo');
    });

    btnCerrar.addEventListener('click', function () {
        modal.classList.add('no-activo');
        window.location.href = 'index.html';
    });
});