const { sql, poolPromise } = require('../db/connection');

exports.getTutores = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Tutores');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al obtener tutores');
    }
};

exports.createTutor = async (req, res) => {
    try {
        const { nombre, telefono, direccion } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('nombre', sql.VarChar, nombre)
            .input('telefono', sql.VarChar, telefono)
            .input('direccion', sql.VarChar, direccion)
            .query('INSERT INTO Tutores (nombre, telefono, direccion) VALUES (@nombre, @telefono, @direccion)');
        res.status(201).send('Tutor creado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al crear tutor');
    }
};

exports.updateTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono, direccion } = req.body;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('nombre', sql.VarChar, nombre)
            .input('telefono', sql.VarChar, telefono)
            .input('direccion', sql.VarChar, direccion)
            .query('UPDATE Tutores SET nombre=@nombre, telefono=@telefono, direccion=@direccion WHERE id=@id');
        res.send('Tutor actualizado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al actualizar tutor');
    }
};

exports.deleteTutor = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Tutores WHERE id = @id');
        res.send('Tutor eliminado');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar tutor');
    }
};