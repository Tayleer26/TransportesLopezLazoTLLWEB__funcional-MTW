/**
 * Módulo de gestión de rutas
 * CRUD completo con almacenamiento en localStorage
 * Sigue la misma estructura que el módulo de estudiantes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let rutas = JSON.parse(localStorage.getItem('rutas')) || [];
    let vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || []; // Asumiendo que existe módulo de vehículos
    let editando = false;
    let rutaActual = null;
    
    // Elementos del DOM
    const tablaRutas = document.getElementById('tablaRutasBody');
    const formRuta = document.getElementById('formRuta');
    const modalRuta = document.getElementById('modalRuta');
    const modalEliminar = document.getElementById('modalEliminar');
    const btnAbrirModalAgregar = document.getElementById('btnAbrirModalAgregar');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    const modalTitulo = document.getElementById('modalTitulo');
    const rutaId = document.getElementById('rutaId');
    const rutaAEliminar = document.getElementById('rutaAEliminar');
    const selectVehiculo = document.getElementById('id_vehiculo');

    // Inicializar la aplicación
    cargarVehiculos();
    cargarEventListeners();
    renderizarTabla();

    // Funciones
    function cargarEventListeners() {
        btnAbrirModalAgregar.addEventListener('click', abrirModalAgregar);
        btnCancelarModal.addEventListener('click', () => cerrarModal(modalRuta));
        btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminar));
    btnConfirmarEliminar.addEventListener('click', () => {
        if (!confirm('¿Está seguro de realizar esta acción?')) return;
        eliminarRuta();
    });
        formRuta.addEventListener('submit', guardarRuta);
        
        // Delegación de eventos para botones de acción
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
                const btn = e.target.classList.contains('btn-edit') ? e.target : e.target.parentElement;
                editarRuta(btn.dataset.id);
            }
            
            if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
                const btn = e.target.classList.contains('btn-delete') ? e.target : e.target.parentElement;
                confirmarEliminacion(btn.dataset.id);
            }
        });
    }

    function cargarVehiculos() {
        // Limpiar select
        selectVehiculo.innerHTML = '<option value="">Seleccione un vehículo</option>';
        
        // Llenar con vehículos disponibles
        vehiculos.forEach(vehiculo => {
            const option = document.createElement('option');
            option.value = vehiculo.id;
            option.textContent = `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})`;
            selectVehiculo.appendChild(option);
        });
    }

    function abrirModalAgregar() {
        editando = false;
        rutaActual = null;
        modalTitulo.textContent = 'Agregar Ruta';
        formRuta.reset();
        modalRuta.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function renderizarTabla() {
        tablaRutas.innerHTML = '';
        
        if (rutas.length === 0) {
            tablaRutas.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay rutas registradas</td>
                </tr>
            `;
            return;
        }

        rutas.forEach(ruta => {
            const vehiculo = vehiculos.find(v => v.id == ruta.id_vehiculo) || {};
            const vehiculoTexto = vehiculo.id 
                ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})`
                : 'Sin vehículo asignado';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ruta.id}</td>
                <td>${ruta.nombre_ruta}</td>
                <td>${ruta.punto_partida}</td>
                <td>${ruta.punto_llegada}</td>
                <td>${vehiculoTexto}</td>
                <td class="text-center">
                    <button class="btn-action btn-edit" data-id="${ruta.id}">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${ruta.id}">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            `;
            tablaRutas.appendChild(tr);
        });
    }
    
    function editarRuta(id) {
        editando = true;
        rutaActual = rutas.find(ruta => ruta.id == id);
        
        if (rutaActual) {
            modalTitulo.textContent = 'Editar Ruta';
            rutaId.value = rutaActual.id;
            document.getElementById('nombre_ruta').value = rutaActual.nombre_ruta;
            document.getElementById('punto_partida').value = rutaActual.punto_partida;
            document.getElementById('punto_llegada').value = rutaActual.punto_llegada;
            document.getElementById('id_vehiculo').value = rutaActual.id_vehiculo;
            
            modalRuta.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function guardarRuta(e) {
        e.preventDefault();
        
        const ruta = {
            id: rutaId.value,
            nombre_ruta: document.getElementById('nombre_ruta').value.trim(),
            punto_partida: document.getElementById('punto_partida').value.trim(),
            punto_llegada: document.getElementById('punto_llegada').value.trim(),
            id_vehiculo: document.getElementById('id_vehiculo').value
        };

        if (!validarRuta(ruta)) return;

        if (!confirm('¿Está seguro de realizar esta acción?')) return;

        if (editando) {
            // Actualizar ruta existente
            rutas = rutas.map(r => 
                r.id == rutaActual.id ? ruta : r
            );
        } else {
            // Crear nueva ruta
            const nuevoId = rutas.length > 0 ? Math.max(...rutas.map(r => r.id)) + 1 : 1;
            ruta.id = nuevoId;
            rutas.push(ruta);
        }

        localStorage.setItem('rutas', JSON.stringify(rutas));
        renderizarTabla();
        cerrarModal(modalRuta);
        formRuta.reset();
    }

    function validarRuta(ruta) {
        if (!ruta.nombre_ruta || !ruta.punto_partida || !ruta.punto_llegada) {
            alert('Nombre, punto de partida y punto de llegada son obligatorios');
            return false;
        }
        return true;
    }
    
    function confirmarEliminacion(id) {
        rutaAEliminar.value = id;
        modalEliminar.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function eliminarRuta() {
        rutas = rutas.filter(ruta => ruta.id != rutaAEliminar.value);
        localStorage.setItem('rutas', JSON.stringify(rutas));
        renderizarTabla();
        cerrarModal(modalEliminar);
    }
});