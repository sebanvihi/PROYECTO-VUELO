const TOTAL_ASIENTOS = 128;
const CIUDADES = ["Caracas", "Valencia", "Maracaibo", "Porlamar", "Madrid", "Bogotá", "Miami", "Panamá", "Buenos Aires", "Lima"];
const ESTADOS = ["En reserva", "A punto de abordar", "Abordando"];

function cargarPagina() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramOrigen = urlParams.get('origen');
    const paramDestino = urlParams.get('destino');

    const contenedorTabla = document.querySelector('.contenedor-tabla');
    const cuerpoTabla = document.getElementById('cuerpo-tabla');

    const modalTerminos = document.getElementById('modal-terminos');
    const btnTerminos = document.getElementById('terminos');
    const btnCerrarTerminos = document.getElementById('cerrar-terminos');

    if(btnTerminos && modalTerminos) {
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

    if (paramOrigen && paramDestino) {
        const cantidadVuelos = Math.floor(Math.random() * 4);
        if (cantidadVuelos === 0) {
            contenedorTabla.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <h2 style="font-family: 'Chunky', sans-serif; color: #001f3f; font-size: 35px; margin-bottom: 20px;">¡Lo sentimos!</h2>
                    <p style="font-size: 18px; color: #333; margin-bottom: 30px;">Actualmente no hay vuelos disponibles en la ruta <strong>${paramOrigen} a ${paramDestino}</strong>.</p>
                    <button onclick="window.location.href='index.html'" style="background-color: #4cabd3; color: white; border: none; padding: 12px 30px; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; transition: 0.3s;">
                        Volver al Inicio
                    </button>
                </div>
            `;
            return;
        } else {
            contenedorTabla.querySelector('h2').innerText = `Resultados de Búsqueda`;
            contenedorTabla.querySelector('p').innerHTML = `Se encontraron <strong>${cantidadVuelos} vuelo(s)</strong> disponibles de ${paramOrigen} a ${paramDestino}.`;

            const vuelosEncontrados = generarVuelosFijos(paramOrigen, paramDestino, cantidadVuelos);
            renderizarTabla(vuelosEncontrados, cuerpoTabla);
        }
    } else {
        const vuelosAleatorios = generarVuelosAleatorios(15);
        renderizarTabla(vuelosAleatorios, cuerpoTabla);
    }
}

function generarVuelosAleatorios(cantidad) {
    let vuelos = [];
    let rutasGeneradas = new Set();
    while (vuelos.length < cantidad) {
        let origen = CIUDADES[Math.floor(Math.random() * CIUDADES.length)];
        let destino = CIUDADES[Math.floor(Math.random() * CIUDADES.length)];
        if (origen === destino) continue;
        let ruta = `${origen}-${destino}`;
        if (rutasGeneradas.has(ruta)) continue;
        rutasGeneradas.add(ruta);

        vuelos.push(crearObjetoVuelo(origen, destino));
    }
    return vuelos;
}

function generarVuelosFijos(origen, destino, cantidad) {
    let vuelos = [];
    for (let i = 0; i < cantidad; i++) {
        vuelos.push(crearObjetoVuelo(origen, destino));
    }
    return vuelos;
}

function crearObjetoVuelo(origen, destino) {
    let idVuelo = "BV-" + Math.floor(Math.random() * 9000 + 1000);
    let hora = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    let minuto = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    let fecha = new Date();
    fecha.setDate(fecha.getDate() + Math.floor(Math.random() * 5));

    let estado = ESTADOS[Math.floor(Math.random() * ESTADOS.length)];
    let asientosDisponibles = 0;

    if (estado === "En reserva") {
        asientosDisponibles = Math.floor(TOTAL_ASIENTOS * (Math.random() * 0.10));
    } else if (estado === "A punto de abordar") {
        asientosDisponibles = Math.floor(TOTAL_ASIENTOS * ((Math.random() * 0.45) + 0.15));
    } else {
        asientosDisponibles = 0;
    }

    let maxClub = 8;
    let maxPremium = 48;
    let maxTurista = 69;
    let dispClub = 0, dispPremium = 0, dispTurista = 0;

    if (asientosDisponibles > 0) {
        let restantes = asientosDisponibles;
        while (restantes > 0) {
            let r = Math.random();
            if (r < 0.1 && dispClub < maxClub) { dispClub++; restantes--; }
            else if (r < 0.4 && dispPremium < maxPremium) { dispPremium++; restantes--; }
            else if (dispTurista < maxTurista) { dispTurista++; restantes--; }
            else if (dispPremium < maxPremium) { dispPremium++; restantes--; }
            else if (dispClub < maxClub) { dispClub++; restantes--; }
        }
    }

    let desgloseAsientos = { club: dispClub, premium: dispPremium, turista: dispTurista };

    return {
        fechaHora: `${fecha.toISOString().split('T')[0]} | ${hora}:${minuto}H`,
        origen: origen,
        destino: destino,
        id: idVuelo,
        estado: estado,
        asientos: asientosDisponibles,
        desglose: desgloseAsientos
    };
}

function renderizarTabla(vuelos, cuerpoTabla) {
    cuerpoTabla.innerHTML = "";
    vuelos.forEach(vuelo => {
        let fila = document.createElement('tr');
        if (vuelo.estado === "Abordando") {
            fila.classList.add('fila-bloqueada');
        } else {
            fila.classList.add('fila-vuelo');
            fila.addEventListener('click', () => {
                sessionStorage.setItem('asientosDisponibles', vuelo.asientos);
                sessionStorage.setItem('desgloseAsientos', JSON.stringify(vuelo.desglose));
                sessionStorage.setItem('vueloId', vuelo.id);
                sessionStorage.setItem('vueloFecha', vuelo.fechaHora.split(' | ')[0]);
                sessionStorage.setItem('vueloHora', vuelo.fechaHora.split(' | ')[1]);
                sessionStorage.setItem('vueloOrigen', vuelo.origen);
                sessionStorage.setItem('vueloDestino', vuelo.destino);
                window.location.href = 'formularios.html';
            });
        }
        fila.innerHTML = `
            <td><strong>${vuelo.fechaHora}</strong></td>
            <td>${vuelo.origen}</td>
            <td>${vuelo.destino}</td>
            <td class="id-vuelo">${vuelo.id}</td>
            <td>${vuelo.estado}</td>
            <td><span class="asientos-badge">${vuelo.asientos} / 128</span></td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.contenedor-tabla')) return;
    cargarPagina();
});