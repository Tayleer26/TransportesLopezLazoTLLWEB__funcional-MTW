const { poolPromise, sql } = require('../db/connection');

// Obtener todos los vehículos
const getVehiculos = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Vehiculos');
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener vehículos', error });
    }
};

// Crear un vehículo
const createVehiculo = async (req, res) => {
    const { placa, modelo, capacidad } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('placa', sql.VarChar(20), placa)
            .input('modelo', sql.VarChar(50), modelo)
            .input('capacidad', sql.Int, capacidad)
            .query(`
                INSERT INTO Vehiculos (placa, modelo, capacidad)
                VALUES (@placa, @modelo, @capacidad)
            `);
        res.status(201).json({ message: 'Vehículo creado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear vehículo', error });
    }
};

// Actualizar un vehículo
const updateVehiculo = async (req, res) => {
    const { id } = req.params;
    const { placa, modelo, capacidad } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('placa', sql.VarChar(20), placa)
            .input('modelo', sql.VarChar(50), modelo)
            .input('capacidad', sql.Int, capacidad)
            .query(`
                UPDATE Vehiculos
                SET placa = @placa, modelo = @modelo, capacidad = @capacidad
                WHERE id = @id
            `);
        res.json({ message: 'Vehículo actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar vehículo', error });
    }
};

// Eliminar un vehículo
const deleteVehiculo = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Vehiculos WHERE id = @id');
        res.json({ message: 'Vehículo eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar vehículo', error });
    }
};

module.exports = {
    getVehiculos,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo
};
