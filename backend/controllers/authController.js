const { poolPromise, sql } = require('../db/connection');

async function login(req, res) {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM Usuarios WHERE username = @username AND password = @password');

        if (result.recordset.length > 0) {
            res.json({ success: true, message: 'Login exitoso', user: result.recordset[0] });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error('Error en login:', err);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
}

module.exports = { login };
