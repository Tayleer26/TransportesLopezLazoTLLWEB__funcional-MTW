// tutores.js

const urlAPI = 'http://localhost:3000/api/tutores';

const tablaBody = document.getElementById('tablaTutoresBody');
const modal = document.getElementById('modalTutor');
const modalEliminar = document.getElementById('modalEliminar');
const formTutor = document.getElementById('formTutor');
const btnAbrirModal = document.getElementById('btnAbrirModalAgregar');
const btnCerrarModal = document.querySelectorAll('#btnCancelarModal');
const btnCerrarEliminar = document.querySelectorAll('#btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

let idEliminar = null;

// Mostrar todos los tutores
const listarTutores = async () => {
  try {
    const res = await fetch(urlAPI);
    const tutores = await res.json();
    tablaBody.innerHTML = '';
    tutores.forEach(tutor => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${tutor.id}</td>
        <td>${tutor.nombre}</td>
        <td>${tutor.telefono}</td>
        <td>${tutor.direccion}</td>
        <td>
          <button class="btn-action btn-edit" onclick="editarTutor(${tutor.id}, '${tutor.nombre}', '${tutor.telefono}', '${tutor.direccion}')">Editar</button>
          <button class="btn-action btn-delete" onclick="abrirModalEliminar(${tutor.id})">Eliminar</button>
        </td>
      `;
      tablaBody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al listar tutores:', err);
  }
};

// Abrir modal agregar
btnAbrirModal.addEventListener('click', () => {
  document.getElementById('modalTitulo').textContent = 'Agregar Tutor';
  formTutor.reset();
  document.getElementById('tutorId').value = '';
  modal.style.display = 'flex';
});

// Cerrar modales
btnCerrarModal.forEach(btn => btn.addEventListener('click', () => modal.style.display = 'none'));
btnCerrarEliminar.forEach(btn => btn.addEventListener('click', () => modalEliminar.style.display = 'none'));

// Editar tutor
function editarTutor(id, nombre, telefono, direccion) {
  document.getElementById('modalTitulo').textContent = 'Editar Tutor';
  document.getElementById('tutorId').value = id;
  document.getElementById('nombre').value = nombre;
  document.getElementById('telefono').value = telefono;
  document.getElementById('direccion').value = direccion;
  modal.style.display = 'flex';
}

// Guardar tutor
formTutor.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('tutorId').value;
  const nombre = document.getElementById('nombre').value;
  const telefono = document.getElementById('telefono').value;
  const direccion = document.getElementById('direccion').value;
  const tutor = { nombre, telefono, direccion };

  try {
    let respuesta;
    if (id) {
      if (!confirm('¿Está seguro de realizar esta acción?')) return;
      respuesta = await fetch(`${urlAPI}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutor)
      });
    } else {
      if (!confirm('¿Está seguro de realizar esta acción?')) return;
      respuesta = await fetch(urlAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tutor)
      });
    }
    if (!respuesta.ok) throw new Error('Error al guardar tutor');
    modal.style.display = 'none';
    listarTutores();
  } catch (err) {
    console.error(err);
  }
});

// Eliminar tutor
function abrirModalEliminar(id) {
  idEliminar = id;
  modalEliminar.style.display = 'flex';
}

btnConfirmarEliminar.addEventListener('click', async () => {
  try {
    if (!confirm('¿Está seguro de realizar esta acción?')) return;
    const respuesta = await fetch(`${urlAPI}/${idEliminar}`, { method: 'DELETE' });
    if (!respuesta.ok) throw new Error('Error al eliminar tutor');
    modalEliminar.style.display = 'none';
    listarTutores();
  } catch (err) {
    console.error(err);
  }
});

// Cerrar modal al hacer click fuera del contenido
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
  if (e.target === modalEliminar) modalEliminar.style.display = 'none';
});

// Cargar tutores al iniciar
listarTutores();