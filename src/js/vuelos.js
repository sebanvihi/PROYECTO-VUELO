const TOTAL_ASIENTOS = 128; 
const CIUDADES = ["Caracas", "Valencia", "Maracaibo", "Porlamar", "Madrid", "Bogotá", "Miami", "Panamá", "Buenos Aires", "Lima"];
const ESTADOS = ["En reserva", "A punto de abordar", "Abordando"];

function generarVuelosAleatorios() {
    let vuelos = [];
    let rutasGeneradas = new Set(); 

    while (vuelos.length < 15) {
        let origen = CIUDADES[Math.floor(Math.random() * CIUDADES.length)];
        let destino = CIUDADES[Math.floor(Math.random() * CIUDADES.length)];
        if (origen === destino) continue;
        let ruta = `${origen}-${destino}`;
        if (rutasGeneradas.has(ruta)) continue;
        rutasGeneradas.add(ruta);
        let idVuelo = "BV-" + Math.floor(Math.random() * 9000 + 1000);
        let hora = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        let minuto = String(Math.floor(Math.random() * 60)).padStart(2, '0');
        let fecha = new Date();
        fecha.setDate(fecha.getDate() + Math.floor(Math.random() * 5));
        let fechaStr = fecha.toISOString().split('T')[0];
        let estado = ESTADOS[Math.floor(Math.random() * ESTADOS.length)];
        let asientosDisponibles = 0;

        if (estado === "En reserva") {
            let porcentaje = Math.random() * 0.10; 
            asientosDisponibles = Math.floor(TOTAL_ASIENTOS * porcentaje);
        } else if (estado === "A punto de abordar") {
            let porcentaje = (Math.random() * 0.45) + 0.15; 
            asientosDisponibles = Math.floor(TOTAL_ASIENTOS * porcentaje);
        } else if (estado === "Abordando") {
            asientosDisponibles = 0;
        }

        vuelos.push({
            fechaHora: `${fechaStr} | ${hora}:${minuto}`,
            origen: origen,
            destino: destino,
            id: idVuelo,
            estado: estado,
            asientos: asientosDisponibles
        });
    }

    return vuelos;
}

function cargarTabla() {
    const vuelos = generarVuelosAleatorios();
    const cuerpoTabla = document.getElementById('cuerpo-tabla');

    vuelos.forEach(vuelo => {
        let fila = document.createElement('tr');
        if (vuelo.estado === "Abordando") {
            fila.classList.add('fila-bloqueada');
        } else {
            fila.classList.add('fila-vuelo');
            fila.addEventListener('click', () => {
                alert(`Has seleccionado el vuelo ${vuelo.id} de ${vuelo.origen} a ${vuelo.destino}.\nTe redirigiendo al formulario...`);
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
    });
}
window.onload = cargarTabla;