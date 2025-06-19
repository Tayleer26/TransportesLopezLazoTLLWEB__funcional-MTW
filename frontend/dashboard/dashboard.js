async function fetchPagosMensuales() {
    const res = await fetch('http://localhost:3000/api/dashboard/pagos-mensuales');
    return await res.json();
}

async function fetchEstudiantesPorRuta() {
    const res = await fetch('http://localhost:3000/api/dashboard/estudiantes-por-ruta');
    return await res.json();
}

async function renderCharts() {
    const pagosData = await fetchPagosMensuales();
    const rutasData = await fetchEstudiantesPorRuta();

    // Datos pagos mensuales para gráfico lineal
    const meses = pagosData.map(p => p.mes);
    const totales = pagosData.map(p => parseFloat(p.total_pagado));

    const ctxPagos = document.getElementById('pagosMensualesChart').getContext('2d');
    new Chart(ctxPagos, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Pagos Mensuales',
                data: totales,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
                tension: 0.3,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });

    // Datos estudiantes por ruta para gráfico de barras
    const rutas = rutasData.map(r => r.nombre_ruta);
    const estudiantes = rutasData.map(r => parseInt(r.cantidad_estudiantes));

    const ctxRutas = document.getElementById('estudiantesRutaChart').getContext('2d');
    new Chart(ctxRutas, {
        type: 'bar',
        data: {
            labels: rutas,
            datasets: [{
                label: 'Estudiantes por Ruta',
                data: estudiantes,
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCharts();

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    function isMobile() {
        return window.innerWidth < 992;
    }

    menuToggle.addEventListener('click', () => {
        if (isMobile()) {
            sidebar.classList.toggle('show');
        } else {
            sidebar.classList.toggle('collapsed');
            if (sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '0';
            } else {
                mainContent.style.marginLeft = '260px';
            }
        }
    });

    // Opcional: ajustar estado al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            sidebar.classList.remove('show');
            if (!sidebar.classList.contains('collapsed')) {
                mainContent.style.marginLeft = '260px';
            }
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.style.marginLeft = '0';
        }
    });
});
