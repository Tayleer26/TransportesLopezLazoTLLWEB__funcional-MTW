// 🔥 Manejo de errores globales
process.on('uncaughtException', (err) => {
    console.error('🔥 Excepción no capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 Promesa rechazada sin manejar:', reason);
});

// 🚀 Requerimientos principales
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Rutas
// Agregado console.log para debug
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard').default || require('./routes/dashboard');
const estudiantesRoutes = require('./routes/estudiantes');
const tutoresRoutes = require('./routes/tutores');
const vehiculosRoutes = require('./routes/vehiculos');

console.log('Tipo de authRoutes:', typeof authRoutes);
console.log('Tipo de dashboardRoutes:', typeof dashboardRoutes);
console.log('dashboardRoutes:', dashboardRoutes);
console.log('Tipo de estudiantesRoutes:', typeof estudiantesRoutes);
console.log('Tipo de tutoresRoutes:', typeof tutoresRoutes);
console.log('Tipo de vehiculosRoutes:', typeof vehiculosRoutes);


// 📌 Enrutadores
app.use('/api/auth', authRoutes); // Login
app.use('/api/dashboard', dashboardRoutes); // Dashboard (si ya lo tienes creado)
app.use('/api/estudiantes', estudiantesRoutes); // CRUD Estudiantes
app.use('/api/tutores', tutoresRoutes);
app.use('/api/vehiculos', vehiculosRoutes);


// 🟢 Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

