/**
 * Módulo de gestión de trabajadores
 * CRUD completo con almacenamiento en localStorage
 */

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let trabajadores = JSON.parse(localStorage.getItem('trabajadores')) || [];
    let editando = false;
    let trabajadorActual = null;
    
    // Elementos del DOM
    const tablaTrabajadores = document.getElementById('tablaTrabajadoresBody');
    const formTrabajador = document.getElementById('formTrabajador');
    const modalTrabajador = document.getElementById('modalTrabajador');
    const modalEliminar = document.getElementById('modalEliminar');
    const btnAbrirModalAgregar = document.getElementById('btnAbrirModalAgregar');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    const modalTitulo = document.getElementById('modalTitulo');
    const trabajadorId = document.getElementById('trabajadorId');
    const trabajadorAEliminar = document.getElementById('trabajadorAEliminar');

    // Inicializar la aplicación
    cargarEventListeners();
    renderizarTabla();

    // Funciones
    function cargarEventListeners() {
        btnAbrirModalAgregar.addEventListener('click', abrirModalAgregar);
        btnCancelarModal.addEventListener('click', () => cerrarModal(modalTrabajador));
        btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminar));
        btnConfirmarEliminar.addEventListener('click', eliminarTrabajador);
        formTrabajador.addEventListener('submit', guardarTrabajador);
        
        // Delegación de eventos para botones de acción
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
                const btn = e.target.classList.contains('btn-edit') ? e.target : e.target.parentElement;
                editarTrabajador(btn.dataset.id);
            }
            
            if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
                const btn = e.target.classList.contains('btn-delete') ? e.target : e.target.parentElement;
                confirmarEliminacion(btn.dataset.id);
            }
        });
    }

    function abrirModalAgregar() {
        editando = false;
        trabajadorActual = null;
        modalTitulo.textContent = 'Agregar Trabajador';
        formTrabajador.reset();
        modalTrabajador.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function renderizarTabla() {
        tablaTrabajadores.innerHTML = '';
        
        if (trabajadores.length === 0) {
            tablaTrabajadores.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No hay trabajadores registrados</td>
                </tr>
            `;
            return;
        }

        trabajadores.forEach(trabajador => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${trabajador.id}</td>
                <td>${trabajador.nombre}</td>
                <td>${trabajador.rol}</td>
                <td>$${trabajador.salario.toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn-action btn-edit" data-id="${trabajador.id}">
                        <i class='bx bx-edit'></i>
                    </button>
                    <button class="btn-action btn-delete" data-id="${trabajador.id}">
                        <i class='bx bx-trash'></i>
                    </button>
                </td>
            `;
            tablaTrabajadores.appendChild(tr);
        });
    }
    
    function editarTrabajador(id) {
        editando = true;
        trabajadorActual = trabajadores.find(trabajador => trabajador.id == id);
        
        if (trabajadorActual) {
            modalTitulo.textContent = 'Editar Trabajador';
            trabajadorId.value = trabajadorActual.id;
            document.getElementById('nombre').value = trabajadorActual.nombre;
            document.getElementById('rol').value = trabajadorActual.rol;
            document.getElementById('salario').value = trabajadorActual.salario;
            
            modalTrabajador.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function guardarTrabajador(e) {
        e.preventDefault();
        
        const trabajador = {
            id: trabajadorId.value,
            nombre: document.getElementById('nombre').value.trim(),
            rol: document.getElementById('rol').value,
            salario: parseFloat(document.getElementById('salario').value)
        };

        if (!validarTrabajador(trabajador)) return;

        if (editando) {
            // Actualizar trabajador existente
            trabajadores = trabajadores.map(t => 
                t.id == trabajadorActual.id ? trabajador : t
            );
        } else {
            // Crear nuevo trabajador
            const nuevoId = trabajadores.length > 0 ? Math.max(...trabajadores.map(t => t.id)) + 1 : 1;
            trabajador.id = nuevoId;
            trabajadores.push(trabajador);
        }

        localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
        renderizarTabla();
        cerrarModal(modalTrabajador);
        formTrabajador.reset();
    }

    function validarTrabajador(trabajador) {
        if (!trabajador.nombre || !trabajador.rol || isNaN(trabajador.salario)) {
            alert('Todos los campos son obligatorios');
            return false;
        }

        if (trabajador.salario < 0) {
            alert('El salario no puede ser negativo');
            return false;
        }

        return true;
    }
    
    function confirmarEliminacion(id) {
        trabajadorAEliminar.value = id;
        modalEliminar.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function eliminarTrabajador() {
        trabajadores = trabajadores.filter(trabajador => trabajador.id != trabajadorAEliminar.value);
        localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
        renderizarTabla();
        cerrarModal(modalEliminar);
    }
});