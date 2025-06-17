const express = require('express');
const router = express.Router();
const tutoresController = require('../controllers/tutoresController');

// CRUD Tutores
router.get('/', tutoresController.getTutores);
router.post('/', tutoresController.createTutor);
router.put('/:id', tutoresController.updateTutor);
router.delete('/:id', tutoresController.deleteTutor);

module.exports = router;