exports.getEstudianteById = async (req, res) => {
  console.log('ID recibido:', req.params.id); // <-- AÑADE ESTO

  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
  }


};




const { sql, poolPromise } = require('../db/connection');

// Obtener todos los estudiantes
exports.getAllEstudiantes = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Estudiantes');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener estudiantes' });
  }
};

// Obtener estudiante por ID
exports.getEstudianteById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Estudiantes WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener estudiante' });
  }
};

// Crear nuevo estudiante
exports.createEstudiante = async (req, res) => {
  const { nombre, apellido, edad, id_tutor, id_ruta } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('apellido', sql.VarChar, apellido)
      .input('edad', sql.Int, edad)
      .input('id_tutor', sql.Int, id_tutor)
      .input('id_ruta', sql.Int, id_ruta)
      .query(`INSERT INTO Estudiantes (nombre, apellido, edad, id_tutor, id_ruta) 
              VALUES (@nombre, @apellido, @edad, @id_tutor, @id_ruta);
              SELECT SCOPE_IDENTITY() AS Id;`);
    res.status(201).json({ message: 'Estudiante creado', id: result.recordset[0].Id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear estudiante' });
  }
};

// Actualizar estudiante
exports.updateEstudiante = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { nombre, apellido, edad, id_tutor, id_ruta } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('nombre', sql.VarChar, nombre)
      .input('apellido', sql.VarChar, apellido)
      .input('edad', sql.Int, edad)
      .input('id_tutor', sql.Int, id_tutor)
      .input('id_ruta', sql.Int, id_ruta)
      .query(`UPDATE Estudiantes SET 
              nombre = @nombre, 
              apellido = @apellido,
              edad = @edad,
              id_tutor = @id_tutor,
              id_ruta = @id_ruta
              WHERE id = @id`);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json({ message: 'Estudiante actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al actualizar estudiante' });
  }
};

// Eliminar estudiante
exports.deleteEstudiante = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID inválido. Debe ser un número.' });
  }

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Estudiantes WHERE id = @id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }
    res.json({ message: 'Estudiante eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al eliminar estudiante' });
  }
};
