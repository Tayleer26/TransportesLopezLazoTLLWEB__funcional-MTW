const API_URL = 'http://localhost:3000/api/vehiculos';

// CORRECCIÓN: Usar ID del tbody en lugar de selector complejo
const tablaBody = document.getElementById('tablaVehiculosBody');
const btnNuevo = document.getElementById('btnNuevo');
const modal = document.getElementById('modalVehiculo');
const modalTitle = document.getElementById('modalTitle');
const closeModalBtn = document.getElementById('btnCerrarModal');
const form = document.getElementById('formVehiculo');
const modalEliminar = document.getElementById('modalEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const btnConfirmarEliminar = document.getElementById('btnConfirmarEliminar');

let editando = false;
let vehiculoId = null;

document.addEventListener('DOMContentLoaded', cargarVehiculos);

btnNuevo.addEventListener('click', () => {
    editando = false;
    vehiculoId = null;
    modalTitle.textContent = 'Nuevo Vehículo';
    form.reset();
    modal.style.display = 'flex';
});

closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

document.getElementById('btnCancelar').addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
    if (e.target === modalEliminar) {
        modalEliminar.style.display = 'none';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const placa = form.placa.value.trim();
    const modelo = form.modelo.value.trim();
    const capacidad = parseInt(form.capacidad.value);

    if (!placa || !modelo || isNaN(capacidad) || capacidad <= 0) {
        alert('Por favor completa todos los campos correctamente.');
        return;
    }

    const vehiculoData = { placa, modelo, capacidad };

    try {
        if (editando && vehiculoId) {
            const res = await fetch(`${API_URL}/${vehiculoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehiculoData)
            });
            if (!res.ok) throw new Error('Error en la respuesta del servidor');
            alert('Vehículo actualizado correctamente');
        } else {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vehiculoData)
            });
            if (!res.ok) throw new Error('Error en la respuesta del servidor');
            alert('Vehículo creado correctamente');
        }
        modal.style.display = 'none';
        cargarVehiculos();
    } catch (error) {
        alert('Hubo un error: ' + error.message);
    }
});

async function cargarVehiculos() {
    try {
        const res = await fetch(API_URL);
        
        // Verificar si la respuesta es exitosa
        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const vehiculos = await res.json();

        // Limpiar tabla solo si tablaBody existe
        if (tablaBody) {
            tablaBody.innerHTML = '';
        } else {
            throw new Error('No se encontró el elemento tablaBody');
        }

        vehiculos.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.id}</td>
                <td>${v.placa || ''}</td>
                <td>${v.modelo || ''}</td>
                <td>${v.capacidad || ''}</td>
                <td class="text-center">
                    <button class="btn-action btn-edit" data-id="${v.id}">
                        <i class='bx bx-edit'></i> Editar
                    </button>
                    <button class="btn-action btn-delete" data-id="${v.id}">
                        <i class='bx bx-trash'></i> Eliminar
                    </button>
                </td>
            `;
            tablaBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.dataset.id;
                await cargarVehiculo(id);
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                vehiculoId = e.currentTarget.dataset.id;
                modalEliminar.style.display = 'flex';
            });
        });

    } catch (error) {
        alert('Error al cargar vehículos: ' + error.message);
        console.error(error);
    }
}

async function cargarVehiculo(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Vehículo no encontrado');
        const v = await res.json();

        editando = true;
        vehiculoId = id;
        modalTitle.textContent = 'Editar Vehículo';
        form.placa.value = v.placa || '';
        form.modelo.value = v.modelo || '';
        form.capacidad.value = v.capacidad || '';
        modal.style.display = 'flex';
    } catch (error) {
        alert('Error al cargar vehículo: ' + error.message);
    }
}

btnConfirmarEliminar.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_URL}/${vehiculoId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error al eliminar');
        alert('Vehículo eliminado correctamente');
        modalEliminar.style.display = 'none';
        cargarVehiculos();
    } catch (error) {
        alert('Error al eliminar vehículo: ' + error.message);
    }
});

btnCancelarEliminar.addEventListener('click', () => {
    modalEliminar.style.display = 'none';
});