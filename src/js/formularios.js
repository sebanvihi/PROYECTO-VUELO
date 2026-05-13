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
    const sexoM = document.getElementById('sexo-m');
    const asistSi = document.getElementById('asist-si');
    const asistNo = document.getElementById('asist-no');
    const btnPasajeroAnterior = document.getElementById('btn-pasajero-anterior');
    const btnPasajeroSiguiente = document.getElementById('btn-pasajero-siguiente');
    
    let pasajeroActual = 0;
    let totalPasajeros = 1;
    let pasajerosData = [];

    function mostrarAlerta(mensaje) {
        const modal = document.getElementById('modal-alerta');
        document.getElementById('mensaje-alerta').textContent = mensaje;
        modal.showModal();
        
        document.getElementById('cerrar-alerta').onclick = () => modal.close();
        document.getElementById('btn-entendido-alerta').onclick = () => modal.close();
    }

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
                guardarPasajeroForm(pasajeroActual);
                document.querySelectorAll('.nombre-pasajero').forEach(el => el.classList.remove('activo'));
                this.classList.add('activo');
                pasajeroActual = parseInt(this.dataset.index);
                cargarPasajeroForm(pasajeroActual);
            });
            listaPasajeros.appendChild(span);
        }
    }

    function guardarPasajeroForm(index) {
        if (!pasajerosData[index]) return;
        pasajerosData[index].nombre = document.getElementById('nombre').value;
        pasajerosData[index].apellido = document.getElementById('apellido').value;
        pasajerosData[index].fecha = document.getElementById('fecha-nacimiento').value;
        pasajerosData[index].sexo = document.getElementById('sexo-m').checked ? 'Masculino' : (document.getElementById('sexo-f').checked ? 'Femenino' : '');
        pasajerosData[index].embarazo = document.getElementById('emb-si').checked ? 'Si' : 'No';
        pasajerosData[index].asistencia = document.getElementById('asist-si').checked ? document.getElementById('tipo-asistencia').value : 'No';
        pasajerosData[index].representante = document.getElementById('representante').value;
        pasajerosData[index].telefono = document.getElementById('numero-telefono').value;
        pasajerosData[index].clase = document.getElementById('tipo-cabina-especifico').value;
        
        let menor = false;
        if(pasajerosData[index].fecha) {
            let fecha = new Date(pasajerosData[index].fecha);
            let hoy = new Date();
            let edad = hoy.getFullYear() - fecha.getFullYear();
            let m = hoy.getMonth() - fecha.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) edad--;
            menor = (edad < 18);
        }
        pasajerosData[index].menor = menor;
    }

    function cargarPasajeroForm(index) {
        if (!pasajerosData[index]) return;
        document.getElementById('nombre').value = pasajerosData[index].nombre;
        document.getElementById('apellido').value = pasajerosData[index].apellido;
        document.getElementById('fecha-nacimiento').value = pasajerosData[index].fecha;
        if (pasajerosData[index].sexo === 'Masculino') document.getElementById('sexo-m').checked = true;
        else if (pasajerosData[index].sexo === 'Femenino') document.getElementById('sexo-f').checked = true;
        else {
            document.getElementById('sexo-m').checked = false;
            document.getElementById('sexo-f').checked = false;
        }

        if (pasajerosData[index].embarazo === 'Si') document.getElementById('emb-si').checked = true;
        else document.getElementById('emb-no').checked = true;

        if (pasajerosData[index].asistencia !== 'No') {
            document.getElementById('asist-si').checked = true;
            document.getElementById('tipo-asistencia').value = pasajerosData[index].asistencia;
            campoAsistencia.classList.remove('no-visible');
        } else {
            document.getElementById('asist-no').checked = true;
            campoAsistencia.classList.add('no-visible');
        }

        document.getElementById('numero-telefono').value = pasajerosData[index].telefono;
        document.getElementById('tipo-cabina-especifico').value = pasajerosData[index].clase || 'turista';
        
        document.getElementById('fecha-nacimiento').dispatchEvent(new Event('input'));
        if (pasajerosData[index].sexo === 'Femenino') sexoF.dispatchEvent(new Event('change'));
        else sexoM.dispatchEvent(new Event('change'));
        
        actualizarSelectRepresentantes(index);
        document.getElementById('representante').value = pasajerosData[index].representante;
    }

    function actualizarSelectRepresentantes(indexActual = -1) {
        let select = document.getElementById('representante');
        select.innerHTML = '<option value="">Seleccione un representante</option>';
        for(let i=0; i<pasajerosData.length; i++) {
            if (i !== indexActual && !pasajerosData[i].menor && pasajerosData[i].nombre) {
                let option = document.createElement('option');
                option.value = `${pasajerosData[i].nombre} ${pasajerosData[i].apellido}`;
                option.textContent = `Pasajero ${i+1}: ${pasajerosData[i].nombre} ${pasajerosData[i].apellido}`;
                select.appendChild(option);
            }
        }
    }

    btnPasajeroAnterior.addEventListener('click', function() {
        if (pasajeroActual > 0) {
            document.querySelector(`.nombre-pasajero[data-index="${pasajeroActual - 1}"]`).click();
        }
    });

    btnPasajeroSiguiente.addEventListener('click', function() {
        if (pasajeroActual < totalPasajeros - 1) {
            document.querySelector(`.nombre-pasajero[data-index="${pasajeroActual + 1}"]`).click();
        }
    });

    // Paso 1 → Paso 2
    btnSiguienteGeneral.addEventListener('click', function(){
        let correo = document.getElementById('correo').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!correo) { mostrarAlerta('Complete el campo de correo de contacto.'); return; }
        if(!emailRegex.test(correo)) { mostrarAlerta('Por favor, ingrese un correo electrónico válido.'); return; }
        
        let telGeneral = document.getElementById('numero-telefono-general').value.replace(/\s+/g, '');
        if(!/^\d{7,15}$/.test(telGeneral)) {
            mostrarAlerta('El número de teléfono general debe contener entre 7 y 15 dígitos.');
            return;
        }
        
        nodo1.classList.remove('activo');
        nodo2.classList.add('activo');
        
        formularioGeneral.style.display = 'none';
        contenedorEspecifico.style.display = 'flex';
        
        acuerdosGeneral.classList.remove('activo');
        acuerdosGeneral.classList.add('no-activo');
        acuerdosEspecifico.classList.remove('no-activo');
        acuerdosEspecifico.classList.add('activo');
        
        generarListaPasajeros(numPasajerosSelect.value);
        
        pasajerosData = [];
        for(let i=0; i<totalPasajeros; i++) {
            pasajerosData.push({
                nombre: '',
                apellido: '',
                fecha: '',
                sexo: '',
                embarazo: 'No',
                asistencia: 'No',
                representante: '',
                telefono: '',
                menor: false,
                clase: 'turista',
                asiento: null
            });
        }
        pasajeroActual = 0;
        cargarPasajeroForm(0);
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
    });

    // Paso 2 → Reservas
    btnSiguienteEspecifico.addEventListener('click', function(){
        guardarPasajeroForm(pasajeroActual);
        
        let conteoClases = { club: 0, premium: 0, turista: 0 };

        for(let i=0; i<pasajerosData.length; i++) {
            if(!pasajerosData[i].nombre || !pasajerosData[i].apellido || !pasajerosData[i].fecha) {
                mostrarAlerta(`Complete los campos obligatorios del Pasajero ${i+1}`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            
            const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if(!nombreRegex.test(pasajerosData[i].nombre)) {
                mostrarAlerta(`El nombre del Pasajero ${i+1} solo debe contener letras.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            if(!nombreRegex.test(pasajerosData[i].apellido)) {
                mostrarAlerta(`El apellido del Pasajero ${i+1} solo debe contener letras.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            
            let telObj = pasajerosData[i].telefono.replace(/\s+/g, '');
            if(!/^\d{7,15}$/.test(telObj)) {
                mostrarAlerta(`El número de teléfono del Pasajero ${i+1} debe contener entre 7 y 15 dígitos.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            conteoClases[pasajerosData[i].clase]++;
        }

        let desgloseStr = sessionStorage.getItem('desgloseAsientos');
        let desglose = desgloseStr ? JSON.parse(desgloseStr) : { club: 8, premium: 48, turista: 69 };
        
        if (conteoClases.club > desglose.club) {
            mostrarAlerta(`Solo hay ${desglose.club} asiento(s) de Economy-Club disponibles, pero has seleccionado ${conteoClases.club}.`);
            return;
        }
        if (conteoClases.premium > desglose.premium) {
            mostrarAlerta(`Solo hay ${desglose.premium} asiento(s) Premium disponibles, pero has seleccionado ${conteoClases.premium}.`);
            return;
        }
        if (conteoClases.turista > desglose.turista) {
            mostrarAlerta(`Solo hay ${desglose.turista} asiento(s) de Turista disponibles, pero has seleccionado ${conteoClases.turista}.`);
            return;
        }

        sessionStorage.setItem('pasajerosData', JSON.stringify(pasajerosData));
        window.location.href = 'reservaciones.html';
    });

    // --- Lógica condicional ---
    fechaNacimiento.addEventListener('input', function(){
        let fecha = new Date(this.value);
        if(isNaN(fecha.getTime())) {
            campoRepresentante.classList.add('no-visible');
            return;
        }
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
        }
    });
    sexoM.addEventListener('change', function(){
        if(this.checked) {
            campoEmbarazo.classList.add('no-visible');
        }
    });

    asistSi.addEventListener('change', function() {
        if(this.checked) campoAsistencia.classList.remove('no-visible');
    });
    asistNo.addEventListener('change', function() {
        if(this.checked) campoAsistencia.classList.add('no-visible');
    });

    const btnTerminos = document.getElementById('terminos');
    const modalTerminos = document.getElementById('modal-terminos');
    const btnCerrarTerminos = document.getElementById('cerrar-terminos');

    if(modalTerminos && btnTerminos) {
        btnTerminos.addEventListener('click', (e) => {
            e.preventDefault();
            modalTerminos.showModal();
        });
        if(btnCerrarTerminos) {
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