const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db/connection.js'); 

// Datos pagos mensuales (para gráfico lineal)
router.get('/pagos-mensuales', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT mes, SUM(monto) AS total_pagado
                FROM Pagos
                GROUP BY mes
                ORDER BY 
                    CASE mes
                        WHEN 'Enero' THEN 1
                        WHEN 'Febrero' THEN 2
                        WHEN 'Marzo' THEN 3
                        WHEN 'Abril' THEN 4
                        WHEN 'Mayo' THEN 5
                        WHEN 'Junio' THEN 6
                        WHEN 'Julio' THEN 7
                        WHEN 'Agosto' THEN 8
                        WHEN 'Septiembre' THEN 9
                        WHEN 'Octubre' THEN 10
                        WHEN 'Noviembre' THEN 11
                        WHEN 'Diciembre' THEN 12
                        ELSE 13
                    END
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener pagos mensuales' });
    }
});

// Cantidad de estudiantes por ruta (gráfico de barras)
router.get('/estudiantes-por-ruta', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(`
                SELECT r.nombre_ruta, COUNT(e.id) AS cantidad_estudiantes
                FROM Rutas r
                LEFT JOIN Estudiantes e ON e.id_tutor IN (
                    SELECT t.id FROM Tutores t -- Ajusta esta relación según tu modelo real si tienes otra
                )
                GROUP BY r.nombre_ruta
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener estudiantes por ruta' });
    }
});

module.exports = router;
