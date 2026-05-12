document.addEventListener('DOMContentLoaded', function() {
    const nodo1 = document.getElementById('nodo-1');
    const nodo2 = document.getElementById('nodo-2');
    const formularioGeneral = document.getElementById('formulario-general');
    const contenedorEspecifico = document.getElementById('contenedor-especifico');
    const btnSiguienteGeneral = document.getElementById('btn-siguiente-general');
    const btnSiguienteEspecifico = document.getElementById('btn-siguiente-especifico');
    const btnRegresar = document.getElementById('btn-regresar');
    const acuerdosGeneral = document.getElementById('acuerdos-general');
    const acuerdosEspecifico = document.getElementById('acuerdos-especifico');
    const numPasajerosSelect = document.getElementById('num-pasajeros');
    const listaPasajeros = document.getElementById('lista-pasajeros');
    const campoRepresentante = document.getElementById('campo-representante');
    const campoEmbarazo = document.getElementById('campo-embarazo');
    const campoAsistencia = document.getElementById('campo-asistencia');
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const sexoF = document.getElementById('sexo-f');
    const asistSi = document.getElementById('asist-si');
    const asistNo = document.getElementById('asist-no');
    let pasajeroActual = 0;
    let totalPasajeros = 1;

    function generarListaPasajeros(num) {
        totalPasajeros = parseInt(num);
        listaPasajeros.innerHTML = '';
        for(let i=0; i<totalPasajeros; i++) {
            let span = document.createElement('span');
            span.className = 'nombre-pasajero';
            if(i===0) span.classList.add('activo');
            span.textContent = `Pasajero ${i+1}`;
            span.dataset.index = i;
            span.addEventListener('click', function(e){
                document.querySelectorAll('.nombre-pasajero').forEach(el => el.classList.remove('activo'));
                this.classList.add('activo');
                pasajeroActual = parseInt(this.dataset.index);
            });
            listaPasajeros.appendChild(span);
        }
    }

    // Paso 1 → Paso 2
    btnSiguienteGeneral.addEventListener('click', function(){
        let correo = document.getElementById('correo').value;
        if(!correo) { alert('Complete el campo de correo'); return; }
        
        nodo1.classList.remove('activo');
        nodo2.classList.add('activo');
        
        formularioGeneral.style.display = 'none';
        contenedorEspecifico.style.display = 'flex';
        
        acuerdosGeneral.classList.remove('activo');
        acuerdosGeneral.classList.add('no-activo');
        acuerdosEspecifico.classList.remove('no-activo');
        acuerdosEspecifico.classList.add('activo');
        
        generarListaPasajeros(numPasajerosSelect.value);
    });

    // Paso 2 → Paso 1
    btnRegresar.addEventListener('click', function(){
        nodo2.classList.remove('activo');
        nodo1.classList.add('activo');
        
        formularioGeneral.style.display = 'flex';
        contenedorEspecifico.style.display = 'none';
        
        acuerdosEspecifico.classList.remove('activo');
        acuerdosEspecifico.classList.add('no-activo');
        acuerdosGeneral.classList.remove('no-activo');
        acuerdosGeneral.classList.add('activo');
        
        pasajeroActual = 0;
    });

    // Paso 2 → Reservas (simulación)
    btnSiguienteEspecifico.addEventListener('click', function(){
        let nombre = document.getElementById('nombre').value;
        let apellido = document.getElementById('apellido').value;
        if(!nombre || !apellido) { alert('Complete al menos nombre y apellido'); return; }
        localStorage.setItem('pasoActual', '3');
        window.location.href = 'reservaciones.html';
    });

    // --- Lógica condicional ---
    fechaNacimiento.addEventListener('input', function(){
        let fecha = new Date(this.value);
        if(isNaN(fecha.getTime())) return;
        let hoy = new Date();
        let edad = hoy.getFullYear() - fecha.getFullYear();
        let m = hoy.getMonth() - fecha.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
        if(edad < 18) campoRepresentante.classList.remove('no-visible');
        else campoRepresentante.classList.add('no-visible');
    });

    sexoF.addEventListener('change', function(){
        if(this.checked) {
            let fecha = new Date(fechaNacimiento.value);
            if(isNaN(fecha.getTime())) return;
            let hoy = new Date();
            let edad = hoy.getFullYear() - fecha.getFullYear();
            let m = hoy.getMonth() - fecha.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
            if(edad >= 18) campoEmbarazo.classList.remove('no-visible');
            else campoEmbarazo.classList.add('no-visible');
        } else {
            campoEmbarazo.classList.add('no-visible');
        }
    });

    asistSi.addEventListener('change', function() {
        if(this.checked) campoAsistencia.classList.remove('no-visible');
    });
    asistNo.addEventListener('change', function() {
        if(this.checked) campoAsistencia.classList.add('no-visible');
    });

    // Modal de términos (por si se usan los enlaces del header)
    const modalTerminos = document.getElementById('modal-terminos');
    if(modalTerminos) {
        document.querySelector('.headerNav-link[href="#"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            modalTerminos.showModal();
        });
        document.getElementById('cerrar-terminos')?.addEventListener('click', () => {
            modalTerminos.close();
        });
    }
});