const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../db/connection');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM Usuarios WHERE username = @username AND password = @password');

        if (result.recordset.length > 0) {
            res.json({ message: 'Login exitoso', username });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (err) {
        console.error('❌ Error en login:', err);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
