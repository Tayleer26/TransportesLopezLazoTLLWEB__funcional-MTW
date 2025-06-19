
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let estudiantes = JSON.parse(localStorage.getItem('estudiantes')) || [];
    let editando = false;
    let estudianteActual = null;
    
    // Elementos del DOM
    const tablaEstudiantes = document.getElementById('tablaEstudiantesBody');
    const formEstudiante = document.getElementById('formEstudiante');
    const modalEstudiante = document.getElementById('modalEstudiante');
    const modalEliminar = document.getElementById('modalEliminar');
    const btnAbrirModalAgregar = document.getElementById('btnAbrirModalAgregar');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
    const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');
    const buscarEstudiante = document.getElementById('buscarEstudiante');
    const modalTitulo = document.getElementById('modalTitulo');
    const estudianteId = document.getElementById('estudianteId');
    
    // Event Listeners
    btnAbrirModalAgregar.addEventListener('click', abrirModalAgregar);
    btnCancelarModal.addEventListener('click', () => cerrarModal(modalEstudiante));
    btnCancelarEliminar.addEventListener('click', () => cerrarModal(modalEliminar));
    btnConfirmarEliminar.addEventListener('click', eliminarEstudiante);
    formEstudiante.addEventListener('submit', guardarEstudiante);
    buscarEstudiante.addEventListener('input', filtrarEstudiantes);
    
    // Delegación de eventos para botones de editar y eliminar
    document.addEventListener('click', function(e) {
        // Manejar clic en botón editar
        if (e.target.classList.contains('btn-edit') || e.target.parentElement.classList.contains('btn-edit')) {
            const btn = e.target.classList.contains('btn-edit') ? e.target : e.target.parentElement;
            const id = btn.getAttribute('data-id') || btn.closest('tr').getAttribute('data-id');
            if (id) {
                if (confirm('¿Está seguro de realizar esta acción?')) {
                    editarEstudiante(id);
                }
            }
        }
        
    // Manejar clic en botón eliminar
    if (e.target.classList.contains('btn-delete') || e.target.parentElement.classList.contains('btn-delete')) {
        const btn = e.target.classList.contains('btn-delete') ? e.target : e.target.parentElement;
        const id = btn.getAttribute('data-id') || btn.closest('tr').getAttribute('data-id');
        if (id) {
            if (confirm('¿Está seguro de realizar esta acción?')) {
                confirmarEliminacion(id);
            }
        }
    }
    });

    // Funciones
    function abrirModalAgregar() {
        editando = false;
        estudianteActual = null;
        modalTitulo.textContent = 'Agregar Estudiante';
        formEstudiante.reset();
        modalEstudiante.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function cerrarModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    function mostrarEstudiantes() {
        tablaEstudiantes.innerHTML = '';
        
        if (estudiantes.length === 0) {
            tablaEstudiantes.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay estudiantes registrados</td>
                </tr>
            `;
            return;
        }

        estudiantes.forEach(estudiante => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', estudiante.id);
            tr.innerHTML = `
                <td>${estudiante.id}</td>
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.edad}</td>
                <td>${estudiante.grado}</td>
                <td class="text-center">
                    <button class="btn-action btn-edit" data-id="${estudiante.id}">
                        <i class='bx bx-edit'></i> Editar
                    </button>
                    <button class="btn-action btn-delete" data-id="${estudiante.id}">
                        <i class='bx bx-trash'></i> Eliminar
                    </button>
                </td>
            `;
            tablaEstudiantes.appendChild(tr);
        });
    }
    
    function editarEstudiante(id) {
        editando = true;
        estudianteActual = estudiantes.find(estudiante => estudiante.id == id);
        
        if (estudianteActual) {
            modalTitulo.textContent = 'Editar Estudiante';
            estudianteId.value = estudianteActual.id;
            document.getElementById('nombre').value = estudianteActual.nombre;
            document.getElementById('apellido').value = estudianteActual.apellido;
            document.getElementById('edad').value = estudianteActual.edad;
            document.getElementById('grado').value = estudianteActual.grado;
            
            modalEstudiante.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function guardarEstudiante(e) {
        e.preventDefault();
        
        const id = estudianteId.value;
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const edad = document.getElementById('edad').value;
        const grado = document.getElementById('grado').value;

        if (!nombre || !apellido || !edad || !grado) {
            alert('Todos los campos son obligatorios');
            return;
        }

        if (isNaN(edad) || edad < 5 || edad > 25) {
            alert('La edad debe ser entre 5 y 25 años');
            return;
        }

        const estudiante = { id, nombre, apellido, edad, grado };

        if (editando) {
            // Actualizar estudiante existente
            estudiantes = estudiantes.map(est => 
                est.id == estudianteActual.id ? estudiante : est
            );
        } else {
            // Crear nuevo estudiante
            const nuevoId = estudiantes.length > 0 ? Math.max(...estudiantes.map(e => e.id)) + 1 : 1;
            estudiante.id = nuevoId;
            estudiantes.push(estudiante);
        }

        localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
        mostrarEstudiantes();
        cerrarModal(modalEstudiante);
        formEstudiante.reset();
    }
    
    function confirmarEliminacion(id) {
        estudianteActual = id;
        modalEliminar.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    function eliminarEstudiante() {
        estudiantes = estudiantes.filter(estudiante => estudiante.id != estudianteActual);
        localStorage.setItem('estudiantes', JSON.stringify(estudiantes));
        mostrarEstudiantes();
        cerrarModal(modalEliminar);
        estudianteActual = null;
    }
    
    function filtrarEstudiantes() {
        const texto = buscarEstudiante.value.toLowerCase();
        const filas = tablaEstudiantes.querySelectorAll('tr');
        
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td');
            let mostrarFila = false;
            
            if (celdas.length > 0) {
                const textoFila = Array.from(celdas).map(celda => celda.textContent.toLowerCase()).join(' ');
                mostrarFila = textoFila.includes(texto);
            }
            
            fila.style.display = mostrarFila ? '' : 'none';
        });
    }

    // Inicializar la tabla al cargar la página
    mostrarEstudiantes();
});