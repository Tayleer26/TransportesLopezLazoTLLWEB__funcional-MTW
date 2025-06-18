/**
 * Módulo de gestión de pagos
 * CRUD completo con almacenamiento en localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    let editando = false;
    let pagoActual = null;
    
    // Elementos del DOM
    const tablaPagos = document.getElementById('tablaPagosBody');
    const formPago = document.getElementById('formPago');
    const modalPago = document.getElementById('modalPago');
    const modalEliminar = document.getElementById('modalEliminar');
    const btnAbrirModalAgregar = document.getElementById('btnAbrirModalAgregar');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    const modalTitulo = document.getElementById('modalTitulo');
    const pagoId = document.getElementById('pagoId');
    const pagoAEliminar = document.getElementById('pagoAEliminar');
    const selectEstudiante = document.getElementById('id_estudiante');

    // Inicializar la aplicación
    cargarEstudiantes();
    cargarEventListeners();
    renderizarTabla();

    // Funciones
    function cargarEventListeners() {
        btnAbrirModalAgregar.addEventListener('click', abrirModalAgregar);
        btnCancelarModal.addEventListener('click', () => cerrarModal(modalPago));
        btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminar));
        btnConfirmarEliminar.addEventListener('click', eliminarPago);
        formPago.addEventListener('submit', guardarPago);
        
        // Delegación de eventos para botones de acción
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
                const btn = e.target.classList.contains('btn-edit') ? e.target : e.target.parentElement;
                editarPago(btn.dataset.id);
            }
            
            if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
                const btn = e.target.classList.contains('btn-delete') ? e.target : e.target.parentElement;
                confirmarEliminacion(btn.dataset.id);
            }
        });
    }

    function cargarEstudiantes() {
        // Limpiar select
        selectEstudiante.innerHTML = '<option value="">Seleccione un estudiante</option>';
        
        // Llenar con estudiantes disponibles
        estudiantes.forEach(estudiante => {
            const option = document.createElement('option');
            option.value = estudiante.id;
            option.textContent = `${estudiante.nombre} ${estudiante.apellido}`;
            selectEstudiante.appendChild(option);
        });
    }

    function abrirModalAgregar() {
        editando = false;
        pagoActual = null;
        modalTitulo.textContent = 'Registrar Pago';
        formPago.reset();
        document.getElementById('fecha_pago').valueAsDate = new Date(); // Fecha actual por defecto
        modalPago.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function renderizarTabla() {
        tablaPagos.innerHTML = '';
        
        if (pagos.length === 0) {
            tablaPagos.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay pagos registrados</td>
                </tr>
            `;
            return;
        }

        pagos.forEach(pago => {
            const estudiante = estudiantes.find(e => e.id == pago.id_estudiante) || {};
            const estudianteTexto = estudiante.id 
                ? `${estudiante.nombre} ${estudiante.apellido}`
                : 'Estudiante no encontrado';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${pago.id}</td>
                <td>${estudianteTexto}</td>
                <td>$${pago.monto.toFixed(2)}</td>
                <td>${pago.mes}</td>
                <td>${formatFecha(pago.fecha_pago)}</td>
                <td class="text-center">
                    <button class="btn-action btn-edit" data-id="${pago.id}">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${pago.id}">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            `;
            tablaPagos.appendChild(tr);
        });
    }

    function formatFecha(fechaString) {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-ES');
    }
    
    function editarPago(id) {
        editando = true;
        pagoActual = pagos.find(pago => pago.id == id);
        
        if (pagoActual) {
            modalTitulo.textContent = 'Editar Pago';
            pagoId.value = pagoActual.id;
            document.getElementById('id_estudiante').value = pagoActual.id_estudiante;
            document.getElementById('monto').value = pagoActual.monto;
            document.getElementById('mes').value = pagoActual.mes;
            document.getElementById('fecha_pago').value = pagoActual.fecha_pago.split('T')[0];
            
            modalPago.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function guardarPago(e) {
        e.preventDefault();
        
        const pago = {
            id: pagoId.value,
            id_estudiante: document.getElementById('id_estudiante').value,
            monto: parseFloat(document.getElementById('monto').value),
            mes: document.getElementById('mes').value,
            fecha_pago: document.getElementById('fecha_pago').value
        };

        if (!validarPago(pago)) return;

        if (editando) {
            // Actualizar pago existente
            pagos = pagos.map(p => 
                p.id == pagoActual.id ? pago : p
            );
        } else {
            // Crear nuevo pago
            const nuevoId = pagos.length > 0 ? Math.max(...pagos.map(p => p.id)) + 1 : 1;
            pago.id = nuevoId;
            pagos.push(pago);
        }

        localStorage.setItem('pagos', JSON.stringify(pagos));
        renderizarTabla();
        cerrarModal(modalPago);
        formPago.reset();
    }

    function validarPago(pago) {
        if (!pago.id_estudiante || isNaN(pago.monto) || !pago.mes || !pago.fecha_pago) {
            alert('Todos los campos son obligatorios');
            return false;
        }

        if (pago.monto <= 0) {
            alert('El monto debe ser mayor que cero');
            return false;
        }

        return true;
    }
    
    function confirmarEliminacion(id) {
        pagoAEliminar.value = id;
        modalEliminar.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function eliminarPago() {
        pagos = pagos.filter(pago => pago.id != pagoAEliminar.value);
        localStorage.setItem('pagos', JSON.stringify(pagos));
        renderizarTabla();
        cerrarModal(modalEliminar);
    }
});