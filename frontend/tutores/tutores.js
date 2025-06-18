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