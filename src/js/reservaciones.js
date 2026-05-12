document.addEventListener('DOMContentLoaded', function() {
    const mapaAsientos = document.getElementById('mapa-asientos');
    const listadoPasajeros = document.getElementById('lista-pasajeros-actual');
    const btnAsignar = document.getElementById('btn-asignar');
    const btnConfirmar = document.getElementById('btn-confirmar');
    const modal = document.getElementById('modal-print');
    const btnCerrar = document.getElementById('btn-cerrar-modal');
    
    let asientoSeleccionado = null;
    let pasajeroActivo = 0;
    
    let pasajeros = [
        { nombre: 'Luis', apellido: 'Pérez', sexo: 'Masculino', fecha: '15/03/1990', asiento: null, asistencia: 'No', embarazo: null, menor: false, representante: null },
        { nombre: 'Ana', apellido: 'Gómez', sexo: 'Femenino', fecha: '10/10/1985', asiento: null, asistencia: 'No', embarazo: null, menor: false, representante: null },
        { nombre: 'Carlos', apellido: 'López', sexo: 'Masculino', fecha: '12/06/2015', asiento: null, asistencia: 'No', embarazo: null, menor: true, representante: 'Luis Pérez' }
    ];

    function generarAvion() {
        let html = '';
        for (let fila = 1; fila <= 22; fila++) {
            html += '<div class="fila-avion">';

            let asientosIzq = [];
            let asientosDer = [];

            if (fila <= 2) { 
                asientosIzq = ['A', 'C'];
                asientosDer = ['D', 'F'];
            } else { 
                asientosIzq = ['A', 'B', 'C'];
                asientosDer = ['D', 'E', 'F'];
            }

            let tipoFila = (fila <= 2) ? 'premium' : 'turista';
            let claseEmergencia = (fila === 10) ? ' fila-emergencia' : ''; 
            
            let claseExtra = (fila === 22) ? 'no-disponible' : '';

            html += `<div class="bloque-izquierdo">`;
            asientosIzq.forEach(letra => {
                html += `<div class="asiento ${tipoFila} ${claseExtra}" data-fila="${fila}" data-letra="${letra}">${letra}</div>`;
            });
            html += `</div>`;

            html += `<span class="num-fila${claseEmergencia}">${fila}</span>`;

            html += `<div class="bloque-derecho">`;
            asientosDer.forEach(letra => {
                html += `<div class="asiento ${tipoFila} ${claseExtra}" data-fila="${fila}" data-letra="${letra}">${letra}</div>`;
            });
            html += `</div>`;

            html += '</div>';
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
            if(p.asistencia !== 'No') necesidades.push(p.asistencia);
            if(p.embarazo === 'Si') necesidades.push('Embarazo');
            let necStr = necesidades.length > 0 ? necesidades.join('/') : 'Ninguna';
            
            div.innerHTML = `
                <strong>${p.nombre} ${p.apellido}</strong>
                <small>${necStr}; ${p.fecha}</small>
                <span class="asiento-asignado">${p.asiento ? 'Asiento: ' + p.asiento : 'Sin asiento asignado'}</span>
            `;
            
            div.addEventListener('click', function(){
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

    mapaAsientos.addEventListener('click', function(e){
        if(e.target.classList.contains('asiento') && !e.target.classList.contains('ocupado') && !e.target.classList.contains('no-disponible')) {
            document.querySelectorAll('.asiento.seleccionado').forEach(el => el.classList.remove('seleccionado'));
            e.target.classList.add('seleccionado');
            asientoSeleccionado = e.target.dataset;
        }
    });

    btnAsignar.addEventListener('click', function(){
        if(asientoSeleccionado && pasajeros[pasajeroActivo]) {
            let fila = asientoSeleccionado.fila;
            let letra = asientoSeleccionado.letra;
            let asientoDiv = document.querySelector(`.asiento[data-fila="${fila}"][data-letra="${letra}"]`);
            
            asientoDiv.classList.add('ocupado');
            asientoDiv.classList.remove('seleccionado');
            pasajeros[pasajeroActivo].asiento = `${fila}${letra}`;
            
            renderPasajeros();
            asientoSeleccionado = null;
        } else {
            alert("Por favor, selecciona un asiento primero.");
        }
    });

    btnConfirmar.addEventListener('click', function(){
        let todosAsignados = pasajeros.every(p => p.asiento !== null);
        if(!todosAsignados) {
            alert("Aún faltan pasajeros por asignar asiento.");
            return;
        }

        let info = `<p><strong>Vuelo:</strong> CCS // PMV</p><p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p><hr>`;
        pasajeros.forEach((p, i) => {
            info += `<p><strong>#${i+1}:</strong> ${p.nombre} ${p.apellido} | Asiento: <strong>${p.asiento}</strong></p>`;
            if(p.menor) info += `<p>Representante: ${p.representante}</p>`;
            info += `<hr>`;
        });
        
        document.getElementById('print-info').innerHTML = info;
        modal.classList.remove('no-activo');
    });

    btnCerrar.addEventListener('click', function(){
        modal.classList.add('no-activo');
        window.location.href = 'index.html';
    });
});