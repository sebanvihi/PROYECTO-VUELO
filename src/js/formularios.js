document.addEventListener('DOMContentLoaded', function () {
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

    let fechaHoy = new Date();
    fechaNacimiento.max = fechaHoy.toISOString().split("T")[0];
    fechaNacimiento.min = "1910-01-01";

    function calcularEdadExacta(fechaNacimientoStr, fechaVueloStr) {
        if (!fechaNacimientoStr) return -1;
        let partesNac = fechaNacimientoStr.split('-');
        if (partesNac.length !== 3) return -1;
        let fechaNac = new Date(partesNac[0], partesNac[1] - 1, partesNac[2]);
        
        let fechaVuelo;
        if (fechaVueloStr) {
            let partesVuelo = fechaVueloStr.split('-');
            fechaVuelo = new Date(partesVuelo[0], partesVuelo[1] - 1, partesVuelo[2]);
        } else {
            fechaVuelo = new Date();
        }

        let edad = fechaVuelo.getFullYear() - fechaNac.getFullYear();
        let m = fechaVuelo.getMonth() - fechaNac.getMonth();
        if (m < 0 || (m === 0 && fechaVuelo.getDate() < fechaNac.getDate())) edad--;
        return edad;
    }

    let storedCorreo = sessionStorage.getItem('contactoCorreo');
    if (storedCorreo) document.getElementById('correo').value = storedCorreo;

    let storedTelGeneral = sessionStorage.getItem('contactoTelefono');
    if (storedTelGeneral) {
        let parts = storedTelGeneral.split(' ');
        if (parts.length > 1) {
            document.getElementById('codigo-pais-general').value = parts[0];
            document.getElementById('numero-telefono-general').value = parts.slice(1).join(' ');
        } else {
            document.getElementById('numero-telefono-general').value = storedTelGeneral;
        }
    }

    let asientosDisponibles = parseInt(sessionStorage.getItem('asientosDisponibles'));
    if (isNaN(asientosDisponibles) || asientosDisponibles <= 0) asientosDisponibles = 9;
    let maxPasajeros = Math.min(asientosDisponibles, 9);
    
    numPasajerosSelect.innerHTML = '';
    for (let i = 1; i <= maxPasajeros; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        numPasajerosSelect.appendChild(option);
    }

    let storedNumPasajeros = sessionStorage.getItem('numPasajeros');
    if (storedNumPasajeros && parseInt(storedNumPasajeros) <= maxPasajeros) {
        numPasajerosSelect.value = storedNumPasajeros;
    } else {
        numPasajerosSelect.value = "1";
    }

    let origenStr = sessionStorage.getItem('vueloOrigen');
    let destinoStr = sessionStorage.getItem('vueloDestino');
    let horaStr = sessionStorage.getItem('vueloHora');
    
    if (origenStr && destinoStr) {
        let elRuta = document.getElementById('ruta-vuelo');
        if (elRuta) elRuta.textContent = `${origenStr} - ${destinoStr}`;
    }
    if (horaStr) {
        let elHora = document.getElementById('hora-salida');
        if (elHora) elHora.textContent = horaStr;
    }

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
        for (let i = 0; i < totalPasajeros; i++) {
            let span = document.createElement('span');
            span.className = 'nombre-pasajero';
            if (i === 0) span.classList.add('activo');
            span.textContent = `Pasajero ${i + 1}`;
            span.dataset.index = i;
            span.addEventListener('click', function (e) {
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
        pasajerosData[index].telefono = document.getElementById('codigo-pais').value + ' ' + document.getElementById('numero-telefono').value;
        pasajerosData[index].clase = document.getElementById('tipo-cabina-especifico').value;
        pasajerosData[index].nacionalidad = document.getElementById('nacionalidad').value;
        pasajerosData[index].tipoDocumento = document.getElementById('tipo-documento').value;
        pasajerosData[index].numeroDocumento = document.getElementById('numero-documento').value;
        pasajerosData[index].paisEmisor = document.getElementById('pais-emisor').value;
        pasajerosData[index].vencimientoDocumento = document.getElementById('vencimiento-documento').value;
        pasajerosData[index].certificadoEmbarazo = document.getElementById('acepta-certificado-emb').checked;
        pasajerosData[index].infanteAsiento = document.getElementById('infante-regazo').checked ? 'regazo' : 'asiento';

        let menor = false;
        let infante = false;
        if (pasajerosData[index].fecha) {
            let edad = calcularEdadExacta(pasajerosData[index].fecha, sessionStorage.getItem('vueloFecha'));
            menor = (edad < 18);
            infante = (edad < 2);
        }
        pasajerosData[index].menor = menor;
        pasajerosData[index].infante = infante;
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

        if (pasajerosData[index].embarazo === 'Si') {
            document.getElementById('emb-si').checked = true;
            document.getElementById('emb-si').dispatchEvent(new Event('change'));
        } else {
            document.getElementById('emb-no').checked = true;
            document.getElementById('emb-no').dispatchEvent(new Event('change'));
        }

        if (pasajerosData[index].asistencia !== 'No') {
            document.getElementById('asist-si').checked = true;
            document.getElementById('tipo-asistencia').value = pasajerosData[index].asistencia;
            campoAsistencia.classList.remove('no-visible');
        } else {
            document.getElementById('asist-no').checked = true;
            campoAsistencia.classList.add('no-visible');
        }

        let telString = pasajerosData[index].telefono || '';
        let telParts = telString.split(' ');
        if (telParts.length > 1) {
            document.getElementById('codigo-pais').value = telParts[0];
            document.getElementById('numero-telefono').value = telParts.slice(1).join(' ');
        } else {
            document.getElementById('numero-telefono').value = telString;
        }

        document.getElementById('tipo-cabina-especifico').value = pasajerosData[index].clase || 'turista';
        document.getElementById('nacionalidad').value = pasajerosData[index].nacionalidad || 'Venezolano';
        document.getElementById('tipo-documento').value = pasajerosData[index].tipoDocumento || 'Pasaporte';
        document.getElementById('numero-documento').value = pasajerosData[index].numeroDocumento || '';
        document.getElementById('pais-emisor').value = pasajerosData[index].paisEmisor || 'Venezuela';
        document.getElementById('vencimiento-documento').value = pasajerosData[index].vencimientoDocumento || '';
        document.getElementById('acepta-certificado-emb').checked = pasajerosData[index].certificadoEmbarazo || false;

        if (pasajerosData[index].infanteAsiento === 'asiento') {
            document.getElementById('infante-propio').checked = true;
        } else {
            document.getElementById('infante-regazo').checked = true;
        }

        document.getElementById('fecha-nacimiento').dispatchEvent(new Event('input'));
        if (pasajerosData[index].sexo === 'Femenino') sexoF.dispatchEvent(new Event('change'));
        else sexoM.dispatchEvent(new Event('change'));

        actualizarSelectRepresentantes(index);
        document.getElementById('representante').value = pasajerosData[index].representante;
    }

    function actualizarSelectRepresentantes(indexActual = -1) {
        let select = document.getElementById('representante');
        select.innerHTML = '<option value="">Seleccione un representante</option>';
        for (let i = 0; i < pasajerosData.length; i++) {
            if (i !== indexActual && !pasajerosData[i].menor && pasajerosData[i].nombre) {
                let option = document.createElement('option');
                option.value = `${pasajerosData[i].nombre} ${pasajerosData[i].apellido}`;
                option.textContent = `Pasajero ${i + 1}: ${pasajerosData[i].nombre} ${pasajerosData[i].apellido}`;
                select.appendChild(option);
            }
        }
    }

    btnPasajeroAnterior.addEventListener('click', function () {
        if (pasajeroActual > 0) {
            document.querySelector(`.nombre-pasajero[data-index="${pasajeroActual - 1}"]`).click();
        }
    });

    btnPasajeroSiguiente.addEventListener('click', function () {
        if (pasajeroActual < totalPasajeros - 1) {
            document.querySelector(`.nombre-pasajero[data-index="${pasajeroActual + 1}"]`).click();
        }
    });

    // Paso 1 → Paso 2
    btnSiguienteGeneral.addEventListener('click', function () {
        let correo = document.getElementById('correo').value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.[a-zA-Z]+$/;
        if (!correo) { mostrarAlerta('Complete el campo de correo de contacto.'); return; }
        if (!emailRegex.test(correo)) { mostrarAlerta('Por favor, ingrese un correo electrónico válido.'); return; }

        let telGeneralCompleto = document.getElementById('codigo-pais-general').value + ' ' + document.getElementById('numero-telefono-general').value;
        let telGeneralSoloNum = document.getElementById('numero-telefono-general').value.replace(/[\s]/g, '');
        if (!/^\d{7,15}$/.test(telGeneralSoloNum)) {
            mostrarAlerta('El número de teléfono general debe contener entre 7 y 15 dígitos y solo números.');
            return;
        }

        sessionStorage.setItem('contactoCorreo', correo);
        sessionStorage.setItem('contactoTelefono', telGeneralCompleto);
        sessionStorage.setItem('numPasajeros', numPasajerosSelect.value);

        nodo1.classList.remove('activo');
        nodo2.classList.add('activo');

        formularioGeneral.style.display = 'none';
        contenedorEspecifico.style.display = 'flex';

        acuerdosGeneral.classList.remove('activo');
        acuerdosGeneral.classList.add('no-activo');
        acuerdosEspecifico.classList.remove('no-activo');
        acuerdosEspecifico.classList.add('activo');

        const CIUDADES_PAISES = {
            "Caracas": "Venezuela", "Valencia": "Venezuela", "Maracaibo": "Venezuela", "Porlamar": "Venezuela",
            "Madrid": "España", "Bogotá": "Colombia", "Miami": "Estados Unidos", "Panamá": "Panamá", "Buenos Aires": "Argentina", "Lima": "Perú"
        };
        let vueloOrigen = sessionStorage.getItem('vueloOrigen');
        let vueloDestino = sessionStorage.getItem('vueloDestino');
        let paisOrigen = CIUDADES_PAISES[vueloOrigen] || "Venezuela";
        let paisDestino = CIUDADES_PAISES[vueloDestino] || "Venezuela";
        let esInternacional = paisOrigen !== paisDestino;
        if (esInternacional) {
            document.getElementById('campo-vencimiento').classList.remove('no-visible');
        } else {
            document.getElementById('campo-vencimiento').classList.add('no-visible');
        }

        generarListaPasajeros(numPasajerosSelect.value);

        if (pasajerosData.length !== totalPasajeros) {
            let dataPrevia = sessionStorage.getItem('pasajerosData');
            let arrayPrevio = dataPrevia ? JSON.parse(dataPrevia) : [];
            let nuevosPasajeros = [];
            
            for (let i = 0; i < totalPasajeros; i++) {
                if (pasajerosData[i]) {
                    nuevosPasajeros.push(pasajerosData[i]);
                } else if (arrayPrevio[i]) {
                    nuevosPasajeros.push(arrayPrevio[i]);
                } else {
                    nuevosPasajeros.push({
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
                        nacionalidad: 'Venezolano',
                        tipoDocumento: 'Pasaporte',
                        numeroDocumento: '',
                        paisEmisor: 'Venezuela',
                        vencimientoDocumento: '',
                        certificadoEmbarazo: false,
                        infante: false,
                        infanteAsiento: 'regazo',
                        asiento: null
                    });
                }
            }
            pasajerosData = nuevosPasajeros;
        }
        pasajeroActual = 0;
        cargarPasajeroForm(0);
    });

    // Paso 2 → Paso 1
    btnRegresar.addEventListener('click', function () {
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
    btnSiguienteEspecifico.addEventListener('click', function () {
        guardarPasajeroForm(pasajeroActual);

        let conteoClases = { club: 0, premium: 0, turista: 0 };
        const CIUDADES_PAISES = {
            "Caracas": "Venezuela", "Valencia": "Venezuela", "Maracaibo": "Venezuela", "Porlamar": "Venezuela",
            "Madrid": "España", "Bogotá": "Colombia", "Miami": "Estados Unidos", "Panamá": "Panamá", "Buenos Aires": "Argentina", "Lima": "Perú"
        };
        let vueloOrigen = sessionStorage.getItem('vueloOrigen');
        let vueloDestino = sessionStorage.getItem('vueloDestino');
        let paisOrigen = CIUDADES_PAISES[vueloOrigen] || "Venezuela";
        let paisDestino = CIUDADES_PAISES[vueloDestino] || "Venezuela";
        let esInternacional = paisOrigen !== paisDestino;

        let todosMenores = true;
        let documentosVistos = new Set();
        let regazoPorAdulto = {};

        for (let i = 0; i < pasajerosData.length; i++) {
            pasajerosData[i].nombre = pasajerosData[i].nombre.trim();
            pasajerosData[i].apellido = pasajerosData[i].apellido.trim();

            if (!pasajerosData[i].nombre || !pasajerosData[i].apellido || !pasajerosData[i].fecha) {
                mostrarAlerta(`Complete los campos obligatorios del Pasajero ${i + 1}`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            let edadExacta = calcularEdadExacta(pasajerosData[i].fecha, sessionStorage.getItem('vueloFecha'));
            
            let todayStr = new Date().toISOString().split("T")[0];
            if (pasajerosData[i].fecha > todayStr) {
                mostrarAlerta(`La fecha de nacimiento del Pasajero ${i + 1} no puede ser mayor a la fecha actual.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            if (pasajerosData[i].fecha < "1910-01-01") {
                mostrarAlerta(`La fecha de nacimiento del Pasajero ${i + 1} no puede ser anterior al 1 de enero de 1910.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            if (edadExacta === 0) {
                mostrarAlerta(`La edad del Pasajero ${i + 1} no puede ser 0.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            if (!pasajerosData[i].sexo) {
                mostrarAlerta(`Debe seleccionar el sexo del Pasajero ${i + 1}.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            if (pasajerosData[i].nombre.length < 3 || pasajerosData[i].nombre.length > 40) {
                mostrarAlerta(`El nombre del Pasajero ${i + 1} debe tener entre 3 y 40 caracteres.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            if (pasajerosData[i].apellido.length < 3 || pasajerosData[i].apellido.length > 50) {
                mostrarAlerta(`El apellido del Pasajero ${i + 1} debe tener entre 3 y 50 caracteres.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
            if (!nombreRegex.test(pasajerosData[i].nombre)) {
                mostrarAlerta(`El nombre del Pasajero ${i + 1} solo debe contener letras.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            if (!nombreRegex.test(pasajerosData[i].apellido)) {
                mostrarAlerta(`El apellido del Pasajero ${i + 1} solo debe contener letras.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            let tipoDoc = pasajerosData[i].tipoDocumento;
            let numDoc = pasajerosData[i].numeroDocumento;

            if (tipoDoc === 'Pasaporte') {
                if (!/^[0-9A-F]+$/.test(numDoc)) {
                    mostrarAlerta(`El Pasaporte del Pasajero ${i + 1} solo debe contener números y letras A-F, y no estar vacío.`);
                    document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                    return;
                }
            } else {
                if (!/^\d+$/.test(numDoc)) {
                    mostrarAlerta(`El número de documento del Pasajero ${i + 1} solo debe contener números y no estar vacío.`);
                    document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                    return;
                }
            }

            if (documentosVistos.has(pasajerosData[i].numeroDocumento)) {
                mostrarAlerta(`El número de documento del Pasajero ${i + 1} ya ha sido registrado para otro pasajero.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }
            documentosVistos.add(pasajerosData[i].numeroDocumento);

            if (esInternacional) {
                if (!pasajerosData[i].vencimientoDocumento) {
                    mostrarAlerta(`El vuelo es internacional. Debe indicar la fecha de vencimiento del documento del Pasajero ${i + 1}.`);
                    document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                    return;
                }

                let fechaVueloStr = sessionStorage.getItem('vueloFecha');
                let vueloDate = fechaVueloStr ? new Date(fechaVueloStr) : new Date();
                let limiteDate = new Date(vueloDate);
                limiteDate.setMonth(limiteDate.getMonth() + 6);

                if (pasajerosData[i].vencimientoDocumento && pasajerosData[i].vencimientoDocumento.trim() !== '') {
                    let vencimientoDate = new Date(pasajerosData[i].vencimientoDocumento);
                    if (vencimientoDate < limiteDate) {
                        mostrarAlerta(`Para vuelos internacionales, el documento del Pasajero ${i + 1} debe tener una vigencia de al menos 6 meses posteriores a la fecha del vuelo.`);
                        document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                        return;
                    }
                }
            }

            if (pasajerosData[i].embarazo === 'Si' && !pasajerosData[i].certificadoEmbarazo) {
                mostrarAlerta(`El Pasajero ${i + 1} indicó embarazo. Debe marcar la casilla confirmando que requerirá certificado médico si tiene más de 28 semanas.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            let todayStrDocs = new Date().toISOString().split("T")[0];
            if (pasajerosData[i].vencimientoDocumento && pasajerosData[i].vencimientoDocumento < todayStrDocs) {
                mostrarAlerta(`El documento ingresado no es válido. Su fecha de validez ha expirado.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            let telObjParts = pasajerosData[i].telefono.split(' ');
            let telSoloNum = telObjParts.slice(1).join('').replace(/[\s]/g, '');
            if (!/^\d{7,15}$/.test(telSoloNum)) {
                mostrarAlerta(`El número de teléfono del Pasajero ${i + 1} debe contener entre 7 y 15 dígitos y solo números.`);
                document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                return;
            }

            if (!pasajerosData[i].menor) todosMenores = false;

            if (pasajerosData[i].menor) {
                if (!pasajerosData[i].representante) {
                    let msj = pasajerosData[i].infante ? `El Pasajero ${i + 1} es un infante menor de 2 años y estrictamente debe tener un representante asignado.` : `El Pasajero ${i + 1} es menor de edad y debe tener un representante asignado.`;
                    mostrarAlerta(msj);
                    document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                    return;
                } else {
                    let repreValido = pasajerosData.some(p => !p.menor && (`${p.nombre.trim()} ${p.apellido.trim()}` === pasajerosData[i].representante.trim()));
                    if (!repreValido) {
                        mostrarAlerta(`El representante asignado al Pasajero ${i + 1} ya no es válido o ha cambiado de nombre. Por favor, reasígnelo.`);
                        document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                        return;
                    }
                }
            }

            if (pasajerosData[i].infante && pasajerosData[i].infanteAsiento === 'regazo') {
                let repName = pasajerosData[i].representante.trim();
                regazoPorAdulto[repName] = (regazoPorAdulto[repName] || 0) + 1;
                
                if (regazoPorAdulto[repName] > 1) {
                    mostrarAlerta(`Normativa Aeronáutica: El representante "${repName}" tiene asignado más de un infante en regazo. Cada adulto solo puede llevar a un (1) infante en su regazo. Si viaja con otro bebé, debe elegir "Asiento propio".`);
                    document.querySelector(`.nombre-pasajero[data-index="${i}"]`).click();
                    return;
                }
            }

            if (!pasajerosData[i].infante || pasajerosData[i].infanteAsiento === 'asiento') {
                conteoClases[pasajerosData[i].clase]++;
            }
        }

        if (todosMenores && pasajerosData.length > 0) {
            mostrarAlerta('La reserva contiene únicamente menores de edad. Por favor, utilice el servicio de "Menor no acompañado" contactando directamente con la aerolínea. Esta reserva web no puede continuar.');
            return;
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
    function actualizarEmbarazoVisibilidad() {
        let edad = calcularEdadExacta(fechaNacimiento.value, sessionStorage.getItem('vueloFecha'));
        if (sexoF.checked && edad >= 12) {
            campoEmbarazo.classList.remove('no-visible');
        } else {
            campoEmbarazo.classList.add('no-visible');
            document.getElementById('campo-certificado-embarazo').classList.add('no-visible');
            document.getElementById('emb-no').checked = true;
        }
    }

    fechaNacimiento.addEventListener('input', function () {
        let edad = calcularEdadExacta(this.value, sessionStorage.getItem('vueloFecha'));
        if (edad === -1 || isNaN(edad)) {
            campoRepresentante.classList.add('no-visible');
            document.getElementById('campo-infante-asiento').classList.add('no-visible');
            actualizarEmbarazoVisibilidad();
            return;
        }
        
        if (edad < 18) campoRepresentante.classList.remove('no-visible');
        else campoRepresentante.classList.add('no-visible');

        if (edad < 2) document.getElementById('campo-infante-asiento').classList.remove('no-visible');
        else document.getElementById('campo-infante-asiento').classList.add('no-visible');

        actualizarEmbarazoVisibilidad();
    });

    sexoF.addEventListener('change', actualizarEmbarazoVisibilidad);
    sexoM.addEventListener('change', actualizarEmbarazoVisibilidad);

    document.getElementById('emb-si').addEventListener('change', function () {
        if (this.checked) document.getElementById('campo-certificado-embarazo').classList.remove('no-visible');
    });
    document.getElementById('emb-no').addEventListener('change', function () {
        if (this.checked) document.getElementById('campo-certificado-embarazo').classList.add('no-visible');
    });

    asistSi.addEventListener('change', function () {
        if (this.checked) campoAsistencia.classList.remove('no-visible');
    });
    asistNo.addEventListener('change', function () {
        if (this.checked) campoAsistencia.classList.add('no-visible');
    });

    const btnTerminos = document.getElementById('terminos');
    const modalTerminos = document.getElementById('modal-terminos');
    const btnCerrarTerminos = document.getElementById('cerrar-terminos');

    if (modalTerminos && btnTerminos) {
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

    document.getElementById('nombre').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });
    document.getElementById('apellido').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    });
    
    document.getElementById('numero-telefono-general').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d]/g, '');
    });
    document.getElementById('numero-telefono').addEventListener('input', function (e) {
        this.value = this.value.replace(/[^\d]/g, '');
    });
    const selectTipoDoc = document.getElementById('tipo-documento');
    const inputNumDoc = document.getElementById('numero-documento');

    selectTipoDoc.addEventListener('change', function () {
        inputNumDoc.value = '';
    });

    inputNumDoc.addEventListener('input', function (e) {
        let tipo = selectTipoDoc.value;
        if (tipo === 'Cédula') {
            this.value = this.value.replace(/[^\d]/g, '').substring(0, 9);
        } else if (tipo === 'DNI') {
            this.value = this.value.replace(/[^\d]/g, '').substring(0, 10);
        } else if (tipo === 'Pasaporte') {
            this.value = this.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        }
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